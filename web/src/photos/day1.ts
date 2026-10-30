import { ellipse, falloff, gradient, gray, person, poly, rect, seeded, type Ctx } from './draw'
import { PRINT, type Frame } from './frame'

// As fotos do dia 1, desenhadas em coordenadas da folha inteira (480x360),
// já recortadas no quadro do filme. Os detalhes da lupa estão nas mesmas
// posições do roteiro (game/days/day1.ts), em fração da folha.

const W = PRINT.width
const H = PRINT.height
const X = (f: number) => f * W
const Y = (f: number) => f * H

export type Scene = (ctx: Ctx, frame: Frame) => void

// O bolo do Toninho, na mesa da cozinha.
const bolo: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.72, 0.6)
  // Janela clara à esquerda.
  rect(ctx, X(0.08), Y(0.16), X(0.16), Y(0.3), 0.95)
  rect(ctx, X(0.155), Y(0.16), 4, Y(0.3), 0.4)
  rect(ctx, X(0.08), Y(0.3), X(0.16), 4, 0.4)
  // A família atrás da mesa.
  person(ctx, { x: X(0.2), foot: Y(0.95), h: Y(0.78), tone: 0.3, dress: true, hair: 0.25 })
  person(ctx, { x: X(0.84), foot: Y(0.98), h: Y(0.8), tone: 0.2, hair: 0.15 })
  person(ctx, { x: X(0.36), foot: Y(0.85), h: Y(0.45), tone: 0.65, dress: true, hair: 0.2 })
  person(ctx, { x: X(0.5), foot: Y(0.86), h: Y(0.5), tone: 0.4, hair: 0.1 })
  person(ctx, { x: X(0.7), foot: Y(0.85), h: Y(0.4), tone: 0.55, hair: 0.3 })
  // Mesa com toalha.
  rect(ctx, fr.x, Y(0.6), fr.w, Y(0.4), 0.86)
  rect(ctx, fr.x, Y(0.6), fr.w, 3, 0.7)
  // O bolo e as velas.
  ellipse(ctx, X(0.6), Y(0.6), X(0.09), Y(0.035), 0.75)
  rect(ctx, X(0.53), Y(0.5), X(0.14), Y(0.1), 0.94)
  ellipse(ctx, X(0.6), Y(0.5), X(0.07), Y(0.025), 0.98)
  for (let i = 0; i < 7; i++) {
    const cx = X(0.545 + i * 0.018)
    rect(ctx, cx, Y(0.44), 2, Y(0.05), 0.5)
    ellipse(ctx, cx + 1, Y(0.435), 2, 3, 1)
  }
  // O braço do Toninho e o dedo na cobertura.
  ctx.save()
  ctx.translate(X(0.53), Y(0.47))
  ctx.rotate(-0.5)
  rect(ctx, -2, 0, 8, Y(0.08), 0.4)
  ctx.restore()
  ellipse(ctx, X(0.578), Y(0.5), 3, 2.5, 0.68)
  // Pratos.
  for (const px of [0.2, 0.36, 0.8]) ellipse(ctx, X(px), Y(0.7), X(0.05), Y(0.02), 0.95)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

// Os três netos no portão de ferro.
const portao: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h * 0.4, 0.88, 0.8)
  // A casa: parede, janela e porta.
  rect(ctx, fr.x, Y(0.18), fr.w, Y(0.5), 0.72)
  rect(ctx, X(0.14), Y(0.28), X(0.14), Y(0.18), 0.25)
  rect(ctx, X(0.7), Y(0.28), X(0.14), Y(0.18), 0.25)
  rect(ctx, X(0.44), Y(0.3), X(0.12), Y(0.38), 0.3)
  poly(ctx, [[fr.x, Y(0.18)], [X(0.5), Y(0.08)], [fr.x + fr.w, Y(0.18)]], 0.45)
  // Muro baixo e calçada.
  rect(ctx, fr.x, Y(0.6), fr.w, Y(0.12), 0.8)
  gradient(ctx, fr.x, Y(0.72), fr.w, Y(0.28), 0.6, 0.45)
  // O portão de ferro.
  for (let i = 0; i < 18; i++) rect(ctx, X(0.3 + i * 0.022), Y(0.4), 3, Y(0.32), 0.12)
  rect(ctx, X(0.3), Y(0.42), X(0.4), 3, 0.12)
  rect(ctx, X(0.3), Y(0.68), X(0.4), 3, 0.12)
  // Toninho, Lúcia e o Zezinho, do maior para o menor.
  person(ctx, { x: X(0.38), foot: Y(0.92), h: Y(0.5), tone: 0.3, hair: 0.12 })
  person(ctx, { x: X(0.5), foot: Y(0.93), h: Y(0.44), tone: 0.85, dress: true, hair: 0.2 })
  person(ctx, { x: X(0.61), foot: Y(0.94), h: Y(0.34), tone: 0.5, hair: 0.15, arms: 'side' })
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// Seu Juvenal dormindo na poltrona depois do almoço.
const poltrona: Scene = (ctx, fr) => {
  for (let i = 0; i < 30; i++) rect(ctx, fr.x + i * X(0.035), fr.y, X(0.0175), Y(0.66), i % 2 ? 0.66 : 0.6)
  rect(ctx, fr.x, Y(0.62), fr.w, Y(0.04), 0.35)
  gradient(ctx, fr.x, Y(0.66), fr.w, Y(0.34), 0.48, 0.38)
  // Quadro na parede e abajur.
  rect(ctx, X(0.66), Y(0.18), X(0.12), Y(0.16), 0.25)
  rect(ctx, X(0.675), Y(0.2), X(0.09), Y(0.12), 0.7)
  poly(ctx, [[X(0.8), Y(0.3)], [X(0.88), Y(0.3)], [X(0.9), Y(0.42)], [X(0.78), Y(0.42)]], 0.92)
  rect(ctx, X(0.835), Y(0.42), 4, Y(0.4), 0.2)
  // A poltrona, com o vão escuro embaixo.
  rect(ctx, X(0.22), Y(0.7), X(0.36), Y(0.16), 0.14)
  rect(ctx, X(0.22), Y(0.2), X(0.36), Y(0.52), 0.24)
  rect(ctx, X(0.18), Y(0.42), X(0.08), Y(0.32), 0.2)
  rect(ctx, X(0.54), Y(0.42), X(0.08), Y(0.32), 0.2)
  rect(ctx, X(0.24), Y(0.86), 6, Y(0.04), 0.1)
  rect(ctx, X(0.56), Y(0.86), 6, Y(0.04), 0.1)
  // Seu Juvenal, com a cabeça caída e o jornal no colo.
  rect(ctx, X(0.3), Y(0.38), X(0.2), Y(0.3), 0.42)
  rect(ctx, X(0.32), Y(0.62), X(0.22), Y(0.08), 0.4)
  ellipse(ctx, X(0.43), Y(0.34), X(0.04), Y(0.07), 0.7)
  ellipse(ctx, X(0.425), Y(0.29), X(0.04), Y(0.03), 0.85)
  poly(ctx, [[X(0.33), Y(0.52)], [X(0.5), Y(0.5)], [X(0.52), Y(0.62)], [X(0.35), Y(0.64)]], 0.9)
  for (let i = 0; i < 5; i++) rect(ctx, X(0.36), Y(0.53 + i * 0.02), X(0.12), 1.5, 0.55)
  // O gato, enrolado no escuro embaixo da poltrona.
  ellipse(ctx, X(0.4), Y(0.8), X(0.04), Y(0.022), 0.62)
  ellipse(ctx, X(0.43), Y(0.785), X(0.014), Y(0.016), 0.62)
  poly(ctx, [[X(0.42), Y(0.775)], [X(0.425), Y(0.76)], [X(0.43), Y(0.773)]], 0.62)
  poly(ctx, [[X(0.433), Y(0.773)], [X(0.44), Y(0.76)], [X(0.443), Y(0.777)]], 0.62)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.4)
}

// Dona Cida e a Lúcia no quintal, tirada torta pelo Toninho.
const quintal: Scene = (ctx, fr) => {
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.rotate(-0.07)
  ctx.translate(-W / 2, -H / 2)
  gradient(ctx, 0, 0, W, Y(0.5), 0.9, 0.82)
  rect(ctx, 0, Y(0.36), W, Y(0.2), 0.62)
  for (let i = 0; i < 14; i++) rect(ctx, X(i * 0.08), Y(0.36), 2, Y(0.2), 0.5)
  gradient(ctx, 0, Y(0.56), W, Y(0.5), 0.55, 0.4)
  // O varal de roupa com os lençóis.
  rect(ctx, 0, Y(0.2), W, 1.5, 0.3)
  rect(ctx, X(0.05), Y(0.2), X(0.18), Y(0.26), 0.95)
  rect(ctx, X(0.62), Y(0.2), X(0.12), Y(0.2), 0.9)
  rect(ctx, X(0.78), Y(0.2), X(0.16), Y(0.28), 0.96)
  // Dona Cida e a neta.
  person(ctx, { x: X(0.44), foot: Y(1.02), h: Y(0.86), tone: 0.28, dress: true, hair: 0.85, face: 0.68 })
  person(ctx, { x: X(0.6), foot: Y(1.0), h: Y(0.5), tone: 0.85, dress: true, hair: 0.18 })
  ctx.restore()
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.45)
}

// Os noivos na escadaria da igreja.
const escadaria: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.7)
  // Colunas e a porta em arco.
  for (const cx of [0.27, 0.35, 0.65, 0.73]) rect(ctx, X(cx), fr.y, X(0.04), Y(0.62), 0.84)
  rect(ctx, X(0.42), Y(0.18), X(0.16), Y(0.44), 0.12)
  ellipse(ctx, X(0.5), Y(0.18), X(0.08), Y(0.08), 0.12)
  // Os degraus.
  for (let i = 0; i < 7; i++) {
    rect(ctx, fr.x, Y(0.62 + i * 0.05), fr.w, Y(0.05), i % 2 ? 0.66 : 0.8)
    rect(ctx, fr.x, Y(0.62 + i * 0.05), fr.w, 2, 0.45)
  }
  // O noivo de terno preto e a noiva de branco com o véu.
  person(ctx, { x: X(0.45), foot: Y(0.86), h: Y(0.56), tone: 0.1, hair: 0.06 })
  rect(ctx, X(0.444), Y(0.4), 4, Y(0.12), 0.95)
  poly(ctx, [[X(0.55), Y(0.31)], [X(0.6), Y(0.34)], [X(0.63), Y(0.84)], [X(0.52), Y(0.84)]], 0.88)
  person(ctx, { x: X(0.57), foot: Y(0.88), h: Y(0.54), tone: 0.96, dress: true, hair: 0.1 })
  ellipse(ctx, X(0.52), Y(0.56), X(0.025), Y(0.03), 0.9)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

// As duas famílias, em duas fileiras. O padrinho piscou.
const familia: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h * 0.7, 0.78, 0.7)
  for (let i = 0; i < 10; i++) rect(ctx, fr.x, Y(0.08 + i * 0.06), fr.w, 1, 0.62)
  gradient(ctx, fr.x, Y(0.72), fr.w, Y(0.28), 0.58, 0.48)
  const back = [0.24, 0.33, 0.42, 0.53, 0.62, 0.72]
  const eyes = (x: number, y: number, closed: boolean) => {
    for (const s of [-1, 1]) {
      if (closed) rect(ctx, x + s * 4 - 1.5, y, 3, 1, 0.2)
      else ellipse(ctx, x + s * 4, y, 1, 1.2, 0.12)
    }
  }
  for (const [i, bx] of back.entries()) {
    const h = Y(0.42)
    person(ctx, { x: X(bx), foot: Y(0.78), h, tone: i % 2 ? 0.15 : 0.35, dress: i === 2, hair: 0.08 })
    eyes(X(bx), Y(0.78) - h + h * 0.075, bx === 0.62)
  }
  const front = [0.3, 0.42, 0.5, 0.58, 0.7]
  for (const [i, fx] of front.entries()) {
    const h = Y(0.44)
    const bride = fx === 0.5
    person(ctx, { x: X(fx), foot: Y(0.94), h, tone: bride ? 0.96 : i % 2 ? 0.2 : 0.5, dress: bride || i === 0, hair: 0.08 })
    eyes(X(fx), Y(0.94) - h + h * 0.075, false)
  }
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.35)
}

// O brinde, no salão enfeitado com lanternas de papel.
const brinde: Scene = (ctx, fr) => {
  gradient(ctx, fr.x, fr.y, fr.w, fr.h, 0.42, 0.3)
  rect(ctx, fr.x, Y(0.12), fr.w, 1.5, 0.6)
  for (let i = 0; i < 7; i++) {
    const lx = X(0.27 + i * 0.075)
    const ly = Y(0.15 + (i % 2) * 0.03)
    ellipse(ctx, lx, ly, X(0.025), Y(0.04), 0.9)
    rect(ctx, lx - 6, ly - Y(0.04), 12, 2, 0.4)
  }
  // Os noivos de copo erguido.
  person(ctx, { x: X(0.43), foot: Y(0.9), h: Y(0.6), tone: 0.1, hair: 0.06, arms: 'up' })
  person(ctx, { x: X(0.58), foot: Y(0.9), h: Y(0.56), tone: 0.95, dress: true, hair: 0.1, arms: 'up' })
  for (const gx of [0.47, 0.54]) {
    poly(ctx, [[X(gx) - 4, Y(0.3)], [X(gx) + 4, Y(0.3)], [X(gx) + 2, Y(0.34)], [X(gx) - 2, Y(0.34)]], 0.92)
  }
  // Convidados nas pontas, de costas para a parede.
  person(ctx, { x: X(0.27), foot: Y(0.9), h: Y(0.5), tone: 0.25, hair: 0.1 })
  person(ctx, { x: X(0.74), foot: Y(0.9), h: Y(0.52), tone: 0.55, dress: true, hair: 0.1 })
  // A mesa com a toalha e os copos.
  rect(ctx, fr.x, Y(0.7), fr.w, Y(0.3), 0.88)
  for (let i = 0; i < 9; i++) rect(ctx, X(0.25 + i * 0.06), Y(0.64), 6, Y(0.06), 0.75)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

// A saída da igreja, com arroz no ar e um menino catando do chão.
const arroz: Scene = (ctx, fr) => {
  rect(ctx, fr.x, fr.y, fr.w, fr.h, 0.68)
  rect(ctx, X(0.4), fr.y, X(0.2), Y(0.5), 0.12)
  ellipse(ctx, X(0.5), fr.y + 4, X(0.1), Y(0.08), 0.12)
  gradient(ctx, fr.x, Y(0.55), fr.w, Y(0.45), 0.62, 0.5)
  // Convidados dos dois lados, jogando arroz.
  for (const [gx, tone] of [
    [0.22, 0.3],
    [0.3, 0.6],
    [0.7, 0.25],
    [0.78, 0.5],
  ] as const) {
    person(ctx, { x: X(gx), foot: Y(0.82), h: Y(0.5), tone, dress: tone > 0.4, hair: 0.1, arms: 'up' })
  }
  // Os noivos saindo pela porta.
  person(ctx, { x: X(0.46), foot: Y(0.86), h: Y(0.6), tone: 0.1, hair: 0.06 })
  person(ctx, { x: X(0.55), foot: Y(0.86), h: Y(0.56), tone: 0.96, dress: true, hair: 0.1 })
  // O arroz.
  const rand = seeded(1210)
  for (let i = 0; i < 160; i++) {
    ctx.fillStyle = gray(0.97)
    ctx.fillRect(X(0.24 + rand() * 0.52), Y(0.08 + rand() * 0.45), 1.6, 1.6)
  }
  // O menino agachado, catando arroz.
  ellipse(ctx, X(0.27), Y(0.81), X(0.022), Y(0.035), 0.35)
  ellipse(ctx, X(0.265), Y(0.765), X(0.012), Y(0.018), 0.72)
  rect(ctx, X(0.278), Y(0.81), X(0.02), 3, 0.35)
  for (let i = 0; i < 6; i++) ctx.fillRect(X(0.285 + i * 0.006), Y(0.835), 1.5, 1.5)
  falloff(ctx, fr.x, fr.y, fr.w, fr.h, 0.3)
}

export const DAY1_SCENES: Record<string, Scene> = {
  'cida-toninho/bolo': bolo,
  'cida-toninho/portao': portao,
  'cida-toninho/poltrona': poltrona,
  'cida-toninho/quintal': quintal,
  'nakamura-casamento/escadaria': escadaria,
  'nakamura-casamento/familia': familia,
  'nakamura-casamento/brinde': brinde,
  'nakamura-casamento/arroz': arroz,
}
