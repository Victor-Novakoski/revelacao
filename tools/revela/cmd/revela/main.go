// Comando revela prepara as fotos do jogo a partir dos renders do Blender.
package main

import (
	"fmt"
	"io"
	"os"

	"github.com/victor-novakoski/revelacao/tools/revela/internal/roll"
)

const usage = `revela prepara as fotos do jogo Revelação.

Uso:
  revela check <pasta-de-rolos>   confere os rolos e as camadas
  revela build <entrada> <saída>  gera WebP e rolos.json (etapa 3)
`

func main() {
	os.Exit(run(os.Args[1:], os.Stdout, os.Stderr))
}

func run(args []string, stdout, stderr io.Writer) int {
	if len(args) == 0 {
		fmt.Fprint(stderr, usage)
		return 2
	}
	switch args[0] {
	case "check":
		if len(args) != 2 {
			fmt.Fprint(stderr, usage)
			return 2
		}
		return check(args[1], stdout, stderr)
	case "build":
		fmt.Fprintln(stderr, "revela build ainda não existe: chega na etapa 3 do roadmap")
		return 1
	default:
		fmt.Fprint(stderr, usage)
		return 2
	}
}

func check(root string, stdout, stderr io.Writer) int {
	dirs, err := roll.Dirs(root)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	total := 0
	for _, dir := range dirs {
		probs := roll.Check(dir)
		for _, p := range probs {
			fmt.Fprintln(stderr, p)
		}
		total += len(probs)
	}
	if total > 0 {
		fmt.Fprintf(stderr, "%d problema(s) em %d rolo(s)\n", total, len(dirs))
		return 1
	}
	fmt.Fprintf(stdout, "%d rolo(s) conferido(s), tudo certo\n", len(dirs))
	return 0
}
