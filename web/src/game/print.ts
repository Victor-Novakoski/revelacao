// A cópia pronta, ponto a ponto, com a mesma conta do shader da bandeja
// (shaders/develop.frag), mas com a revelação igual no papel todo. Serve
// para o varal e para o mural, que mostram a cópia já seca.

export function paperCurve(x: number) {
  return (1 - Math.exp(-1.6 * x)) / (1 - Math.exp(-1.6))
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// scene e figure de 0 (preto) a 1 (branco), como saem da foto. Devolve a
// densidade de prata, de 0 (papel branco) a 1 (preto).
//
// A figura desenhada (figure) só escurece. A de foto real (photos/real.ts)
// tem tom próprio, de 0 a 1 como a cena: onde ela está (mix), a cópia vai da
// cena para ela conforme a camada revela, então o rosto pode sair mais claro
// que o arbusto atrás.
export function printDensity(scene: number, figure: number, developed: number, exposure: number, mix = 0, tone = 0) {
  const induction = Math.max(developed - 0.08, 0) / 0.92
  const silver = (gray: number) => paperCurve(Math.min(induction * Math.pow(1 - gray, 1.1) * exposure, 1.6))
  const base = silver(scene)
  const late = induction * smoothstep(0.75, 1.35, developed)
  const creature = paperCurve(figure * 0.85 * late)
  let density = 1 - (1 - base) * (1 - creature)
  if (mix > 0) density += (silver(tone) - density) * Math.min(1, mix * late)
  density += 0.35 * Math.pow(Math.max(developed * exposure - 1.15, 0), 1.3)
  return Math.min(1, Math.max(0, density))
}

// O quanto a camada da figura já revelou (a mesma conta de "late" acima).
// Abaixo de um quarto, ela ainda não dá para ver nem com a lupa.
export function figureShows(developed: number) {
  const induction = Math.max(developed - 0.08, 0) / 0.92
  return induction * smoothstep(0.75, 1.35, developed)
}

export const FIGURE_VISIBLE = 0.25

// Desfoque de caixa em duas passadas, para a cópia fora de foco.
export function boxBlur(src: Float32Array, w: number, h: number, radius: number): Float32Array {
  const r = Math.round(radius)
  if (r < 1) return src
  const tmp = new Float32Array(src.length)
  const out = new Float32Array(src.length)
  const pass = (from: Float32Array, to: Float32Array, horizontal: boolean) => {
    const lines = horizontal ? h : w
    const len = horizontal ? w : h
    for (let l = 0; l < lines; l++) {
      const at = (i: number) => (horizontal ? l * w + i : i * w + l)
      for (let i = 0; i < len; i++) {
        let sum = 0
        let n = 0
        for (let k = -r; k <= r; k++) {
          const j = i + k
          if (j < 0 || j >= len) continue
          sum += from[at(j)]
          n++
        }
        to[at(i)] = sum / n
      }
    }
  }
  pass(src, tmp, true)
  pass(tmp, out, false)
  return out
}

// Raio do desfoque em pixels, para uma foto de largura w.
export function blurRadius(blur: number, w: number) {
  return blur * w * 0.02
}
