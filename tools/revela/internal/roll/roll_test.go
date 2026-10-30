package roll

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func write(t *testing.T, path, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestCheckValidRoll(t *testing.T) {
	dir := t.TempDir()
	write(t, filepath.Join(dir, "roll.json"), `{"id":"praca","title":"Domingo na praça","photos":[{"id":"p1","layers":["p1/fundo.png","p1/figura.png"]}]}`)
	write(t, filepath.Join(dir, "p1/fundo.png"), "x")
	write(t, filepath.Join(dir, "p1/figura.png"), "x")

	if probs := Check(dir); len(probs) != 0 {
		t.Fatalf("esperava nenhum problema, veio %v", probs)
	}
}

func TestCheckFindsProblems(t *testing.T) {
	dir := t.TempDir()
	write(t, filepath.Join(dir, "roll.json"), `{"photos":[{"id":"p1","layers":["p1/fundo.png"]},{"id":"p1","layers":[]}]}`)

	probs := Check(dir)
	var msgs []string
	for _, p := range probs {
		msgs = append(msgs, p.Msg)
	}
	got := strings.Join(msgs, "|")
	for _, want := range []string{"falta o id do rolo", "camada da foto \"p1\" não encontrada", "id de foto repetido: p1", "não tem camadas"} {
		if !strings.Contains(got, want) {
			t.Errorf("faltou o problema %q em %q", want, got)
		}
	}
}

func TestCheckInvalidJSON(t *testing.T) {
	dir := t.TempDir()
	write(t, filepath.Join(dir, "roll.json"), `{`)
	if probs := Check(dir); len(probs) != 1 || !strings.Contains(probs[0].Msg, "inválido") {
		t.Fatalf("esperava um problema de JSON inválido, veio %v", probs)
	}
}

func TestDirsOnlyListsRolls(t *testing.T) {
	root := t.TempDir()
	write(t, filepath.Join(root, "b/roll.json"), `{}`)
	write(t, filepath.Join(root, "a/roll.json"), `{}`)
	write(t, filepath.Join(root, "sem-rolo/nota.txt"), "x")

	dirs, err := Dirs(root)
	if err != nil {
		t.Fatal(err)
	}
	if len(dirs) != 2 || filepath.Base(dirs[0]) != "a" || filepath.Base(dirs[1]) != "b" {
		t.Fatalf("esperava [a b], veio %v", dirs)
	}
}

func TestCheckRejectsUnsafeNames(t *testing.T) {
	dir := t.TempDir()
	write(t, filepath.Join(dir, "roll.json"), `{"id":"Praça 1","photos":[{"id":"../p1","layers":["../fora.png","a/fundo.png","b/fundo.jpg","negative.png"]}]}`)
	write(t, filepath.Join(dir, "a/fundo.png"), "x")
	write(t, filepath.Join(dir, "b/fundo.jpg"), "x")
	write(t, filepath.Join(dir, "negative.png"), "x")

	var msgs []string
	for _, p := range Check(dir) {
		msgs = append(msgs, p.Msg)
	}
	got := strings.Join(msgs, "|")
	for _, want := range []string{"id de rolo inválido", "id de foto inválido", "sai da pasta do rolo", "duas camadas chamadas \"fundo\"", "nome reservado"} {
		if !strings.Contains(got, want) {
			t.Errorf("faltou o problema %q em %q", want, got)
		}
	}
}
