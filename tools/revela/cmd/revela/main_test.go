package main

import (
	"bytes"
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
