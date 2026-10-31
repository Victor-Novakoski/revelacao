// Onde a figura está em cada foto, em fração da folha (480x360): x do
// meio, foot dos pés e h da altura. Dado puro: o desenho (photos/index.ts)
// e o detalhe da lupa (game/days) saem daqui, então não descasam.

// real: a figura é o homem recortado de foto (photos/real.ts), não a
// desenhada.
export type Placement = { x: number; foot: number; h: number; real?: boolean }

export const PLACEMENTS: Record<string, Placement> = {
  // Dia 2: a viagem do Vilela, de Anápolis a Campinas. O mesmo homem em
  // todas, cada vez mais perto. Na última, colado na lente.
  'vilela-praca/coreto': { x: 0.739, foot: 0.528, h: 0.161, real: true },
  'vilela-praca/pipoqueiro': { x: 0.547, foot: 0.77, h: 0.144, real: true },
  'vilela-praca/lago': { x: 0.682, foot: 0.905, h: 0.212, real: true },
  'vilela-praca/familia': { x: 0.608, foot: 0.923, h: 0.288, real: true },
  'vilela-praca/perto': { x: 0.648, foot: 1.625, h: 1.665, real: true },
  // Dia 3: bem longe, no alto do morro do sítio.
  'cida-piquenique/turma': { x: 0.9, foot: 0.455, h: 0.1, real: true },
  // Dia 4: no altar, entre as palmeiras, ao lado dos noivos.
  'nakamura-cambuci/altar': { x: 0.333, foot: 0.608, h: 0.203, real: true },
  // Dia 5: na fresta da cortina do estúdio.
  'nakamura-estudio/rapaz': { x: 0.75, foot: 0.86, h: 0.6 },
  // Dia 6: o rolo voltou, e ela veio para a frente.
  'vilela-volta/coreto': { x: 0.5, foot: 0.86, h: 0.6, real: true },
  'vilela-volta/pipoqueiro': { x: 0.44, foot: 0.92, h: 0.72, real: true },
  'vilela-volta/lago': { x: 0.36, foot: 0.98, h: 0.82, real: true },
  'vilela-volta/perto': { x: 0.5, foot: 1.7, h: 1.9, real: true },
  // Dia 9: perto, nas fotos de todo mundo. Nunca nas da Senhorita Amanda.
  'cida-quintal/lencois': { x: 0.36, foot: 0.86, h: 0.66 },
  'cida-quintal/roda': { x: 0.5, foot: 0.9, h: 0.6 },
  'cida-quintal/poltrona': { x: 0.6, foot: 0.86, h: 0.78 },
  'cida-quintal/portao': { x: 0.55, foot: 0.9, h: 0.72 },
  'nakamura-mooca/escadaria': { x: 0.66, foot: 0.86, h: 0.66 },
  'nakamura-mooca/familia': { x: 0.47, foot: 0.8, h: 0.55 },
  'nakamura-mooca/brinde': { x: 0.66, foot: 0.92, h: 0.76 },
  'nakamura-mooca/saida': { x: 0.36, foot: 0.9, h: 0.7 },
  // Dia 10: na sua câmara escura, mais perto a cada foto.
  'sem-nome/bancada': { x: 0.82, foot: 0.78, h: 0.42 },
  'sem-nome/ampliador': { x: 0.7, foot: 0.86, h: 0.6 },
  'sem-nome/varal': { x: 0.32, foot: 0.92, h: 0.76 },
  'sem-nome/pia': { x: 0.64, foot: 1.02, h: 0.98 },
  'sem-nome/rosto': { x: 0.72, foot: 1.3, h: 1.4 },
  'sem-nome/fogo': { x: 0.62, foot: 1.0, h: 0.92 },
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// O círculo da lupa que acha a figura: no tronco, dentro da folha.
export function figureSpot(key: string): { x: number; y: number; r: number } {
  const p = PLACEMENTS[key]
  if (!p) throw new Error(`sem figura em ${key}`)
  const r = clamp(p.h * 0.3, 0.04, 0.16)
  return {
    x: clamp(p.x, r + 0.01, 0.99 - r),
    y: clamp(p.foot - p.h * 0.6, r + 0.01, 0.99 - r),
    r,
  }
}
