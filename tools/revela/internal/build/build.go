// Package build transforma os rolos do Blender nos arquivos que o jogo carrega:
// camadas em tons de cinza e o negativo de cada foto, em WebP, e o rolos.json.
package build

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"hash/fnv"
	"os"
	"path"
	"path/filepath"

	"github.com/victor-novakoski/revelacao/tools/revela/internal/age"
	"github.com/victor-novakoski/revelacao/tools/revela/internal/pool"
	"github.com/victor-novakoski/revelacao/tools/revela/internal/roll"
)

// ManifestName é o arquivo que o jogo lê para saber quais fotos existem.
const ManifestName = "rolos.json"

// ManifestVersion muda quando o formato do rolos.json mudar de jeito que o
// jogo precise saber.
const ManifestVersion = 1

// Options controla o build.
type Options struct {
	// Workers é quantas fotos são processadas ao mesmo tempo. Zero usa um por CPU.
	Workers int
	// Quality é a qualidade do WebP, de 0 a 100.
	Quality int
}

// DefaultQuality segura o grão do filme sem pesar no celular.
const DefaultQuality = 82

// Manifest é o rolos.json.
type Manifest struct {
	Version int    `json:"version"`
	Rolls   []Roll `json:"rolls"`
}

// Roll é um rolo pronto para o jogo.
type Roll struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Photos []Photo `json:"photos"`
}

// Photo é uma foto pronta: as camadas, na ordem do roll.json, e o negativo.
type Photo struct {
	ID       string `json:"id"`
	Note     string `json:"note,omitempty"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
	Layers   []File `json:"layers"`
	Negative File   `json:"negative"`
}

// File é um WebP gerado. Src é relativo ao rolos.json. O hash serve para o
// jogo furar o cache quando a foto mudar.
type File struct {
	Name   string `json:"name"`
	Src    string `json:"src"`
	Bytes  int    `json:"bytes"`
	SHA256 string `json:"sha256"`
}

type job struct {
	dir   string
	roll  roll.Roll
	photo roll.Photo
}

// Run lê os rolos de root, escreve os WebP em out e, por último, o rolos.json.
// Se algum roll.json estiver quebrado, nada é escrito; se uma camada falhar, o
// rolos.json antigo fica como estava.
func Run(root, out string, opts Options) (Manifest, error) {
	if opts.Quality == 0 {
		opts.Quality = DefaultQuality
	}
	if opts.Quality < 0 || opts.Quality > 100 {
		return Manifest{}, fmt.Errorf("qualidade %d fora de 0 a 100", opts.Quality)
	}
	dirs, err := roll.Dirs(root)
	if err != nil {
		return Manifest{}, err
	}

	var probs []error
	var rolls []roll.Roll
	seen := map[string]string{}
	for _, dir := range dirs {
		for _, p := range roll.Check(dir) {
			probs = append(probs, errors.New(p.String()))
		}
		r, err := roll.Load(dir)
		if err != nil {
			continue
		}
		if other, ok := seen[r.ID]; ok && r.ID != "" {
			probs = append(probs, fmt.Errorf("%s: id de rolo %q repetido (também em %s)", dir, r.ID, other))
		}
		seen[r.ID] = dir
		rolls = append(rolls, r)
	}
	if len(probs) > 0 {
		return Manifest{}, errors.Join(probs...)
	}

	// Cada foto é um trabalho do pool: as camadas de uma foto precisam ser
	// conferidas juntas (mesmo tamanho), então não vale separar mais.
	var jobs []job
	for i, r := range rolls {
		for _, p := range r.Photos {
			jobs = append(jobs, job{dirs[i], r, p})
		}
	}
	photos, err := pool.Map(opts.Workers, jobs, func(j job) (Photo, error) {
		return developPhoto(j, out, opts.Quality)
	})
	if err != nil {
		return Manifest{}, err
	}

	m := Manifest{Version: ManifestVersion, Rolls: []Roll{}}
	k := 0
	for _, r := range rolls {
		mr := Roll{ID: r.ID, Title: r.Title, Photos: photos[k : k+len(r.Photos)]}
		k += len(r.Photos)
		m.Rolls = append(m.Rolls, mr)
	}
	return m, writeManifest(out, m)
}

func developPhoto(j job, out string, quality int) (Photo, error) {
	p := Photo{ID: j.photo.ID, Note: j.photo.Note}
	var scene []byte
	for i, layer := range j.photo.Layers {
		src := filepath.Join(j.dir, layer)
		gray, err := DecodeGray(src)
		if err != nil {
			return p, err
		}
		w, h := gray.Rect.Dx(), gray.Rect.Dy()
		if i == 0 && j.photo.Age {
			gray = age.Age(gray, Seed(j.roll.ID, p.ID), age.Default)
		}
		if i == 0 {
			p.Width, p.Height = w, h
		} else if w != p.Width || h != p.Height {
			return p, fmt.Errorf("%s: camada de %dx%d, mas a foto %q é %dx%d", src, w, h, p.ID, p.Width, p.Height)
		}
		data, err := encodeWebP(gray, quality)
		if err != nil {
			return p, fmt.Errorf("%s: não deu para gerar o WebP: %w", src, err)
		}
		f, err := writeFile(out, j.roll.ID, p.ID, roll.LayerName(layer), data)
		if err != nil {
			return p, err
		}
		p.Layers = append(p.Layers, f)
		// O negativo sai só da primeira camada, a cena. A figura nunca aparece
		// no filme: só no papel, quando a foto é revelada.
		if i == 0 {
			scene, err = encodeWebP(negative(gray), quality)
			if err != nil {
				return p, fmt.Errorf("%s: não deu para gerar o negativo: %w", src, err)
			}
		}
	}
	f, err := writeFile(out, j.roll.ID, p.ID, roll.NegativeName, scene)
	if err != nil {
		return p, err
	}
	p.Negative = f
	return p, nil
}

// Seed é a semente do envelhecimento de uma foto: sai do id, então a mesma
// foto envelhece igual em qualquer máquina.
func Seed(rollID, photoID string) uint64 {
	h := fnv.New64a()
	h.Write([]byte(rollID + "/" + photoID))
	return h.Sum64()
}

func writeFile(out, rollID, photoID, name string, data []byte) (File, error) {
	rel := path.Join(rollID, photoID, name+".webp")
	dst := filepath.Join(out, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return File{}, err
	}
	if err := os.WriteFile(dst, data, 0o644); err != nil {
		return File{}, err
	}
	sum := sha256.Sum256(data)
	return File{Name: name, Src: rel, Bytes: len(data), SHA256: hex.EncodeToString(sum[:])}, nil
}

// writeManifest escreve o rolos.json num arquivo temporário e troca de uma vez,
// para o jogo nunca ler um manifesto pela metade.
func writeManifest(out string, m Manifest) error {
	data, err := json.MarshalIndent(m, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(out, 0o755); err != nil {
		return err
	}
	tmp, err := os.CreateTemp(out, ManifestName+".*")
	if err != nil {
		return err
	}
	defer os.Remove(tmp.Name())
	if _, err := tmp.Write(append(data, '\n')); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Close(); err != nil {
		return err
	}
	if err := os.Chmod(tmp.Name(), 0o644); err != nil {
		return err
	}
	return os.Rename(tmp.Name(), filepath.Join(out, ManifestName))
}
