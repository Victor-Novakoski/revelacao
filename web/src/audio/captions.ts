import { create } from 'zustand'

export type Caption = { id: number; text: string }

type CaptionState = {
  lines: Caption[]
  say: (text: string, seconds?: number) => void
  clear: () => void
}

const MAX_LINES = 3
let nextId = 1

// Legendas dos sons. Cada linha some sozinha depois de alguns segundos;
// se juntar muita, a mais velha sai primeiro.
export const useCaptions = create<CaptionState>((set) => ({
  lines: [],
  say: (text, seconds = 5) => {
    const id = nextId++
    set((s) => ({ lines: [...s.lines, { id, text }].slice(-MAX_LINES) }))
    setTimeout(() => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })), seconds * 1000)
  },
  clear: () => set({ lines: [] }),
}))
