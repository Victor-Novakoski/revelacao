import { useEffect, useRef } from 'react'
import { currentStep } from '../game/day'
import { script, useGame } from '../game/store'
import { playCue } from '../audio/engine'

// O rolo que voltou: um gesto de cada vez, até o fogo.
export function BurnPanel() {
  const action = useGame((s) => {
    const step = currentStep(script(s.day), s.cursor)
    return step.kind === 'burn' ? step.actions[s.cursor.index] : undefined
  })
  const next = useGame((s) => s.next)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (action?.cue) playCue(action.cue)
    button.current?.focus()
  }, [action])

  if (!action) return null
  return (
    <section className={`burn ${action.fire ? 'fire' : ''}`} aria-label="O rolo">
      {action.fire && <div className="glow" aria-hidden="true" />}
      <div className="dialog narration">
        <p className="line" aria-live="polite">
          {action.text}
        </p>
        <button ref={button} className="enter" onClick={next}>
          {action.label}
        </button>
      </div>
    </section>
  )
}
