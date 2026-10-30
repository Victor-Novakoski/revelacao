import { BENCH_TOP } from './layout'

const ROOM = { halfWidth: 2.6, back: -1.2, height: 3.2 }
const WALL = '#1b100d'

// Frascos marrons de químico, com rótulo de papel.
const BOTTLES = [
  { x: -0.95, h: 0.24, r: 0.05 },
  { x: -0.8, h: 0.2, r: 0.045 },
  { x: -0.66, h: 0.26, r: 0.055 },
  { x: 0.62, h: 0.18, r: 0.04 },
  { x: 0.78, h: 0.24, r: 0.05 },
]

function Shelf() {
  const y = 1.45
  return (
    <group position={[0, y, ROOM.back + 0.13]}>
      <mesh receiveShadow>
        <boxGeometry args={[2.4, 0.03, 0.24]} />
        <meshStandardMaterial color="#2a1c16" roughness={0.9} />
      </mesh>
      {BOTTLES.map((b) => (
        <group key={b.x} position={[b.x, b.h / 2 + 0.015, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[b.r, b.r, b.h, 18]} />
            <meshStandardMaterial color="#3a1a08" roughness={0.1} metalness={0.1} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, b.h / 2 + 0.02, 0]}>
            <cylinderGeometry args={[b.r * 0.45, b.r * 0.45, 0.04, 12]} />
            <meshStandardMaterial color="#111" roughness={0.6} />
          </mesh>
          <mesh position={[0, -b.h * 0.08, 0]}>
            <cylinderGeometry args={[b.r + 0.002, b.r + 0.002, b.h * 0.4, 18, 1, true, -0.9, 1.8]} />
            <meshStandardMaterial color="#d8cdb8" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// O relógio de revelação na parede. Parado: a sala não mexe sozinha.
function Timer() {
  return (
    <group position={[1.35, 2.55, ROOM.back + 0.03]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.05, 32]} />
        <meshStandardMaterial color="#151212" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.026]}>
        <circleGeometry args={[0.135, 32]} />
        <meshStandardMaterial color="#c9bfae" roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * 0.115, Math.cos(a) * 0.115, 0.028]} rotation={[0, 0, -a]}>
            <boxGeometry args={[0.006, 0.02, 0.002]} />
            <meshStandardMaterial color="#1a1410" />
          </mesh>
        )
      })}
      <mesh position={[0.03, 0.03, 0.03]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.006, 0.1, 0.002]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[-0.02, 0.01, 0.031]} rotation={[0, 0, 1.2]}>
        <boxGeometry args={[0.008, 0.06, 0.002]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
    </group>
  )
}

// A cortina de pano preto na porta, para a luz da loja não entrar.
function Curtain() {
  const folds = 9
  return (
    <group position={[-2.05, 0, ROOM.back + 0.12]}>
      {Array.from({ length: folds }, (_, i) => (
        <mesh key={i} position={[(i - folds / 2) * 0.085, 1.3, (i % 2) * 0.04]} receiveShadow>
          <cylinderGeometry args={[0.055, 0.055, 2.6, 10, 1, true]} />
          <meshStandardMaterial color="#0d0909" roughness={1} side={2} />
        </mesh>
      ))}
      <mesh position={[0, 2.62, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

// O cano que desce até a torneira da pia.
function Pipe() {
  return (
    <group>
      <mesh position={[1.9, (BENCH_TOP + ROOM.height) / 2 + 0.25, ROOM.back + 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, ROOM.height - BENCH_TOP - 0.5, 10]} />
        <meshStandardMaterial color="#4a4440" roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  )
}

export function Walls() {
  const { halfWidth, back, height } = ROOM
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#120a08" roughness={1} />
      </mesh>
      <mesh position={[0, height / 2, back]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, height]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * halfWidth, height / 2, back + 3]} rotation={[0, -side * Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[6, height]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, height, back + 3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfWidth * 2, 6]} />
        <meshStandardMaterial color="#0e0806" roughness={1} />
      </mesh>
      {/* Azulejo atrás da bancada, onde respinga químico. */}
      <mesh position={[0, BENCH_TOP + 0.3, back + 0.005]} receiveShadow>
        <planeGeometry args={[halfWidth * 2, 0.6]} />
        <meshStandardMaterial color="#2a1e1a" roughness={0.3} />
      </mesh>
      <Shelf />
      <Timer />
      <Curtain />
      <Pipe />
    </group>
  )
}
