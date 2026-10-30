import type { Verdict } from '../game/develop'
import { useGame } from '../game/store'

const STAGES = [
  'O papel ainda está branco.',
  'Surgem as primeiras sombras.',
  'A praça vai aparecendo.',
  'A foto está no ponto.',
  'A foto está passando do ponto.',
]

const VERDICTS: Record<Verdict, string> = {
  pale: 'Saiu pálida. Faltou tempo no revelador.',
  right: 'Saiu no ponto.',
  dark: 'Passou do ponto. Saiu escura.',
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

type Props = { onLeave: () => void }

export function DevelopHud({ onLeave }: Props) {
  const phase = useGame((s) => s.phase)
  const seconds = useGame((s) => s.seconds)
  const stage = useGame((s) => s.stage)
  const result = useGame((s) => s.result)
  const pull = useGame((s) => s.pull)
  const newSheet = useGame((s) => s.newSheet)

  return (
    <>
      <header className="develop-top">
        <p className="timer" aria-label={`${seconds} segundos no revelador`}>
          {clock(seconds)}
        </p>
        <p className="stage-line" aria-live="polite">
          {phase === 'pulled' && result ? VERDICTS[result] : STAGES[stage]}
        </p>
      </header>
      <div className="hud">
        {phase === 'developing' ? (
          <>
            <p className="hint">Arraste para balançar a bandeja.</p>
            <button className="enter" onClick={pull}>
              Tirar da bandeja
            </button>
          </>
        ) : (
          <button className="enter" onClick={newSheet}>
            Outra folha
          </button>
        )}
        <button className="ghost" onClick={onLeave}>
          Voltar
        </button>
      </div>
    </>
  )
}
