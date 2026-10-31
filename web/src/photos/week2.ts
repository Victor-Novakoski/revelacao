import { crowd, falloff, person, rect } from './draw'
import type { Scene } from './day1'
import { realScene } from './real'
import {
  X,
  Y,
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

// Dia 10 · "Sem nome" (35 mm). Retratos do Seu Augusto que ele não lembra de
// ter posado. A cada foto, o rosto mais borrado (já vem assim de
// art/real/prepare.py).

const cadeira = realScene('augusto-cadeira')
const olhar = realScene('augusto-olhar')
const cintura = realScene('augusto-cintura')
const cigarro = realScene('augusto-cigarro')
const rosto = realScene('augusto-rosto')
const fogo = realScene('augusto-fogo')

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
  'sem-nome/cadeira': cadeira,
  'sem-nome/olhar': olhar,
  'sem-nome/cintura': cintura,
  'sem-nome/cigarro': cigarro,
  'sem-nome/rosto': rosto,
  'sem-nome/fogo': fogo,
}
