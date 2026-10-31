// Onde cada coisa fica na sala, em metros. O som usa as mesmas posições,
// então a gota vem da pia e o rádio vem do rádio.
export type Point = readonly [number, number, number]

export const BENCH_TOP = 0.94
export const LAMP: Point = [0, 2.4, -0.6]
export const RADIO: Point = [1.55, BENCH_TOP + 0.13, -0.42]
export const SINK: Point = [1.9, BENCH_TOP, 0.12]
export const TAP: Point = [1.9, BENCH_TOP + 0.34, -0.2]
export const ENLARGER: Point = [-1.85, BENCH_TOP, -0.05]
export const LINE_Y = 2.05
export const LINE_Z = -0.85
