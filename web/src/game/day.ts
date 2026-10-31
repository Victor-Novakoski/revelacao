import { verdict } from './develop'
import type { DayScript, Ending, Gesture, Line, Mood, PhotoSpec, Quality, Roll, Step } from './script'

// Andar pelo roteiro de um dia, sem React e sem Three.js. O cursor diz em
// que passo o jogador está; dentro de uma conversa, index é a fala; dentro
// de um rolo, index é a foto e gesture é a etapa da cópia.

export type Cursor = { step: number; index: number; gesture: Gesture }

export const START: Cursor = { step: 0, index: 0, gesture: 'enlarger' }

// Uma cópia pronta, pendurada no varal.
export type Print = {
  roll: string
  photo: string
  developed: number
  exposure: number
  blur: number
}

const GESTURES: Gesture[] = ['enlarger', 'tray', 'line']

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Botão de foco a um quarto do curso do ponto certo já é o borrão máximo.
export function focusBlur(knob: number, target: number) {
  return clamp(Math.abs(knob - target) / 0.25, 0, 1)
}

export const IN_FOCUS = 0.08
export const BLURRY = 0.3

// Mais luz no ampliador, mais escura a cópia: o tempo de luz multiplica a
// densidade que o revelador consegue tirar do papel.
export const EXPOSURE_RANGE = { min: 2, max: 24 }

export function exposureFactor(seconds: number, ideal: number) {
  return clamp(seconds / ideal, 0.3, 2.5)
}

// O tom da cópia: o quanto revelou vezes o quanto de luz levou.
export function printTone(developed: number, exposure: number) {
  return developed * exposure
}

export function printQuality(p: Pick<Print, 'developed' | 'exposure' | 'blur'>): Quality {
  if (p.blur > BLURRY) return 'blurry'
  return verdict(printTone(p.developed, p.exposure))
}

// O humor do cliente ao ver o envelope: tudo no ponto, ou o defeito que
// pegou pelo menos metade das fotos, ou um pouco de tudo.
export function rollMood(qualities: Quality[]): Mood {
  if (qualities.length === 0) return 'mixed'
  if (qualities.every((q) => q === 'right')) return 'good'
  const bad = ['blurry', 'pale', 'dark'] as const
  let worst: Mood = 'mixed'
  let most = 0
  for (const q of bad) {
    const n = qualities.filter((x) => x === q).length
    if (n > most) {
      most = n
      worst = q
    }
  }
  return most * 2 >= qualities.length ? worst : 'mixed'
}

export function rolls(day: DayScript): Roll[] {
  return day.steps.flatMap((s) => (s.kind === 'roll' ? [s.roll] : []))
}

export function findPhoto(day: DayScript, roll: string, photo: string): PhotoSpec | undefined {
  return rolls(day)
    .find((r) => r.id === roll)
    ?.photos.find((p) => p.id === photo)
}

export function moodOf(day: DayScript, roll: string, prints: Print[]): Mood {
  const spec = rolls(day).find((r) => r.id === roll)
  if (!spec) return 'mixed'
  const qualities = spec.photos.flatMap((photo) => {
    const p = prints.find((x) => x.roll === roll && x.photo === photo.id)
    return p ? [printQuality(p)] : []
  })
  return rollMood(qualities)
}

export function endingOf(day: DayScript, ending: string | null | undefined): Ending | undefined {
  if (!ending) return undefined
  for (const s of day.steps) if (s.kind === 'choice') return s.options.find((o) => o.id === ending)
  return undefined
}

// As falas de um passo de conversa. Na entrega, dependem das cópias; na
// escolha do fim, do final escolhido.
export function stepLines(day: DayScript, step: Step, prints: Print[], ending?: string | null): Line[] {
  if (step.kind === 'talk') return step.lines
  if (step.kind === 'deliver') return [...step.before, ...step.after[moodOf(day, step.roll, prints)]]
  if (step.kind === 'choice') return step.options.find((o) => o.id === ending)?.lines ?? []
  return []
}

export function currentStep(day: DayScript, c: Cursor): Step {
  return day.steps[Math.min(c.step, day.steps.length - 1)]
}

export function currentPhoto(day: DayScript, c: Cursor): { roll: Roll; photo: PhotoSpec } | null {
  const step = currentStep(day, c)
  if (step.kind !== 'roll') return null
  const photo = step.roll.photos[c.index]
  return photo ? { roll: step.roll, photo } : null
}

const nextStep = (day: DayScript, c: Cursor): Cursor =>
  c.step + 1 < day.steps.length ? { step: c.step + 1, index: 0, gesture: 'enlarger' } : c

// Um passo à frente. No fim do dia, fica parado; na escolha, só anda
// depois de escolher.
export function advance(day: DayScript, c: Cursor, prints: Print[], ending?: string | null): Cursor {
  const step = currentStep(day, c)
  switch (step.kind) {
    case 'talk':
    case 'deliver':
      return c.index + 1 < stepLines(day, step, prints).length ? { ...c, index: c.index + 1 } : nextStep(day, c)
    case 'choice': {
      const lines = stepLines(day, step, prints, ending)
      if (lines.length === 0) return c
      return c.index + 1 < lines.length ? { ...c, index: c.index + 1 } : nextStep(day, c)
    }
    case 'burn':
    case 'tank':
      return c.index + 1 < step.actions.length ? { ...c, index: c.index + 1 } : nextStep(day, c)
    case 'roll': {
      const g = GESTURES.indexOf(c.gesture)
      if (g < GESTURES.length - 1) return { ...c, gesture: GESTURES[g + 1] }
      if (c.index + 1 < step.roll.photos.length) return { ...c, index: c.index + 1, gesture: 'enlarger' }
      return nextStep(day, c)
    }
    case 'wall':
      return nextStep(day, c)
    case 'end':
      return c
  }
}

// O filme enrolando na espiral enquanto o botão fica apertado. Soltar
// pausa, não perde o que já foi: no escuro, a mão volta a achar a ponta.
export function reel(wound: number, held: number, hold: number) {
  return hold > 0 ? clamp(wound + held / hold, 0, 1) : 1
}

// Outra folha: a cópia volta para o ampliador.
export function retry(c: Cursor): Cursor {
  return { ...c, gesture: 'enlarger' }
}

// Guarda a cópia, trocando a anterior da mesma foto se houver.
export function keepPrint(prints: Print[], print: Print): Print[] {
  return [...prints.filter((p) => p.roll !== print.roll || p.photo !== print.photo), print]
}

// Um cursor salvo que não cabe mais no roteiro (o roteiro mudou) volta ao começo.
export function validCursor(day: DayScript, c: Cursor | undefined): Cursor {
  if (!c || c.step < 0 || c.step >= day.steps.length) return START
  const step = day.steps[c.step]
  if (step.kind === 'roll' && c.index >= step.roll.photos.length) return START
  if ((step.kind === 'burn' || step.kind === 'tank') && c.index >= step.actions.length) return START
  if (!GESTURES.includes(c.gesture)) return START
  return c
}
