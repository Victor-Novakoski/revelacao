import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCaptions } from './captions'

describe('legendas', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useCaptions.getState().clear()
  })
  afterEach(() => vi.useRealTimers())

  it('mostra a legenda e tira depois do tempo', () => {
    useCaptions.getState().say('[Uma gota cai na pia]', 4)
    expect(useCaptions.getState().lines.map((l) => l.text)).toEqual(['[Uma gota cai na pia]'])
    vi.advanceTimersByTime(3999)
    expect(useCaptions.getState().lines).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(useCaptions.getState().lines).toHaveLength(0)
  })

  it('guarda no máximo três linhas, a mais velha sai primeiro', () => {
    const { say } = useCaptions.getState()
    for (const t of ['a', 'b', 'c', 'd']) say(t)
    expect(useCaptions.getState().lines.map((l) => l.text)).toEqual(['b', 'c', 'd'])
  })
})
