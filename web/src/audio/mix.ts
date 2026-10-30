// Os números do som, sem Tone.js, para dar para testar.

// Volume de cada parte, em dB. Tudo baixo: o medo vem de perto do silêncio.
export const LEVELS = {
  hum: -30,
  buzz: -44,
  drip: -18,
  radio: -16,
  statics: -40,
  crackle: -34,
  bell: -26,
  phone: -32,
  creak: -30,
  match: -28,
}

// Ao entrar, o som sobe devagar. Ao tirar o mudo, também.
// Ao pôr o mudo, pode cortar rápido: silêncio repentino é permitido.
export const FADE_IN = 4
export const UNMUTE = 1.5
export const MUTE = 0.25

export function fadeTime(audible: boolean) {
  return audible ? UNMUTE : MUTE
}

// A goteira da pia: irregular, entre 3 e 11 segundos, às vezes duas
// gotas seguidas.
export function nextDrip(random: () => number) {
  if (random() < 0.15) return 0.35 + random() * 0.3
  return 3 + random() * 8
}

// Altura da gota, em Hz. Varia um pouco, como a água na pia.
export function dripPitch(random: () => number) {
  return 1100 + random() * 700
}

export const RADIO_BPM = 66

// "O rádio desafina": de 0 (normal) a 1 (fita gasta), a música desacelera
// e fica grave.
export function radioWarp(amount: number) {
  const w = Math.min(1, Math.max(0, amount))
  return { bpm: RADIO_BPM * (1 - 0.4 * w), detune: 0 - 600 * w }
}

// De onde vem o rangido: atrás e à esquerda de quem ouve, um pouco abaixo.
// forward e up são a direção da câmera; a esquerda sai do produto vetorial.
export function behindLeft(
  position: readonly [number, number, number],
  forward: readonly [number, number, number],
  up: readonly [number, number, number],
): [number, number, number] {
  const [fx, fy, fz] = forward
  const [ux, uy, uz] = up
  // direita = frente × cima
  const right = [fy * uz - fz * uy, fz * ux - fx * uz, fx * uy - fy * ux]
  return [
    position[0] - fx * 1.4 - right[0] * 1.1,
    position[1] - fy * 1.4 - right[1] * 1.1 - 0.4,
    position[2] - fz * 1.4 - right[2] * 1.1,
  ]
}
