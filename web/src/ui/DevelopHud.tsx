import type { Quality } from '../game/script'
import { useGame } from '../game/store'
import { Hint, PhotoCount } from './Hint'

const STAGES = [
  'O papel ainda está branco.',
  'Surgem as primeiras sombras.',
  'A imagem vai aparecendo.',
  'A foto está no ponto.',
  'A foto está passando do ponto.',
]

const VERDICTS: Record<Quality, string> = {
  pale: 'Saiu pálida. Faltou tempo no revelador.',
  right: 'Saiu no ponto.',
  dark: 'Passou do ponto. Saiu escura.',
  blurry: 'Saiu borrada. O foco do ampliador não estava certo.',
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function DevelopHud() {
  const phase = useGame((s) => s.phase)
  const seconds = useGame((s) => s.seconds)
  const stage = useGame((s) => s.stage)
  const result = useGame((s) => s.result)
  const { pull, next, retry } = useGame.getState()

  return (
    <>
      <header className="develop-top">
        <PhotoCount />
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
            <Hint gesture="tray" />
            <p className="hint">Arraste para balançar a bandeja.</p>
            <button className="enter" onClick={pull}>
              Tirar da bandeja
            </button>
          </>
        ) : (
          <>
            <p className="hint">Interruptor, fixador e água corrente. Agora é secar.</p>
            <button className="enter" onClick={next}>
              Levar ao varal
            </button>
            <button className="ghost" onClick={retry}>
              Outra folha
            </button>
          </>
        )}
      </div>
    </>
  )
}
