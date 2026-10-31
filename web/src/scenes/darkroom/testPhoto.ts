import { CanvasTexture, LinearFilter, type Texture } from 'three'

// Foto de teste, desenhada em código até as fotos do Blender chegarem
// (etapa 3): um domingo na praça, e alguém parado ao fundo. Duas camadas,
// como as fotos de verdade: a cena e a figura. A figura é desenhada pequena
// e ampliada, então sai fora de foco.

export type TestPhoto = { photo: Texture; figure: Texture }

const W = 640
const H = 480

const gray = (v: number, a = 1) => {
  const c = Math.round(Math.max(0, Math.min(1, v)) * 255)
  return `rgba(${c},${c},${c},${a})`
}

// Sorteio com semente, para a foto sair sempre igual.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function person(ctx: CanvasRenderingContext2D, x: number, foot: number, h: number, tone: number, dress = false) {
  const head = h * 0.13
  ctx.fillStyle = gray(tone)
  ctx.beginPath()
  ctx.arc(x, foot - h + head * 0.5, head * 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  const shoulder = h * 0.13
  const hem = dress ? h * 0.2 : h * 0.1
  ctx.moveTo(x - shoulder, foot - h + head * 1.1)
  ctx.lineTo(x + shoulder, foot - h + head * 1.1)
  ctx.lineTo(x + hem, foot - h * (dress ? 0.22 : 0.45))
  ctx.lineTo(x - hem, foot - h * (dress ? 0.22 : 0.45))
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(x - h * 0.07, foot - h * (dress ? 0.24 : 0.47), h * 0.05, h * (dress ? 0.24 : 0.47))
  ctx.fillRect(x + h * 0.02, foot - h * (dress ? 0.24 : 0.47), h * 0.05, h * (dress ? 0.24 : 0.47))
}

function drawScene(ctx: CanvasRenderingContext2D) {
  const rand = seeded(1957)
  const horizon = H * 0.46

  const sky = ctx.createLinearGradient(0, 0, 0, horizon)
  sky.addColorStop(0, gray(0.78))
  sky.addColorStop(1, gray(0.9))
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, horizon)

  const ground = ctx.createLinearGradient(0, horizon, 0, H)
  ground.addColorStop(0, gray(0.62))
  ground.addColorStop(1, gray(0.42))
  ctx.fillStyle = ground
  ctx.fillRect(0, horizon, W, H - horizon)

  // O caminho de terra batida até o fundo da praça.
  const vanish = W * 0.58
  ctx.fillStyle = gray(0.8)
  ctx.beginPath()
  ctx.moveTo(vanish - 8, horizon)
  ctx.lineTo(vanish + 8, horizon)
  ctx.lineTo(W * 0.95, H)
  ctx.lineTo(W * 0.25, H)
  ctx.closePath()
  ctx.fill()

  // Copas ao fundo, com um vão claro onde o caminho some.
  for (let i = 0; i < 140; i++) {
    const x = rand() * W
    if (Math.abs(x - vanish) < 34) continue
    const y = horizon - rand() * 70
    ctx.fillStyle = gray(0.22 + rand() * 0.12)
    ctx.beginPath()
    ctx.arc(x, y, 14 + rand() * 26, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = gray(0.2)
  ctx.fillRect(0, horizon - 4, vanish - 34, 8)
  ctx.fillRect(vanish + 34, horizon - 4, W, 8)

  // Árvore grande à esquerda, em primeiro plano.
  ctx.fillStyle = gray(0.1)
  ctx.beginPath()
  ctx.moveTo(40, H)
  ctx.lineTo(70, H * 0.25)
  ctx.lineTo(96, H * 0.25)
  ctx.lineTo(118, H)
  ctx.fill()
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = gray(0.08 + rand() * 0.06)
    ctx.beginPath()
    ctx.arc(rand() * 260 - 40, rand() * H * 0.3, 30 + rand() * 40, 0, Math.PI * 2)
    ctx.fill()
  }

  // Poste de luz e banco à direita.
  ctx.fillStyle = gray(0.14)
  ctx.fillRect(W * 0.8, H * 0.2, 6, H * 0.6)
  ctx.beginPath()
  ctx.arc(W * 0.8 + 3, H * 0.19, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(W * 0.66, H * 0.7, 120, 10)
  ctx.fillRect(W * 0.66, H * 0.64, 120, 6)
  ctx.fillRect(W * 0.67, H * 0.7, 6, 34)
  ctx.fillRect(W * 0.66 + 108, H * 0.7, 6, 34)

  // Gente comum, longe, para dar a escala.
  person(ctx, W * 0.47, horizon + 26, 34, 0.28, true)
  person(ctx, W * 0.5, horizon + 28, 37, 0.25)
  person(ctx, W * 0.72, horizon + 18, 27, 0.3)

  // A mãe e o menino passeando, perto da câmera.
  person(ctx, W * 0.36, H * 0.97, 230, 0.2, true)
  person(ctx, W * 0.45, H * 0.98, 120, 0.24)

  // Pombos no caminho.
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = gray(0.35)
    ctx.beginPath()
    ctx.ellipse(W * (0.5 + rand() * 0.25), H * (0.78 + rand() * 0.15), 7, 4, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Queda de luz da lente nos cantos.
  const falloff = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.62)
  falloff.addColorStop(0, gray(0, 0))
  falloff.addColorStop(1, gray(0, 0.45))
  ctx.fillStyle = falloff
  ctx.fillRect(0, 0, W, H)
}

// Parada no vão das árvores, no fim do caminho. Alta demais e magra demais
// para a distância em que está.
function drawFigure(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  const x = w * 0.58
  const foot = h * 0.5
  const tall = h * 0.15
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.ellipse(x, foot - tall * 0.93, tall * 0.06, tall * 0.08, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x - tall * 0.08, foot - tall * 0.82)
  ctx.lineTo(x + tall * 0.08, foot - tall * 0.82)
  ctx.lineTo(x + tall * 0.05, foot)
  ctx.lineTo(x - tall * 0.05, foot)
  ctx.closePath()
  ctx.fill()
  // Os braços descem até perto dos joelhos.
  ctx.fillRect(x - tall * 0.12, foot - tall * 0.8, tall * 0.035, tall * 0.55)
  ctx.fillRect(x + tall * 0.085, foot - tall * 0.8, tall * 0.035, tall * 0.55)
}

function texture(canvas: HTMLCanvasElement) {
  const tex = new CanvasTexture(canvas)
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.generateMipmaps = false
  return tex
}

export function createTestPhoto(): TestPhoto {
  // Desenhada na metade do tamanho e ampliada: a lente da câmera quebrada
  // não é das melhores, e o borrado esconde o traço de desenho.
  const photo = document.createElement('canvas')
  photo.width = W / 2
  photo.height = H / 2
  const ctx = photo.getContext('2d')!
  ctx.scale(0.5, 0.5)
  drawScene(ctx)

  const figure = document.createElement('canvas')
  figure.width = 192
  figure.height = 144
  drawFigure(figure.getContext('2d')!, figure.width, figure.height)

  return { photo: texture(photo), figure: texture(figure) }
}
