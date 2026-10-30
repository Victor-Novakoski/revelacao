type Props = { onEnter: () => void; onRestart: () => void; onGallery: () => void; resume: boolean }

export function TitleCard({ onEnter, onRestart, onGallery, resume }: Props) {
  return (
    <section className="title-card" aria-labelledby="title">
      <p className="kicker">Foto Íris · São Paulo, 1957</p>
      <h1 id="title">Revelação</h1>
      <p className="lead">Toda foto guarda o que estava na frente da lente. Algumas guardam mais.</p>
      <div className="actions">
        <button className="enter" onClick={onEnter}>
          {resume ? 'Continuar o dia' : 'Abrir a loja'}
        </button>
        {resume && (
          <button className="ghost" onClick={onRestart}>
            Começar de novo
          </button>
        )}
      </div>
      <button className="link" onClick={onGallery}>
        Ver as fotos sem revelar
      </button>
      <p className="hint">Melhor com fone de ouvido.</p>
    </section>
  )
}
