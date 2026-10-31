import type { Scene } from './day1'
import { blurredSign, realScene } from './real'
import { Y } from './places'

// As fotos dos dias 2 a 5. A figura não está aqui: ela fica na camada
// própria (photos/figures.ts). Aqui só ficam os vãos onde ela cabe.

// Dia 2 e 6 · o rolo da câmera do H. Vilela: a viagem de Anápolis a
// Campinas. Fotos de verdade, ver photos/real.ts.

export const coreto = realScene('anapolis-coreto')
export const pipoqueiro = realScene('campinas-jardim')
export const lago = realScene('campinas-bento-quirino')
export const familia = realScene('campinas-rosario')
export const perto = realScene('campinas-pompeo')

// Dia 6 · a última foto do rolo que voltou: tão perto que atrás dele só
// sobra, desfocada, uma vitrine com letras.
export const pertoVolta: Scene = (ctx, fr) => {
  perto(ctx, fr)
  blurredSign(ctx, 'FOTO ÍRIS', 0.79, 0.66, Y(0.04))
}

// Dia 3 · Dona Cida, "Piquenique no parque" (35 mm).

// Dia 3 · o piquenique da Dona Cida no sítio do compadre, e os patos do
// Jardim da Luz na volta. Fotos de verdade, ver photos/real.ts.

export const toalha = realScene('amersfoort-toalha')
export const turma = realScene('amersfoort-turma')
export const soneca = realScene('renee-soneca')
export const patos = realScene('sarphatipark-patos')

// Dia 3 · Marlene, "As normalistas" (35 mm). O passeio de sábado, fotos de
// verdade. Na última, a Marlene sai tremida, só ela (art/real/prepare.py).

export const passeio = realScene('normal-passeio')
export const banco = realScene('normal-banco')
export const lanche = realScene('normal-lanche')
export const marleneSo = realScene('normal-marlene')

// Dia 4 · Seu Nakamura, "Casamento no Cambuci" (120). Fotos de verdade,
// ver photos/real.ts.

export const portaCambuci = realScene('cambuci-porta')
export const altar = realScene('cambuci-altar')
export const boloCambuci = realScene('cambuci-bolo')
export const retratoCambuci = realScene('cambuci-retrato')

// Dia 4 · o Elias, "A rota de Santos" (35 mm). Ele vai sumindo das fotos:
// art/real/fade.py tira um pouco mais dele a cada uma.

export const caminhao = realScene('rota-caminhao')
export const serra = realScene('rota-serra')
export const janela = realScene('rota-janela')
export const cabine = realScene('rota-cabine')

// Dia 5 · Seu Nakamura, "Retratos do estúdio" (120).

// Dia 5 · Seu Nakamura, "Retratos do estúdio" (120). Retratos de estúdio
// de verdade, ver photos/real.ts. O Okada e o Tanaka saem do mesmo fundo
// pintado: é o mesmo estúdio.

export const keiko = realScene('estudio-keiko')
export const okada = realScene('estudio-okada')
export const rapaz = realScene('estudio-rapaz')
export const ito = realScene('estudio-ito')

export const WEEK1_SCENES: Record<string, Scene> = {
  'vilela-praca/coreto': coreto,
  'vilela-praca/pipoqueiro': pipoqueiro,
  'vilela-praca/lago': lago,
  'vilela-praca/familia': familia,
  'vilela-praca/perto': perto,
  'cida-piquenique/toalha': toalha,
  'cida-piquenique/turma': turma,
  'cida-piquenique/soneca': soneca,
  'cida-piquenique/patos': patos,
  'marlene-normal/passeio': passeio,
  'marlene-normal/banco': banco,
  'marlene-normal/lanche': lanche,
  'marlene-normal/marlene': marleneSo,
  'nakamura-cambuci/porta': portaCambuci,
  'nakamura-cambuci/altar': altar,
  'nakamura-cambuci/bolo': boloCambuci,
  'nakamura-cambuci/retrato': retratoCambuci,
  'elias-rota/caminhao': caminhao,
  'elias-rota/serra': serra,
  'elias-rota/janela': janela,
  'elias-rota/cabine': cabine,
  'nakamura-estudio/keiko': keiko,
  'nakamura-estudio/okada': okada,
  'nakamura-estudio/rapaz': rapaz,
  'nakamura-estudio/ito': ito,
}
