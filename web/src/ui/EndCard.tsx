import { currentStep, endingOf } from '../game/day'
import { LAST_DAY, script, useGame } from '../game/store'

type Props = { onWall: () => void; onTitle: () => void; onNext: () => void; onRestart: () => void }

// O fim do dia, ou o fim do jogo com o final escolhido.
export function EndCard({ onWall, onTitle, onNext, onRestart }: Props) {
  const day = useGame((s) => s.day)
  const step = useGame((s) => currentStep(script(s.day), s.cursor))
  const ending = useGame((s) => endingOf(script(s.day), s.ending))
  if (step.kind !== 'end') return null
  const title = ending?.title ?? step.title
  const text = ending?.text ?? step.text
  const more = !ending && day < LAST_DAY
  return (
    <>
      {ending && <div className={`ending-look ${ending.look}`} aria-hidden="true" />}
      <section className={`title-card end-card ${ending ? `ending ${ending.look}` : ''}`} aria-labelledby="end-title">
        <p className="kicker">{ending ? 'Fim' : 'Foto Íris'}</p>
        <h2 id="end-title">{title}</h2>
        <p className="lead">{text}</p>
        <div className="actions">
          {more && (
            <button className="enter" onClick={onNext} autoFocus>
              Abrir a loja: {script(day + 1).title.toLowerCase()}
            </button>
          )}
          {ending && (
            <button className="enter" onClick={onRestart} autoFocus>
              {ending.look === 'fire' ? 'Abrir a loja de novo' : 'Começar de novo'}
            </button>
          )}
          <button className="ghost" onClick={onWall}>
            Ver as fotos do dia
          </button>
          <button className="ghost" onClick={onTitle}>
            Voltar ao título
          </button>
        </div>
      </section>
    </>
  )
}
