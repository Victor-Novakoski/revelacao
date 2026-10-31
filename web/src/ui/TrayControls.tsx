import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { MAX_TILT, dragTilt } from '../game/develop'
import { useGame } from '../game/store'

const KEYS: Record<string, ['x' | 'y', number]> = {
  ArrowLeft: ['x', -1],
  ArrowRight: ['x', 1],
  ArrowUp: ['y', -1],
  ArrowDown: ['y', 1],
}

// Arrastar (mouse ou dedo) inclina a bandeja; soltar deixa ela voltar.
// Pelo teclado, as setas fazem o mesmo.
export function TrayControls() {
  const start = useRef<{ x: number; y: number; id: number } | null>(null)

  const target = () => useGame.getState().sim.tiltTarget
  const release = () => {
    start.current = null
    target().x = 0
    target().y = 0
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return
    const tilt = dragTilt(e.clientX - start.current.x, e.clientY - start.current.y, {
      width: window.innerWidth,
      height: window.innerHeight,
    })
    target().x = tilt.x
    target().y = tilt.y
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>, down: boolean) => {
    const key = KEYS[e.key]
    if (!key) return
    e.preventDefault()
    const [axis, sign] = key
    target()[axis] = down ? sign * MAX_TILT : 0
  }

  return (
    <div
      className="tray-controls"
      role="application"
      aria-label="Bandeja do revelador. Use as setas para balançar."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onKeyDown={(e) => onKey(e, true)}
      onKeyUp={(e) => onKey(e, false)}
      onBlur={release}
    />
  )
}
