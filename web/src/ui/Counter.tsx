import { useEffect, useRef } from 'react'
import { currentStep, stepLines } from '../game/day'
import { SPEAKERS } from '../game/script'
import { script, useGame } from '../game/store'
import { ringBell } from '../audio/engine'

// O balcão da loja: as falas, uma de cada vez.
export function Counter() {
  const day = useGame((s) => s.day)
  const cursor = useGame((s) => s.cursor)
  const prints = useGame((s) => s.prints)
  const next = useGame((s) => s.next)
  const button = useRef<HTMLButtonElement>(null)

  const plan = script(day)
  const lines = stepLines(plan, currentStep(plan, cursor), prints)
  const line = lines[Math.min(cursor.index, lines.length - 1)]

  useEffect(() => {
    if (line?.bell) ringBell()
  }, [line])
  useEffect(() => button.current?.focus(), [])

  if (!line) return null
  const name = SPEAKERS[line.who]
  return (
    <section className="counter" aria-label="Balcão da loja">
      <div className={`dialog ${line.who === 'narrator' ? 'narration' : ''}`}>
        {name && <p className="speaker">{name}</p>}
        <p className="line" aria-live="polite">
          {line.text}
        </p>
        <button ref={button} className="enter" onClick={next}>
          Continuar
        </button>
      </div>
    </section>
  )
}
