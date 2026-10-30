// Package age envelhece uma foto de hoje para parecer uma cópia de 1957:
// lente mais mole, halo nas luzes, preto que não chega a preto, cantos
// escuros, grão, poeira e riscos. Tudo sai de uma semente, então o mesmo
// arquivo envelhece sempre igual e o build continua reproduzível.
package age

import (
	"image"
	"math"
	"math/rand/v2"
)

// Options controla o quanto a foto envelhece. Zero em tudo usa Default.
type Options struct {
	// Soft mistura a foto com uma versão borrada (lente de 1950), de 0 a 1.
	Soft float64
	// Halo espalha as luzes fortes, como a halação do filme, de 0 a 1.
	Halo float64
	// Fade levanta o preto e baixa o branco: a cópia não tem contraste de hoje.
	Fade float64
	// Vignette escurece os cantos, de 0 a 1.
	Vignette float64
	// Grain é a força do grão, em fração da escala de cinza.
	Grain float64
	// Dust é quantos pontos de poeira a cada mil por mil pixels.
	Dust float64
	// Scratches é quantos riscos finos atravessam a foto.
	Scratches int
}

// Default é uma cópia de balcão, guardada num envelope por alguns anos.
var Default = Options{Soft: 0.35, Halo: 0.3, Fade: 0.1, Vignette: 0.35, Grain: 0.045, Dust: 40, Scratches: 2}

// Age devolve uma cópia envelhecida de src. A mesma semente dá o mesmo resultado.
func Age(src *image.Gray, seed uint64, o Options) *image.Gray {
	if o == (Options{}) {
		o = Default
	}
	w, h := src.Rect.Dx(), src.Rect.Dy()
	if w == 0 || h == 0 {
		return image.NewGray(image.Rect(0, 0, w, h))
	}
	rng := rand.New(rand.NewPCG(seed, 0x9e3779b97f4a7c15))
	v := toFloat(src)
	short := float64(min(w, h))

	if o.Soft > 0 {
		blur := boxBlur(v, w, h, max(1, int(short/300)), 2)
		mix(v, blur, o.Soft)
	}
	if o.Halo > 0 {
		// Só o que passa de 0,7 se espalha: a janela clara, o céu, a camisa branca.
		bright := make([]float64, len(v))
		for i, x := range v {
			bright[i] = math.Max(0, x-0.7) / 0.3
		}
		glow := boxBlur(bright, w, h, max(2, int(short/40)), 3)
		for i := range v {
			v[i] += o.Halo * glow[i] * (1 - v[i])
		}
	}

	cx, cy := float64(w-1)/2, float64(h-1)/2
	diag := math.Hypot(cx, cy)
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			i := y*w + x
			t := clamp(v[i])
			// Um S de leve, depois o preto e o branco puxados para o meio.
			t = t + 0.5*(t*t*(3-2*t)-t)
			t = o.Fade + (1-2*o.Fade)*t
			if o.Vignette > 0 {
				d := math.Hypot(float64(x)-cx, float64(y)-cy) / diag
				t *= 1 - o.Vignette*math.Pow(d, 2.5)
			}
			v[i] = t
		}
	}

	if o.Grain > 0 {
		for i := range v {
			// Soma de três uniformes: perto de uma normal, sem cauda longa.
			n := (rng.Float64() + rng.Float64() + rng.Float64() - 1.5) / 1.5
			// O grão aparece mais nos meios-tons do que no preto e no branco.
			mid := 4 * v[i] * (1 - v[i])
			v[i] += o.Grain * n * (0.4 + 0.6*mid)
		}
	}

	specks := int(o.Dust * float64(w*h) / 1e6)
	for range specks {
		r := 0.6 + rng.Float64()*1.4*short/600
		// Poeira no negativo sai clara na cópia; no papel, sai escura.
		tone := 0.08
		if rng.Float64() < 0.7 {
			tone = 0.95
		}
		dot(v, w, h, rng.Float64()*float64(w), rng.Float64()*float64(h), r, tone, 0.8)
	}
	for range o.Scratches {
		scratch(v, w, h, rng)
	}

	return toGray(v, w, h)
}

// scratch é um risco fino e quase vertical, que treme um pouco e some aos poucos.
func scratch(v []float64, w, h int, rng *rand.Rand) {
	x := rng.Float64() * float64(w)
	y0 := rng.Float64() * float64(h) * 0.5
	length := (0.3 + rng.Float64()*0.6) * float64(h)
	drift := (rng.Float64() - 0.5) * 0.08
	for s := 0.0; s < length; s++ {
		y := y0 + s
		if int(y) >= h {
			break
		}
		x += drift + (rng.Float64()-0.5)*0.3
		fade := math.Sin(math.Pi * s / length)
		dot(v, w, h, x, y, 0.6, 0.92, 0.35*fade)
	}
}

// dot pinta um ponto redondo de tom tone, com força alpha, borda macia.
func dot(v []float64, w, h int, cx, cy, r, tone, alpha float64) {
	for y := int(cy - r - 1); y <= int(cy+r+1); y++ {
		for x := int(cx - r - 1); x <= int(cx+r+1); x++ {
			if x < 0 || y < 0 || x >= w || y >= h {
				continue
			}
			d := math.Hypot(float64(x)+0.5-cx, float64(y)+0.5-cy)
			a := alpha * clamp(r+0.5-d)
			i := y*w + x
			v[i] += (tone - v[i]) * a
		}
	}
}

// boxBlur repete um borrão de caixa, que em poucas passadas fica parecido
// com um gaussiano e custa o mesmo para qualquer raio.
func boxBlur(src []float64, w, h, r, passes int) []float64 {
	a := append([]float64(nil), src...)
	b := make([]float64, len(src))
	for range passes {
		blurLine(a, b, w, h, r, 1, w)
		blurLine(b, a, h, w, r, w, 1)
	}
	return a
}

// blurLine borra cada linha de src em dst. n é o tamanho da linha, lines é
// quantas são; step anda dentro da linha e stride pula de uma para outra.
func blurLine(src, dst []float64, n, lines, r, step, stride int) {
	for l := 0; l < lines; l++ {
		base := l * stride
		sum := 0.0
		at := func(k int) float64 { return src[base+min(max(k, 0), n-1)*step] }
		for k := -r; k <= r; k++ {
			sum += at(k)
		}
		for k := 0; k < n; k++ {
			dst[base+k*step] = sum / float64(2*r+1)
			sum += at(k+r+1) - at(k-r)
		}
	}
}

func mix(dst, src []float64, t float64) {
	for i := range dst {
		dst[i] += (src[i] - dst[i]) * t
	}
}

func clamp(x float64) float64 { return math.Min(1, math.Max(0, x)) }

func toFloat(src *image.Gray) []float64 {
	w, h := src.Rect.Dx(), src.Rect.Dy()
	v := make([]float64, w*h)
	for y := 0; y < h; y++ {
		row := src.Pix[y*src.Stride : y*src.Stride+w]
		for x, p := range row {
			v[y*w+x] = float64(p) / 255
		}
	}
	return v
}

func toGray(v []float64, w, h int) *image.Gray {
	g := image.NewGray(image.Rect(0, 0, w, h))
	for i, x := range v {
		g.Pix[i] = uint8(math.Round(clamp(x) * 255))
	}
	return g
}
