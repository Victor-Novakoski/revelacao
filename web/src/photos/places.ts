import { ellipse, gradient, gray, person, poly, rect, tree, type Ctx, type Figure } from './draw'
import { PRINT, type Frame } from './frame'

// Os lugares que se repetem de um rolo para o outro (a praça, a igreja, o
// salão, o quintal, o estúdio, a câmara escura) e as pessoas que voltam.
// Tudo em fração da folha inteira, como em day1.ts.

export const W = PRINT.width
export const H = PRINT.height
export const X = (f: number) => f * W
export const Y = (f: number) => f * H

// A praça de domingo: céu claro, a fileira de árvores no horizonte com vãos
// (onde alguém pode ficar parado), o chão de terra batida.
export function praca(ctx: Ctx, fr: Frame, horizon = 0.52, gaps: number[] = []) {
  gradient(ctx, fr.x, fr.y, fr.w, Y(horizon) - fr.y, 0.92, 0.82)
  for (let i = 0; i < 12; i++) {
    const tx = 0.12 + i * 0.07
    if (gaps.some((g) => Math.abs(g - tx) < 0.05)) continue
    tree(ctx, X(tx), Y(horizon), Y(0.2 + (i % 3) * 0.03), 0.34 + (i % 2) * 0.06)
  }
  gradient(ctx, fr.x, Y(horizon), fr.w, fr.y + fr.h - Y(horizon), 0.7, 0.55)
}

// A fachada de igreja: colunas, porta em arco e degraus.
export function churchFront(ctx: Ctx, fr: Frame, tone = 0.72) {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, tone)
  for (const cx of [0.24, 0.33, 0.64, 0.73]) rect(ctx, X(cx), fr.y, X(0.04), Y(0.6), tone + 0.12)
  rect(ctx, X(0.42), Y(0.16), X(0.16), Y(0.44), 0.12)
  ellipse(ctx, X(0.5), Y(0.16), X(0.08), Y(0.08), 0.12)
  for (let i = 0; i < 8; i++) {
    rect(ctx, fr.x, Y(0.6 + i * 0.05), fr.w, Y(0.05), i % 2 ? tone - 0.06 : tone + 0.08)
    rect(ctx, fr.x, Y(0.6 + i * 0.05), fr.w, 2, 0.45)
  }
}

// O salão de festa: parede, faixa de enfeite e a mesa comprida.
export function hall(ctx: Ctx, fr: Frame, lanterns = true) {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.46, 0.32)
  rect(ctx, fr.x, Y(0.12), fr.w, 1.5, 0.6)
  if (lanterns) {
    for (let i = 0; i < 8; i++) {
      const lx = X(0.2 + i * 0.085)
      const ly = Y(0.15 + (i % 2) * 0.03)
      ellipse(ctx, lx, ly, X(0.022), Y(0.035), 0.9)
    }
  }
  rect(ctx, fr.x, Y(0.7), fr.w, Y(0.3), 0.86)
}

// A sala da Dona Cida: papel de parede listrado e assoalho.
export function parlor(ctx: Ctx, fr: Frame) {
  for (let i = 0; i < 30; i++) rect(ctx, fr.x + i * X(0.035), fr.y, X(0.0175), Y(0.66), i % 2 ? 0.66 : 0.6)
  rect(ctx, fr.x, Y(0.62), fr.w, Y(0.04), 0.35)
  gradient(ctx, fr.x, Y(0.66), fr.w, Y(0.34), 0.48, 0.38)
}

// A poltrona do Seu Juvenal, com ele dormindo.
export function armchair(ctx: Ctx, x: number) {
  rect(ctx, X(x - 0.18), Y(0.7), X(0.36), Y(0.16), 0.14)
  rect(ctx, X(x - 0.18), Y(0.2), X(0.36), Y(0.52), 0.24)
  rect(ctx, X(x - 0.22), Y(0.42), X(0.08), Y(0.32), 0.2)
  rect(ctx, X(x + 0.14), Y(0.42), X(0.08), Y(0.32), 0.2)
  rect(ctx, X(x - 0.1), Y(0.38), X(0.2), Y(0.3), 0.42)
  ellipse(ctx, X(x + 0.03), Y(0.34), X(0.04), Y(0.07), 0.7)
  ellipse(ctx, X(x + 0.025), Y(0.29), X(0.04), Y(0.03), 0.85)
}

// O quintal: muro, chão de terra e o varal de lençóis.
export function yard(ctx: Ctx, fr: Frame, sheets = true) {
  gradient(ctx, fr.x, fr.y, fr.w, Y(0.4), 0.92, 0.84)
  rect(ctx, fr.x, Y(0.34), fr.w, Y(0.22), 0.62)
  for (let i = 0; i < 14; i++) rect(ctx, X(i * 0.08), Y(0.34), 2, Y(0.22), 0.5)
  gradient(ctx, fr.x, Y(0.56), fr.w, Y(0.44), 0.56, 0.42)
  if (!sheets) return
  rect(ctx, fr.x, Y(0.18), fr.w, 1.5, 0.3)
  rect(ctx, X(0.12), Y(0.18), X(0.2), Y(0.5), 0.95)
  rect(ctx, X(0.36), Y(0.18), X(0.22), Y(0.56), 0.97)
  rect(ctx, X(0.64), Y(0.18), X(0.16), Y(0.4), 0.93)
}

// O estúdio do Nakamura: fundo pintado em degradê e o chão.
export function studio(ctx: Ctx, fr: Frame, curtain = false) {
  const g = ctx.createRadialGradient(X(0.5), Y(0.4), 10, X(0.5), Y(0.45), X(0.45))
  g.addColorStop(0, gray(0.78))
  g.addColorStop(1, gray(0.36))
  ctx.fillStyle = g
  ctx.fillRect(fr.x, fr.y, fr.w, fr.h)
  rect(ctx, fr.x, Y(0.82), fr.w, Y(0.18), 0.3)
  if (curtain) {
    // A cortina de veludo à direita, com uma fresta aberta para o corredor.
    for (let i = 0; i < 6; i++) rect(ctx, X(0.66 + i * 0.03), fr.y, X(0.03), Y(0.82), i % 2 ? 0.2 : 0.26)
    rect(ctx, X(0.72), fr.y, X(0.06), Y(0.82), 0.5)
  }
}

// O interior da igreja, do fundo da nave para o altar.
export function churchInside(ctx: Ctx, fr: Frame) {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.5, 0.3)
  // As colunas, cada vez menores para o fundo.
  for (let i = 0; i < 4; i++) {
    const s = 1 - i * 0.18
    for (const side of [-1, 1]) {
      rect(ctx, X(0.5 + side * (0.28 * s) - 0.02 * s), Y(0.05), X(0.04 * s), Y(0.5 + 0.12 * s), 0.7 - i * 0.06)
    }
  }
  // O altar, claro, com as velas.
  rect(ctx, X(0.42), Y(0.36), X(0.16), Y(0.16), 0.88)
  for (let i = 0; i < 5; i++) rect(ctx, X(0.44 + i * 0.03), Y(0.3), 2, Y(0.06), 0.95)
  // Os bancos, escuros, dos dois lados do corredor.
  for (let i = 0; i < 5; i++) {
    const y = Y(0.6 + i * 0.075)
    rect(ctx, fr.x, y, X(0.42) - fr.x - i * 6, Y(0.04), 0.14)
    rect(ctx, X(0.58) + i * 6, y, fr.x + fr.w - X(0.58) - i * 6, Y(0.04), 0.14)
  }
  poly(ctx, [[X(0.45), Y(0.52)], [X(0.55), Y(0.52)], [X(0.7), fr.y + fr.h], [X(0.3), fr.y + fr.h]], 0.62)
}

// A câmara escura da Foto Íris, a mesma da sala do jogo: parede escura,
// a bancada com as bandejas, a lâmpada de segurança e o varal.
export function darkroom(ctx: Ctx, fr: Frame, bench = 0.62) {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.5, 0.32)
  // A lâmpada de segurança e o halo dela.
  const g = ctx.createRadialGradient(X(0.5), Y(0.14), 2, X(0.5), Y(0.14), X(0.3))
  g.addColorStop(0, gray(0.85, 0.9))
  g.addColorStop(1, gray(0.3, 0))
  ctx.fillStyle = g
  ctx.fillRect(fr.x, fr.y, fr.w, fr.h)
  ellipse(ctx, X(0.5), Y(0.14), X(0.025), Y(0.03), 0.98)
  // O varal com as cópias.
  rect(ctx, fr.x, Y(0.26), fr.w, 1.5, 0.45)
  for (let i = 0; i < 6; i++) rect(ctx, X(0.14 + i * 0.13), Y(0.27), X(0.07), Y(0.08), 0.62)
  // A bancada e as três bandejas.
  rect(ctx, fr.x, Y(bench), fr.w, Y(0.05), 0.32)
  rect(ctx, fr.x, Y(bench + 0.05), fr.w, fr.y + fr.h - Y(bench + 0.05), 0.24)
  for (let i = 0; i < 3; i++) rect(ctx, X(0.3 + i * 0.16), Y(bench - 0.02), X(0.13), Y(0.025), 0.55)
}

// O ampliador da bancada: coluna, cabeça e a mesa de base.
export function enlarger(ctx: Ctx, x: number, foot: number, h: number) {
  rect(ctx, x - h * 0.02, foot - h, h * 0.04, h, 0.35)
  rect(ctx, x - h * 0.12, foot - h * 0.72, h * 0.24, h * 0.18, 0.28)
  poly(ctx, [[x - h * 0.06, foot - h * 0.54], [x + h * 0.06, foot - h * 0.54], [x + h * 0.03, foot - h * 0.44], [x - h * 0.03, foot - h * 0.44]], 0.4)
  rect(ctx, x - h * 0.2, foot - h * 0.04, h * 0.4, h * 0.04, 0.5)
}

// Os clientes de sempre, para os rolos dos outros dias.
export const lady = (x: number, foot: number, h: number): Figure => ({ x, foot, h, tone: 0.28, dress: true, hair: 0.85, face: 0.68 })
export const girl = (x: number, foot: number, h: number, tone = 0.85): Figure => ({ x, foot, h, tone, dress: true, hair: 0.18 })
export const boy = (x: number, foot: number, h: number, tone = 0.4): Figure => ({ x, foot, h, tone, hair: 0.12 })
export const groom = (x: number, foot: number, h: number): Figure => ({ x, foot, h, tone: 0.1, hair: 0.06 })
export const bride = (x: number, foot: number, h: number): Figure => ({ x, foot, h, tone: 0.96, dress: true, hair: 0.1 })
// Normalista: blusa branca e saia escura.
export function student(ctx: Ctx, x: number, foot: number, h: number, arms: Figure['arms'] = 'down') {
  person(ctx, { x, foot, h, tone: 0.25, dress: true, hair: 0.12, arms })
  rect(ctx, x - h * 0.1, foot - h * 0.86, h * 0.2, h * 0.32, 0.92)
}

// O Elias, de boné. alpha: o quanto ele ainda está na foto.
export function elias(ctx: Ctx, x: number, foot: number, h: number, alpha: number) {
  ctx.save()
  ctx.globalAlpha = alpha
  person(ctx, { x, foot, h, tone: 0.38, face: 0.7, hair: 0.2 })
  cap(ctx, x, foot - h, h)
  ctx.restore()
}

export function cap(ctx: Ctx, x: number, top: number, h: number) {
  ctx.fillStyle = gray(0.2)
  ctx.beginPath()
  ctx.ellipse(x, top + h * 0.04, h * 0.065, h * 0.04, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  rect(ctx, x - h * 0.02, top + h * 0.035, h * 0.1, h * 0.012, 0.15)
}

// Letreiro pintado, em maiúsculas.
export function sign(ctx: Ctx, text: string, x: number, y: number, size: number, tone: number) {
  ctx.fillStyle = gray(tone)
  ctx.font = `bold ${Math.round(size)}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}
