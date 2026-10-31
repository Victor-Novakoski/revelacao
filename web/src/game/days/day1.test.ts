import { describe, expect, it } from 'vitest'
import { EXPOSURE_RANGE, advance, rolls, START, stepLines, type Print } from '../day'
import { DAY1 } from './day1'

describe('o roteiro do dia 1', () => {
  it('cada entrega é de um rolo que foi revelado antes', () => {
    const seen = new Set<string>()
    for (const step of DAY1.steps) {
      if (step.kind === 'roll') seen.add(step.roll.id)
      if (step.kind === 'deliver') expect(seen.has(step.roll)).toBe(true)
    }
  })

  it('as fotos têm verso, luz possível, foco no curso e detalhes dentro da foto', () => {
    const ids = new Set<string>()
    for (const roll of rolls(DAY1)) {
      expect(roll.photos.length).toBeGreaterThanOrEqual(4)
      for (const p of roll.photos) {
        expect(ids.has(`${roll.id}/${p.id}`)).toBe(false)
        ids.add(`${roll.id}/${p.id}`)
        expect(p.verso.length).toBeGreaterThan(0)
        expect(p.exposure).toBeGreaterThanOrEqual(EXPOSURE_RANGE.min)
        expect(p.exposure).toBeLessThanOrEqual(EXPOSURE_RANGE.max)
        expect(p.focus).toBeGreaterThan(0)
        expect(p.focus).toBeLessThan(1)
        for (const d of p.details ?? []) {
          expect(d.x - d.r).toBeGreaterThanOrEqual(0)
          expect(d.x + d.r).toBeLessThanOrEqual(1)
          expect(d.y - d.r).toBeGreaterThanOrEqual(0)
          expect(d.y + d.r).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('dá para jogar do começo ao fim', () => {
    const prints: Print[] = []
    let c = START
    for (let i = 0; i < 500; i++) {
      const step = DAY1.steps[c.step]
      if (step.kind === 'end') break
      if (step.kind === 'talk' || step.kind === 'deliver') expect(stepLines(DAY1, step, prints).length).toBeGreaterThan(0)
      if (step.kind === 'roll' && c.gesture === 'line') {
        prints.push({ roll: step.roll.id, photo: step.roll.photos[c.index].id, developed: 1, exposure: 1, blur: 0 })
      }
      c = advance(DAY1, c, prints)
    }
    expect(DAY1.steps[c.step].kind).toBe('end')
    expect(prints).toHaveLength(8)
  })
})
