import { useEffect } from 'react'
import { useSettings } from '../game/settings'
import { LAST_DAY, useGame } from '../game/store'
import { setDread, setHidden, setMuted, setWaltzWrong } from './engine'
import { dayDread } from './mix'

// Liga o mudo, a aba escondida e o dia ao som da sala.
export function useRoomAudio() {
  const muted = useSettings((s) => s.muted)
  const day = useGame((s) => s.day)
  const lastDay = day === LAST_DAY
  useEffect(() => setMuted(muted), [muted])
  useEffect(() => setWaltzWrong(lastDay), [lastDay])
  useEffect(() => setDread(dayDread(day, LAST_DAY)), [day])
  useEffect(() => {
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
}
