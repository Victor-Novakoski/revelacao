import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { Group, PointLight } from 'three'
import { PAPER, TRAY, developStage, stepSim } from '../../game/develop'
import { script, useGame } from '../../game/store'
import { printTone, rolls } from '../../game/day'
import { hasFigure, photoLayers } from '../../photos'
import { figureShows } from '../../game/print'
import { setRadioWarp } from '../../audio/engine'
import { TrayGpu } from './trayGpu'

type Props = { reducedMotion: boolean; active: boolean }

// Nome da lâmpada de segurança na cena; o papel acompanha o brilho dela.
export const SAFELIGHT = 'safelight'

const WALL = 0.03
const WALL_HEIGHT = 0.05

function TrayBody() {
  const outerW = TRAY.width + WALL * 2
  const outerD = TRAY.depth + WALL * 2
  const enamel = <meshStandardMaterial color="#8c857b" roughness={0.45} />
  return (
    <group>
      <mesh position={[0, -0.01, 0]} receiveShadow castShadow>
        <boxGeometry args={[outerW, 0.02, outerD]} />
        {enamel}
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`x${side}`} position={[side * (TRAY.width + WALL) * 0.5, WALL_HEIGHT / 2, 0]} castShadow>
          <boxGeometry args={[WALL, WALL_HEIGHT, outerD]} />
          {enamel}
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={`z${side}`} position={[0, WALL_HEIGHT / 2, side * (TRAY.depth + WALL) * 0.5]} castShadow>
          <boxGeometry args={[TRAY.width, WALL_HEIGHT, WALL]} />
          {enamel}
        </mesh>
      ))}
    </group>
  )
}

// A bandeja do revelador, com o papel e o líquido. O balanço vem do estado
// (TrayControls escreve a inclinação desejada); aqui ele anda e é desenhado.
export function DevelopTray({ reducedMotion, active }: Props) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const tray = useRef<Group>(null)
  const sheetSeen = useRef(-1)
  const gpu = useMemo(() => new TrayGpu(gl), [gl])

  useEffect(() => () => gpu.dispose(), [gpu])

  useFrame((_, delta) => {
    const game = useGame.getState()
    const { sim } = game

    if (game.sheet !== sheetSeen.current) {
      sheetSeen.current = game.sheet
      gpu.clear(gl)
      // A foto da folha nova, com a luz e o foco do ampliador.
      const sheet = game.sheetPhoto
      const roll = sheet && rolls(script(game.day)).find((r) => r.id === sheet.roll)
      if (sheet && roll) {
        const key = `${sheet.roll}/${sheet.photo}`
        const layers = photoLayers(key, roll.film)
        gpu.setSheet({ key, photo: layers.scene, figure: layers.figure, exposure: sheet.exposure, blur: sheet.blur })
      } else gpu.setSheet(null)
    }

    if (active) {
      stepSim(sim, delta)
      const exposure = game.sheetPhoto?.exposure ?? 1
      game.progress(Math.floor(sim.elapsed), developStage(printTone(sim.developed, exposure)))
    }

    // O rádio desafina enquanto a figura surge no papel, e volta ao normal
    // quando a folha sai da bandeja.
    const sheet = game.sheetPhoto
    const haunted = active && game.phase === 'developing' && !!sheet && hasFigure(`${sheet.roll}/${sheet.photo}`)
    setRadioWarp(haunted ? Math.min(1, figureShows(sim.developed) * 1.4) : 0, haunted ? 4 : 8)

    if (tray.current) {
      tray.current.rotation.z = -sim.tilt.x
      tray.current.rotation.x = sim.tilt.y
    }

    const lamp = scene.getObjectByName(SAFELIGHT) as PointLight | undefined
    gpu.frame(gl, { sim, delta, active, reducedMotion, light: lamp ? lamp.intensity / 6 : 1 })
  })

  return (
    <group ref={tray} position={[0, 0.95, 0.05]}>
      <TrayBody />
      <mesh geometry={gpu.paperGeometry} material={gpu.paper} position={[0, PAPER.height, 0]} />
      <mesh geometry={gpu.liquidGeometry} material={gpu.liquid} renderOrder={1} />
    </group>
  )
}
