import { currentStep } from '../game/day'
import { script, useGame } from '../game/store'

// A última foto, na mão. Sem resposta certa.
export function ChoiceCard() {
  const step = useGame((s) => currentStep(script(s.day), s.cursor))
  const choose = useGame((s) => s.choose)
  if (step.kind !== 'choice') return null
  return (
    <section className="title-card choice-card" aria-labelledby="choice-title">
      <p className="kicker">A última foto</p>
      <h2 id="choice-title">{step.prompt}</h2>
      <div className="actions column">
        {step.options.map((o, i) => (
          <button key={o.id} className={i === 0 ? 'enter' : 'ghost'} onClick={() => choose(o.id)} autoFocus={i === 0}>
            {o.label}
          </button>
        ))}
      </div>
    </section>
  )
}
