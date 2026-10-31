// A valsa da Rádio Garoa: o começo da Gymnopédie nº 1, de Erik Satie (1888,
// domínio público), em 3/4. Arranjo curto e livre, tocado pelo próprio jogo.

export type Note = { bar: number; beat: number; notes: string[]; beats: number }

export const BARS = 12
export const BEATS_PER_BAR = 3

const G = ['B3', 'D4', 'F#4']
const D = ['A3', 'C#4', 'F#4']

// Mão esquerda: baixo no tempo 1, acorde nos tempos 2 e 3, alternando
// sol e ré com sétima maior, como no original.
const left: Note[] = Array.from({ length: BARS }, (_, bar) => {
  const even = bar % 2 === 0
  return [
    { bar, beat: 0, notes: [even ? 'G2' : 'D2'], beats: 3 },
    { bar, beat: 1, notes: even ? G : D, beats: 2 },
  ]
}).flat()

// Melodia: entra depois de quatro compassos de introdução.
const melody: Note[] = [
  { bar: 4, beat: 1, notes: ['F#5'], beats: 1 },
  { bar: 4, beat: 2, notes: ['A5'], beats: 1 },
  { bar: 5, beat: 0, notes: ['G5'], beats: 1 },
  { bar: 5, beat: 1, notes: ['F#5'], beats: 1 },
  { bar: 5, beat: 2, notes: ['C#5'], beats: 1 },
  { bar: 6, beat: 0, notes: ['B4'], beats: 1 },
  { bar: 6, beat: 1, notes: ['C#5'], beats: 1 },
  { bar: 6, beat: 2, notes: ['D5'], beats: 1 },
  { bar: 7, beat: 0, notes: ['A4'], beats: 3 },
  { bar: 8, beat: 0, notes: ['F#4'], beats: 9 },
]

export const WALTZ: Note[] = [...left, ...melody]

// Tempo no formato do Tone.js: "compasso:tempo:semicolcheia".
export const at = (bar: number, beat: number) => `${bar}:${beat}:0`
export const length = (beats: number) => `0:${beats}:0`

// No último dia a valsa volta com uma nota errada: a nota longa do sétimo
// compasso desce meio tom e briga com o acorde.
export const WRONG_BAR = 7

export function played(n: Note, wrong: boolean): string[] {
  if (!wrong || n.bar !== WRONG_BAR || n.notes[0] !== 'A4') return n.notes
  return ['G#4']
}
