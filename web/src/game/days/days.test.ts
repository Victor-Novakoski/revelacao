import { describe, expect, it } from 'vitest'
import { EXPOSURE_RANGE, START, advance, rolls, stepLines, type Print } from '../day'
import { DAYS, LAST_DAY } from '../store'
import { PLACEMENTS } from '../../photos/figures'
import { hasScene } from '../../photos'

const all = Object.values(DAYS)

describe('o roteiro de todos os dias', () => {
  it('os dias vão de 1 ao último, sem buraco', () => {
    for (let d = 1; d <= LAST_DAY; d++) expect(DAYS[d]?.day).toBe(d)
  })

  it('cada rolo tem de 4 a 6 fotos, com id único no jogo inteiro', () => {
    const ids = new Set<string>()
    for (const day of all) {
      for (const roll of rolls(day)) {
        expect(ids.has(roll.id)).toBe(false)
        ids.add(roll.id)
        expect(roll.photos.length).toBeGreaterThanOrEqual(4)
        expect(roll.photos.length).toBeLessThanOrEqual(6)
      }
    }
  })

  it('toda foto tem desenho, verso, luz possível, foco no curso e detalhes dentro da foto', () => {
    for (const day of all) {
      for (const roll of rolls(day)) {
        for (const p of roll.photos) {
          const key = `${roll.id}/${p.id}`
          expect(hasScene(key), key).toBe(true)
          expect(p.verso.length).toBeGreaterThan(0)
          expect(p.exposure).toBeGreaterThanOrEqual(EXPOSURE_RANGE.min)
          expect(p.exposure).toBeLessThanOrEqual(EXPOSURE_RANGE.max)
          expect(p.focus).toBeGreaterThan(0)
          expect(p.focus).toBeLessThan(1)
          for (const d of p.details ?? []) {
            expect(d.x - d.r, `${key} ${d.id}`).toBeGreaterThanOrEqual(0)
            expect(d.x + d.r, `${key} ${d.id}`).toBeLessThanOrEqual(1)
            expect(d.y - d.r, `${key} ${d.id}`).toBeGreaterThanOrEqual(0)
            expect(d.y + d.r, `${key} ${d.id}`).toBeLessThanOrEqual(1)
          }
        }
      }
    }
  })

  it('a figura de cada foto tem o seu detalhe na lupa, e só ela', () => {
    for (const day of all) {
      for (const roll of rolls(day)) {
        for (const p of roll.photos) {
          const key = `${roll.id}/${p.id}`
          const figure = (p.details ?? []).filter((d) => d.figure)
          expect(figure.length, key).toBe(key in PLACEMENTS ? 1 : 0)
        }
      }
    }
  })

  it('a figura nunca aparece no dia 1 nem nas fotos da Senhorita Amanda', () => {
    const keys = all.flatMap((day) =>
      rolls(day)
        .filter((r) => day.day === 1 || r.customer === 'amanda')
        .flatMap((r) => r.photos.map((p) => `${r.id}/${p.id}`)),
    )
    for (const key of keys) expect(key in PLACEMENTS, key).toBe(false)
  })

  it('cada entrega é de um rolo revelado antes, no mesmo dia', () => {
    for (const day of all) {
      const seen = new Set<string>()
      for (const step of day.steps) {
        if (step.kind === 'roll') seen.add(step.roll.id)
        if (step.kind === 'deliver') expect(seen.has(step.roll)).toBe(true)
      }
    }
  })

  it('o filme vai para o tanque no dia 1, e todo tanque tem um gesto de segurar', () => {
    expect(DAYS[1].steps.some((s) => s.kind === 'tank')).toBe(true)
    for (const day of all) {
      for (const step of day.steps) {
        if (step.kind !== 'tank') continue
        expect(step.actions.filter((a) => a.hold).length, `dia ${day.day}`).toBe(1)
        // O tanque vem antes das cópias do dia.
        const at = day.steps.indexOf(step)
        expect(day.steps.findIndex((s) => s.kind === 'roll'), `dia ${day.day}`).toBeGreaterThan(at)
      }
    }
  })

  it('todo dia dá para jogar do começo ao fim', () => {
    for (const day of all) {
      const prints: Print[] = []
      const choice = day.steps.find((s) => s.kind === 'choice')
      const ending = choice?.kind === 'choice' ? choice.options[0].id : null
      let c = START
      for (let i = 0; i < 800; i++) {
        const step = day.steps[c.step]
        if (step.kind === 'end') break
        if (step.kind === 'talk' || step.kind === 'deliver') expect(stepLines(day, step, prints).length).toBeGreaterThan(0)
        if (step.kind === 'roll' && c.gesture === 'line') {
          prints.push({ roll: step.roll.id, photo: step.roll.photos[c.index].id, developed: 1, exposure: 1, blur: 0 })
        }
        c = advance(day, c, prints, ending)
      }
      expect(day.steps[c.step].kind, `dia ${day.day}`).toBe('end')
      expect(prints).toHaveLength(rolls(day).reduce((n, r) => n + r.photos.length, 0))
    }
  })
})
