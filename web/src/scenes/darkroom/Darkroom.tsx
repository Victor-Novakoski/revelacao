import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing'
import type { PointLight, Group } from 'three'

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
      <pointLight ref={light} color={RED} intensity={6} distance={9} decay={1.6} castShadow />
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

function Bench() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#2a1c16" roughness={0.9} />
      </mesh>
      {[-0.95, 0, 0.95].map((x, i) => (
        <group key={x} position={[x, 0.97, 0.05]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.06, 0.6]} />
            <meshStandardMaterial color={i === 1 ? '#d9d4c8' : '#3b3b3b'} roughness={0.4} />
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

function Camera({ reducedMotion, active }: Props) {
  const rig = useRef<Group>(null)
  useFrame(({ camera, clock }, delta) => {
    const t = clock.getElapsedTime()
    const breathe = reducedMotion ? 0 : Math.sin(t * 0.6) * 0.02
    const targetZ = active ? 2.6 : 3.4
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 1.5)
    camera.position.y = 1.7 + breathe
    camera.lookAt(0, 1.05, 0)
  })
  return <group ref={rig} />
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
      <Camera reducedMotion={reducedMotion} active={active} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.6} mipmapBlur />
        <Noise opacity={0.12} />
        <Vignette eskil={false} offset={0.2} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  )
}
