// Package pool roda um trabalho em paralelo com um número fixo de goroutines.
package pool

import (
	"errors"
	"runtime"
	"sync"
)

// Map aplica fn a cada item de in usando no máximo workers goroutines ao mesmo
// tempo. A saída sai na mesma ordem da entrada, não importa quem termina antes.
// Um erro não para os outros trabalhos: todos rodam e os erros voltam juntos,
// para a CLI mostrar tudo o que está quebrado de uma vez.
func Map[In, Out any](workers int, in []In, fn func(In) (Out, error)) ([]Out, error) {
	if workers < 1 {
		workers = runtime.NumCPU()
	}
	if workers > len(in) {
		workers = len(in)
	}
	out := make([]Out, len(in))
	errs := make([]error, len(in))

	jobs := make(chan int)
	var wg sync.WaitGroup
	for range workers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range jobs {
				out[i], errs[i] = fn(in[i])
			}
		}()
	}
	for i := range in {
		jobs <- i
	}
	close(jobs)
	wg.Wait()

	return out, errors.Join(errs...)
}
