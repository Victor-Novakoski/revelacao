// Pincéis para as fotos desenhadas em código, enquanto as do Blender não
// chegam. Tudo em tons de cinza, de 0 (preto) a 1 (branco).

export type Ctx = CanvasRenderingContext2D

export const gray = (v: number, a = 1) => {
  const c = Math.round(Math.max(0, Math.min(1, v)) * 255)
  return `rgba(${c},${c},${c},${a})`
}

// Sorteio com semente, para a foto sair sempre igual.
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.fillRect(x, y, w, h)
}

export function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2)
  ctx.fill()
}

export function poly(ctx: Ctx, points: [number, number][], tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.beginPath()
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.fill()
}

export function gradient(ctx: Ctx, x: number, y: number, w: number, h: number, top: number, bottom: number) {
  const g = ctx.createLinearGradient(0, y, 0, y + h)
  g.addColorStop(0, gray(top))
  g.addColorStop(1, gray(bottom))
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
}

export type Figure = {
  x: number
  foot: number
  h: number
  // Tom da roupa e do rosto.
  tone: number
  face?: number
  dress?: boolean
  // Braços para cima (jogando arroz, brindando).
  arms?: 'down' | 'up' | 'side'
  hair?: number
}

// Uma pessoa simples, de frente: cabeça, tronco, saia ou calça, braços.
export function person(ctx: Ctx, f: Figure) {
  const { x, foot, h, tone, dress = false, arms = 'down' } = f
  const head = h * 0.13
  const top = foot - h
  const shoulder = h * 0.13
  const waist = top + h * 0.48
  const hem = dress ? h * 0.22 : h * 0.1
  // Pernas.
  const legTop = dress ? foot - h * 0.24 : waist
  rect(ctx, x - h * 0.065, legTop, h * 0.05, foot - legTop, dress ? 0.55 : tone)
  rect(ctx, x + h * 0.015, legTop, h * 0.05, foot - legTop, dress ? 0.55 : tone)
  // Tronco e saia.
  poly(
    ctx,
    [
      [x - shoulder, top + head * 1.1],
      [x + shoulder, top + head * 1.1],
      [x + hem, dress ? foot - h * 0.22 : waist],
      [x - hem, dress ? foot - h * 0.22 : waist],
    ],
    tone,
  )
  // Braços.
  const armW = h * 0.04
  ctx.fillStyle = gray(tone)
  for (const side of [-1, 1]) {
    ctx.save()
    ctx.translate(x + side * (shoulder - armW * 0.5), top + head * 1.2)
    // Girar no sentido do relógio leva a mão para a esquerda.
    const angle = arms === 'up' ? 2.6 : arms === 'side' ? 0.5 : 0.08
    ctx.rotate(-side * angle)
    ctx.fillRect(-armW / 2, 0, armW, h * 0.36)
    ctx.restore()
  }
  // Cabeça e cabelo.
  ellipse(ctx, x, top + head * 0.55, head * 0.45, head * 0.55, f.face ?? 0.72)
  if (f.hair !== undefined) {
    ctx.fillStyle = gray(f.hair)
    ctx.beginPath()
    ctx.ellipse(x, top + head * 0.35, head * 0.48, head * 0.38, 0, Math.PI, Math.PI * 2)
    ctx.fill()
  }
}

// Queda de luz da lente nos cantos.
export function falloff(ctx: Ctx, x: number, y: number, w: number, h: number, strength = 0.4) {
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, h * 0.35, x + w / 2, y + h / 2, Math.max(w, h) * 0.72)
  g.addColorStop(0, gray(0, 0))
  g.addColorStop(1, gray(0, strength))
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
}
