import { create } from 'zustand'
import { createSim, verdict, type DevelopSim, type Verdict } from './develop'

export type Screen = 'title' | 'darkroom'
export type Phase = 'developing' | 'pulled'

type GameState = {
  screen: Screen
  day: number
  phase: Phase
  // Conta as folhas postas na bandeja; trocar de folha zera o papel na cena.
  sheet: number
  // A bandeja muda a cada quadro, fora do React. Só os números da tela
  // (segundos e etapa) passam pelo estado.
  sim: DevelopSim
  seconds: number
  stage: number
  result: Verdict | null
  enter: () => void
  leave: () => void
  progress: (seconds: number, stage: number) => void
  pull: () => void
  newSheet: () => void
}

const freshSheet = (sheet: number) => ({
  phase: 'developing' as Phase,
  sheet,
  sim: createSim(),
  seconds: 0,
  stage: 0,
  result: null,
})

export const useGame = create<GameState>((set, get) => ({
  screen: 'title',
  day: 1,
  ...freshSheet(0),
  enter: () => set({ screen: 'darkroom', ...freshSheet(get().sheet + 1) }),
  leave: () => set({ screen: 'title' }),
  progress: (seconds, stage) => {
    if (seconds !== get().seconds || stage !== get().stage) set({ seconds, stage })
  },
  pull: () => {
    const { sim, phase } = get()
    if (phase !== 'developing') return
    sim.running = false
    set({ phase: 'pulled', result: verdict(sim.developed) })
  },
  newSheet: () => set(freshSheet(get().sheet + 1)),
}))
