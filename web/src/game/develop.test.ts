import { describe, expect, it } from 'vitest'
import {
  MAX_TILT,
  createSim,
  developStage,
  dragTilt,
  paperCoverage,
  stepSim,
  verdict,
  type DevelopSim,
} from './develop'

const FRAME = 1 / 60

function run(sim: DevelopSim, seconds: number, rock: boolean) {
  for (let t = 0; t < seconds; t += FRAME) {
    if (rock) sim.tiltTarget.x = Math.floor(t / 0.6) % 2 === 0 ? MAX_TILT : -MAX_TILT
    stepSim(sim, FRAME)
  }
}

describe('bandeja', () => {
  it('com a bandeja parada, o papel fica todo coberto', () => {
    const sim = createSim()
    run(sim, 5, false)
    expect(sim.coverage).toBe(1)
    expect(sim.agitation).toBeLessThan(0.01)
  })

  it('balançando, a foto fica no ponto em menos de um minuto', () => {
    const sim = createSim()
    let seconds = 0
    while (verdict(sim.developed) === 'pale' && seconds < 120) {
      run(sim, 1, true)
      seconds++
    }
    expect(seconds).toBeGreaterThan(20)
    expect(seconds).toBeLessThan(50)
  })

  it('parada, revela bem mais devagar do que balançando', () => {
    const still = createSim()
    const rocked = createSim()
    run(still, 30, false)
    run(rocked, 30, true)
    expect(rocked.developed).toBeGreaterThan(still.developed * 1.4)
  })

  it('o líquido vai e volta depois que a bandeja para', () => {
    const sim = createSim()
    sim.tiltTarget.x = MAX_TILT
    run(sim, 1.5, false)
    sim.tiltTarget.x = 0
    let minSlope = 0
    for (let t = 0; t < 1.5; t += FRAME) {
      stepSim(sim, FRAME)
      minSlope = Math.min(minSlope, sim.slope.x)
    }
    expect(minSlope).toBeLessThan(-0.02)
  })

  it('inclinar tudo deixa a ponta do papel fora do líquido', () => {
    expect(paperCoverage({ x: Math.tan(MAX_TILT), y: 0 })).toBeLessThan(1)
    expect(paperCoverage({ x: 0, y: 0 })).toBe(1)
  })

  it('o arraste inclina até o limite e não passa dele', () => {
    const view = { width: 390, height: 844 }
    expect(dragTilt(0, 0, view)).toEqual({ x: 0, y: 0 })
    expect(dragTilt(1000, -1000, view)).toEqual({ x: MAX_TILT, y: -MAX_TILT })
    expect(dragTilt(42.9, 0, view).x).toBeCloseTo(MAX_TILT / 2, 2)
  })
})

describe('ponto da foto', () => {
  it('pálida, no ponto ou escura', () => {
    expect(verdict(0.5)).toBe('pale')
    expect(verdict(1)).toBe('right')
    expect(verdict(1.4)).toBe('dark')
  })

  it('a legenda acompanha a revelação', () => {
    expect([0, 0.2, 0.6, 0.9, 1.3].map(developStage)).toEqual([0, 1, 2, 3, 4])
  })
})
