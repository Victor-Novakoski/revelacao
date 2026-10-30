import { useSettings } from '../game/settings'

// Sempre na tela, em qualquer momento do jogo.
export function SoundControls() {
  const muted = useSettings((s) => s.muted)
  const captions = useSettings((s) => s.captions)
  const toggleMuted = useSettings((s) => s.toggleMuted)
  const toggleCaptions = useSettings((s) => s.toggleCaptions)

  return (
    <div className="sound-controls">
      <button
        className="icon"
        onClick={toggleCaptions}
        aria-pressed={captions}
        aria-label="Legendas"
        title={captions ? 'Esconder legendas' : 'Mostrar legendas'}
      >
        <span aria-hidden="true" className={captions ? '' : 'off'}>
          CC
        </span>
      </button>
      <button
        className="icon"
        onClick={toggleMuted}
        aria-pressed={muted}
        aria-label="Sem som"
        title={muted ? 'Ligar o som' : 'Tirar o som'}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          {muted ? (
            <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path
              d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
      </button>
    </div>
  )
}
