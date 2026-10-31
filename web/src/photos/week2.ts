import { augusto, crowd, ellipse, falloff, gradient, gray, person, poly, rect } from './draw'
import type { Scene } from './day1'
import { realScene } from './real'
import {
  X,
  Y,
  darkroom,
  enlarger,
  hall,
  sign,
  studio,
} from './places'
import { coreto, lago, pertoVolta, pipoqueiro } from './week1'

// As fotos dos dias 6 a 10. Como em week1.ts, a figura fica na camada
// própria (photos/figures.ts).

// Dia 7 · Dona Cida, "Primeira comunhão da Lúcia" (35 mm). Fotos de
// verdade, ver photos/real.ts.

const comunhaoPorta = realScene('comunhao-porta')
const comunhaoAltar = realScene('comunhao-altar')
const comunhaoIgreja = realScene('comunhao-igreja')
const procissao = realScene('comunhao-procissao')

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

// Dia 9 · Dona Cida, "O quintal" (35 mm). A figura perto, em todas. Fotos
// de verdade, ver photos/real.ts: a Lúcia é a mesma menina que dormiu no
// mato no piquenique.

const bolhas = realScene('quintal-bolhas')
const gramado = realScene('quintal-gramado')
const gatoQuintal = realScene('quintal-gato')
const escada = realScene('quintal-escada')

// Dia 9 · Seu Nakamura, "Casamento na Mooca" (120). Fotos de verdade, ver
// photos/real.ts.

const moocaConvidados = realScene('mooca-convidados')
const moocaFamilia = realScene('mooca-familia')
const moocaNoivos = realScene('mooca-noivos')
const moocaSaida = realScene('mooca-saida')

// Dia 9 · a Senhorita Amanda, "A livraria" (35 mm). Sem figura nenhuma.

const vitrine = realScene('livraria-vitrine')
const estantes = realScene('livraria-estantes')
const gato = realScene('livraria-gato')
const balcao = realScene('livraria-balcao')

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
  'cida-comunhao/altar': comunhaoAltar,
  'cida-comunhao/igreja': comunhaoIgreja,
  'cida-comunhao/procissao': procissao,
  'nakamura-bodas/casal': bodasCasal,
  'nakamura-bodas/bolo': bodasBolo,
  'nakamura-bodas/danca': danca,
  'nakamura-bodas/familia': bodasFamilia,
  'nakamura-bodas/salao': salao,
  'cida-quintal/bolhas': bolhas,
  'cida-quintal/gramado': gramado,
  'cida-quintal/gato': gatoQuintal,
  'cida-quintal/escada': escada,
  'nakamura-mooca/convidados': moocaConvidados,
  'nakamura-mooca/familia': moocaFamilia,
  'nakamura-mooca/noivos': moocaNoivos,
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
