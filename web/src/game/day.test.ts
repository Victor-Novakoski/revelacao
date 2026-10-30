import { describe, expect, it } from 'vitest'
import {
  START,
  advance,
  currentPhoto,
  exposureFactor,
  focusBlur,
  keepPrint,
  moodOf,
  printQuality,
  retry,
  rollMood,
  stepLines,
  validCursor,
  type Cursor,
  type Print,
} from './day'
import type { DayScript, Line, Mood } from './script'

const line = (text: string): Line => ({ who: 'narrator', text })
const moods = (text: string): Record<Mood, Line[]> => ({
  good: [line(`${text} boa`)],
  pale: [line(`${text} pálida`)],
  dark: [line(`${text} escura`)],
  blurry: [line(`${text} borrada`)],
  mixed: [line(`${text} mista`)],
})

const DAY: DayScript = {
  day: 1,
  title: 'Teste',
  steps: [
    { kind: 'talk', lines: [line('a'), line('b')] },
    {
      kind: 'roll',
      roll: {
        id: 'r',
        customer: 'cida',
        film: '35mm',
        title: 'Rolo',
        photos: [
          { id: 'p1', verso: '', exposure: 8, focus: 0.5 },
          { id: 'p2', verso: '', exposure: 8, focus: 0.5 },
        ],
      },
    },
    { kind: 'wall', hint: '' },
    { kind: 'deliver', roll: 'r', before: [line('volta')], after: moods('cópia') },
    { kind: 'end', title: 'Fim', text: '' },
  ],
}

const print = (photo: string, developed = 1, exposure = 1, blur = 0): Print => ({
  roll: 'r',
  photo,
  developed,
  exposure,
  blur,
})

describe('o cursor do dia', () => {
  it('passa as falas uma a uma e depois vai para o rolo', () => {
    let c = advance(DAY, START, [])
    expect(c).toEqual({ step: 0, index: 1, gesture: 'enlarger' })
    c = advance(DAY, c, [])
    expect(c).toEqual({ step: 1, index: 0, gesture: 'enlarger' })
  })

  it('cada foto passa pelo ampliador, pela bandeja e pelo varal', () => {
    let c: Cursor = { step: 1, index: 0, gesture: 'enlarger' }
    const seen: string[] = []
    while (c.step === 1) {
      seen.push(`${currentPhoto(DAY, c)?.photo.id}:${c.gesture}`)
      c = advance(DAY, c, [])
    }
    expect(seen).toEqual(['p1:enlarger', 'p1:tray', 'p1:line', 'p2:enlarger', 'p2:tray', 'p2:line'])
    expect(c.step).toBe(2)
  })

  it('outra folha volta a foto para o ampliador', () => {
    expect(retry({ step: 1, index: 1, gesture: 'tray' })).toEqual({ step: 1, index: 1, gesture: 'enlarger' })
  })

  it('para no fim do dia', () => {
    const end = { step: 4, index: 0, gesture: 'enlarger' as const }
    expect(advance(DAY, end, [])).toBe(end)
  })

  it('um cursor que não cabe no roteiro volta ao começo', () => {
    expect(validCursor(DAY, { step: 9, index: 0, gesture: 'tray' })).toBe(START)
    expect(validCursor(DAY, { step: 1, index: 5, gesture: 'tray' })).toBe(START)
    expect(validCursor(DAY, undefined)).toBe(START)
    expect(validCursor(DAY, { step: 1, index: 1, gesture: 'line' })).toEqual({ step: 1, index: 1, gesture: 'line' })
  })
})

describe('o ampliador', () => {
  it('fica nítido no ponto do foco e borra longe dele', () => {
    expect(focusBlur(0.5, 0.5)).toBe(0)
    expect(focusBlur(0.55, 0.5)).toBeCloseTo(0.2)
    expect(focusBlur(0, 0.5)).toBe(1)
  })

  it('mais luz, cópia mais escura, com limite', () => {
    expect(exposureFactor(8, 8)).toBe(1)
    expect(exposureFactor(16, 8)).toBe(2)
    expect(exposureFactor(60, 8)).toBe(2.5)
    expect(exposureFactor(1, 8)).toBe(0.3)
  })
})

describe('a qualidade das cópias', () => {
  it('o tom é revelação vezes luz', () => {
    expect(printQuality(print('p1', 1, 1))).toBe('right')
    expect(printQuality(print('p1', 0.5, 1))).toBe('pale')
    expect(printQuality(print('p1', 0.5, 2))).toBe('right')
    expect(printQuality(print('p1', 1, 1.6))).toBe('dark')
  })

  it('fora de foco vale mais que o tom', () => {
    expect(printQuality(print('p1', 1, 1, 0.5))).toBe('blurry')
  })

  it('o cliente reclama do defeito que pegou metade do rolo', () => {
    expect(rollMood(['right', 'right'])).toBe('good')
    expect(rollMood(['pale', 'right'])).toBe('pale')
    expect(rollMood(['pale', 'right', 'right', 'dark'])).toBe('mixed')
    expect(rollMood(['blurry', 'dark', 'dark', 'right'])).toBe('dark')
  })

  it('a fala da entrega depende das cópias', () => {
    const deliver = DAY.steps[3]
    expect(stepLines(DAY, deliver, [print('p1'), print('p2')]).map((l) => l.text)).toEqual(['volta', 'cópia boa'])
    expect(moodOf(DAY, 'r', [print('p1', 0.3), print('p2')])).toBe('pale')
  })

  it('a cópia nova da mesma foto troca a antiga', () => {
    const prints = keepPrint([print('p1', 0.3), print('p2')], print('p1', 1))
    expect(prints).toHaveLength(2)
    expect(prints.find((p) => p.photo === 'p1')?.developed).toBe(1)
  })
})
