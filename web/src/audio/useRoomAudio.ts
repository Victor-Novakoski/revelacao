import { useEffect } from 'react'
import { useSettings } from '../game/settings'
import { LAST_DAY, useGame } from '../game/store'
import { setHidden, setMuted, setWaltzWrong } from './engine'

// Liga o mudo, a aba escondida e o dia ao som da sala.
export function useRoomAudio() {
  const muted = useSettings((s) => s.muted)
  const lastDay = useGame((s) => s.day === LAST_DAY)
  useEffect(() => setMuted(muted), [muted])
  useEffect(() => setWaltzWrong(lastDay), [lastDay])
  useEffect(() => {
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
}
