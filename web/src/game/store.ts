import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSim, type DevelopSim } from './develop'
import {
  START,
  advance,
  currentPhoto,
  currentStep,
  exposureFactor,
  focusBlur,
  keepPrint,
  printQuality,
  retry,
  rolls,
  validCursor,
  type Cursor,
  type Print,
} from './day'
import type { DayScript, Quality } from './script'
import { DAY1 } from './days/day1'
import { DAY2 } from './days/day2'
import { DAY3 } from './days/day3'
import { DAY4 } from './days/day4'
import { DAY5 } from './days/day5'
import { DAY6 } from './days/day6'
import { DAY7 } from './days/day7'
import { DAY8 } from './days/day8'
import { DAY9 } from './days/day9'
import { DAY10 } from './days/day10'

export const DAYS: Record<number, DayScript> = {
  1: DAY1,
  2: DAY2,
  3: DAY3,
  4: DAY4,
  5: DAY5,
  6: DAY6,
  7: DAY7,
  8: DAY8,
  9: DAY9,
  10: DAY10,
}
export const LAST_DAY = Math.max(...Object.keys(DAYS).map(Number))

export const script = (day: number) => DAYS[day] ?? DAY1

export type Screen = 'title' | 'day' | 'gallery'
export type View = 'room' | 'counter' | 'enlarger' | 'tray' | 'line' | 'wall' | 'burn' | 'tank' | 'choice' | 'end'
export type Phase = 'developing' | 'pulled'

// O que está no ampliador. O foco e os segundos ficam de uma foto para a
// outra, como no aparelho de verdade; exposed diz se esta folha já levou luz.
export type EnlargerState = { focus: number; seconds: number; exposed: boolean }

// A folha na bandeja: de que foto é, quanta luz levou e o quanto borrou.
export type Sheet = { roll: string; photo: string; exposure: number; blur: number }

type GameState = {
  screen: Screen
  day: number
  cursor: Cursor
  prints: Print[]
  // Anotações do jogador, por foto ("rolo/foto").
  notes: Record<string, string>
  // Detalhes que a lupa já achou.
  found: string[]
  // O final escolhido no último dia.
  ending: string | null
  enlarger: EnlargerState
  // A lâmpada do ampliador acesa, enquanto a folha leva luz.
  lamp: boolean
  // Conta as folhas postas na bandeja; trocar de folha zera o papel na cena.
  sheet: number
  sheetPhoto: Sheet | null
  phase: Phase
  // A bandeja muda a cada quadro, fora do React. Só os números da tela
  // (segundos e etapa) passam pelo estado.
  sim: DevelopSim
  seconds: number
  stage: number
  result: Quality | null

  open: () => void
  restart: () => void
  leave: () => void
  showGallery: () => void
  next: () => void
  nextDay: () => void
  choose: (ending: string) => void
  setFocus: (focus: number) => void
  setSeconds: (seconds: number) => void
  expose: () => void
  setLamp: (on: boolean) => void
  progress: (seconds: number, stage: number) => void
  pull: () => void
  retry: () => void
  hang: () => void
  writeNote: (key: string, text: string) => void
  find: (detail: string) => void
}

export const noteKey = (roll: string, photo: string) => `${roll}/${photo}`

const freshEnlarger: EnlargerState = { focus: 0.5, seconds: 8, exposed: false }

const freshSheet = (sheet: number, sheetPhoto: Sheet | null) => ({
  phase: 'developing' as Phase,
  sheet,
  sheetPhoto,
  sim: createSim(),
  seconds: 0,
  stage: 0,
  result: null,
})

// Põe na bandeja a folha que acabou de sair do ampliador.
function sheetFor(state: Pick<GameState, 'day' | 'cursor' | 'enlarger'>): Sheet | null {
  const current = currentPhoto(script(state.day), state.cursor)
  if (!current) return null
  const { roll, photo } = current
  return {
    roll: roll.id,
    photo: photo.id,
    exposure: exposureFactor(state.enlarger.seconds, photo.exposure),
    blur: focusBlur(state.enlarger.focus, photo.focus),
  }
}

// A cópia da foto atual já está no varal?
function hung(s: Pick<GameState, 'day' | 'cursor' | 'prints'>) {
  const current = currentPhoto(script(s.day), s.cursor)
  return !!current && s.prints.some((p) => p.roll === current.roll.id && p.photo === current.photo.id)
}

export function viewOf(state: Pick<GameState, 'screen' | 'day' | 'cursor'> & { ending?: string | null }): View {
  if (state.screen === 'gallery') return 'wall'
  if (state.screen !== 'day') return 'room'
  const step = currentStep(script(state.day), state.cursor)
  switch (step.kind) {
    case 'talk':
    case 'deliver':
      return 'counter'
    case 'roll':
      return state.cursor.gesture
    case 'wall':
      return 'wall'
    case 'burn':
      return 'burn'
    case 'tank':
      return 'tank'
    case 'choice':
      return state.ending ? 'counter' : 'choice'
    case 'end':
      return 'end'
  }
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'title',
      day: 1,
      cursor: START,
      prints: [],
      notes: {},
      found: [],
      ending: null,
      enlarger: freshEnlarger,
      lamp: false,
      ...freshSheet(0, null),

      open: () => {
        const s = get()
        // Voltando no meio de uma revelação, a folha recomeça. Se a cópia
        // estava indo para o varal, ela se perdeu: volta para o ampliador.
        const view = viewOf({ ...s, screen: 'day' })
        const cursor = view === 'line' ? retry(s.cursor) : s.cursor
        set({ screen: 'day', cursor, ...freshSheet(s.sheet + 1, view === 'tray' ? sheetFor(s) : null) })
      },
      restart: () =>
        set((s) => ({
          screen: 'day',
          day: 1,
          cursor: START,
          prints: [],
          notes: {},
          found: [],
          ending: null,
          enlarger: freshEnlarger,
          ...freshSheet(s.sheet + 1, null),
        })),
      leave: () => set({ screen: 'title' }),
      showGallery: () => set({ screen: 'gallery' }),

      next: () => {
        const s = get()
        if (s.screen !== 'day') return
        const from = viewOf(s)
        if (from === 'enlarger' && !s.enlarger.exposed) return
        if (from === 'tray' && s.phase !== 'pulled') return
        if (from === 'line' && !hung(s)) return
        const cursor = advance(script(s.day), s.cursor, s.prints, s.ending)
        const to = viewOf({ ...s, cursor })
        if (to === 'tray') set({ cursor, ...freshSheet(s.sheet + 1, sheetFor(s)) })
        else if (to === 'enlarger') set({ cursor, enlarger: { ...s.enlarger, exposed: false } })
        else set({ cursor })
      },

      // Fim do dia: a loja abre de novo no dia seguinte. As cópias dos outros
      // dias ficam guardadas, para o mural de "Ver as fotos".
      nextDay: () => {
        const s = get()
        if (viewOf(s) !== 'end' || s.day >= LAST_DAY) return
        set({ day: s.day + 1, cursor: START, enlarger: { ...s.enlarger, exposed: false }, ...freshSheet(s.sheet + 1, null) })
      },
      choose: (ending) => {
        const s = get()
        if (viewOf(s) !== 'choice') return
        const step = currentStep(script(s.day), s.cursor)
        if (step.kind === 'choice' && step.options.some((o) => o.id === ending)) set({ ending })
      },

      setFocus: (focus) => set((s) => ({ enlarger: { ...s.enlarger, focus: Math.min(1, Math.max(0, focus)) } })),
      setSeconds: (seconds) => set((s) => ({ enlarger: { ...s.enlarger, seconds: Math.round(seconds) } })),
      expose: () => set((s) => ({ lamp: false, enlarger: { ...s.enlarger, exposed: true } })),
      setLamp: (lamp) => set({ lamp }),

      progress: (seconds, stage) => {
        if (seconds !== get().seconds || stage !== get().stage) set({ seconds, stage })
      },
      pull: () => {
        const { sim, phase, sheetPhoto } = get()
        if (phase !== 'developing') return
        sim.running = false
        const exposure = sheetPhoto?.exposure ?? 1
        const blur = sheetPhoto?.blur ?? 0
        set({ phase: 'pulled', result: printQuality({ developed: sim.developed, exposure, blur }) })
      },
      // Outra folha: volta para o ampliador e acende de novo.
      retry: () =>
        set((s) => ({
          cursor: retry(s.cursor),
          enlarger: { ...s.enlarger, exposed: false },
          ...freshSheet(s.sheet + 1, null),
        })),
      hang: () => {
        const s = get()
        if (viewOf(s) !== 'line' || !s.sheetPhoto) return
        const { roll, photo, exposure, blur } = s.sheetPhoto
        set({ prints: keepPrint(s.prints, { roll, photo, exposure, blur, developed: s.sim.developed }) })
      },

      writeNote: (key, text) => set((s) => ({ notes: { ...s.notes, [key]: text } })),
      find: (detail) => {
        if (!get().found.includes(detail)) set((s) => ({ found: [...s.found, detail] }))
      },
    }),
    {
      name: 'revelacao:game',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ day, cursor, prints, notes, found, ending, enlarger }) => ({
        day,
        cursor,
        prints,
        notes,
        found,
        ending,
        enlarger,
      }),
      merge: (saved, current) => {
        const s = (saved ?? {}) as Partial<GameState>
        const day = s.day && DAYS[s.day] ? s.day : 1
        return {
          ...current,
          ...s,
          day,
          ending: s.ending ?? null,
          cursor: validCursor(script(day), s.cursor),
          enlarger: { ...freshEnlarger, ...s.enlarger, exposed: false },
        }
      },
    },
  ),
)

// Já começou o dia? Na tela de título, o botão vira "Continuar".
export const hasProgress = (s: Pick<GameState, 'day' | 'cursor' | 'prints'>) =>
  s.day > 1 || s.cursor.step > 0 || s.cursor.index > 0 || s.prints.length > 0

// As cópias de um dia (as dos outros dias também ficam guardadas).
export const printsOf = (day: number, prints: Print[]) => {
  const ids = new Set(rolls(script(day)).map((r) => r.id))
  return prints.filter((p) => ids.has(p.roll))
}
