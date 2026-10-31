import { gray, type Ctx } from './draw'
import { PRINT } from './frame'

// Medidas da folha inteira (480x360): as posições das fotos ficam em
// fração dela.

export const W = PRINT.width
export const H = PRINT.height
export const X = (f: number) => f * W
export const Y = (f: number) => f * H

// Letreiro pintado, em maiúsculas.
export function sign(ctx: Ctx, text: string, x: number, y: number, size: number, tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.font = `bold ${Math.round(size)}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}
