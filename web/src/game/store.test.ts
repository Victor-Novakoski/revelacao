import { beforeEach, describe, expect, it } from 'vitest'
import { useGame } from './store'

describe('useGame', () => {
  beforeEach(() => useGame.setState({ screen: 'title', day: 1 }))

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
})
