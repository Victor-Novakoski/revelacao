import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing'
import { Vector3, type PerspectiveCamera, type PointLight } from 'three'
import { DevelopTray, SAFELIGHT } from './DevelopTray'
import { ListenerSync } from './ListenerSync'
import { Bench } from './Bench'
import { Enlarger } from './Enlarger'
import { Clothesline } from './Clothesline'
import { Walls } from './Walls'
import { ENLARGER, LAMP, LINE_Y, LINE_Z } from './layout'
import type { View } from '../../game/store'

type Props = { reducedMotion: boolean; view: View }

const RED = '#ff2a1a'

// Lâmpada de segurança: um zumbido visual, nunca um pisca-pisca agressivo.
function SafeLight({ reducedMotion }: { reducedMotion: boolean }) {
  const light = useRef<PointLight>(null)
  useFrame(({ clock }) => {
    if (!light.current || reducedMotion) return
    const t = clock.getElapsedTime()
    const hum = Math.sin(t * 2.1) * 0.06 + Math.sin(t * 13.7) * 0.03
    const dip = Math.sin(t * 0.37) > 0.995 ? 0.55 : 1
    light.current.intensity = (6 + hum * 6) * dip
  })
  return (
    <group position={LAMP}>
      <pointLight ref={light} name={SAFELIGHT} color={RED} intensity={6} distance={9} decay={1.6} castShadow />
      <mesh>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#1a1010" />
      </mesh>
    </group>
  )
}

const TRAY_CENTER = new Vector3(0, 0.96, 0.05)
const ROOM_LOOK = new Vector3(0, 1.3, -0.2)
const EASEL = new Vector3(ENLARGER[0], ENLARGER[1] + 0.3, ENLARGER[2])
const EASEL_LOW = EASEL.clone().setY(EASEL.y - 0.45)
const LINE_LOOK = new Vector3(0, LINE_Y - 0.15, LINE_Z)
const deg = (d: number) => (d * Math.PI) / 180

const TRAY_FOV = 45

// Na loja, a câmera olha a bancada inteira; em pé (celular), abre a lente
// para caber o ampliador e a pia. Na revelação, desce sobre a bandeja,
// perto o bastante para a foto encher a tela, em pé ou deitada. No
// ampliador e no varal, chega perto de cada um.
function Camera({ reducedMotion, view }: Props) {
  const active = view === 'tray'
  const look = useRef(ROOM_LOOK.clone())
  const goal = useRef(new Vector3())
  useFrame(({ camera, clock, size }, delta) => {
    const t = clock.getElapsedTime()
    const breathe = reducedMotion || active ? 0 : Math.sin(t * 0.6) * 0.02
    // Com movimento reduzido, a câmera corta para o lugar novo em vez de voar.
    const ease = reducedMotion ? 1 : Math.min(1, delta * 1.5)
    const aspect = size.width / size.height
    if (active) {
      const halfTan = Math.tan((TRAY_FOV * Math.PI) / 360)
      const distance = Math.max(0.36 / halfTan, 0.4 / (halfTan * aspect)) * 1.05
      // Em pé (celular), olha mais de cima para a foto não achatar.
      const pitch = aspect < 1 ? deg(72) : deg(58)
      goal.current.set(0, Math.sin(pitch), Math.cos(pitch)).multiplyScalar(distance).add(TRAY_CENTER)
      look.current.lerp(TRAY_CENTER, ease)
    } else if (view === 'enlarger') {
      // Deitado, o painel fica à direita; em pé, embaixo.
      if (aspect < 1) goal.current.set(EASEL.x + 0.3, EASEL.y + 0.9, EASEL.z + 1.5)
      else goal.current.set(EASEL.x + 1.0, EASEL.y + 0.55, EASEL.z + 1.6)
      // Em pé, o painel cobre a parte de baixo: a câmera mira abaixo do
      // marginador para ele subir na tela.
      look.current.lerp(aspect < 1 ? EASEL_LOW : EASEL, ease)
    } else if (view === 'line') {
      goal.current.set(0, 1.5 + breathe, aspect < 1 ? 1.9 : 1.3)
      look.current.lerp(LINE_LOOK, ease)
    } else {
      goal.current.set(0, 1.75 + breathe, aspect < 1 ? 4 : 3.6)
      look.current.lerp(ROOM_LOOK, ease)
    }
    const lens = camera as PerspectiveCamera
    const fov = active ? TRAY_FOV : view === 'enlarger' ? 50 : aspect < 1 ? 64 : 48
    if (Math.abs(lens.fov - fov) > 0.01) {
      lens.fov += (fov - lens.fov) * ease
      lens.updateProjectionMatrix()
    }
    camera.position.lerp(goal.current, ease)
    camera.lookAt(look.current)
  })
  return null
}

// Uma segunda lâmpada, mais fraca e sem sombra, sobre o ampliador.
function EnlargerLight() {
  const [x, , z] = ENLARGER
  return (
    <group position={[x + 0.2, 2.35, z - 0.6]}>
      <pointLight color={RED} intensity={1.6} distance={3.5} decay={1.6} />
      <mesh>
        <boxGeometry args={[0.16, 0.1, 0.08]} />
        <meshStandardMaterial color="#1a1010" />
      </mesh>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[0.12, 0.07]} />
        <meshBasicMaterial color="#b0180c" toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Darkroom({ reducedMotion, view }: Props) {
  const active = view === 'tray'
  // Celular fraco: se os quadros caem, a tela desenha com menos pixels.
  const [dpr, setDpr] = useState(2)
  return (
    <Canvas
      shadows
      // No tanque, a luz está apagada e a tela fica preta: a sala para de desenhar.
      frameloop={view === 'tank' ? 'never' : 'always'}
      dpr={[1, dpr]}
      camera={{ position: [0, 1.7, 3.4], fov: 45 }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} flipflops={3} onFallback={() => setDpr(1)} />
      <color attach="background" args={['#050202']} />
      <fog attach="fog" args={['#050202', 3, 9]} />
      <ambientLight intensity={0.04} color={RED} />
      <SafeLight reducedMotion={reducedMotion} />
      <EnlargerLight />
      <Walls />
      <Bench />
      <Enlarger />
      <Clothesline />
      <DevelopTray reducedMotion={reducedMotion} active={active} />
      <Camera reducedMotion={reducedMotion} view={view} />
      <ListenerSync />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.6} mipmapBlur />
        {/* O grão muda a cada quadro: com movimento reduzido, fica de fora. */}
        <Noise opacity={reducedMotion ? 0 : 0.12} />
        <Vignette eskil={false} offset={0.2} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  )
}
