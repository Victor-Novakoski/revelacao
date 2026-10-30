import { figureSpot } from '../../photos/figures'
import type { Detail, Line, Mood, Speaker } from '../script'

// Atalhos para escrever os roteiros dos dias.

export const say = (who: Speaker, text: string, extra: Partial<Line> = {}): Line => ({ who, text, ...extra })
export const bell = (who: Speaker, text: string): Line => ({ who, text, bell: true })
export const narrate = (text: string, extra: Partial<Line> = {}): Line => ({ who: 'narrator', text, ...extra })

// A fala de quem busca o envelope, conforme as cópias saíram.
export const moods = (who: Speaker, texts: Record<Mood, string>): Record<Mood, Line[]> => ({
  good: [say(who, texts.good)],
  pale: [say(who, texts.pale)],
  dark: [say(who, texts.dark)],
  blurry: [say(who, texts.blurry)],
  mixed: [say(who, texts.mixed)],
})

// O detalhe da lupa que é a figura, no lugar onde ela foi desenhada.
export function seen(roll: string, photo: string, text: string): Detail {
  return { id: `figura-${roll}-${photo}`, ...figureSpot(`${roll}/${photo}`), text, figure: true }
}
