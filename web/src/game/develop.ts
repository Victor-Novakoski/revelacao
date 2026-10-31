// O modelo da bandeja: inclinação, o líquido que vai e volta, e o quanto a
// foto já revelou. Puro, sem Three.js, para dar para testar.

export type Vec2 = { x: number; y: number }

// Medidas da bandeja, em metros, no espaço da própria bandeja (x, z).
export const TRAY = { width: 0.7, depth: 0.5 }
export const PAPER = { width: 0.52, depth: 0.39, height: 0.0015 }
export const LIQUID_BASE = 0.012

export const MAX_TILT = 0.12

// Velocidade do revelador: com agitação boa, a foto fica no ponto em ~35 s.
export const DEVELOP_RATE = 1 / 32

const SPRING = 60
const DAMPING = 3
const STEP = 1 / 120

export type DevelopSim = {
  tilt: Vec2
  tiltTarget: Vec2
  // Inclinação da superfície do líquido em relação ao fundo da bandeja.
  slope: Vec2
  slopeVel: Vec2
  agitation: number
  // Revelador fresco perto do papel. Cai quando a bandeja fica parada.
  freshness: number
  coverage: number
  developed: number
  elapsed: number
  running: boolean
}

export function createSim(): DevelopSim {
  return {
    tilt: { x: 0, y: 0 },
    tiltTarget: { x: 0, y: 0 },
    slope: { x: 0, y: 0 },
    slopeVel: { x: 0, y: 0 },
    agitation: 0,
    freshness: 1,
    coverage: 1,
    developed: 0,
    elapsed: 0,
    running: true,
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Altura do líquido sobre o papel num ponto, sem as ondinhas.
export function liquidDepth(slope: Vec2, x: number, z: number) {
  return LIQUID_BASE + slope.x * x + slope.y * z - PAPER.height
}

// Fração do papel coberta pelo líquido, numa grade 5x5.
export function paperCoverage(slope: Vec2) {
  let covered = 0
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const x = (i / 4 - 0.5) * PAPER.width
      const z = (j / 4 - 0.5) * PAPER.depth
      if (liquidDepth(slope, x, z) > 0) covered++
    }
  }
  return covered / 25
}

// O quanto o revelador trabalha agora, antes de multiplicar pelo tempo.
// freshSpeed é a parte que vale para o papel todo; a cobertura o shader
// calcula ponto a ponto.
export function freshSpeed(freshness: number) {
  return DEVELOP_RATE * (0.35 + 0.65 * freshness)
}

export function developSpeed(freshness: number, coverage: number) {
  return freshSpeed(freshness) * (0.6 + 0.4 * coverage)
}

function substep(sim: DevelopSim, dt: number) {
  const follow = Math.min(1, dt * 12)
  sim.tilt.x += (sim.tiltTarget.x - sim.tilt.x) * follow
  sim.tilt.y += (sim.tiltTarget.y - sim.tilt.y) * follow

  // O líquido quer ficar na horizontal; em relação à bandeja, isso é a
  // tangente da inclinação. Uma mola com pouco amortecimento faz ele ir e voltar.
  for (const axis of ['x', 'y'] as const) {
    const rest = Math.tan(sim.tilt[axis])
    sim.slopeVel[axis] += (SPRING * (rest - sim.slope[axis]) - DAMPING * sim.slopeVel[axis]) * dt
    sim.slope[axis] += sim.slopeVel[axis] * dt
  }

  const speed = Math.hypot(sim.slopeVel.x, sim.slopeVel.y) / 0.5
  sim.agitation += (Math.min(1, speed) - sim.agitation) * Math.min(1, dt * 3)
  sim.freshness += (2 * sim.agitation * (1 - sim.freshness) - 0.4 * sim.freshness) * dt
  sim.freshness = clamp(sim.freshness, 0, 1)

  if (!sim.running) return
  sim.coverage = paperCoverage(sim.slope)
  sim.developed += developSpeed(sim.freshness, sim.coverage) * dt
  sim.elapsed += dt
}

export function stepSim(sim: DevelopSim, dt: number) {
  let left = Math.min(dt, 0.1)
  while (left > 1e-6) {
    const h = Math.min(STEP, left)
    substep(sim, h)
    left -= h
  }
}

// Arrastar a partir de onde o dedo encostou inclina a bandeja.
export function dragTilt(dx: number, dy: number, viewport: { width: number; height: number }): Vec2 {
  const reach = Math.min(viewport.width, viewport.height) * 0.22
  return {
    x: clamp(dx / reach, -1, 1) * MAX_TILT,
    y: clamp(dy / reach, -1, 1) * MAX_TILT,
  }
}

export type Verdict = 'pale' | 'right' | 'dark'

export function verdict(developed: number): Verdict {
  if (developed < 0.8) return 'pale'
  if (developed <= 1.2) return 'right'
  return 'dark'
}

// Etapas da imagem, para a legenda: 0 branco até 4 passando do ponto.
export function developStage(developed: number) {
  if (developed >= 1.2) return 4
  if (developed >= 0.8) return 3
  if (developed >= 0.5) return 2
  if (developed >= 0.12) return 1
  return 0
}
