// Onde a figura está em cada foto, em fração da folha (480x360): x do
// meio, foot dos pés e h da altura. Dado puro: o desenho (photos/index.ts)
// e o detalhe da lupa (game/days) saem daqui, então não descasam.

import type { Front } from './real'

// real: a figura é o homem recortado de foto (photos/real.ts), não a
// desenhada. front: a cena cujas pessoas ficam na frente dela (só a
// cabeça e um ombro aparecem); a lupa mira mais alto, no rosto.
export type Placement = { x: number; foot: number; h: number; real?: boolean; front?: Front }

export const PLACEMENTS: Record<string, Placement> = {
  // Dia 2: a viagem do Vilela, de Anápolis a Campinas. O mesmo homem em
  // todas, cada vez mais perto. Na última, colado na lente.
  'vilela-praca/coreto': { x: 0.739, foot: 0.528, h: 0.161, real: true },
  'vilela-praca/pipoqueiro': { x: 0.547, foot: 0.77, h: 0.144, real: true },
  'vilela-praca/lago': { x: 0.682, foot: 0.905, h: 0.212, real: true },
  'vilela-praca/familia': { x: 0.608, foot: 0.923, h: 0.288, real: true },
  'vilela-praca/perto': { x: 0.82, foot: 1.625, h: 1.665, real: true },
  // Dia 3: bem longe, no alto do morro do sítio.
  'cida-piquenique/turma': { x: 0.9, foot: 0.455, h: 0.1, real: true },
  // Dia 4: no altar, entre as palmeiras, ao lado dos noivos.
  'nakamura-cambuci/altar': { x: 0.333, foot: 0.608, h: 0.203, real: true },
  // Dia 5: no fundo pintado do estúdio, entre o rapaz e a moça.
  'nakamura-estudio/rapaz': { x: 0.703, foot: 0.887, h: 0.765, real: true, front: 'estudio-rapaz' },
  // Dia 6: o rolo voltou, e ela veio para mais perto, sempre atrás de
  // alguma coisa: o arbusto, a palmeira, o carro, a beirada da foto.
  'vilela-volta/coreto': { x: 0.696, foot: 0.59, h: 0.405, real: true, front: 'anapolis-coreto' },
  'vilela-volta/pipoqueiro': { x: 0.7025, foot: 0.824, h: 0.495, real: true, front: 'campinas-jardim' },
  'vilela-volta/lago': { x: 0.419, foot: 0.878, h: 0.405, real: true, front: 'campinas-bento-quirino' },
  'vilela-volta/perto': { x: 0.18, foot: 1.7, h: 1.9, real: true },
  // Dia 9: perto, nas fotos de todo mundo. Nunca nas da Senhorita Amanda.
  'cida-quintal/bolhas': { x: 0.545, foot: 0.9, h: 0.76, real: true, front: 'quintal-bolhas' },
  'cida-quintal/gramado': { x: 0.714, foot: 0.564, h: 0.4, real: true, front: 'quintal-gramado' },
  'cida-quintal/gato': { x: 0.752, foot: 1.06, h: 0.92, real: true, front: 'quintal-gato' },
  'cida-quintal/escada': { x: 0.158, foot: 0.86, h: 0.64, real: true },
  'nakamura-mooca/convidados': { x: 0.56, foot: 0.725, h: 0.56, real: true, front: 'mooca-convidados' },
  'nakamura-mooca/familia': { x: 0.5, foot: 0.824, h: 0.495, real: true, front: 'mooca-familia' },
  'nakamura-mooca/noivos': { x: 0.54, foot: 1.085, h: 0.99, real: true, front: 'mooca-noivos' },
  'nakamura-mooca/saida': { x: 0.79, foot: 0.905, h: 0.675, real: true, front: 'mooca-saida' },
  // Dia 10: atrás do Seu Augusto, mais perto a cada retrato.
  'sem-nome/cadeira': { x: 0.185, foot: 0.82, h: 0.56, real: true, front: 'augusto-cadeira' },
  'sem-nome/olhar': { x: 0.752, foot: 0.94, h: 0.72, real: true, front: 'augusto-olhar' },
  'sem-nome/cintura': { x: 0.608, foot: 0.98, h: 0.8, real: true, front: 'augusto-cintura' },
  'sem-nome/cigarro': { x: 0.662, foot: 1.02, h: 0.88, real: true, front: 'augusto-cigarro' },
  'sem-nome/rosto': { x: 0.77, foot: 1.14, h: 1.08, real: true, front: 'augusto-rosto' },
  'sem-nome/fogo': { x: 0.662, foot: 1.1, h: 1.04, real: true, front: 'augusto-fogo' },
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// O círculo da lupa que acha a figura: no tronco, dentro da folha.
export function figureSpot(key: string): { x: number; y: number; r: number } {
  const p = PLACEMENTS[key]
  if (!p) throw new Error(`sem figura em ${key}`)
  const r = clamp(p.h * 0.3, 0.04, 0.16)
  return {
    x: clamp(p.x, r + 0.01, 0.99 - r),
    y: clamp(p.foot - p.h * (p.front ? 0.85 : 0.6), r + 0.01, 0.99 - r),
    r,
  }
}
