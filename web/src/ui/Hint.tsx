import { currentStep } from '../game/day'
import type { Gesture } from '../game/script'
import { script, useGame } from '../game/store'

// A dica do gesto, só no rolo que ensina (a primeira vez de cada um).
export function Hint({ gesture }: { gesture: Gesture }) {
  const text = useGame((s) => {
    const step = currentStep(script(s.day), s.cursor)
    return step.kind === 'roll' && s.cursor.index === 0 ? step.hints?.[gesture] : undefined
  })
  if (!text) return null
  return <p className="tutorial">{text}</p>
}

// Qual foto está na mesa, para o jogador saber onde está no rolo.
export function PhotoCount() {
  const label = useGame((s) => {
    const step = currentStep(script(s.day), s.cursor)
    if (step.kind !== 'roll') return ''
    return `${step.roll.title} · foto ${s.cursor.index + 1} de ${step.roll.photos.length}`
  })
  return label ? <p className="photo-count">{label}</p> : null
}
