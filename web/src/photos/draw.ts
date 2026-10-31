// Pincéis para as camadas das fotos. Tudo em tons de cinza, de 0 (preto)
// a 1 (branco).

export type Ctx = CanvasRenderingContext2D

export const gray = (v: number, a = 1) => {
  const c = Math.round(Math.max(0, Math.min(1, v)) * 255)
  return `rgba(${c},${c},${c},${a})`
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.fillRect(x, y, w, h)
}

// A figura, desenhada na própria camada: vermelho sobre preto (verde e azul
// são da figura de foto real, ver real.ts). Alta e magra demais, braços que
// descem até perto dos joelhos, cabeça pequena.
export function creature(ctx: Ctx, x: number, foot: number, h: number) {
  ctx.fillStyle = '#f00'
  ctx.beginPath()
  ctx.ellipse(x, foot - h * 0.93, h * 0.055, h * 0.075, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x - h * 0.08, foot - h * 0.83)
  ctx.lineTo(x + h * 0.08, foot - h * 0.83)
  ctx.lineTo(x + h * 0.05, foot)
  ctx.lineTo(x - h * 0.05, foot)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(x - h * 0.12, foot - h * 0.81, h * 0.035, h * 0.56)
  ctx.fillRect(x + h * 0.085, foot - h * 0.81, h * 0.035, h * 0.56)
}
