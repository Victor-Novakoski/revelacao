package build

import (
	"bytes"
	"encoding/json"
	"image"
	"image/color"
	"image/png"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/gen2brain/webp"
)

func write(t *testing.T, path string, data []byte) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, data, 0o644); err != nil {
		t.Fatal(err)
	}
}

// writePNG grava uma imagem lisa, de uma cor só.
func writePNG(t *testing.T, path string, w, h int, c color.Color) {
	t.Helper()
	img := image.NewNRGBA(image.Rect(0, 0, w, h))
	for y := range h {
		for x := range w {
			img.Set(x, y, c)
		}
	}
	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		t.Fatal(err)
	}
	write(t, path, buf.Bytes())
}

// readGray abre um WebP gerado e devolve o tom do pixel do meio.
func readGray(t *testing.T, path string) (uint8, image.Rectangle) {
	t.Helper()
	f, err := os.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	img, err := webp.Decode(f)
	if err != nil {
		t.Fatal(err)
	}
	b := img.Bounds()
	// O WebP com perda guarda o Y em faixa de vídeo (16 a 235), e o Go devolve
	// o YCbCr cru. O navegador expande sozinho; aqui expandimos na mão.
	if a, ok := img.(*image.NYCbCrA); ok {
		img = &a.YCbCr
	}
	if ycc, ok := img.(*image.YCbCr); ok {
		y := int(ycc.Y[ycc.YOffset(b.Dx()/2, b.Dy()/2)])
		v := (y - 16) * 255 / 219
		return uint8(max(0, min(255, v))), b
	}
	g := color.GrayModel.Convert(img.At(b.Dx()/2, b.Dy()/2)).(color.Gray)
	return g.Y, b
}

func near(a, b uint8) bool {
	d := int(a) - int(b)
	return d >= -4 && d <= 4
}

// praca monta um rolo com uma foto de duas camadas: a cena, cinza-claro
// avermelhada, e a figura, branca sobre fundo transparente.
func praca(t *testing.T, root string) {
	dir := filepath.Join(root, "praca")
	write(t, filepath.Join(dir, "roll.json"), []byte(`{"id":"praca","title":"Domingo na praça","photos":[
		{"id":"p1","note":"o coreto","layers":["p1/scene.png","p1/figure.png"]},
		{"id":"p2","layers":["p2/scene.png"]}]}`))
	writePNG(t, filepath.Join(dir, "p1/scene.png"), 32, 24, color.NRGBA{200, 180, 180, 255})
	writePNG(t, filepath.Join(dir, "p1/figure.png"), 32, 24, color.NRGBA{255, 255, 255, 0})
	writePNG(t, filepath.Join(dir, "p2/scene.png"), 16, 16, color.NRGBA{40, 40, 40, 255})
}

func TestRunBuildsLayersNegativeAndManifest(t *testing.T) {
	root, out := t.TempDir(), t.TempDir()
	praca(t, root)

	m, err := Run(root, out, Options{Workers: 2})
	if err != nil {
		t.Fatal(err)
	}
	if m.Version != ManifestVersion || len(m.Rolls) != 1 || len(m.Rolls[0].Photos) != 2 {
		t.Fatalf("manifesto inesperado: %+v", m)
	}
	p1 := m.Rolls[0].Photos[0]
	if p1.ID != "p1" || p1.Note != "o coreto" || p1.Width != 32 || p1.Height != 24 {
		t.Fatalf("foto inesperada: %+v", p1)
	}
	if len(p1.Layers) != 2 || p1.Layers[0].Src != "praca/p1/scene.webp" || p1.Layers[1].Name != "figure" {
		t.Fatalf("camadas inesperadas: %+v", p1.Layers)
	}
	if p1.Negative.Src != "praca/p1/negative.webp" || p1.Negative.Bytes == 0 || len(p1.Negative.SHA256) != 64 {
		t.Fatalf("negativo inesperado: %+v", p1.Negative)
	}

	// A cena vira cinza (luminância de 200,180,180 é 186), o negativo inverte
	// e a figura transparente vira preto.
	scene, b := readGray(t, filepath.Join(out, "praca/p1/scene.webp"))
	if !near(scene, 186) || b.Dx() != 32 || b.Dy() != 24 {
		t.Errorf("cena: tom %d em %v, esperava ~186 em 32x24", scene, b)
	}
	if neg, _ := readGray(t, filepath.Join(out, "praca/p1/negative.webp")); !near(neg, 255-186) {
		t.Errorf("negativo: tom %d, esperava ~%d", neg, 255-186)
	}
	if fig, _ := readGray(t, filepath.Join(out, "praca/p1/figure.webp")); !near(fig, 0) {
		t.Errorf("figura transparente: tom %d, esperava ~0", fig)
	}

	var disk Manifest
	data, err := os.ReadFile(filepath.Join(out, ManifestName))
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(data, &disk); err != nil {
		t.Fatal(err)
	}
	if disk.Rolls[0].Photos[1].Layers[0].SHA256 != m.Rolls[0].Photos[1].Layers[0].SHA256 {
		t.Fatal("o rolos.json no disco não bate com o retorno")
	}
}

func TestRunIsDeterministic(t *testing.T) {
	root := t.TempDir()
	praca(t, root)
	outA, outB := t.TempDir(), t.TempDir()
	if _, err := Run(root, outA, Options{Workers: 1}); err != nil {
		t.Fatal(err)
	}
	if _, err := Run(root, outB, Options{Workers: 8}); err != nil {
		t.Fatal(err)
	}
	a, _ := os.ReadFile(filepath.Join(outA, ManifestName))
	b, _ := os.ReadFile(filepath.Join(outB, ManifestName))
	if !bytes.Equal(a, b) {
		t.Fatalf("o rolos.json mudou com o número de workers:\n%s\n---\n%s", a, b)
	}
}

func TestRunEmptyRoot(t *testing.T) {
	out := t.TempDir()
	m, err := Run(t.TempDir(), out, Options{})
	if err != nil {
		t.Fatal(err)
	}
	data, _ := os.ReadFile(filepath.Join(out, ManifestName))
	if len(m.Rolls) != 0 || !strings.Contains(string(data), `"rolls": []`) {
		t.Fatalf("esperava lista vazia, veio %s", data)
	}
}

func TestRunRejectsMismatchedLayers(t *testing.T) {
	root, out := t.TempDir(), t.TempDir()
	dir := filepath.Join(root, "praca")
	write(t, filepath.Join(dir, "roll.json"), []byte(`{"id":"praca","photos":[{"id":"p1","layers":["scene.png","figure.png"]}]}`))
	writePNG(t, filepath.Join(dir, "scene.png"), 32, 24, color.White)
	writePNG(t, filepath.Join(dir, "figure.png"), 16, 16, color.White)

	_, err := Run(root, out, Options{})
	if err == nil || !strings.Contains(err.Error(), "16x16") {
		t.Fatalf("esperava erro de tamanho, veio %v", err)
	}
	if _, err := os.Stat(filepath.Join(out, ManifestName)); !os.IsNotExist(err) {
		t.Fatal("não devia escrever o rolos.json quando uma foto falha")
	}
}

func TestRunRejectsBrokenRollsBeforeWriting(t *testing.T) {
	root, out := t.TempDir(), filepath.Join(t.TempDir(), "out")
	praca(t, root)
	write(t, filepath.Join(root, "outro/roll.json"), []byte(`{"id":"praca","photos":[{"id":"p1","layers":["falta.png"]}]}`))

	_, err := Run(root, out, Options{})
	if err == nil || !strings.Contains(err.Error(), "repetido") || !strings.Contains(err.Error(), "não encontrada") {
		t.Fatalf("esperava id repetido e camada faltando, veio %v", err)
	}
	if _, err := os.Stat(out); !os.IsNotExist(err) {
		t.Fatal("não devia criar nada com rolo quebrado")
	}
}

func TestRunRejectsUnreadableImage(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "praca")
	write(t, filepath.Join(dir, "roll.json"), []byte(`{"id":"praca","photos":[{"id":"p1","layers":["scene.png"]}]}`))
	write(t, filepath.Join(dir, "scene.png"), []byte("não é png"))

	if _, err := Run(root, t.TempDir(), Options{}); err == nil || !strings.Contains(err.Error(), "não deu para ler") {
		t.Fatalf("esperava erro de leitura, veio %v", err)
	}
}

func TestRunRejectsBadQuality(t *testing.T) {
	if _, err := Run(t.TempDir(), t.TempDir(), Options{Quality: 101}); err == nil {
		t.Fatal("esperava erro de qualidade")
	}
}

func TestEncodeWebPHasNoAlpha(t *testing.T) {
	img := image.NewGray(image.Rect(0, 0, 8, 8))
	data, err := encodeWebP(img, DefaultQuality)
	if err != nil {
		t.Fatal(err)
	}
	if bytes.Contains(data, []byte("ALPH")) {
		t.Fatal("a foto não tem transparência, o WebP não devia levar canal alfa")
	}
}
