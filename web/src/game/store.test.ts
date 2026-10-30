import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './store'

describe('useGame', () => {
  beforeEach(() => {
    useGame.getState().newSheet()
    useGame.setState({ screen: 'title', day: 1 })
  })

  it('começa na tela de título, no dia 1', () => {
    expect(useGame.getState().screen).toBe('title')
    expect(useGame.getState().day).toBe(1)
  })

  it('entra e sai da câmara escura', () => {
    useGame.getState().enter()
    expect(useGame.getState().screen).toBe('darkroom')
    useGame.getState().leave()
    expect(useGame.getState().screen).toBe('title')
  })

  it('entrar põe uma folha nova na bandeja', () => {
    const before = useGame.getState().sheet
    useGame.getState().enter()
    expect(useGame.getState().sheet).toBe(before + 1)
    expect(useGame.getState().phase).toBe('developing')
    expect(useGame.getState().sim.developed).toBe(0)
  })

  it('tirar da bandeja para a revelação e dá o ponto da foto', () => {
    useGame.getState().enter()
    useGame.getState().sim.developed = 1
    useGame.getState().pull()
    expect(useGame.getState().phase).toBe('pulled')
    expect(useGame.getState().result).toBe('right')
    expect(useGame.getState().sim.running).toBe(false)
  })

  it('a folha nova recomeça do papel branco', () => {
    useGame.getState().enter()
    useGame.getState().sim.developed = 0.4
    useGame.getState().pull()
    useGame.getState().newSheet()
    expect(useGame.getState().phase).toBe('developing')
    expect(useGame.getState().result).toBeNull()
    expect(useGame.getState().sim.developed).toBe(0)
  })
})
