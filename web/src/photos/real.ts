import type { Scene } from './day1'
import { rect } from './draw'
import { X, Y, sign } from './places'

// As fotos de verdade: cartões-postais e fotos de arquivo em domínio
// público, já recortadas no quadrado do 120 e envelhecidas pelo
// `revela age` (ver art/real/README.md). A figura delas também é real: um
// homem recortado de um retrato de 1870, com o rosto borrado.
//
// As imagens são baixadas uma vez, antes da sala e da loja abrirem
// (loadRealPhotos, em App.tsx); as camadas são desenhadas de forma síncrona e
// só depois disso. Se uma imagem não baixar, a foto sai cinza, sem quebrar o
// jogo.

const FILES = {
  'anapolis-coreto': 'anapolis-coreto.jpg',
  'campinas-jardim': 'campinas-jardim.jpg',
  'campinas-bento-quirino': 'campinas-bento-quirino.jpg',
  'campinas-rosario': 'campinas-rosario.jpg',
  'campinas-pompeo': 'campinas-pompeo.jpg',
  'amersfoort-toalha': 'amersfoort-toalha.jpg',
  'amersfoort-turma': 'amersfoort-turma.jpg',
  'renee-soneca': 'renee-soneca.jpg',
  'sarphatipark-patos': 'sarphatipark-patos.jpg',
  pessoa: 'pessoa.png',
} as const

type Name = keyof typeof FILES

const images = new Map<Name, HTMLImageElement>()
let loading: Promise<void> | null = null

export function loadRealPhotos(): Promise<void> {
  loading ??= Promise.allSettled(
    (Object.keys(FILES) as Name[]).map(async (name) => {
      const img = new Image()
      img.src = `${import.meta.env.BASE_URL}photos/${FILES[name]}`
      await img.decode()
      images.set(name, img)
    }),
  ).then(() => undefined)
  return loading
}

// A foto ocupa o quadro do filme inteiro.
export const realScene =
  (name: Exclude<Name, 'pessoa'>): Scene =>
  (ctx, fr) => {
    const img = images.get(name)
    if (img) ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h)
  }

// O homem, com os pés em (x, foot) e altura h, tudo em fração da folha.
// Vai em dois canais da camada da figura: verde é onde ele está e azul é o
// tom dele já multiplicado por isso (o vermelho fica para a figura
// desenhada). Ver printDensity em game/print.ts.
export const realFigure =
  (x: number, foot: number, h: number): Scene =>
  (ctx, fr) => {
    const img = images.get('pessoa')
    if (!img) return
    const hh = Y(h)
    const ww = (img.width / img.height) * hh
    const { width, height } = ctx.canvas
    const tmp = document.createElement('canvas')
    tmp.width = width
    tmp.height = height
    const tc = tmp.getContext('2d', { willReadFrequently: true })!
    tc.beginPath()
    tc.rect(fr.x, fr.y, fr.w, fr.h)
    tc.clip()
    tc.drawImage(img, X(x) - ww / 2, Y(foot) - hh, ww, hh)
    const src = tc.getImageData(0, 0, width, height).data
    const out = ctx.getImageData(0, 0, width, height)
    for (let i = 0; i < src.length; i += 4) {
      const a = src[i + 3] / 255
      if (a === 0) continue
      out.data[i + 1] = Math.round(a * 255)
      out.data[i + 2] = Math.round(src[i] * a)
    }
    ctx.putImageData(out, 0, 0)
  }

// Um letreiro na foto, fora de foco (o "FOTO ÍRIS" do dia 6). Onde o
// navegador não desfoca o canvas, sai nítido.
export function blurredSign(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.save()
  ctx.filter = `blur(${Math.max(1, size * 0.15)}px)`
  rect(ctx, X(x) - size * 3.6, Y(y) - size * 0.9, size * 7.2, size * 1.6, 0.22)
  sign(ctx, text, X(x), Y(y), size, 0.88)
  ctx.restore()
}
