import { beforeEach, describe, expect, it } from 'vitest'
import { START } from './day'
import { DAY1 } from './days/day1'
import { LAST_DAY, hasProgress, printsOf, useGame, viewOf } from './store'

const game = () => useGame.getState()
const view = () => viewOf(game())

// Passa as falas e o tanque até chegar nas cópias.
const talkThrough = () => {
  while (view() === 'counter' || view() === 'tank') game().next()
}

const develop = (developed = 1) => {
  game().sim.developed = developed
  game().pull()
}

describe('useGame', () => {
  beforeEach(() => {
    game().restart()
    useGame.setState({ screen: 'title' })
  })

  it('começa na tela de título, no dia 1', () => {
    expect(game().screen).toBe('title')
    expect(game().day).toBe(1)
    expect(view()).toBe('room')
    expect(hasProgress(game())).toBe(false)
  })

  it('abrir a loja começa no balcão', () => {
    game().open()
    expect(game().screen).toBe('day')
    expect(view()).toBe('counter')
    game().leave()
    expect(game().screen).toBe('title')
  })

  it('o ampliador só passa a folha para a bandeja depois de acender', () => {
    game().open()
    talkThrough()
    expect(view()).toBe('enlarger')
    game().next()
    expect(view()).toBe('enlarger')
    game().expose()
    game().next()
    expect(view()).toBe('tray')
  })

  it('a folha leva o foco e a luz do ampliador', () => {
    game().open()
    talkThrough()
    const photo = DAY1.steps.find((s) => s.kind === 'roll')!
    if (photo.kind !== 'roll') throw new Error()
    const spec = photo.roll.photos[0]
    game().setFocus(spec.focus)
    game().setSeconds(spec.exposure * 2)
    game().expose()
    const before = game().sheet
    game().next()
    expect(game().sheet).toBe(before + 1)
    expect(game().sheetPhoto).toEqual({ roll: photo.roll.id, photo: spec.id, exposure: 2, blur: 0 })
    expect(game().sim.developed).toBe(0)
  })

  it('tirar da bandeja dá o ponto da cópia, e só então vai para o varal', () => {
    game().open()
    talkThrough()
    const first = DAY1.steps.find((s) => s.kind === 'roll')
    game().setFocus(first?.kind === 'roll' ? first.roll.photos[0].focus : 0)
    game().setSeconds(8)
    game().expose()
    game().next()
    game().next()
    expect(view()).toBe('tray')
    develop(1)
    expect(game().phase).toBe('pulled')
    expect(game().result).toBe('right')
    expect(game().sim.running).toBe(false)
    game().next()
    expect(view()).toBe('line')
  })

  it('cópia fora de foco sai borrada', () => {
    game().open()
    talkThrough()
    game().setFocus(0)
    game().expose()
    game().next()
    develop(1)
    expect(game().result).toBe('blurry')
  })

  it('outra folha volta para o ampliador sem luz', () => {
    game().open()
    talkThrough()
    game().expose()
    game().next()
    develop(0.3)
    game().retry()
    expect(view()).toBe('enlarger')
    expect(game().enlarger.exposed).toBe(false)
    expect(game().phase).toBe('developing')
  })

  it('pendurar guarda a cópia e traz a próxima foto', () => {
    game().open()
    talkThrough()
    game().expose()
    game().next()
    develop(0.9)
    game().next()
    game().next()
    expect(view()).toBe('line')
    game().hang()
    expect(game().prints).toHaveLength(1)
    expect(game().prints[0].developed).toBe(0.9)
    expect(view()).toBe('line')
    game().next()
    expect(view()).toBe('enlarger')
    expect(game().cursor.index).toBe(1)
    expect(hasProgress(game())).toBe(true)
  })

  it('o dia inteiro, do balcão até o fim', () => {
    game().open()
    for (let i = 0; i < 300 && view() !== 'end'; i++) {
      const v = view()
      if (v === 'enlarger') game().expose()
      if (v === 'tray') develop(1)
      if (v === 'line') game().hang()
      game().next()
    }
    expect(view()).toBe('end')
    expect(game().prints).toHaveLength(8)
  })

  it('voltando com a cópia a caminho do varal, refaz no ampliador', () => {
    game().open()
    talkThrough()
    game().expose()
    game().next()
    develop(1)
    game().next()
    game().leave()
    useGame.setState({ sheetPhoto: null })
    game().open()
    expect(view()).toBe('enlarger')
  })

  it('anota e acha detalhes uma vez só', () => {
    game().writeNote('r/p', 'nada de estranho')
    game().find('dedo')
    game().find('dedo')
    expect(game().notes['r/p']).toBe('nada de estranho')
    expect(game().found).toEqual(['dedo'])
  })

  it('recomeçar zera o dia', () => {
    game().open()
    talkThrough()
    game().restart()
    expect(game().cursor).toEqual(START)
    expect(game().prints).toEqual([])
  })

  it('no fim do dia, a loja abre no dia seguinte e as cópias de ontem ficam guardadas', () => {
    game().open()
    game().nextDay()
    expect(game().day).toBe(1)
    for (let i = 0; i < 300 && view() !== 'end'; i++) {
      const v = view()
      if (v === 'enlarger') game().expose()
      if (v === 'tray') develop(1)
      if (v === 'line') game().hang()
      game().next()
    }
    game().nextDay()
    expect(game().day).toBe(2)
    expect(game().cursor).toEqual(START)
    expect(view()).toBe('counter')
    expect(game().prints).toHaveLength(8)
    expect(printsOf(2, game().prints)).toHaveLength(0)
    expect(hasProgress({ ...game(), prints: [], cursor: START })).toBe(true)
  })

  it('o jogo inteiro, do primeiro dia até um final', () => {
    game().open()
    for (let i = 0; i < 6000 && !(view() === 'end' && game().day === LAST_DAY); i++) {
      const v = view()
      if (v === 'enlarger') game().expose()
      if (v === 'tray') develop(1)
      if (v === 'line') game().hang()
      if (v === 'choice') game().choose('revelar')
      if (v === 'end') game().nextDay()
      else game().next()
    }
    expect(game().day).toBe(LAST_DAY)
    expect(view()).toBe('end')
  })
})
