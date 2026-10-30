type Props = { onEnter: () => void }

export function TitleCard({ onEnter }: Props) {
  return (
    <section className="title-card" aria-labelledby="title">
      <p className="kicker">Foto Íris · São Paulo, 1957</p>
      <h1 id="title">Revelação</h1>
      <p className="lead">Toda foto guarda o que estava na frente da lente. Algumas guardam mais.</p>
      <button className="enter" onClick={onEnter}>
        Abrir a loja
      </button>
      <p className="hint">Melhor com fone de ouvido.</p>
    </section>
  )
}
