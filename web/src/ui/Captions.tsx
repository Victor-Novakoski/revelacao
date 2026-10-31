import { useCaptions } from '../audio/captions'
import { useSettings } from '../game/settings'

// Legendas dos sons. Aparecem mesmo no mudo: quem joga sem som também
// precisa saber que o rádio está tocando.
export function Captions() {
  const lines = useCaptions((s) => s.lines)
  const show = useSettings((s) => s.captions)
  return (
    <div className="captions" aria-live="polite" hidden={!show}>
      {lines.map((l) => (
        <p key={l.id}>{l.text}</p>
      ))}
    </div>
  )
}
