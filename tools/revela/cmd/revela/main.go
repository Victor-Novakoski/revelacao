// Comando revela prepara as fotos do jogo a partir dos renders do Blender.
package main

import (
	"flag"
	"fmt"
	"image/png"
	"io"
	"os"
	"strings"
	"time"

	"github.com/victor-novakoski/revelacao/tools/revela/internal/age"
	"github.com/victor-novakoski/revelacao/tools/revela/internal/build"
	"github.com/victor-novakoski/revelacao/tools/revela/internal/roll"
)

const usage = `revela prepara as fotos do jogo Revelação.

Uso:
  revela check <pasta-de-rolos>   confere os rolos e as camadas
  revela build [-j N] [-q Q] <entrada> <saída>
                                  gera as camadas em cinza, o negativo
                                  de cada foto em WebP e o rolos.json
  revela age [-seed N] <foto> <saída.png>
                                  envelhece uma foto, para conferir antes
                                  de marcar "age": true no roll.json

Opções do build:
  -j N   fotos processadas ao mesmo tempo (padrão: uma por CPU)
  -q Q   qualidade do WebP, de 1 a 100 (padrão: 82)
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
		return runBuild(args[1:], stdout, stderr)
	case "age":
		return runAge(args[1:], stdout, stderr)
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

func runBuild(args []string, stdout, stderr io.Writer) int {
	fs := flag.NewFlagSet("build", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	workers := fs.Int("j", 0, "")
	quality := fs.Int("q", build.DefaultQuality, "")
	if err := fs.Parse(args); err != nil || fs.NArg() != 2 || *quality < 1 || *quality > 100 || *workers < 0 {
		fmt.Fprint(stderr, usage)
		return 2
	}
	start := time.Now()
	m, err := build.Run(fs.Arg(0), fs.Arg(1), build.Options{Workers: *workers, Quality: *quality})
	if err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	photos, total := 0, 0
	for _, r := range m.Rolls {
		for _, p := range r.Photos {
			photos++
			total += p.Negative.Bytes
			for _, l := range p.Layers {
				total += l.Bytes
			}
		}
	}
	fmt.Fprintf(stdout, "%d rolo(s), %d foto(s), %.1f KB em %s\n", len(m.Rolls), photos, float64(total)/1024, time.Since(start).Round(time.Millisecond))
	return 0
}

func runAge(args []string, stdout, stderr io.Writer) int {
	fs := flag.NewFlagSet("age", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	seed := fs.Uint64("seed", 1, "")
	if err := fs.Parse(args); err != nil || fs.NArg() != 2 || !strings.HasSuffix(strings.ToLower(fs.Arg(1)), ".png") {
		fmt.Fprint(stderr, usage)
		return 2
	}
	gray, err := build.DecodeGray(fs.Arg(0))
	if err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	f, err := os.Create(fs.Arg(1))
	if err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	if err := png.Encode(f, age.Age(gray, *seed, age.Default)); err != nil {
		f.Close()
		fmt.Fprintln(stderr, err)
		return 1
	}
	if err := f.Close(); err != nil {
		fmt.Fprintln(stderr, err)
		return 1
	}
	fmt.Fprintf(stdout, "%s envelhecida em %s\n", fs.Arg(0), fs.Arg(1))
	return 0
}
