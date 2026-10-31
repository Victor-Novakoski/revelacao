import { describe, expect, it } from 'vitest'
import { BARS, BEATS_PER_BAR, WALTZ, WRONG_BAR, at, length, played } from './waltz'

describe('a valsa', () => {
  it('cabe no laço e nenhuma nota passa do fim', () => {
    for (const n of WALTZ) {
      expect(n.beat).toBeLessThan(BEATS_PER_BAR)
      expect(n.bar * BEATS_PER_BAR + n.beat + n.beats).toBeLessThanOrEqual(BARS * BEATS_PER_BAR)
    }
  })

  it('o baixo toca em todo compasso', () => {
    for (let bar = 0; bar < BARS; bar++) {
      expect(WALTZ.some((n) => n.bar === bar && n.beat === 0 && /2$/.test(n.notes[0]))).toBe(true)
    }
  })

  it('escreve o tempo do jeito do Tone.js', () => {
    expect(at(4, 2)).toBe('4:2:0')
    expect(length(3)).toBe('0:3:0')
  })

  it('no último dia, só uma nota sai errada', () => {
    const changed = WALTZ.filter((n) => played(n, true).join() !== n.notes.join())
    expect(changed).toHaveLength(1)
    expect(changed[0].bar).toBe(WRONG_BAR)
    for (const n of WALTZ) expect(played(n, false)).toEqual(n.notes)
  })
})
