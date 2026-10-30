import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { currentStep, reel } from '../game/day'
import { script, useGame } from '../game/store'
import { playCue, reelTick, setDark } from '../audio/engine'
import type { TankAction } from '../game/script'

// Um dente da espiral a cada tanto de botão apertado.
const TICK = 0.22

// O tanque, no escuro total: a luz vermelha apagada, nada da sala na tela.
// Só o texto, o som das mãos e, no celular, uma vibração curta a cada dente.
export function TankPanel() {
  const index = useGame((s) => s.cursor.index)
  const action = useGame((s) => {
    const step = currentStep(script(s.day), s.cursor)
    return step.kind === 'tank' ? step.actions[s.cursor.index] : undefined
  })

  useEffect(() => {
    setDark(true)
    return () => setDark(false)
  }, [])

  if (!action) return null
  // Cada gesto começa do zero: a chave troca o componente inteiro.
  return <Gesture key={index} action={action} />
}

function Gesture({ action }: { action: TankAction }) {
  const next = useGame((s) => s.next)
  const button = useRef<HTMLButtonElement>(null)
  const [wound, setWound] = useState(0)
  const [holding, setHolding] = useState(false)

  useEffect(() => {
    if (action.cue) playCue(action.cue)
    button.current?.focus()
  }, [action])

  const hold = action.hold ?? 0

  useEffect(() => {
    if (!holding || hold <= 0) return
    let frame = 0
    let last = performance.now()
    let sinceTick = TICK
    const step = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      sinceTick += dt
      if (sinceTick >= TICK) {
        sinceTick = 0
        reelTick()
        navigator.vibrate?.(8)
      }
      setWound((w) => reel(w, dt, hold))
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [holding, hold])

  useEffect(() => {
    if (hold > 0 && wound >= 1) next()
  }, [wound, hold, next])

  const press = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (!e.repeat) setHolding(true)
  }
  const release = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    setHolding(false)
  }

  return (
    <section className="tank" aria-label="O tanque, no escuro">
      <div className="dialog narration">
        <p className="line" aria-live="polite">
          {action.text}
        </p>
        {hold > 0 ? (
          <>
            <div
              className="reel"
              role="progressbar"
              aria-label="Filme na espiral"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(wound * 100)}
            >
              <span style={{ width: `${wound * 100}%` }} />
            </div>
            <button
              ref={button}
              className={`enter hold ${holding ? 'held' : ''}`}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                setHolding(true)
              }}
              onPointerUp={() => setHolding(false)}
              onPointerCancel={() => setHolding(false)}
              onKeyDown={press}
              onKeyUp={release}
              onBlur={() => setHolding(false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {action.label}
            </button>
          </>
        ) : (
          <button ref={button} className="enter" onClick={next}>
            {action.label}
          </button>
        )}
      </div>
    </section>
  )
}
