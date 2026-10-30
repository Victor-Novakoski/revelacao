import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing'
import { Vector3, type PointLight } from 'three'
import { DevelopTray, SAFELIGHT } from './DevelopTray'

type Props = { reducedMotion: boolean; active: boolean }

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
    <group position={[0, 2.4, -0.6]}>
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

// Revelador no meio (DevelopTray); interruptor e fixador dos lados.
function Bench() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#2a1c16" roughness={0.9} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <group key={x} position={[x, 0.97, 0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.06, 0.6]} />
            <meshStandardMaterial color="#3b3b3b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.7, 0.02, 0.5]} />
            <meshStandardMaterial color="#1c0b08" roughness={0.05} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#120a08" roughness={1} />
      </mesh>
      <mesh position={[0, 3, -1.2]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#1b100d" roughness={1} />
      </mesh>
      <mesh position={[0, 2, -1.1]}>
        <boxGeometry args={[3.4, 0.03, 0.02]} />
        <meshStandardMaterial color="#0d0706" />
      </mesh>
    </group>
  )
}

const TRAY_CENTER = new Vector3(0, 0.96, 0.05)
const ROOM_LOOK = new Vector3(0, 1.05, 0)
const deg = (d: number) => (d * Math.PI) / 180

// Na loja, a câmera olha a bancada. Na revelação, desce sobre a bandeja,
// perto o bastante para a foto encher a tela, em pé ou deitada.
function Camera({ reducedMotion, active }: Props) {
  const look = useRef(ROOM_LOOK.clone())
  const goal = useRef(new Vector3())
  useFrame(({ camera, clock, size }, delta) => {
    const t = clock.getElapsedTime()
    const breathe = reducedMotion || active ? 0 : Math.sin(t * 0.6) * 0.02
    const ease = Math.min(1, delta * 1.5)
    if (active) {
      const halfTan = Math.tan((45 * Math.PI) / 360)
      const aspect = size.width / size.height
      const distance = Math.max(0.36 / halfTan, 0.4 / (halfTan * aspect)) * 1.05
      // Em pé (celular), olha mais de cima para a foto não achatar.
      const pitch = aspect < 1 ? deg(72) : deg(58)
      goal.current.set(0, Math.sin(pitch), Math.cos(pitch)).multiplyScalar(distance).add(TRAY_CENTER)
      look.current.lerp(TRAY_CENTER, ease)
    } else {
      goal.current.set(0, 1.7 + breathe, 3.4)
      look.current.lerp(ROOM_LOOK, ease)
    }
    camera.position.lerp(goal.current, ease)
    camera.lookAt(look.current)
  })
  return null
}

export function Darkroom({ reducedMotion, active }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.7, 3.4], fov: 45 }}
      gl={{ antialias: true }}
      aria-hidden="true"
    >
      <color attach="background" args={['#050202']} />
      <fog attach="fog" args={['#050202', 3, 9]} />
      <ambientLight intensity={0.04} color={RED} />
      <SafeLight reducedMotion={reducedMotion} />
      <Room />
      <Bench />
      <DevelopTray reducedMotion={reducedMotion} active={active} />
      <Camera reducedMotion={reducedMotion} active={active} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.6} mipmapBlur />
        <Noise opacity={0.12} />
        <Vignette eskil={false} offset={0.2} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  )
}
