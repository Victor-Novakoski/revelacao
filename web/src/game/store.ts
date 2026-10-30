import { create } from 'zustand'

export type Screen = 'title' | 'darkroom'

type GameState = {
  screen: Screen
  day: number
  enter: () => void
  leave: () => void
}

export const useGame = create<GameState>((set) => ({
  screen: 'title',
  day: 1,
  enter: () => set({ screen: 'darkroom' }),
  leave: () => set({ screen: 'title' }),
}))
