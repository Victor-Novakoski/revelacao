import { ENLARGER } from './layout'
import { useGame } from '../../game/store'

const BLACK = <meshStandardMaterial color="#7d756a" roughness={0.45} metalness={0.1} />
const METAL = <meshStandardMaterial color="#77726c" roughness={0.4} metalness={0.3} />

// O ampliador, como os de coluna dos anos 50: base de madeira, coluna,
// cabeçote com a lâmpada, fole e lente apontados para o marginador.
export function Enlarger() {
  const [x, y, z] = ENLARGER
  const head = 0.72
  const lamp = useGame((s) => s.lamp)
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.04, 0.5]} />
        <meshStandardMaterial color="#3a271b" roughness={0.8} />
      </mesh>
      {/* Marginador: o papel e as réguas que seguram a borda. */}
      <group position={[0, 0.045, 0.04]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.36, 0.01, 0.3]} />
          <meshStandardMaterial color="#d9d2c4" roughness={0.9} />
        </mesh>
        <mesh position={[-0.17, 0.008, 0]}>
          <boxGeometry args={[0.025, 0.008, 0.3]} />
          {METAL}
        </mesh>
        <mesh position={[0, 0.008, 0.14]}>
          <boxGeometry args={[0.36, 0.008, 0.025]} />
          {METAL}
        </mesh>
        {/* A luz do ampliador na folha, enquanto ela é exposta. */}
        <mesh position={[0, 0.007, -0.01]} rotation={[-Math.PI / 2, 0, 0]} visible={lamp}>
          <planeGeometry args={[0.3, 0.22]} />
          <meshBasicMaterial color="#fff1d6" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </group>
      {/* Sempre montada, para a cena não recompilar ao acender. */}
      <pointLight position={[0, 0.45, 0.04]} color="#ffe9c4" intensity={lamp ? 0.8 : 0} distance={1.4} decay={2} />
      <mesh position={[0, 0.55, -0.2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.05, 16]} />
        {METAL}
      </mesh>
      <mesh position={[0, head, -0.13]}>
        <boxGeometry args={[0.06, 0.1, 0.14]} />
        {BLACK}
      </mesh>
      <group position={[0, head, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.16, 24]} />
          {BLACK}
        </mesh>
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.04, 0.07, 0.07, 16]} />
          {BLACK}
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.2, 0.05, 0.2]} />
          {BLACK}
        </mesh>
        {/* Fole sanfonado. */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, -0.025 - i * 0.025, 0]}>
            <boxGeometry args={[0.15 - (i % 2) * 0.015, 0.025, 0.15 - (i % 2) * 0.015]} />
            <meshStandardMaterial color="#0c0a09" roughness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, -0.13, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.05, 20]} />
          {METAL}
        </mesh>
        <mesh position={[0, -0.156, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.03, 20]} />
          <meshStandardMaterial color="#1a0a08" roughness={0} metalness={1} />
        </mesh>
        <mesh position={[0.1, -0.06, -0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 0.03, 12]} />
          {BLACK}
        </mesh>
      </group>
    </group>
  )
}
