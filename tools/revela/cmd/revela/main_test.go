package main

import (
	"bytes"
	"image"
	"image/png"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunWithoutArgsShowsUsage(t *testing.T) {
	var out, errOut bytes.Buffer
	if code := run(nil, &out, &errOut); code != 2 {
		t.Fatalf("esperava código 2, veio %d", code)
	}
	if !strings.Contains(errOut.String(), "Uso:") {
		t.Fatalf("esperava o uso, veio %q", errOut.String())
	}
}

func TestCheckEmptyFolder(t *testing.T) {
	var out, errOut bytes.Buffer
	if code := run([]string{"check", t.TempDir()}, &out, &errOut); code != 0 {
		t.Fatalf("esperava código 0, veio %d: %s", code, errOut.String())
	}
	if !strings.Contains(out.String(), "0 rolo(s)") {
		t.Fatalf("saída inesperada: %q", out.String())
	}
}

func TestCheckReportsBrokenRoll(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "praca")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "roll.json"), []byte(`{"id":"praca","photos":[{"id":"p1","layers":["p1.png"]}]}`), 0o644); err != nil {
		t.Fatal(err)
	}
	var out, errOut bytes.Buffer
	if code := run([]string{"check", root}, &out, &errOut); code != 1 {
		t.Fatalf("esperava código 1, veio %d", code)
	}
	if !strings.Contains(errOut.String(), "não encontrada") {
		t.Fatalf("esperava camada não encontrada, veio %q", errOut.String())
	}
}

func TestBuildWritesManifest(t *testing.T) {
	root, out := t.TempDir(), t.TempDir()
	dir := filepath.Join(root, "praca")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "roll.json"), []byte(`{"id":"praca","photos":[{"id":"p1","layers":["p1.png"]}]}`), 0o644); err != nil {
		t.Fatal(err)
	}
	var img bytes.Buffer
	if err := png.Encode(&img, image.NewGray(image.Rect(0, 0, 8, 8))); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "p1.png"), img.Bytes(), 0o644); err != nil {
		t.Fatal(err)
	}

	var stdout, errOut bytes.Buffer
	if code := run([]string{"build", "-j", "2", "-q", "70", root, out}, &stdout, &errOut); code != 0 {
		t.Fatalf("esperava código 0, veio %d: %s", code, errOut.String())
	}
	if !strings.Contains(stdout.String(), "1 rolo(s), 1 foto(s)") {
		t.Fatalf("saída inesperada: %q", stdout.String())
	}
	for _, f := range []string{"rolos.json", "praca/p1/p1.webp", "praca/p1/negative.webp"} {
		if _, err := os.Stat(filepath.Join(out, f)); err != nil {
			t.Errorf("faltou %s: %v", f, err)
		}
	}
}

func TestBuildBadArgs(t *testing.T) {
	for _, args := range [][]string{{"build"}, {"build", "a"}, {"build", "-q", "0", "a", "b"}, {"build", "-x", "a", "b"}} {
		var out, errOut bytes.Buffer
		if code := run(args, &out, &errOut); code != 2 {
			t.Errorf("%v: esperava código 2, veio %d", args, code)
		}
	}
}

func TestAgeWritesPNG(t *testing.T) {
	dir := t.TempDir()
	var img bytes.Buffer
	if err := png.Encode(&img, image.NewGray(image.Rect(0, 0, 40, 30))); err != nil {
		t.Fatal(err)
	}
	in := filepath.Join(dir, "foto.png")
	if err := os.WriteFile(in, img.Bytes(), 0o644); err != nil {
		t.Fatal(err)
	}
	out := filepath.Join(dir, "velha.png")
	var stdout, errOut bytes.Buffer
	if code := run([]string{"age", "-seed", "3", in, out}, &stdout, &errOut); code != 0 {
		t.Fatalf("esperava código 0, veio %d: %s", code, errOut.String())
	}
	f, err := os.Open(out)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	got, err := png.Decode(f)
	if err != nil {
		t.Fatal(err)
	}
	if got.Bounds().Dx() != 40 || got.Bounds().Dy() != 30 {
		t.Fatalf("tamanho mudou: %v", got.Bounds())
	}
	for _, args := range [][]string{{"age", in}, {"age", in, filepath.Join(dir, "x.jpg")}} {
		if code := run(args, &stdout, &errOut); code != 2 {
			t.Errorf("%v: esperava código 2, veio %d", args, code)
		}
	}
}
