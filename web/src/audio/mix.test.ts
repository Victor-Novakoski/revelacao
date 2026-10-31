import { describe, expect, it } from 'vitest'
import { FADE_IN, LEVELS, MUTE, RADIO_BPM, UNMUTE, behindLeft, dripPitch, fadeTime, nextDrip, radioWarp } from './mix'

const seq = (...values: number[]) => {
  let i = 0
  return () => values[i++ % values.length]
}

describe('mix', () => {
  it('nenhum som entra de repente', () => {
    expect(FADE_IN).toBeGreaterThanOrEqual(3)
    expect(fadeTime(true)).toBe(UNMUTE)
    expect(UNMUTE).toBeGreaterThanOrEqual(1)
    expect(fadeTime(false)).toBe(MUTE)
  })

  it('a goteira é irregular e nunca para de vez', () => {
    expect(nextDrip(seq(0.5, 0))).toBe(3)
    expect(nextDrip(seq(0.5, 1))).toBe(11)
    expect(nextDrip(seq(0.1, 0))).toBeCloseTo(0.35)
    for (let i = 0; i < 100; i++) {
      const d = nextDrip(Math.random)
      expect(d).toBeGreaterThan(0.3)
      expect(d).toBeLessThanOrEqual(11)
    }
  })

  it('a gota fica numa faixa aguda', () => {
    expect(dripPitch(() => 0)).toBe(1100)
    expect(dripPitch(() => 1)).toBe(1800)
  })

  it('o rádio desafina devagar e grave, sem passar do limite', () => {
    expect(radioWarp(0)).toEqual({ bpm: RADIO_BPM, detune: 0 })
    expect(radioWarp(1).bpm).toBeLessThan(RADIO_BPM)
    expect(radioWarp(1).detune).toBeLessThan(0)
    expect(radioWarp(5)).toEqual(radioWarp(1))
    expect(radioWarp(-1)).toEqual(radioWarp(0))
  })

  it('o rangido vem de trás e da esquerda de quem ouve', () => {
    // Olhando para -z, a esquerda é -x e atrás é +z.
    const [x, y, z] = behindLeft([0, 1.6, 0], [0, 0, -1], [0, 1, 0])
    expect(x).toBeLessThan(0)
    expect(z).toBeGreaterThan(0)
    expect(y).toBeLessThan(1.6)
    // Olhando para +x, a esquerda é -z e atrás é -x.
    const [x2, , z2] = behindLeft([0, 1.6, 0], [1, 0, 0], [0, 1, 0])
    expect(x2).toBeLessThan(0)
    expect(z2).toBeLessThan(0)
  })

  it('os sons da história ficam baixos', () => {
    for (const level of [LEVELS.phone, LEVELS.creak, LEVELS.match]) expect(level).toBeLessThanOrEqual(-24)
  })
})
