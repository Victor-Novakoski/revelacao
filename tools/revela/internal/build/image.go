package build

import (
	"bytes"
	"fmt"
	"image"
	_ "image/jpeg" // as camadas podem vir em JPEG
	_ "image/png"
	"os"

	"github.com/gen2brain/webp"
)

// DecodeGray abre uma camada e converte para tons de cinza. A transparência
// vira preto: no shader, preto é "nada aqui", então uma camada com fundo
// transparente e uma com fundo preto dão no mesmo.
func DecodeGray(path string) (*image.Gray, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	src, _, err := image.Decode(f)
	if err != nil {
		return nil, fmt.Errorf("%s: não deu para ler a imagem: %w", path, err)
	}
	b := src.Bounds()
	gray := image.NewGray(image.Rect(0, 0, b.Dx(), b.Dy()))
	for y := b.Min.Y; y < b.Max.Y; y++ {
		for x := b.Min.X; x < b.Max.X; x++ {
			// Luminância sobre fundo preto: RGBA já vem pré-multiplicado pelo alfa.
			r, g, bl, _ := src.At(x, y).RGBA()
			lum := (19595*r + 38470*g + 7471*bl + 1<<15) >> 24
			gray.Pix[(y-b.Min.Y)*gray.Stride+(x-b.Min.X)] = uint8(lum)
		}
	}
	return gray, nil
}

// negative inverte os tons: o claro fica escuro, como no filme.
func negative(src *image.Gray) *image.Gray {
	dst := image.NewGray(src.Rect)
	for i, v := range src.Pix {
		dst.Pix[i] = 255 - v
	}
	return dst
}

// encodeWebP comprime em WebP com perda. O WebP não tem modo de cinza, então
// a imagem vai como RGB com os três canais iguais; o shader lê só o vermelho.
func encodeWebP(src *image.Gray, quality int) ([]byte, error) {
	rgba := image.NewNRGBA(src.Rect)
	for i, v := range src.Pix {
		rgba.Pix[i*4] = v
		rgba.Pix[i*4+1] = v
		rgba.Pix[i*4+2] = v
		rgba.Pix[i*4+3] = 0xff
	}
	var buf bytes.Buffer
	if err := webp.Encode(&buf, rgba, webp.Options{Quality: quality, Method: 6}); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}
