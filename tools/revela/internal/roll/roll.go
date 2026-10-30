// Package roll lê e confere os rolos de filme que a CLI transforma em arquivos do jogo.
package roll

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"
)

// Roll descreve um rolo: as fotos e as camadas de cada uma.
type Roll struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Photos []Photo `json:"photos"`
}

// Photo é uma foto do rolo, montada no shader a partir das camadas.
type Photo struct {
	ID     string   `json:"id"`
	Note   string   `json:"note,omitempty"`
	Layers []string `json:"layers"`
}

// Problem é algo errado num rolo, com o arquivo onde aconteceu.
type Problem struct {
	Path string
	Msg  string
}

func (p Problem) String() string { return p.Path + ": " + p.Msg }

// Load lê o roll.json de um diretório de rolo.
func Load(dir string) (Roll, error) {
	var r Roll
	data, err := os.ReadFile(filepath.Join(dir, "roll.json"))
	if err != nil {
		return r, err
	}
	if err := json.Unmarshal(data, &r); err != nil {
		return r, fmt.Errorf("roll.json inválido: %w", err)
	}
	return r, nil
}

// Check confere um rolo: id, pelo menos uma foto, ids únicos e camadas que existem no disco.
func Check(dir string) []Problem {
	manifest := filepath.Join(dir, "roll.json")
	r, err := Load(dir)
	if err != nil {
		return []Problem{{manifest, err.Error()}}
	}
	var probs []Problem
	if r.ID == "" {
		probs = append(probs, Problem{manifest, "falta o id do rolo"})
	}
	if len(r.Photos) == 0 {
		probs = append(probs, Problem{manifest, "o rolo não tem fotos"})
	}
	seen := map[string]bool{}
	for i, p := range r.Photos {
		if p.ID == "" {
			probs = append(probs, Problem{manifest, fmt.Sprintf("a foto %d não tem id", i+1)})
		} else if seen[p.ID] {
			probs = append(probs, Problem{manifest, fmt.Sprintf("id de foto repetido: %s", p.ID)})
		}
		seen[p.ID] = true
		if len(p.Layers) == 0 {
			probs = append(probs, Problem{manifest, fmt.Sprintf("a foto %q não tem camadas", p.ID)})
		}
		for _, layer := range p.Layers {
			path := filepath.Join(dir, layer)
			if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
				probs = append(probs, Problem{path, fmt.Sprintf("camada da foto %q não encontrada", p.ID)})
			}
		}
	}
	return probs
}

// Dirs lista os diretórios de rolo (os que têm roll.json) dentro de root, em ordem.
func Dirs(root string) ([]string, error) {
	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}
	var dirs []string
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		dir := filepath.Join(root, e.Name())
		if _, err := os.Stat(filepath.Join(dir, "roll.json")); err == nil {
			dirs = append(dirs, dir)
		}
	}
	sort.Strings(dirs)
	return dirs, nil
}
