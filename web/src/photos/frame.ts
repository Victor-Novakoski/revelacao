// A folha de papel e onde a imagem cai nela. Filme 35 mm sai 3:2 e o 120
// sai quadrado; a margem branca é o papel que o marginador cobriu.

export const PRINT = { width: 480, height: 360 }

export type Film = '35mm' | '120'

export type Frame = { x: number; y: number; w: number; h: number }

export function frameOf(film: Film): Frame {
  const { width: W, height: H } = PRINT
  if (film === '120') {
    const side = H * 0.9
    return { x: (W - side) / 2, y: (H - side) / 2, w: side, h: side }
  }
  const w = W * 0.9
  const h = (w * 2) / 3
  return { x: (W - w) / 2, y: (H - h) / 2, w, h }
}
