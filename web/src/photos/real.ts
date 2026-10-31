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
  'cambuci-porta': 'cambuci-porta.jpg',
  'cambuci-altar': 'cambuci-altar.jpg',
  'cambuci-bolo': 'cambuci-bolo.jpg',
  'cambuci-retrato': 'cambuci-retrato.jpg',
  'estudio-keiko': 'estudio-keiko.jpg',
  'estudio-okada': 'estudio-okada.jpg',
  'estudio-rapaz': 'estudio-rapaz.jpg',
  'estudio-ito': 'estudio-ito.jpg',
  'comunhao-porta': 'comunhao-porta.jpg',
  'quintal-bolhas': 'quintal-bolhas.jpg',
  'quintal-gramado': 'quintal-gramado.jpg',
  'quintal-gato': 'quintal-gato.jpg',
  'quintal-escada': 'quintal-escada.jpg',
  'bodas-presente': 'bodas-presente.jpg',
  'bodas-album': 'bodas-album.jpg',
  'bodas-valsa': 'bodas-valsa.jpg',
  'bodas-familia': 'bodas-familia.jpg',
  'bodas-casal': 'bodas-casal.jpg',
  'mooca-convidados': 'mooca-convidados.jpg',
  'mooca-familia': 'mooca-familia.jpg',
  'mooca-noivos': 'mooca-noivos.jpg',
  'mooca-saida': 'mooca-saida.jpg',
  'livraria-vitrine': 'livraria-vitrine.jpg',
  'livraria-estantes': 'livraria-estantes.jpg',
  'livraria-gato': 'livraria-gato.jpg',
  'livraria-balcao': 'livraria-balcao.jpg',
  'lucia-presente': 'lucia-presente.jpg',
  'lucia-netos': 'lucia-netos.jpg',
  'lucia-boneca': 'lucia-boneca.jpg',
  'lucia-quintal': 'lucia-quintal.jpg',
  'retiro-chegada': 'retiro-chegada.jpg',
  'retiro-dossel': 'retiro-dossel.jpg',
  'retiro-brinde': 'retiro-brinde.jpg',
  'retiro-danca': 'retiro-danca.jpg',
  'normal-passeio': 'normal-passeio.jpg',
  'normal-banco': 'normal-banco.jpg',
  'normal-lanche': 'normal-lanche.jpg',
  'normal-marlene': 'normal-marlene.jpg',
  'rota-caminhao': 'rota-caminhao.jpg',
  'rota-serra': 'rota-serra.jpg',
  'rota-janela': 'rota-janela.jpg',
  'rota-cabine': 'rota-cabine.jpg',
  'augusto-cadeira': 'augusto-cadeira.jpg',
  'augusto-olhar': 'augusto-olhar.jpg',
  'augusto-cintura': 'augusto-cintura.jpg',
  'augusto-cigarro': 'augusto-cigarro.jpg',
  'augusto-rosto': 'augusto-rosto.jpg',
  'augusto-fogo': 'augusto-fogo.jpg',
  'comunhao-altar': 'comunhao-altar.jpg',
  'comunhao-igreja': 'comunhao-igreja.jpg',
  'comunhao-procissao': 'comunhao-procissao.jpg',
  pessoa: 'pessoa.png',
  // O que fica na frente da figura em cada cena (ver art/real/front.py).
  'estudio-rapaz-frente': 'estudio-rapaz-frente.png',
  'anapolis-coreto-frente': 'anapolis-coreto-frente.png',
  'campinas-jardim-frente': 'campinas-jardim-frente.png',
  'campinas-bento-quirino-frente': 'campinas-bento-quirino-frente.png',
  'quintal-gramado-frente': 'quintal-gramado-frente.png',
  'mooca-familia-frente': 'mooca-familia-frente.png',
  'mooca-saida-frente': 'mooca-saida-frente.png',
  'mooca-convidados-frente': 'mooca-convidados-frente.png',
  'mooca-noivos-frente': 'mooca-noivos-frente.png',
  'quintal-bolhas-frente': 'quintal-bolhas-frente.png',
  'quintal-gato-frente': 'quintal-gato-frente.png',
  'augusto-cadeira-frente': 'augusto-cadeira-frente.png',
  'augusto-olhar-frente': 'augusto-olhar-frente.png',
  'augusto-cintura-frente': 'augusto-cintura-frente.png',
  'augusto-cigarro-frente': 'augusto-cigarro-frente.png',
  'augusto-rosto-frente': 'augusto-rosto-frente.png',
  'augusto-fogo-frente': 'augusto-fogo-frente.png',
} as const

type Name = keyof typeof FILES
export type Front = { [K in Name]: K extends `${infer S}-frente` ? S : never }[Name]

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
  (name: Exclude<Name, 'pessoa' | `${string}-frente`>): Scene =>
  (ctx, fr) => {
    const img = images.get(name)
    if (img) ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h)
  }

// O homem, com os pés em (x, foot) e altura h, tudo em fração da folha.
// Vai em dois canais da camada da figura: verde é onde ele está e azul é o
// tom dele já multiplicado por isso (o vermelho fica para a figura
// desenhada). Ver printDensity em game/print.ts. Com front, as pessoas da
// cena ficam na frente dele: ele sai atrás delas.
export const realFigure =
  (x: number, foot: number, h: number, front?: Front): Scene =>
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
    const mask = front && images.get(`${front}-frente`)
    if (mask) {
      tc.globalCompositeOperation = 'destination-out'
      tc.drawImage(mask, fr.x, fr.y, fr.w, fr.h)
    }
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
