import { BENCH_TOP, RADIO, SINK, TAP } from './layout'

const WOOD = '#2a1c16'
const BENCH = { width: 4.7, depth: 1.2, thick: 0.08 }

// Interruptor e fixador, um de cada lado do revelador (DevelopTray).
function SideTrays() {
  return (
    <>
      {[-0.95, 0.95].map((x) => (
        <group key={x} position={[x, BENCH_TOP + 0.03, 0.05]}>
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
    </>
  )
}

// A pia da lavagem, com a torneira que pinga.
function Sink() {
  const [x, y, z] = SINK
  const chrome = <meshStandardMaterial color="#a8a4a0" roughness={0.3} metalness={0.35} />
  return (
    <group>
      <group position={[x, y - 0.06, z]}>
        {[
          [0, -0.07, 0, 0.72, 0.02, 0.56],
          [-0.35, 0, 0, 0.02, 0.16, 0.56],
          [0.35, 0, 0, 0.02, 0.16, 0.56],
          [0, 0, -0.27, 0.72, 0.16, 0.02],
          [0, 0, 0.27, 0.72, 0.16, 0.02],
        ].map(([px, py, pz, w, h, d], i) => (
          <mesh key={i} position={[px, py, pz]} receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#cfc8bb" roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.68, 0.52]} />
          <meshStandardMaterial color="#120606" roughness={0.02} metalness={0.4} />
        </mesh>
      </group>
      <mesh position={[TAP[0], y + 0.2, TAP[2] - 0.12]}>
        <cylinderGeometry args={[0.018, 0.018, 0.4]} />
        {chrome}
      </mesh>
      <mesh position={[TAP[0], TAP[1] + 0.02, TAP[2] - 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.13]} />
        {chrome}
      </mesh>
      <mesh position={[TAP[0], TAP[1] - 0.01, TAP[2]]}>
        <cylinderGeometry args={[0.016, 0.012, 0.05]} />
        {chrome}
      </mesh>
      <mesh position={[TAP[0] + 0.07, TAP[1] + 0.08, TAP[2] - 0.12]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 6]} />
        {chrome}
      </mesh>
      {/* A gota, parada na ponta da torneira. */}
      <mesh position={[TAP[0], TAP[1] - 0.045, TAP[2]]}>
        <sphereGeometry args={[0.007, 10, 10]} />
        <meshStandardMaterial color="#d8c8c0" roughness={0} metalness={0.3} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// O rádio de válvula da bancada. O mostrador fica apagado: luz branca
// velaria o papel.
function Radio() {
  const [x, y, z] = RADIO
  return (
    <group position={[x, y, z]} rotation={[0, -0.25, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.26, 0.18]} />
        <meshStandardMaterial color="#4a2a18" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.38, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#4a2a18" roughness={0.55} />
      </mesh>
      <mesh position={[-0.07, 0.04, 0.091]}>
        <planeGeometry args={[0.19, 0.2]} />
        <meshStandardMaterial color="#1f150f" roughness={1} />
      </mesh>
      {[-0.06, -0.02, 0.02, 0.06, 0.1].map((dy) => (
        <mesh key={dy} position={[-0.07, 0.04 + dy - 0.02, 0.093]}>
          <boxGeometry args={[0.19, 0.006, 0.004]} />
          <meshStandardMaterial color="#6b4a30" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.1, 0.07, 0.091]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial color="#b9a888" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.07, 0.093]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.003, 0.08, 0.002]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      {[0.06, 0.14].map((kx) => (
        <mesh key={kx} position={[kx, -0.07, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.022, 0.025, 16]} />
          <meshStandardMaterial color="#1a1210" roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export function Bench() {
  const legX = BENCH.width / 2 - 0.08
  return (
    <group>
      <mesh position={[0, BENCH_TOP - BENCH.thick / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[BENCH.width, BENCH.thick, BENCH.depth]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
      {[-legX, -0.5, legX].map((lx) =>
        [-0.5, 0.5].map((lz) => (
          <mesh key={`${lx}${lz}`} position={[lx, (BENCH_TOP - BENCH.thick) / 2, lz]}>
            <boxGeometry args={[0.07, BENCH_TOP - BENCH.thick, 0.07]} />
            <meshStandardMaterial color="#1e140f" roughness={0.9} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[BENCH.width - 0.2, 0.03, BENCH.depth - 0.15]} />
        <meshStandardMaterial color="#1e140f" roughness={0.9} />
      </mesh>
      {/* Caixas de papel fotográfico na prateleira de baixo. */}
      {[-1.6, -1.25, 0.4].map((bx, i) => (
        <mesh key={bx} position={[bx, 0.31 + i * 0.01, -0.1]} rotation={[0, i * 0.08, 0]}>
          <boxGeometry args={[0.32, 0.08 + i * 0.02, 0.26]} />
          <meshStandardMaterial color={i === 2 ? '#3a2e22' : '#2c2622'} roughness={0.8} />
        </mesh>
      ))}
      <SideTrays />
      <Sink />
      <Radio />
    </group>
  )
}
