import { useRef, useState, type PointerEvent } from 'react'
import { useGame, script } from '../game/store'
import { currentStep, rolls } from '../game/day'
import { printCanvas } from '../photos'
import { Hint, PhotoCount } from './Hint'
import { PrintView } from './PrintView'

// Arrastar para cima até ali pendura a cópia.
const HANG_AT = 0.35

// O varal: a cópia molhada sobe até o fio e fica presa no prendedor.
export function LinePanel() {
  const sheet = useGame((s) => s.sheetPhoto)
  const day = useGame((s) => s.day)
  const developed = useGame((s) => s.sim.developed)
  const hang = useGame((s) => s.hang)
  const next = useGame((s) => s.next)
  const done = useGame((s) => s.prints.some((p) => p.roll === s.sheetPhoto?.roll && p.photo === s.sheetPhoto?.photo))
  const last = useGame((s) => {
    const step = currentStep(script(s.day), s.cursor)
    return step.kind === 'roll' && s.cursor.index === step.roll.photos.length - 1
  })
  const [lift, setLift] = useState(0)
  const start = useRef<{ y: number; id: number } | null>(null)

  const roll = sheet && rolls(script(day)).find((r) => r.id === sheet.roll)
  if (!sheet || !roll) return null
  const source = printCanvas(`${sheet.roll}/${sheet.photo}`, roll.film, { ...sheet, developed })

  if (done) {
    return (
      <section className="line-panel" aria-label="Varal">
        <header className="develop-top">
          <PhotoCount />
        </header>
        <div className="hud">
          <p className="hint">A cópia está secando no varal.</p>
          <button className="enter" onClick={next} autoFocus>
            {last ? 'Próximo trabalho' : 'Próxima foto'}
          </button>
        </div>
      </section>
    )
  }

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { y: e.clientY, id: e.pointerId }
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return
    setLift(Math.max(0, (start.current.y - e.clientY) / window.innerHeight))
  }
  const onUp = () => {
    start.current = null
    if (lift >= HANG_AT) hang()
    else setLift(0)
  }

  return (
    <section className="line-panel" aria-label="Varal">
      <header className="develop-top">
        <PhotoCount />
        <Hint gesture="line" />
      </header>
      <div
        className="wet-print"
        style={{ transform: `translateY(${-lift * 100}vh)`, opacity: 1 - Math.max(0, lift - HANG_AT) * 2 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <PrintView source={source} role="img" aria-label="A cópia molhada" />
      </div>
      <div className="hud">
        <p className="hint">Arraste a cópia para cima, até o varal.</p>
        <button className="enter" onClick={hang}>
          Pendurar no varal
        </button>
      </div>
    </section>
  )
}
