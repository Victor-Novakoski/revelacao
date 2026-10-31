import { ellipse, falloff, gradient, gray, poly, rect, seeded, type Ctx } from './draw'
import type { Scene } from './day1'
import { blurredSign, realScene } from './real'
import { X, Y, cap, elias, praca, sign, student } from './places'

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

// Dia 3 · Marlene, "As normalistas" (35 mm).

export const escadaNormal: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.78)
  for (let i = 0; i < 6; i++) rect(ctx, X(0.12 + i * 0.15), fr.y, X(0.05), Y(0.5), 0.9)
  rect(ctx, fr.x, Y(0.12), fr.w, Y(0.04), 0.6)
  sign(ctx, 'ESCOLA NORMAL', X(0.5), Y(0.14), Y(0.035), 0.25)
  for (let i = 0; i < 6; i++) rect(ctx, fr.x, Y(0.5 + i * 0.07), fr.w, Y(0.07), i % 2 ? 0.66 : 0.76)
  for (const [i, sx] of [0.3, 0.4, 0.5, 0.6, 0.7].entries()) student(ctx, X(sx), Y(0.64 + (i % 2) * 0.07), Y(0.4))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

export const banco: Scene = (ctx, fr) => {
  praca(ctx, fr, 0.44)
  // As três no banco: Célia, Marlene e a Dirce fazendo chifrinho.
  student(ctx, X(0.38), Y(0.78), Y(0.42))
  student(ctx, X(0.5), Y(0.78), Y(0.42))
  student(ctx, X(0.62), Y(0.78), Y(0.42), 'side')
  rect(ctx, X(0.36), Y(0.36), 2, Y(0.03), 0.2)
  rect(ctx, X(0.395), Y(0.36), 2, Y(0.03), 0.2)
  rect(ctx, X(0.26), Y(0.7), X(0.48), Y(0.04), 0.3)
  rect(ctx, X(0.28), Y(0.74), 4, Y(0.1), 0.2)
  rect(ctx, X(0.71), Y(0.74), 4, Y(0.1), 0.2)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

export const sorvete: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.7)
  // A sorveteria: toldo listrado e vitrine.
  for (let i = 0; i < 12; i++) poly(ctx, [[X(0.1 + i * 0.07), Y(0.2)], [X(0.17 + i * 0.07), Y(0.2)], [X(0.17 + i * 0.07), Y(0.3)], [X(0.1 + i * 0.07), Y(0.3)]], i % 2 ? 0.95 : 0.3)
  rect(ctx, X(0.14), Y(0.32), X(0.72), Y(0.3), 0.4)
  sign(ctx, 'SORVETES', X(0.5), Y(0.15), Y(0.05), 0.2)
  gradient(ctx, fr.x, Y(0.62), fr.w, Y(0.38), 0.6, 0.5)
  for (const sx of [0.36, 0.5, 0.64]) {
    student(ctx, X(sx), Y(0.94), Y(0.5), 'side')
    poly(ctx, [[X(sx + 0.04), Y(0.62)], [X(sx + 0.06), Y(0.62)], [X(sx + 0.05), Y(0.66)]], 0.85)
    ellipse(ctx, X(sx + 0.05), Y(0.615), X(0.012), Y(0.012), 0.97)
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// A Marlene sozinha no poste. Saiu tremida: só ela.
export const marleneSo: Scene = (ctx, fr) => {
  praca(ctx, fr, 0.5)
  rect(ctx, X(0.62), Y(0.12), 4, Y(0.72), 0.15)
  ellipse(ctx, X(0.625), Y(0.12), X(0.02), Y(0.03), 0.9)
  ctx.save()
  ctx.globalAlpha = 0.45
  for (const dx of [-0.012, 0, 0.012]) student(ctx, X(0.5 + dx), Y(0.9), Y(0.56))
  ctx.restore()
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// Dia 4 · Seu Nakamura, "Casamento no Cambuci" (120). Fotos de verdade,
// ver photos/real.ts.

export const portaCambuci = realScene('cambuci-porta')
export const altar = realScene('cambuci-altar')
export const boloCambuci = realScene('cambuci-bolo')
export const retratoCambuci = realScene('cambuci-retrato')

// Dia 4 · o Elias, "A rota de Santos" (35 mm). Ele vai sumindo das fotos.

function truck(ctx: Ctx, x: number, foot: number, s: number) {
  // A carroceria com o nome e a cabine com a luneta pintada na porta.
  rect(ctx, x, foot - s * 0.5, s * 0.9, s * 0.42, 0.82)
  sign(ctx, 'EXPRESSO GUILELA', x + s * 0.45, foot - s * 0.3, s * 0.07, 0.2)
  rect(ctx, x + s * 0.92, foot - s * 0.42, s * 0.3, s * 0.34, 0.5)
  rect(ctx, x + s * 0.98, foot - s * 0.4, s * 0.18, s * 0.12, 0.85)
  poly(ctx, [[x + s * 0.98, foot - s * 0.2], [x + s * 1.12, foot - s * 0.24], [x + s * 1.12, foot - s * 0.21], [x + s * 0.98, foot - s * 0.18]], 0.15)
  ellipse(ctx, x + s * 1.12, foot - s * 0.225, s * 0.015, s * 0.02, 0.15)
  for (const wx of [0.15, 0.7, 1.06]) ellipse(ctx, x + s * wx, foot - s * 0.06, s * 0.07, s * 0.07, 0.1)
}

export const caminhao: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, Y(0.5), 0.9, 0.82)
  gradient(ctx, fr.x, Y(0.5), fr.w, Y(0.5), 0.62, 0.5)
  truck(ctx, X(0.08), Y(0.78), X(0.62))
  elias(ctx, X(0.84), Y(0.92), Y(0.62), 0.78)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

export const serra: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.95, 0.85)
  // A serra em camadas de neblina, e a estrada fazendo a curva.
  for (let i = 0; i < 3; i++) {
    const y = Y(0.42 + i * 0.1)
    poly(ctx, [[fr.x, y], [X(0.3), y - Y(0.12)], [X(0.6), y - Y(0.04)], [X(0.85), y - Y(0.14)], [fr.x + fr.w, y], [fr.x + fr.w, fr.y + fr.h], [fr.x, fr.y + fr.h]], 0.75 - i * 0.15)
  }
  poly(ctx, [[X(0.6), Y(0.62)], [X(0.7), Y(0.62)], [X(0.95), Y(0.9)], [X(0.4), Y(0.9)]], 0.7)
  for (let i = 0; i < 10; i++) rect(ctx, X(0.05 + i * 0.09), Y(0.84), 3, Y(0.05), 0.9)
  rect(ctx, fr.x, Y(0.84), fr.w, 2, 0.9)
  elias(ctx, X(0.26), Y(0.9), Y(0.56), 0.48)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

export const bar: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.55)
  // Prateleira de garrafas e o balcão do posto.
  rect(ctx, fr.x, Y(0.3), fr.w, 3, 0.3)
  const rand = seeded(44)
  for (let i = 0; i < 16; i++) rect(ctx, X(0.1 + i * 0.05), Y(0.2), X(0.02), Y(0.1), 0.2 + rand() * 0.6)
  rect(ctx, fr.x, Y(0.58), fr.w, Y(0.06), 0.25)
  rect(ctx, fr.x, Y(0.64), fr.w, Y(0.3), 0.35)
  // A xícara dele no balcão.
  rect(ctx, X(0.47), Y(0.54), X(0.03), Y(0.04), 0.95)
  ellipse(ctx, X(0.485), Y(0.58), X(0.03), Y(0.008), 0.9)
  elias(ctx, X(0.5), Y(0.92), Y(0.66), 0.22)
  for (const sx of [0.3, 0.7]) {
    ellipse(ctx, X(sx), Y(0.76), X(0.04), Y(0.012), 0.15)
    rect(ctx, X(sx) - 2, Y(0.76), 4, Y(0.16), 0.15)
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

export const cabine: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.2)
  // O para-brisa claro, a estrada lá fora, o volante e o banco vazio.
  poly(ctx, [[X(0.12), Y(0.16)], [X(0.88), Y(0.16)], [X(0.84), Y(0.46)], [X(0.16), Y(0.46)]], 0.9)
  poly(ctx, [[X(0.46), Y(0.46)], [X(0.54), Y(0.46)], [X(0.6), Y(0.3)], [X(0.4), Y(0.3)]], 0.7)
  ctx.strokeStyle = gray(0.08)
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.ellipse(X(0.32), Y(0.56), X(0.11), Y(0.1), 0, 0, Math.PI * 2)
  ctx.stroke()
  rect(ctx, X(0.5), Y(0.58), X(0.36), Y(0.3), 0.4)
  rect(ctx, X(0.52), Y(0.5), X(0.32), Y(0.1), 0.35)
  // O boné dele, largado no banco.
  cap(ctx, X(0.68), Y(0.53), Y(0.9))
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

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
  'marlene-normal/escada': escadaNormal,
  'marlene-normal/banco': banco,
  'marlene-normal/sorvete': sorvete,
  'marlene-normal/marlene': marleneSo,
  'nakamura-cambuci/porta': portaCambuci,
  'nakamura-cambuci/altar': altar,
  'nakamura-cambuci/bolo': boloCambuci,
  'nakamura-cambuci/retrato': retratoCambuci,
  'elias-rota/caminhao': caminhao,
  'elias-rota/serra': serra,
  'elias-rota/bar': bar,
  'elias-rota/cabine': cabine,
  'nakamura-estudio/keiko': keiko,
  'nakamura-estudio/okada': okada,
  'nakamura-estudio/rapaz': rapaz,
  'nakamura-estudio/ito': ito,
}
