import { describe, expect, it } from 'vitest'
import { FADE_IN, LEVELS, MUTE, RADIO_BPM, UNMUTE, behindLeft, dayDread, dreadMix, dripPitch, fadeTime, nextDrip, nextGlass, radioWarp } from './mix'

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

describe('o medo', () => {
  it('cresce com os dias, sem nunca sumir de vez', () => {
    expect(dayDread(1, 10)).toBe(0)
    expect(dayDread(10, 10)).toBe(1)
    expect(dayDread(5, 10)).toBeGreaterThan(dayDread(2, 10))
    expect(dreadMix(0, 0).cellar).toBeGreaterThan(0)
  })

  it('a figura na bandeja aumenta tudo e faz o coração bater', () => {
    const calm = dreadMix(0.3, 0)
    const seen = dreadMix(0.3, 1)
    expect(calm.heart).toBe(0)
    expect(seen.heart).toBe(1)
    expect(seen.cellar).toBeGreaterThan(calm.cellar)
    expect(seen.glass).toBeGreaterThan(calm.glass)
    for (const v of Object.values(dreadMix(5, 5))) expect(v).toBeLessThanOrEqual(1)
  })

  it('o apito volta mais cedo nos dias pesados, mas nunca em menos de 12 s', () => {
    expect(nextGlass(() => 0, 1)).toBeLessThan(nextGlass(() => 0, 0))
    expect(nextGlass(() => 0, 1)).toBeGreaterThanOrEqual(12)
  })

  it('as camadas novas também ficam baixas', () => {
    for (const level of [LEVELS.drone, LEVELS.glass, LEVELS.heart]) expect(level).toBeLessThanOrEqual(-20)
  })
})
