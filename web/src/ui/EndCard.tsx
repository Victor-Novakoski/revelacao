import { currentStep } from '../game/day'
import { script, useGame } from '../game/store'

type Props = { onWall: () => void; onTitle: () => void }

// O fim do dia.
export function EndCard({ onWall, onTitle }: Props) {
  const step = useGame((s) => currentStep(script(s.day), s.cursor))
  if (step.kind !== 'end') return null
  return (
    <section className="title-card end-card" aria-labelledby="end-title">
      <p className="kicker">Foto Íris</p>
      <h2 id="end-title">{step.title}</h2>
      <p className="lead">{step.text}</p>
      <div className="actions">
        <button className="enter" onClick={onWall}>
          Ver as fotos do dia
        </button>
        <button className="ghost" onClick={onTitle}>
          Voltar ao título
        </button>
      </div>
      <p className="hint">Os outros dias chegam nas próximas versões.</p>
    </section>
  )
}
