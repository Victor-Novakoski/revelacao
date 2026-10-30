import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { rolls } from '../game/day'
import type { Detail, PhotoSpec, Roll } from '../game/script'
import { LAST_DAY, noteKey, script, useGame } from '../game/store'
import { FIGURE_VISIBLE, figureShows } from '../game/print'
import { PRINT, printCanvas, type PrintLook } from '../photos'
import { hushLamp } from '../audio/engine'
import { PrintView } from './PrintView'

type Entry = { key: string; roll: Roll; photo: PhotoSpec; look: PrintLook }

// Para "Ver as fotos sem revelar": cada cópia revelada até o fim, com a
// luz ajustada para não passar do ponto. Assim aparece tudo o que há nela.
const FULL: PrintLook = { developed: 1.35, exposure: 0.85, blur: 0 }

const ZOOM = 2.6
const LENS = 168

function useEntries(gallery: boolean, galleryDay: number): Entry[] {
  const current = useGame((s) => s.day)
  const day = gallery ? galleryDay : current
  const prints = useGame((s) => s.prints)
  return useMemo(
    () =>
      rolls(script(day)).flatMap((roll) =>
        roll.photos.flatMap((photo) => {
          const key = noteKey(roll.id, photo.id)
          if (gallery) return [{ key, roll, photo, look: FULL }]
          const p = prints.find((x) => x.roll === roll.id && x.photo === photo.id)
          return p ? [{ key, roll, photo, look: p }] : []
        }),
      ),
    [day, prints, gallery],
  )
}

const hit = (d: Detail, u: number, v: number) => Math.hypot((u - d.x) * (PRINT.width / PRINT.height), v - d.y) < d.r

// A lupa: um círculo que amplia a cópia onde passa. Com o dedo, ela fica
// um pouco acima, para o dedo não tapar.
function Loupe({ entry, source }: { entry: Entry; source: HTMLCanvasElement }) {
  const box = useRef<HTMLDivElement>(null)
  const lens = useRef<HTMLCanvasElement>(null)
  const [pos, setPos] = useState<{ u: number; v: number } | null>(null)
  const [seen, setSeen] = useState<string | null>(null)
  const find = useGame((s) => s.find)

  const move = (u: number, v: number) => {
    const at = { u: Math.min(1, Math.max(0, u)), v: Math.min(1, Math.max(0, v)) }
    setPos(at)
    // A figura só se acha numa cópia que ficou tempo no revelador.
    const shows = figureShows(entry.look.developed) >= FIGURE_VISIBLE
    const detail = entry.photo.details?.find((d) => (!d.figure || shows) && hit(d, at.u, at.v))
    if (detail) {
      // O zumbido da lâmpada some quando a lupa passa sobre ela.
      if (detail.figure && seen !== detail.text) hushLamp(1)
      setSeen(detail.text)
      find(detail.id)
    }
  }

  useEffect(() => {
    const canvas = lens.current
    const el = box.current
    if (!pos || !canvas || !el) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = LENS * dpr
    canvas.height = LENS * dpr
    const scale = el.clientWidth / PRINT.width
    const size = LENS / (scale * ZOOM)
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#efeae0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      source,
      pos.u * PRINT.width - size / 2,
      pos.v * PRINT.height - size / 2,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }, [pos, source])

  const place = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const y = e.pointerType === 'mouse' ? e.clientY : e.clientY - LENS * 0.7
    move((e.clientX - r.left) / r.width, (y - r.top) / r.height)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.03
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const m = moves[e.key]
    if (!m) return
    e.preventDefault()
    move((pos?.u ?? 0.5) + m[0], (pos?.v ?? 0.5) + m[1])
  }

  return (
    <>
      <div
        ref={box}
        className="loupe-area"
        tabIndex={0}
        role="application"
        aria-label="Cópia ampliada. Passe a lupa com o mouse, o dedo ou as setas."
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          place(e)
        }}
        onPointerMove={(e) => (e.pointerType === 'mouse' || e.buttons ? place(e) : undefined)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setPos(null)}
        onFocus={() => pos ?? move(0.5, 0.5)}
        onBlur={() => setPos(null)}
        onKeyDown={onKey}
      >
        <PrintView source={source} className="big-print" aria-hidden="true" />
        {pos && (
          <canvas
            ref={lens}
            className="lens"
            aria-hidden="true"
            style={{ left: `${pos.u * 100}%`, top: `${pos.v * 100}%`, width: LENS, height: LENS }}
          />
        )}
      </div>
      <p className="found" aria-live="polite">
        {seen ?? ' '}
      </p>
    </>
  )
}

function Verso({ entry }: { entry: Entry }) {
  const note = useGame((s) => s.notes[entry.key] ?? '')
  const found = useGame((s) => s.found)
  const writeNote = useGame((s) => s.writeNote)
  const details = (entry.photo.details ?? []).filter((d) => found.includes(d.id))
  return (
    <div className="verso">
      <p className="pencil">{entry.photo.verso}</p>
      {details.length > 0 && (
        <ul className="found-list" aria-label="Achados com a lupa">
          {details.map((d) => (
            <li key={d.id}>{d.text}</li>
          ))}
        </ul>
      )}
      <label className="note">
        <span>Suas anotações</span>
        <textarea
          value={note}
          maxLength={400}
          rows={3}
          placeholder="O que você reparou nesta foto?"
          onChange={(e) => writeNote(entry.key, e.target.value)}
        />
      </label>
    </div>
  )
}

type Props = { gallery: boolean; hint?: string; onDone: () => void; doneLabel: string }

// O mural: as cópias do dia, secas, presas na parede. Abrir uma mostra de
// perto, com a lupa; virar mostra o verso e as anotações.
export function Wall({ gallery, hint, onDone, doneLabel }: Props) {
  const [galleryDay, setGalleryDay] = useState(1)
  const entries = useEntries(gallery, galleryDay)
  const [open, setOpen] = useState<number | null>(null)
  const [back, setBack] = useState(false)
  const entry = open === null ? null : entries[open]
  const sources = useMemo(
    () => entries.map((e) => printCanvas(e.key, e.roll.film, e.look)),
    [entries],
  )

  const go = (i: number) => {
    setOpen((i + entries.length) % entries.length)
    setBack(false)
  }

  if (entry && open !== null) {
    return (
      <section className="wall open" aria-label={`${entry.roll.title}, foto ${open + 1}`}>
        <p className="photo-count">
          {entry.roll.title} · foto {open + 1} de {entries.length}
        </p>
        <div className="sheet">{back ? <Verso entry={entry} /> : <Loupe key={entry.key} entry={entry} source={sources[open]} />}</div>
        <div className="actions">
          <button className="ghost" onClick={() => go(open - 1)} aria-label="Foto anterior">
            ‹
          </button>
          <button className="enter" onClick={() => setBack((b) => !b)}>
            {back ? 'Ver a frente' : 'Virar a foto'}
          </button>
          <button className="ghost" onClick={() => go(open + 1)} aria-label="Próxima foto">
            ›
          </button>
          <button className="ghost" onClick={() => setOpen(null)}>
            Voltar ao mural
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="wall" aria-label="Mural de fotos">
      <h2>{gallery ? 'As fotos' : 'O mural'}</h2>
      {hint && <p className="tutorial">{hint}</p>}
      {gallery && (
        <nav className="days" aria-label="Escolha o dia">
          {Array.from({ length: LAST_DAY }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              className={d === galleryDay ? 'enter' : 'ghost'}
              aria-pressed={d === galleryDay}
              onClick={() => setGalleryDay(d)}
            >
              Dia {d}
            </button>
          ))}
        </nav>
      )}
      {gallery && <p className="gallery-day">{script(galleryDay).title}</p>}
      <ul className="grid">
        {entries.map((e, i) => (
          <li key={e.key}>
            <button className="thumb" onClick={() => go(i)} aria-label={`Abrir: ${e.photo.verso}`}>
              <PrintView source={sources[i]} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button className="enter" onClick={onDone}>
          {doneLabel}
        </button>
      </div>
    </section>
  )
}
