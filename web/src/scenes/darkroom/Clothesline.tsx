import { useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { LINE_Y, LINE_Z } from './layout'

const LINE_HALF = 2.4

// Cópias secando: lugares comuns, sem ninguém. A sala nunca mostra a figura.
type Scene = (ctx: CanvasRenderingContext2D, w: number, h: number) => void

const sky = (ctx: CanvasRenderingContext2D, w: number, h: number, top: number, bottom: number) => {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, `rgb(${top},${top},${top})`)
  g.addColorStop(1, `rgb(${bottom},${bottom},${bottom})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

const SCENES: Scene[] = [
  // Uma fachada com janelas.
  (ctx, w, h) => {
    sky(ctx, w, h, 210, 170)
    ctx.fillStyle = '#5a5a5a'
    ctx.fillRect(w * 0.12, h * 0.25, w * 0.76, h * 0.75)
    ctx.fillStyle = '#2b2b2b'
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) ctx.fillRect(w * (0.2 + c * 0.22), h * (0.32 + r * 0.16), w * 0.12, h * 0.09)
  },
  // Uma rua com árvores.
  (ctx, w, h) => {
    sky(ctx, w, h, 225, 140)
    ctx.fillStyle = '#3a3a3a'
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.arc(w * (0.08 + i * 0.18), h * 0.48, w * 0.12, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#777'
    ctx.fillRect(0, h * 0.6, w, h * 0.4)
  },
  // O mar de Santos, num domingo.
  (ctx, w, h) => {
    sky(ctx, w, h, 235, 200)
    ctx.fillStyle = '#6b6b6b'
    ctx.fillRect(0, h * 0.45, w, h * 0.25)
    ctx.fillStyle = '#b8b8b8'
    ctx.fillRect(0, h * 0.7, w, h * 0.3)
  },
  // Pálida demais: tirada cedo da bandeja.
  (ctx, w, h) => {
    sky(ctx, w, h, 238, 222)
    ctx.fillStyle = 'rgba(120,120,120,0.25)'
    ctx.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.5)
  },
]

function printTexture(scene: Scene) {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 200
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#efeae0'
  ctx.fillRect(0, 0, 160, 200)
  ctx.save()
  ctx.translate(12, 12)
  ctx.filter = 'blur(1.5px)'
  scene(ctx, 136, 176)
  ctx.restore()
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

const PRINTS = [
  { x: -1.35, tilt: 0.03 },
  { x: -0.55, tilt: -0.02 },
  { x: 0.55, tilt: 0.02 },
  { x: 1.3, tilt: -0.04 },
]

function Pin({ x }: { x: number }) {
  return (
    <mesh position={[x, -0.01, 0.006]}>
      <boxGeometry args={[0.012, 0.06, 0.014]} />
      <meshStandardMaterial color="#6b4c33" roughness={0.8} />
    </mesh>
  )
}

// O varal sobre a bancada, onde as cópias secam presas por prendedores.
export function Clothesline() {
  const textures = useMemo(() => SCENES.map(printTexture), [])
  return (
    <group position={[0, LINE_Y, LINE_Z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.003, 0.003, LINE_HALF * 2, 6]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * LINE_HALF, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      {PRINTS.map((p, i) => (
        <group key={p.x} position={[p.x, 0, 0]} rotation={[0, 0, p.tilt]}>
          <mesh position={[0, -0.13, 0]} castShadow>
            <planeGeometry args={[0.2, 0.25]} />
            <meshStandardMaterial map={textures[i]} roughness={0.7} side={2} />
          </mesh>
          <Pin x={-0.07} />
          <Pin x={0.07} />
        </group>
      ))}
    </group>
  )
}
