import { useEffect, useRef, useState } from 'react'
import { currentPhoto, EXPOSURE_RANGE, focusBlur } from '../game/day'
import { script, useGame } from '../game/store'
import { negativeCanvas } from '../photos'
import { Hint, PhotoCount } from './Hint'
import { PrintView } from './PrintView'

// O ampliador: o negativo projetado no marginador, o foco e o tempo de luz.
export function EnlargerPanel() {
  const day = useGame((s) => s.day)
  const cursor = useGame((s) => s.cursor)
  const { focus, seconds, exposed } = useGame((s) => s.enlarger)
  const { setFocus, setSeconds, expose, setLamp, next, retry } = useGame.getState()
  const [left, setLeft] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const current = currentPhoto(script(day), cursor)

  // Sair no meio da exposição apaga a lâmpada; a folha não conta.
  useEffect(
    () => () => {
      window.clearInterval(timer.current)
      useGame.getState().setLamp(false)
    },
    [],
  )

  if (!current) return null
  const { roll, photo } = current
  const blur = focusBlur(focus, photo.focus)
  const exposing = left !== null

  const light = () => {
    const end = performance.now() + seconds * 1000
    setLamp(true)
    setLeft(seconds)
    timer.current = window.setInterval(() => {
      const rest = Math.max(0, (end - performance.now()) / 1000)
      if (rest > 0) return setLeft(Math.ceil(rest))
      window.clearInterval(timer.current)
      setLeft(null)
      expose()
    }, 100)
  }

  return (
    <section className="panel enlarger-panel" aria-label="Ampliador">
      <PhotoCount />
      <PrintView
        source={negativeCanvas(`${roll.id}/${photo.id}`, roll.film)}
        className={`projection ${exposing ? 'lit' : ''}`}
        style={{ filter: `blur(${(blur * 8).toFixed(1)}px)` }}
        role="img"
        aria-label={blur < 0.08 ? 'O negativo projetado, nítido' : 'O negativo projetado, fora de foco'}
      />
      <Hint gesture="enlarger" />
      <label className="control">
        <span>Foco</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={focus}
          disabled={exposing || exposed}
          onChange={(e) => setFocus(Number(e.target.value))}
        />
      </label>
      <label className="control">
        <span>
          Tempo de luz: <strong>{seconds} s</strong>
        </span>
        <input
          type="range"
          min={EXPOSURE_RANGE.min}
          max={EXPOSURE_RANGE.max}
          step={1}
          value={seconds}
          disabled={exposing || exposed}
          onChange={(e) => setSeconds(Number(e.target.value))}
        />
      </label>
      <div className="actions">
        {exposed ? (
          <>
            <button className="enter" onClick={next}>
              Levar para a bandeja
            </button>
            <button className="ghost" onClick={retry}>
              Outra folha
            </button>
          </>
        ) : (
          <button className="enter" onClick={light} disabled={exposing} aria-live="polite">
            {exposing ? `Luz acesa… ${left} s` : `Acender o ampliador (${seconds} s)`}
          </button>
        )}
      </div>
    </section>
  )
}
