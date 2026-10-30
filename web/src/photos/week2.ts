import { augusto, crowd, ellipse, falloff, gradient, gray, person, poly, rect, seeded, type Ctx } from './draw'
import type { Scene } from './day1'
import {
  X,
  Y,
  armchair,
  boy,
  bride,
  churchFront,
  darkroom,
  enlarger,
  girl,
  groom,
  hall,
  lady,
  parlor,
  sign,
  studio,
  yard,
} from './places'
import { coreto, lago, pertoVolta, pipoqueiro } from './week1'

// As fotos dos dias 6 a 10. Como em week1.ts, a figura fica na camada
// própria (photos/figures.ts).

// Dia 7 · Dona Cida, "Primeira comunhão da Lúcia" (35 mm).

const comunhaoPorta: Scene = (ctx, fr) => {
  churchFront(ctx, fr, 0.7)
  person(ctx, girl(X(0.5), Y(0.86), Y(0.42), 0.97))
  // O véu e o terço.
  poly(ctx, [[X(0.47), Y(0.46)], [X(0.53), Y(0.46)], [X(0.56), Y(0.62)], [X(0.44), Y(0.62)]], 0.95)
  person(ctx, lady(X(0.66), Y(0.9), Y(0.56)))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const vela: Scene = (ctx, fr) => {
  studio(ctx, fr)
  person(ctx, girl(X(0.5), Y(1.3), Y(1.0), 0.97))
  // A vela acesa na mão, com a fita.
  rect(ctx, X(0.53), Y(0.42), X(0.02), Y(0.3), 0.96)
  ellipse(ctx, X(0.54), Y(0.4), X(0.008), Y(0.02), 1)
  rect(ctx, X(0.52), Y(0.6), X(0.04), Y(0.02), 0.6)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const almoco: Scene = (ctx, fr) => {
  parlor(ctx, fr)
  person(ctx, lady(X(0.22), Y(0.94), Y(0.72)))
  person(ctx, { x: X(0.8), foot: Y(0.96), h: Y(0.74), tone: 0.2, hair: 0.85 })
  person(ctx, girl(X(0.44), Y(0.86), Y(0.42), 0.97))
  person(ctx, boy(X(0.6), Y(0.86), Y(0.44), 0.2))
  rect(ctx, fr.x, Y(0.62), fr.w, Y(0.38), 0.88)
  for (const px of [0.25, 0.45, 0.65]) ellipse(ctx, X(px), Y(0.7), X(0.05), Y(0.02), 0.96)
  ellipse(ctx, X(0.5), Y(0.64), X(0.08), Y(0.03), 0.6)
  // O gato de novo, agora embaixo da mesa.
  ellipse(ctx, X(0.72), Y(0.84), X(0.035), Y(0.02), 0.45)
  ellipse(ctx, X(0.745), Y(0.828), X(0.013), Y(0.015), 0.45)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const meninos: Scene = (ctx, fr) => {
  yard(ctx, fr, false)
  person(ctx, boy(X(0.42), Y(0.92), Y(0.52), 0.15))
  person(ctx, boy(X(0.58), Y(0.93), Y(0.4), 0.15))
  for (const bx of [0.42, 0.58]) rect(ctx, X(bx) - 3, Y(0.52), 6, Y(0.08), 0.92)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// Dia 8 · Seu Nakamura, "Bodas de prata" (120).

const elderly = (x: number, foot: number, h: number, wife: boolean) =>
  wife ? { x, foot, h, tone: 0.55, dress: true, hair: 0.8 } : { x, foot, h, tone: 0.12, hair: 0.8 }

const bodasCasal: Scene = (ctx, fr) => {
  studio(ctx, fr)
  person(ctx, elderly(X(0.42), Y(0.96), Y(0.74), false))
  person(ctx, elderly(X(0.58), Y(0.96), Y(0.68), true))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const bodasBolo: Scene = (ctx, fr) => {
  hall(ctx, fr)
  rect(ctx, X(0.42), Y(0.54), X(0.16), Y(0.16), 0.95)
  sign(ctx, '25', X(0.5), Y(0.62), Y(0.07), 0.6)
  person(ctx, elderly(X(0.3), Y(0.92), Y(0.6), false))
  person(ctx, elderly(X(0.7), Y(0.92), Y(0.56), true))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const danca: Scene = (ctx, fr) => {
  hall(ctx, fr)
  rect(ctx, fr.x, Y(0.7), fr.w, Y(0.3), 0.5)
  crowd(ctx, 81, 6, X(0.2), X(0.8), Y(0.72), Y(0.34))
  person(ctx, { ...elderly(X(0.46), Y(0.94), Y(0.62), false), arms: 'side' })
  person(ctx, { ...elderly(X(0.54), Y(0.94), Y(0.58), true), arms: 'side' })
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const bodasFamilia: Scene = (ctx, fr) => {
  studio(ctx, fr)
  for (const [i, bx] of [0.26, 0.36, 0.64, 0.74].entries()) person(ctx, { x: X(bx), foot: Y(0.8), h: Y(0.46), tone: i % 2 ? 0.2 : 0.6, dress: i % 2 === 0, hair: 0.1 })
  person(ctx, elderly(X(0.45), Y(0.92), Y(0.56), false))
  person(ctx, elderly(X(0.55), Y(0.92), Y(0.52), true))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const salao: Scene = (ctx, fr) => {
  hall(ctx, fr)
  rect(ctx, fr.x, Y(0.7), fr.w, Y(0.3), 0.5)
  // Cadeiras vazias encostadas na parede e os dois sozinhos no meio.
  for (let i = 0; i < 8; i++) rect(ctx, X(0.18 + i * 0.09), Y(0.58), X(0.03), Y(0.12), 0.2)
  person(ctx, elderly(X(0.48), Y(0.86), Y(0.4), false))
  person(ctx, elderly(X(0.53), Y(0.86), Y(0.37), true))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

// Dia 9 · Dona Cida, "O quintal" (35 mm). A figura perto, em todas.

const lencois: Scene = (ctx, fr) => {
  yard(ctx, fr)
  person(ctx, girl(X(0.7), Y(0.92), Y(0.36)))
  person(ctx, boy(X(0.8), Y(0.92), Y(0.3), 0.5))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const roda: Scene = (ctx, fr) => {
  yard(ctx, fr, false)
  // A roda de crianças, de mãos dadas, com um vão.
  for (const [i, rx] of [0.28, 0.38, 0.62, 0.72].entries()) {
    person(ctx, { ...(i % 2 ? girl(X(rx), Y(0.9), Y(0.36)) : boy(X(rx), Y(0.9), Y(0.36))), arms: 'side' })
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const poltronaNoite: Scene = (ctx, fr) => {
  parlor(ctx, fr)
  armchair(ctx, 0.42)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.45)
}

const portaoNoite: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h * 0.4, 0.84, 0.76)
  rect(ctx, fr.x, Y(0.18), fr.w, Y(0.5), 0.68)
  rect(ctx, X(0.44), Y(0.3), X(0.12), Y(0.38), 0.3)
  rect(ctx, fr.x, Y(0.6), fr.w, Y(0.12), 0.78)
  gradient(ctx, fr.x, Y(0.72), fr.w, Y(0.28), 0.58, 0.44)
  for (let i = 0; i < 18; i++) rect(ctx, X(0.3 + i * 0.022), Y(0.4), 3, Y(0.32), 0.12)
  person(ctx, boy(X(0.38), Y(0.95), Y(0.5), 0.3))
  person(ctx, girl(X(0.5), Y(0.96), Y(0.44)))
  person(ctx, boy(X(0.66), Y(0.97), Y(0.34), 0.5))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

// Dia 9 · Seu Nakamura, "Casamento na Mooca" (120).

const mooca: Scene = (ctx, fr) => {
  churchFront(ctx, fr, 0.7)
  crowd(ctx, 23, 5, X(0.2), X(0.8), Y(0.84), Y(0.48))
  person(ctx, groom(X(0.44), Y(0.9), Y(0.52)))
  person(ctx, bride(X(0.54), Y(0.92), Y(0.5)))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const moocaFamilia: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h * 0.7, 0.78, 0.7)
  gradient(ctx, fr.x, Y(0.72), fr.w, Y(0.28), 0.58, 0.48)
  for (const [i, bx] of [0.24, 0.34, 0.6, 0.7, 0.8].entries()) person(ctx, { x: X(bx), foot: Y(0.78), h: Y(0.42), tone: i % 2 ? 0.15 : 0.4, hair: 0.08 })
  for (const [i, fx] of [0.3, 0.42, 0.5, 0.58, 0.7].entries()) {
    person(ctx, fx === 0.5 ? bride(X(fx), Y(0.94), Y(0.44)) : { x: X(fx), foot: Y(0.94), h: Y(0.44), tone: i % 2 ? 0.2 : 0.5, hair: 0.08 })
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const moocaBrinde: Scene = (ctx, fr) => {
  hall(ctx, fr)
  person(ctx, { ...groom(X(0.42), Y(0.9), Y(0.6)), arms: 'up' })
  person(ctx, { ...bride(X(0.54), Y(0.9), Y(0.56)), arms: 'up' })
  rect(ctx, fr.x, Y(0.72), fr.w, Y(0.28), 0.86)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const moocaSaida: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.68)
  rect(ctx, X(0.4), fr.y, X(0.2), Y(0.5), 0.12)
  gradient(ctx, fr.x, Y(0.55), fr.w, Y(0.45), 0.62, 0.5)
  person(ctx, { x: X(0.72), foot: Y(0.84), h: Y(0.5), tone: 0.3, hair: 0.1, arms: 'up' })
  person(ctx, { x: X(0.8), foot: Y(0.84), h: Y(0.48), tone: 0.6, dress: true, hair: 0.1, arms: 'up' })
  person(ctx, groom(X(0.48), Y(0.86), Y(0.6)))
  person(ctx, bride(X(0.57), Y(0.86), Y(0.56)))
  // O arroz no ar. Em volta dele, não cai nenhum.
  const rand = seeded(2310)
  for (let i = 0; i < 180; i++) {
    const rx = 0.2 + rand() * 0.62
    const ry = 0.08 + rand() * 0.5
    if (Math.abs(rx - 0.36) < 0.06) continue
    ctx.fillStyle = gray(0.97)
    ctx.fillRect(X(rx), Y(ry), 1.6, 1.6)
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// Dia 9 · a Senhorita Amanda, "A livraria" (35 mm). Sem figura nenhuma.

function amanda(ctx: Ctx, x: number, foot: number, h: number) {
  person(ctx, { x, foot, h, tone: 0.06, dress: true, hair: 0.04, face: 0.78 })
  // O livro aberto na mão.
  rect(ctx, x - h * 0.08, foot - h * 0.62, h * 0.16, h * 0.08, 0.92)
}

function shelves(ctx: Ctx, x: number, w: number, top: number, bottom: number, seed: number) {
  rect(ctx, x, top, w, bottom - top, 0.18)
  const rand = seeded(seed)
  for (let row = 0; row < 5; row++) {
    const y = top + ((bottom - top) / 5) * row
    rect(ctx, x, y, w, 3, 0.4)
    let bx = x + 3
    while (bx < x + w - 6) {
      const bw = 4 + rand() * 6
      rect(ctx, bx, y + 5 + rand() * 4, bw - 1, (bottom - top) / 5 - 9, 0.3 + rand() * 0.6)
      bx += bw
    }
  }
}

const vitrine: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
  rect(ctx, X(0.1), Y(0.2), X(0.8), Y(0.56), 0.82)
  sign(ctx, 'LIVRARIA', X(0.5), Y(0.15), Y(0.05), 0.85)
  for (let i = 0; i < 6; i++) rect(ctx, X(0.16 + i * 0.12), Y(0.5), X(0.07), Y(0.18), 0.15 + (i % 3) * 0.2)
  rect(ctx, fr.x, Y(0.76), fr.w, Y(0.2), 0.45)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

const estantes: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.5)
  shelves(ctx, X(0.08), X(0.4), Y(0.12), Y(0.88), 7)
  shelves(ctx, X(0.52), X(0.4), Y(0.12), Y(0.88), 9)
  // Um livro deitado, fora do lugar.
  rect(ctx, X(0.6), Y(0.43), X(0.07), Y(0.02), 0.95)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const gato: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.55)
  shelves(ctx, fr.x, fr.w, Y(0.1), Y(0.56), 3)
  rect(ctx, fr.x, Y(0.56), fr.w, Y(0.36), 0.68)
  // O gato preto da livraria em cima da pilha de livros, e a tigela.
  for (let i = 0; i < 4; i++) rect(ctx, X(0.38 - i * 0.005), Y(0.74 - i * 0.04), X(0.22), Y(0.04), 0.4 + (i % 2) * 0.4)
  ellipse(ctx, X(0.49), Y(0.6), X(0.07), Y(0.05), 0.06)
  ellipse(ctx, X(0.55), Y(0.54), X(0.03), Y(0.035), 0.06)
  poly(ctx, [[X(0.53), Y(0.51)], [X(0.535), Y(0.48)], [X(0.545), Y(0.51)]], 0.06)
  poly(ctx, [[X(0.555), Y(0.51)], [X(0.565), Y(0.48)], [X(0.57), Y(0.51)]], 0.06)
  ellipse(ctx, X(0.75), Y(0.84), X(0.05), Y(0.02), 0.9)
  sign(ctx, 'POE', X(0.75), Y(0.84), Y(0.022), 0.3)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

const balcao: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.5)
  shelves(ctx, fr.x, fr.w, Y(0.1), Y(0.7), 12)
  amanda(ctx, X(0.5), Y(1.05), Y(0.78))
  rect(ctx, fr.x, Y(0.72), fr.w, Y(0.2), 0.3)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

// Dia 10 · "Sem nome" (35 mm). A sua câmara escura, de onde ninguém
// poderia estar. A cada foto, o seu rosto mais borrado.

const bancada: Scene = (ctx, fr) => {
  darkroom(ctx, fr, 0.66)
  // De cima, do canto do teto: ele de costas, curvado sobre a bandeja.
  augusto(ctx, X(0.48), Y(0.86), Y(0.5))
  ellipse(ctx, X(0.48), Y(0.42), X(0.03), Y(0.04), 0.1)
  // A prateleira do canto.
  rect(ctx, X(0.78), Y(0.36), X(0.14), 3, 0.4)
  for (let i = 0; i < 4; i++) rect(ctx, X(0.79 + i * 0.03), Y(0.3), X(0.015), Y(0.06), 0.5)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

const ampliador: Scene = (ctx, fr) => {
  darkroom(ctx, fr, 0.66)
  enlarger(ctx, X(0.3), Y(0.66), Y(0.5))
  augusto(ctx, X(0.48), Y(0.96), Y(0.62), 0.25)
  // A porta da câmara escura, entreaberta.
  rect(ctx, X(0.62), Y(0.14), X(0.16), Y(0.52), 0.42)
  rect(ctx, X(0.62), Y(0.14), X(0.02), Y(0.52), 0.3)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

const varal: Scene = (ctx, fr) => {
  darkroom(ctx, fr, 0.72)
  augusto(ctx, X(0.58), Y(1.0), Y(0.76), 0.5)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

const pia: Scene = (ctx, fr) => {
  // De baixo, perto do chão: a pia, a torneira e ele lavando as cópias.
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.5, 0.3)
  ellipse(ctx, X(0.3), Y(0.14), X(0.03), Y(0.035), 0.95)
  rect(ctx, X(0.1), Y(0.5), X(0.4), Y(0.06), 0.45)
  rect(ctx, X(0.24), Y(0.36), X(0.02), Y(0.14), 0.6)
  rect(ctx, X(0.24), Y(0.36), X(0.06), Y(0.02), 0.6)
  augusto(ctx, X(0.38), Y(1.2), Y(1.0), 0.75)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.45)
}

const rosto: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.5, 0.3)
  ellipse(ctx, X(0.5), Y(0.08), X(0.04), Y(0.05), 0.9)
  // De frente, de perto: não sobra rosto, só o laço da gravata.
  augusto(ctx, X(0.42), Y(1.45), Y(1.4), 1)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.45)
}

const fogo: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.5, 0.3)
  // A pia e o rolo queimando, a coisa mais clara da foto.
  rect(ctx, X(0.1), Y(0.66), X(0.5), Y(0.06), 0.4)
  const g = ctx.createRadialGradient(X(0.36), Y(0.56), 2, X(0.36), Y(0.56), X(0.22))
  g.addColorStop(0, gray(1))
  g.addColorStop(1, gray(0.2, 0))
  ctx.fillStyle = g
  ctx.fillRect(fr.x, fr.y, fr.w, fr.h)
  poly(ctx, [[X(0.31), Y(0.66)], [X(0.36), Y(0.42)], [X(0.41), Y(0.66)]], 1)
  augusto(ctx, X(0.22), Y(1.0), Y(0.7), 0.9)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.45)
}

export const WEEK2_SCENES: Record<string, Scene> = {
  'vilela-volta/coreto': coreto,
  'vilela-volta/pipoqueiro': pipoqueiro,
  'vilela-volta/lago': lago,
  'vilela-volta/perto': pertoVolta,
  'cida-comunhao/porta': comunhaoPorta,
  'cida-comunhao/vela': vela,
  'cida-comunhao/almoco': almoco,
  'cida-comunhao/meninos': meninos,
  'nakamura-bodas/casal': bodasCasal,
  'nakamura-bodas/bolo': bodasBolo,
  'nakamura-bodas/danca': danca,
  'nakamura-bodas/familia': bodasFamilia,
  'nakamura-bodas/salao': salao,
  'cida-quintal/lencois': lencois,
  'cida-quintal/roda': roda,
  'cida-quintal/poltrona': poltronaNoite,
  'cida-quintal/portao': portaoNoite,
  'nakamura-mooca/escadaria': mooca,
  'nakamura-mooca/familia': moocaFamilia,
  'nakamura-mooca/brinde': moocaBrinde,
  'nakamura-mooca/saida': moocaSaida,
  'amanda-livraria/vitrine': vitrine,
  'amanda-livraria/estantes': estantes,
  'amanda-livraria/gato': gato,
  'amanda-livraria/balcao': balcao,
  'sem-nome/bancada': bancada,
  'sem-nome/ampliador': ampliador,
  'sem-nome/varal': varal,
  'sem-nome/pia': pia,
  'sem-nome/rosto': rosto,
  'sem-nome/fogo': fogo,
}
