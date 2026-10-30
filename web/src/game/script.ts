// O formato do roteiro de um dia. Os textos ficam em game/days/, um arquivo
// por dia; a lógica que anda pelo roteiro fica em day.ts.

export type Speaker =
  | 'augusto'
  | 'cida'
  | 'nakamura'
  | 'amanda'
  | 'elias'
  | 'moura'
  | 'marlene'
  | 'menino'
  | 'radio'
  | 'narrator'

export const SPEAKERS: Record<Speaker, string> = {
  augusto: 'Seu Augusto',
  cida: 'Dona Cida',
  nakamura: 'Seu Nakamura',
  amanda: 'Senhorita Amanda',
  elias: 'Elias',
  moura: 'Inspetor Moura',
  marlene: 'Marlene',
  menino: 'Um menino',
  radio: 'Rádio Garoa',
  narrator: '',
}

// Um som que acompanha a fala, sempre com legenda.
export type Cue = 'phone' | 'line' | 'creak' | 'match' | 'silence'

export type Line = {
  who: Speaker
  text: string
  // O sino da porta toca quando a fala aparece.
  bell?: boolean
  cue?: Cue
}

export type Gesture = 'enlarger' | 'tray' | 'line'

// Um detalhe pequeno que só a lupa mostra. x, y e r em fração da foto.
// figure: o detalhe é a criatura, e a lupa só a acha numa cópia que ficou
// tempo bastante no revelador.
export type Detail = { id: string; x: number; y: number; r: number; text: string; figure?: boolean }

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
  // Uma sequência de gestos com o rolo, um botão de cada vez (o rolo queimado).
  | { kind: 'burn'; actions: BurnAction[] }
  // A escolha do fim. Depois de escolher, as falas do final escolhido.
  | { kind: 'choice'; prompt: string; options: Ending[] }
  | { kind: 'end'; title: string; text: string }

// Um gesto com o rolo: o texto do momento e o botão que leva ao próximo.
// fire: o rolo já está queimando.
export type BurnAction = { text: string; label: string; cue?: Cue; fire?: boolean }

// Como o final aparece na tela: fogo, o branco que estoura ou a porta da loja.
export type EndingLook = 'fire' | 'white' | 'door'

export type Ending = { id: string; label: string; lines: Line[]; title: string; text: string; look: EndingLook }

export type DayScript = { day: number; title: string; steps: Step[] }
