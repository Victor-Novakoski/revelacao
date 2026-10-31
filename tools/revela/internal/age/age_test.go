package age

import (
	"bytes"
	"image"
	"testing"
)

func flat(w, h int, v uint8) *image.Gray {
	g := image.NewGray(image.Rect(0, 0, w, h))
	for i := range g.Pix {
		g.Pix[i] = v
	}
	return g
}

func mean(g *image.Gray, r image.Rectangle) float64 {
	sum, n := 0.0, 0
	for y := r.Min.Y; y < r.Max.Y; y++ {
		for x := r.Min.X; x < r.Max.X; x++ {
			sum += float64(g.GrayAt(x, y).Y)
			n++
		}
	}
	return sum / float64(n)
}

func TestSameSeedSameCopy(t *testing.T) {
	src := flat(120, 90, 128)
	a := Age(src, 7, Default)
	b := Age(src, 7, Default)
	if !bytes.Equal(a.Pix, b.Pix) {
		t.Fatal("a mesma semente deu cópias diferentes")
	}
	if bytes.Equal(a.Pix, Age(src, 8, Default).Pix) {
		t.Fatal("sementes diferentes deram a mesma cópia")
	}
}

func TestKeepsSizeAndSource(t *testing.T) {
	src := flat(64, 48, 200)
	before := append([]byte(nil), src.Pix...)
	out := Age(src, 1, Options{})
	if out.Rect.Dx() != 64 || out.Rect.Dy() != 48 {
		t.Fatalf("tamanho mudou: %v", out.Rect)
	}
	if !bytes.Equal(src.Pix, before) {
		t.Fatal("Age mexeu na foto original")
	}
}

func TestCornersDarkerThanCenter(t *testing.T) {
	out := Age(flat(200, 150, 180), 3, Options{Vignette: 0.4})
	center := mean(out, image.Rect(90, 65, 110, 85))
	corner := mean(out, image.Rect(0, 0, 20, 20))
	if corner >= center-10 {
		t.Fatalf("canto %.1f não ficou mais escuro que o centro %.1f", corner, center)
	}
}

func TestFadeLiftsBlackAndLowersWhite(t *testing.T) {
	o := Options{Fade: 0.1}
	black := mean(Age(flat(40, 40, 0), 1, o), image.Rect(0, 0, 40, 40))
	white := mean(Age(flat(40, 40, 255), 1, o), image.Rect(0, 0, 40, 40))
	if black < 20 || white > 235 {
		t.Fatalf("preto %.1f e branco %.1f: o contraste devia ter caído", black, white)
	}
}

func TestHaloSpreadsHighlights(t *testing.T) {
	src := flat(200, 200, 30)
	for y := 90; y < 110; y++ {
		for x := 90; x < 110; x++ {
			src.Pix[y*src.Stride+x] = 255
		}
	}
	plain := Age(src, 1, Options{Fade: 0.0001})
	halo := Age(src, 1, Options{Fade: 0.0001, Halo: 0.6})
	near := image.Rect(112, 95, 118, 105)
	if mean(halo, near) <= mean(plain, near)+5 {
		t.Fatalf("o halo não clareou em volta da luz: %.1f contra %.1f", mean(halo, near), mean(plain, near))
	}
}
