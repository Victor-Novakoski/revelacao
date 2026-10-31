import type * as ToneNS from 'tone'
import { LAMP, RADIO, TAP, type Point } from '../scenes/darkroom/layout'
import { useCaptions } from './captions'
import { BARS, WALTZ, at, length, played, type Note } from './waltz'
import { FADE_IN, LEVELS, RADIO_BPM, behindLeft, dreadMix, dripPitch, fadeTime, nextDrip, nextGlass, radioWarp } from './mix'
import type { Cue } from '../game/script'

type Tone = typeof ToneNS

// O som da sala. Nada toca antes de um gesto do jogador: start() tem que ser
// chamado dentro do clique. O Tone.js só é baixado nessa hora.

type Room = {
  tone: Tone
  master: ToneNS.Gain
  hum: ToneNS.Gain
  radio: ToneNS.PolySynth
  bell: ToneNS.PolySynth
  hands: ToneNS.NoiseSynth
  cellar: ToneNS.Gain
  glass: ToneNS.Gain
  heart: ToneNS.Gain
  flutter: ToneNS.Vibrato
}

let room: Room | null = null
let starting = false
let wantAudible = true
let hidden = false
let bellFree = 0
let handsFree = 0
let crackleFree = 0
let waltzWrong = false
let warp = 0
let dread = 0
let listener: { position: Point; forward: Point; up: Point } = { position: [0, 1.6, 2], forward: [0, 0, -1], up: [0, 1, 0] }

const say = (text: string, seconds?: number) => useCaptions.getState().say(text, seconds)

function panner(tone: Tone, [x, y, z]: Point, output: ToneNS.InputNode) {
  return new tone.Panner3D({
    panningModel: 'HRTF',
    distanceModel: 'inverse',
    refDistance: 1,
    rolloffFactor: 1,
    positionX: x,
    positionY: y,
    positionZ: z,
  }).connect(output)
}

// Zumbido da lâmpada: a rede elétrica daqui é de 60 Hz, a lâmpada vibra no
// dobro. Um chiado fino em cima, para o alto-falante do celular também tocar.
function lamp(tone: Tone, out: ToneNS.InputNode) {
  const hum = new tone.Gain(1).connect(panner(tone, LAMP, out))
  new tone.Oscillator({ frequency: 120, type: 'sine', volume: LEVELS.hum }).connect(hum).start()
  new tone.Oscillator({ frequency: 240, type: 'sine', volume: LEVELS.hum - 8 }).connect(hum).start()
  const buzz = new tone.Filter({ type: 'bandpass', frequency: 2400, Q: 1.2 }).connect(hum)
  new tone.Noise({ type: 'pink', volume: LEVELS.buzz }).connect(buzz).start()
  return hum
}

// A torneira da pia pinga sozinha, num ritmo que não dá para prever.
function drips(tone: Tone, out: ToneNS.InputNode) {
  const drop = new tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 1.5,
    volume: LEVELS.drip,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
  }).connect(panner(tone, TAP, out))
  let first = true
  const fall = (time: number) => {
    drop.triggerAttackRelease(dripPitch(Math.random), 0.05, time)
    if (first) {
      first = false
      tone.getDraw().schedule(() => say('[Uma gota cai na pia]', 4), time)
    }
    tone.getTransport().scheduleOnce(fall, time + nextDrip(Math.random))
  }
  tone.getTransport().scheduleOnce(fall, `+${2 + Math.random() * 3}`)
}

// A Rádio Garoa: a valsa num rádio de válvula, com faixa estreita de AM,
// um pouco de saturação, chiado que vai e vem e estalos de vez em quando.
function radio(tone: Tone, out: ToneNS.InputNode) {
  const speaker = panner(tone, RADIO, out)
  const band = new tone.Filter({ type: 'lowpass', frequency: 2800, rolloff: -24 }).connect(speaker)
  const tube = new tone.Distortion({ distortion: 0.12, wet: 0.5 }).connect(band)
  const cut = new tone.Filter({ type: 'highpass', frequency: 320 }).connect(tube)
  // Um eco escuro, como se a mesma valsa tocasse num cômodo vazio ao lado.
  const room2 = new tone.Filter({ type: 'lowpass', frequency: 900 }).connect(speaker)
  const far = new tone.Gain(0.25).connect(room2)
  band.connect(new tone.FeedbackDelay({ delayTime: 0.68, feedback: 0.38, wet: 1 }).connect(far))
  // O disco balança: a afinação vai e volta devagar, como vitrola cansada.
  const flutter = new tone.Vibrato({ frequency: 0.45, depth: 0.04, type: 'sine' }).connect(cut)

  // Piano de bar, desafinado: duas cordas por nota, uma meio fora do tom.
  const piano = new tone.PolySynth(tone.Synth, {
    volume: LEVELS.radio,
    oscillator: { type: 'fattriangle', count: 2, spread: 28 },
    envelope: { attack: 0.004, decay: 1.4, sustain: 0.12, release: 1.6 },
  }).connect(flutter)

  const reception = new tone.Gain(0.6).connect(band)
  new tone.LFO({ frequency: 0.07, min: 0.25, max: 1 }).connect(reception.gain).start()
  const hiss = new tone.Filter({ type: 'bandpass', frequency: 1800, Q: 0.6 }).connect(reception)
  new tone.Noise({ type: 'pink', volume: LEVELS.statics }).connect(hiss).start()
  const crackle = new tone.NoiseSynth({
    volume: LEVELS.crackle,
    envelope: { attack: 0.001, decay: 0.012, sustain: 0 },
  }).connect(band)

  const part = new tone.Part<Note & { time: string }>((time, n) => {
    piano.triggerAttackRelease(played(n, waltzWrong), length(n.beats), time, 0.5 + Math.random() * 0.1)
    // O estalo é monofônico: dois no mesmo tempo não podem sair fora de ordem.
    if (Math.random() < 0.08) {
      const at = Math.max(time + Math.random() * 0.3, crackleFree)
      crackleFree = at + 0.02
      crackle.triggerAttackRelease(0.01, at)
    }
  }, WALTZ.map((n) => ({ ...n, time: at(n.bar, n.beat) })))
  part.loop = true
  part.loopEnd = at(BARS, 0)
  part.start(0)
  return { piano, flutter }
}

// O porão: um grave que ninguém sabe de onde vem. Dois tons a meio tom de
// distância batem um no outro (uns três tremores por segundo) e um trítono
// fica por baixo. Ele respira devagar, a cada vinte segundos.
function cellar(tone: Tone, out: ToneNS.InputNode) {
  const gain = new tone.Gain(0).connect(out)
  const breath = new tone.Gain(1).connect(gain)
  new tone.LFO({ frequency: 0.05, min: 0.4, max: 1 }).connect(breath.gain).start()
  const low = new tone.Filter({ type: 'lowpass', frequency: 200 }).connect(breath)
  new tone.Oscillator({ frequency: 55, type: 'sine', volume: LEVELS.drone }).connect(low).start()
  new tone.Oscillator({ frequency: 58.27, type: 'sine', volume: LEVELS.drone - 3 }).connect(low).start()
  new tone.Oscillator({ frequency: 77.78, type: 'triangle', volume: LEVELS.drone - 12 }).connect(low).start()
  new tone.Noise({ type: 'brown', volume: LEVELS.rumble }).connect(low).start()
  return gain
}

// O arrepio: dois apitos agudos colados, meio tom de distância, que andam
// devagar de um ouvido para o outro. Sobem de tempos em tempos, nunca de
// repente (8 segundos para subir, 12 para sumir).
function glass(tone: Tone, out: ToneNS.InputNode) {
  const gain = new tone.Gain(0).connect(out)
  const swell = new tone.Gain(0).connect(gain)
  const pan = new tone.AutoPanner({ frequency: 0.03, depth: 0.9 }).connect(swell).start()
  const air = new tone.Filter({ type: 'lowpass', frequency: 3000 }).connect(pan)
  new tone.Oscillator({ frequency: 1318.5, type: 'sine', volume: LEVELS.glass }).connect(air).start()
  new tone.Oscillator({ frequency: 1396.9, type: 'sine', volume: LEVELS.glass - 2 }).connect(air).start()
  let first = true
  const rise = (time: number) => {
    swell.gain.setValueAtTime(0, time)
    swell.gain.linearRampToValueAtTime(1, time + 8)
    swell.gain.setValueAtTime(1, time + 12)
    swell.gain.linearRampToValueAtTime(0, time + 24)
    if (first && dread > 0.2) {
      first = false
      tone.getDraw().schedule(() => say('[Um apito fino, que não vem de lugar nenhum]', 5), time + 6)
    }
    tone.getTransport().scheduleOnce(rise, time + 24 + nextGlass(Math.random, dread))
  }
  tone.getTransport().scheduleOnce(rise, `+${10 + Math.random() * 10}`)
  return gain
}

// O coração: só bate enquanto a figura aparece na bandeja. Grave, abafado,
// e acompanha o rádio quando ele desacelera.
function heart(tone: Tone, out: ToneNS.InputNode) {
  const gain = new tone.Gain(0).connect(out)
  const chest = new tone.Filter({ type: 'lowpass', frequency: 140 }).connect(gain)
  const beat = new tone.MembraneSynth({
    volume: LEVELS.heart,
    pitchDecay: 0.05,
    octaves: 2,
    envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.1 },
  }).connect(chest)
  new tone.Loop((time) => {
    if (gain.gain.value < 0.01) return
    beat.triggerAttackRelease('A1', 0.1, time, 0.9)
    beat.triggerAttackRelease('A1', 0.1, time + 0.28, 0.6)
  }, '4n').start(0)
  return gain
}

// O sino da porta da loja, lá na frente: baixinho, abafado pela parede.
function doorBell(tone: Tone, out: ToneNS.InputNode) {
  const wall = new tone.Filter({ type: 'lowpass', frequency: 3200 }).connect(out)
  return new tone.PolySynth(tone.FMSynth, {
    volume: LEVELS.bell,
    harmonicity: 3.01,
    modulationIndex: 6,
    envelope: { attack: 0.002, decay: 1.2, sustain: 0, release: 0.8 },
    modulationEnvelope: { attack: 0.002, decay: 0.4, sustain: 0, release: 0.4 },
  }).connect(wall)
}

// As mãos no escuro: o estalo do chassi, a espiral, a tampa. Perto do
// ouvido, sem eco de sala.
function hands(tone: Tone, out: ToneNS.InputNode) {
  const click = new tone.Filter({ type: 'bandpass', frequency: 3200, Q: 2 }).connect(out)
  return new tone.NoiseSynth({
    volume: LEVELS.tick,
    envelope: { attack: 0.001, decay: 0.025, sustain: 0 },
  }).connect(click)
}

async function build(context: AudioContext) {
  const tone = await import('tone')
  // Ao carregar, o Tone.js já cria um contexto próprio; troca pelo nosso e
  // fecha o dele.
  tone.setContext(new tone.Context(context), true)
  const transport = tone.getTransport()
  transport.timeSignature = 3
  transport.bpm.value = RADIO_BPM

  const master = new tone.Gain(0).toDestination()
  const reverb = new tone.Reverb({ decay: 1.6, preDelay: 0.01, wet: 0.28 }).connect(master)
  await reverb.ready
  const hum = lamp(tone, reverb)
  drips(tone, reverb)
  const { piano, flutter } = radio(tone, reverb)
  const bell = doorBell(tone, reverb)

  room = {
    tone,
    master,
    hum,
    radio: piano,
    bell,
    hands: hands(tone, master),
    cellar: cellar(tone, master),
    glass: glass(tone, reverb),
    heart: heart(tone, master),
    flutter,
  }
  applyDread(FADE_IN)
  transport.start()
  applyGain(FADE_IN)
  say('[A lâmpada vermelha zumbe baixinho]', 5)
  say('[No rádio, a Rádio Garoa toca uma valsa lenta]', 6)
}

function applyGain(seconds?: number) {
  if (!room) return
  const audible = wantAudible && !hidden
  room.master.gain.rampTo(audible ? 1 : 0, seconds ?? fadeTime(audible))
}

// Chame dentro do clique: o navegador só deixa tocar depois de um gesto.
// O contexto de áudio é criado aqui, antes de baixar o Tone.js, para o
// gesto ainda valer quando ele chegar.
export function start(muted: boolean) {
  wantAudible = !muted
  if (room || starting) return
  starting = true
  const context = new AudioContext({ latencyHint: 'playback' })
  void context.resume()
  build(context).catch(() => {
    starting = false
  })
}

export function setMuted(muted: boolean) {
  wantAudible = !muted
  applyGain()
}

// Aba escondida: o som some; ao voltar, sobe devagar.
export function setHidden(isHidden: boolean) {
  hidden = isHidden
  applyGain()
}

// As camadas do medo seguem o dia e a figura na bandeja. Sempre devagar.
function applyDread(seconds: number) {
  if (!room) return
  const mix = dreadMix(dread, warp)
  room.cellar.gain.rampTo(mix.cellar, seconds)
  room.glass.gain.rampTo(mix.glass, seconds)
  room.heart.gain.rampTo(mix.heart, seconds)
  room.flutter.depth.rampTo(mix.flutter, seconds)
}

// O peso do dia, de 0 (dia 1) a 1 (último dia).
export function setDread(level: number) {
  dread = level
  applyDread(10)
}

// "O rádio desafina" quando a criatura está na foto em revelação. O porão
// sobe junto e o coração começa a bater.
export function setRadioWarp(amount: number, seconds = 6) {
  if (!room || Math.abs(amount - warp) < 0.05) return
  warp = amount
  const { bpm, detune } = radioWarp(amount)
  room.tone.getTransport().bpm.rampTo(bpm, seconds)
  room.radio.set({ detune })
  applyDread(seconds)
}

// Alguém entra na loja. A legenda aparece mesmo sem som.
export function ringBell() {
  say('[O sino da porta toca]', 3)
  if (!room) return
  // Dois toques seguidos não podem ser agendados antes do anterior.
  const now = Math.max(room.tone.now(), bellFree)
  bellFree = now + 0.2
  room.bell.triggerAttackRelease('E6', 0.3, now, 0.6)
  room.bell.triggerAttackRelease('B5', 0.3, now + 0.16, 0.45)
}

// O zumbido some por um instante (a lupa sobre a criatura, mais tarde).
export function hushLamp(seconds = 1) {
  if (!room) return
  const gain = room.hum.gain
  const now = room.tone.now()
  gain.cancelScheduledValues(now)
  gain.setValueAtTime(0, now + 0.02)
  gain.setValueAtTime(0, now + seconds)
  gain.linearRampToValueAtTime(1, now + seconds + 1.2)
}

// Luz apagada para o tanque: a lâmpada para de zumbir. Ao acender, volta.
export function setDark(dark: boolean) {
  if (!room) return
  room.hum.gain.rampTo(dark ? 0 : 1, dark ? 0.3 : 1.5)
}

let reelSaid = false

// Um estalo das mãos. Como no sino, um toque nunca é agendado antes do anterior.
function tap(time: number, velocity = 1) {
  if (!room) return
  const at = Math.max(time, handsFree)
  handsFree = at + 0.01
  room.hands.triggerAttackRelease(0.02, at, velocity)
}

// Um dente da espiral pegando o filme, enquanto o botão está apertado.
export function reelTick() {
  if (!reelSaid) {
    reelSaid = true
    say('[O filme estala na espiral, dente por dente]', 5)
  }
  if (!room) return
  tap(room.tone.now(), 0.4 + Math.random() * 0.3)
}

// A valsa com a nota errada, no último dia.
export function setWaltzWrong(wrong: boolean) {
  waltzWrong = wrong
}

// Os sons da história. A legenda aparece mesmo sem som; tudo baixinho.
export function playCue(cue: Cue) {
  say(CUE_CAPTIONS[cue], cue === 'creak' ? 4 : 6)
  if (!room) return
  const { tone } = room
  const now = tone.now()
  switch (cue) {
    case 'phone': {
      // O sinal de chamada, duas vezes, abafado no fone.
      const ear = new tone.Filter({ type: 'bandpass', frequency: 900, Q: 0.8 }).connect(room.master)
      const ring = new tone.Gain(0).connect(ear)
      const a = new tone.Oscillator({ frequency: 425, type: 'sine', volume: LEVELS.phone }).connect(ring).start(now)
      for (const t of [0, 4]) {
        ring.gain.setValueAtTime(0, now + t)
        ring.gain.linearRampToValueAtTime(1, now + t + 0.05)
        ring.gain.setValueAtTime(1, now + t + 1)
        ring.gain.linearRampToValueAtTime(0, now + t + 1.05)
      }
      a.stop(now + 6)
      tone.getTransport().scheduleOnce(() => ear.dispose(), `+7`)
      break
    }
    case 'line':
      hushLamp(2.5)
      break
    case 'creak': {
      // Uma vez só no jogo: madeira rangendo atrás e à esquerda.
      const at3d = behindLeft(listener.position, listener.forward, listener.up)
      const out = panner(tone, at3d, room.master)
      const wood = new tone.Filter({ type: 'bandpass', frequency: 420, Q: 9 }).connect(out)
      const creak = new tone.NoiseSynth({
        volume: LEVELS.creak,
        noise: { type: 'brown' },
        envelope: { attack: 0.25, decay: 0.6, sustain: 0.4, release: 0.5 },
      }).connect(wood)
      wood.frequency.setValueAtTime(420, now)
      wood.frequency.exponentialRampToValueAtTime(230, now + 1.4)
      creak.triggerAttackRelease(1.2, now)
      tone.getTransport().scheduleOnce(() => out.dispose(), `+4`)
      break
    }
    case 'match': {
      // O risco do fósforo e o chiado do filme queimando.
      const out = new tone.Filter({ type: 'highpass', frequency: 600 }).connect(room.master)
      const scratch = new tone.NoiseSynth({
        volume: LEVELS.match,
        envelope: { attack: 0.005, decay: 0.18, sustain: 0, release: 0.05 },
      }).connect(out)
      scratch.triggerAttackRelease(0.15, now)
      const hiss = new tone.Noise({ type: 'pink', volume: LEVELS.match - 10 }).connect(out)
      hiss.start(now + 0.4).stop(now + 6)
      hiss.volume.setValueAtTime(-60, now + 0.4)
      hiss.volume.linearRampToValueAtTime(LEVELS.match - 10, now + 2)
      hiss.volume.linearRampToValueAtTime(-60, now + 6)
      tone.getTransport().scheduleOnce(() => out.dispose(), `+7`)
      break
    }
    case 'cassette':
    case 'lid': {
      // Um estalo seco de metal: o chassi abrindo, a tampa fechando.
      const snap = new tone.MembraneSynth({
        volume: LEVELS.snap,
        pitchDecay: 0.008,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
      }).connect(room.master)
      snap.triggerAttackRelease(cue === 'lid' ? 'D3' : 'A3', 0.03, now)
      tap(now + 0.01)
      tone.getTransport().scheduleOnce(() => snap.dispose(), `+2`)
      break
    }
    case 'silence': {
      // Silêncio de repente é permitido; a volta é devagar.
      const gain = room.master.gain
      gain.cancelScheduledValues(now)
      gain.setValueAtTime(gain.value, now)
      gain.linearRampToValueAtTime(0, now + 0.08)
      gain.setValueAtTime(0, now + 3)
      gain.linearRampToValueAtTime(wantAudible && !hidden ? 1 : 0, now + 7)
      break
    }
  }
}

const CUE_CAPTIONS: Record<Cue, string> = {
  phone: '[O telefone chama do outro lado da linha]',
  line: '[Do outro lado, uma goteira. E a mesma valsa do seu rádio]',
  creak: '[Um rangido baixinho, atrás de você, à esquerda]',
  match: '[Um fósforo risca. O filme chia e queima]',
  silence: '[Silêncio. Até a lâmpada para de zumbir]',
  cassette: '[O chassi do filme estala ao abrir]',
  lid: '[A tampa do tanque fecha com um clique]',
}

// O ouvido acompanha a câmera da cena, para o som 3D virar com ela.
export function setListener(position: Point, forward: Point, up: Point) {
  listener = { position, forward, up }
  if (!room) return
  const l = room.tone.getListener()
  l.positionX.value = position[0]
  l.positionY.value = position[1]
  l.positionZ.value = position[2]
  l.forwardX.value = forward[0]
  l.forwardY.value = forward[1]
  l.forwardZ.value = forward[2]
  l.upX.value = up[0]
  l.upY.value = up[1]
  l.upZ.value = up[2]
}
