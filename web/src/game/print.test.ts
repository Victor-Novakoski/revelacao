import { describe, expect, it } from 'vitest'
import { boxBlur, printDensity } from './print'

describe('a cópia pronta', () => {
  it('papel sem revelar fica branco', () => {
    expect(printDensity(0, 0, 0, 1)).toBe(0)
  })

  it('o que é escuro na cena fica escuro no papel', () => {
    const shadow = printDensity(0.1, 0, 1, 1)
    const sky = printDensity(0.9, 0, 1, 1)
    expect(shadow).toBeGreaterThan(0.8)
    expect(sky).toBeLessThan(0.15)
  })

  it('mais luz no ampliador escurece', () => {
    expect(printDensity(0.5, 0, 1, 1.5)).toBeGreaterThan(printDensity(0.5, 0, 1, 1))
  })

  it('a figura só aparece com mais tempo no revelador', () => {
    const early = printDensity(1, 1, 0.7, 1)
    const late = printDensity(1, 1, 1.3, 1)
    expect(early).toBeLessThan(0.05)
    expect(late).toBeGreaterThan(0.4)
  })

  it('o desfoque espalha um ponto sem mudar a soma', () => {
    const src = new Float32Array(25)
    src[12] = 1
    const out = boxBlur(src, 5, 5, 1)
    expect(out[12]).toBeCloseTo(1 / 9)
    expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(1)
    expect(boxBlur(src, 5, 5, 0)).toBe(src)
  })
})
