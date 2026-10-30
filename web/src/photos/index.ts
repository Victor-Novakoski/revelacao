import { blurRadius, boxBlur, printDensity } from '../game/print'
import { DAY1_SCENES, type Scene } from './day1'
import { frameOf, PRINT, type Film } from './frame'
import { STORY_FIGURES, STORY_SCENES } from './story'

// As camadas de cada foto (cena e figura) e a cópia pronta, para o varal e
// o mural. As camadas são desenhadas uma vez e guardadas.

export { PRINT } from './frame'

const SCENES: Record<string, Scene> = { ...DAY1_SCENES, ...STORY_SCENES }
// A figura, por foto. No dia 1 ela não está em foto nenhuma.
const FIGURES: Record<string, Scene> = { ...STORY_FIGURES }

export const hasScene = (key: string) => key in SCENES
export const hasFigure = (key: string) => key in FIGURES

export type Layers = {
  scene: HTMLCanvasElement
  figure: HTMLCanvasElement
  sceneGray: Float32Array
  figureGray: Float32Array
}

const layersCache = new Map<string, Layers>()

function canvas() {
  const c = document.createElement('canvas')
  c.width = PRINT.width
  c.height = PRINT.height
  return c
}

function grayOf(c: HTMLCanvasElement) {
  const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
  const out = new Float32Array(c.width * c.height)
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4] / 255
  return out
}

export function photoLayers(key: string, film: Film): Layers {
  const cached = layersCache.get(key)
  if (cached) return cached
  const frame = frameOf(film)

  // Papel branco em volta; a imagem só dentro do quadro do filme.
  const scene = canvas()
  const sc = scene.getContext('2d', { willReadFrequently: true })!
  sc.fillStyle = '#fff'
  sc.fillRect(0, 0, PRINT.width, PRINT.height)
  sc.save()
  sc.beginPath()
  sc.rect(frame.x, frame.y, frame.w, frame.h)
  sc.clip()
  sc.fillStyle = '#888'
  sc.fillRect(frame.x, frame.y, frame.w, frame.h)
  SCENES[key]?.(sc, frame)
  sc.restore()

  const figure = canvas()
  const fc = figure.getContext('2d', { willReadFrequently: true })!
  fc.fillStyle = '#000'
  fc.fillRect(0, 0, PRINT.width, PRINT.height)
  fc.save()
  fc.beginPath()
  fc.rect(frame.x, frame.y, frame.w, frame.h)
  fc.clip()
  FIGURES[key]?.(fc, frame)
  fc.restore()

  const layers = { scene, figure, sceneGray: grayOf(scene), figureGray: grayOf(figure) }
  layersCache.set(key, layers)
  return layers
}

export type PrintLook = { developed: number; exposure: number; blur: number }

const PAPER = [239, 234, 224]
const INK = [16, 14, 12]

const printCache = new Map<string, HTMLCanvasElement>()

// Cada folha que o jogador refaz gera uma cópia nova; as mais velhas saem.
function remember(id: string, c: HTMLCanvasElement) {
  printCache.set(id, c)
  if (printCache.size > 48) printCache.delete(printCache.keys().next().value!)
}

// A cópia seca. Sem a figura quando vai para a sala (o varal): a criatura
// só existe na fotografia que o jogador olha de perto.
export function printCanvas(key: string, film: Film, look: PrintLook, withFigure = true): HTMLCanvasElement {
  const id = `${key}|${look.developed.toFixed(3)}|${look.exposure.toFixed(3)}|${look.blur.toFixed(3)}|${withFigure}`
  const cached = printCache.get(id)
  if (cached) return cached
  const { sceneGray, figureGray } = photoLayers(key, film)
  const { width: w, height: h } = PRINT
  const radius = blurRadius(look.blur, w)
  const scene = boxBlur(sceneGray, w, h, radius)
  const figure = withFigure ? boxBlur(figureGray, w, h, radius) : null

  const out = canvas()
  const ctx = out.getContext('2d')!
  const img = ctx.createImageData(w, h)
  for (let i = 0; i < w * h; i++) {
    const d = printDensity(scene[i], figure ? figure[i] : 0, look.developed, look.exposure)
    for (let c = 0; c < 3; c++) img.data[i * 4 + c] = PAPER[c] + (INK[c] - PAPER[c]) * d
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  remember(id, out)
  return out
}

// O negativo, como aparece projetado no ampliador.
export function negativeCanvas(key: string, film: Film): HTMLCanvasElement {
  const id = `${key}|negative`
  const cached = printCache.get(id)
  if (cached) return cached
  const { sceneGray } = photoLayers(key, film)
  const frame = frameOf(film)
  const out = canvas()
  const ctx = out.getContext('2d')!
  const img = ctx.createImageData(PRINT.width, PRINT.height)
  for (let i = 0; i < sceneGray.length; i++) {
    const x = i % PRINT.width
    const y = Math.floor(i / PRINT.width)
    const inside = x >= frame.x && x < frame.x + frame.w && y >= frame.y && y < frame.y + frame.h
    const v = inside ? 255 * (1 - sceneGray[i]) * 0.8 + 30 : 8
    img.data[i * 4] = v
    img.data[i * 4 + 1] = v * 0.92
    img.data[i * 4 + 2] = v * 0.78
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  remember(id, out)
  return out
}
