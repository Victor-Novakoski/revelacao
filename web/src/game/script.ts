// O formato do roteiro de um dia. Os textos ficam em game/days/, um arquivo
// por dia; a lógica que anda pelo roteiro fica em day.ts.

export type Speaker = 'augusto' | 'cida' | 'nakamura' | 'amanda' | 'narrator'

export const SPEAKERS: Record<Speaker, string> = {
  augusto: 'Seu Augusto',
  cida: 'Dona Cida',
  nakamura: 'Seu Nakamura',
  amanda: 'Senhorita Amanda',
  narrator: '',
}

export type Line = {
  who: Speaker
  text: string
  // O sino da porta toca quando a fala aparece.
  bell?: boolean
}

export type Gesture = 'enlarger' | 'tray' | 'line'

// Um detalhe pequeno que só a lupa mostra. x, y e r em fração da foto.
export type Detail = { id: string; x: number; y: number; r: number; text: string }

export type PhotoSpec = {
  id: string
  // Anotação a lápis no verso da cópia.
  verso: string
  // Segundos de luz no ampliador que deixam a cópia no ponto.
  exposure: number
  // Posição do botão de foco em que a imagem fica nítida (0 a 1).
  focus: number
  details?: Detail[]
}

export type Roll = {
  id: string
  customer: Speaker
  film: '35mm' | '120'
  title: string
  photos: PhotoSpec[]
}

export type Quality = 'pale' | 'right' | 'dark' | 'blurry'
export type Mood = 'good' | 'pale' | 'dark' | 'blurry' | 'mixed'

export type Step =
  | { kind: 'talk'; lines: Line[] }
  | { kind: 'roll'; roll: Roll; hints?: Partial<Record<Gesture, string>> }
  | { kind: 'wall'; hint: string }
  // O cliente volta para buscar. A fala depois depende de como as cópias saíram.
  | { kind: 'deliver'; roll: string; before: Line[]; after: Record<Mood, Line[]> }
  | { kind: 'end'; title: string; text: string }

export type DayScript = { day: number; title: string; steps: Step[] }
