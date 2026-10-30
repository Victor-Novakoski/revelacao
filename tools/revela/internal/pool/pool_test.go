package pool

import (
	"errors"
	"fmt"
	"sync/atomic"
	"testing"
	"time"
)

func TestMapKeepsOrder(t *testing.T) {
	in := []int{5, 1, 4, 2, 3}
	out, err := Map(3, in, func(n int) (string, error) {
		// Os maiores demoram mais, para terminarem fora de ordem.
		time.Sleep(time.Duration(n) * time.Millisecond)
		return fmt.Sprint(n * 10), nil
	})
	if err != nil {
		t.Fatal(err)
	}
	want := []string{"50", "10", "40", "20", "30"}
	for i := range want {
		if out[i] != want[i] {
			t.Fatalf("esperava %v, veio %v", want, out)
		}
	}
}

func TestMapRespectsWorkerLimit(t *testing.T) {
	var running, peak atomic.Int32
	in := make([]int, 20)
	_, err := Map(4, in, func(int) (struct{}, error) {
		n := running.Add(1)
		for {
			p := peak.Load()
			if n <= p || peak.CompareAndSwap(p, n) {
				break
			}
		}
		time.Sleep(2 * time.Millisecond)
		running.Add(-1)
		return struct{}{}, nil
	})
	if err != nil {
		t.Fatal(err)
	}
	if got := peak.Load(); got > 4 {
		t.Fatalf("esperava no máximo 4 ao mesmo tempo, vieram %d", got)
	}
}

func TestMapRunsEverythingAndJoinsErrors(t *testing.T) {
	errA := errors.New("a quebrou")
	errC := errors.New("c quebrou")
	var calls atomic.Int32
	_, err := Map(2, []string{"a", "b", "c"}, func(s string) (int, error) {
		calls.Add(1)
		switch s {
		case "a":
			return 0, errA
		case "c":
			return 0, errC
		}
		return 1, nil
	})
	if calls.Load() != 3 {
		t.Fatalf("esperava 3 chamadas, vieram %d", calls.Load())
	}
	if !errors.Is(err, errA) || !errors.Is(err, errC) {
		t.Fatalf("esperava os dois erros, veio %v", err)
	}
}

func TestMapEmptyInput(t *testing.T) {
	out, err := Map(0, nil, func(int) (int, error) { return 0, nil })
	if err != nil || len(out) != 0 {
		t.Fatalf("esperava nada, veio %v %v", out, err)
	}
}
