import { useEffect } from 'react'
import { useSettings } from '../game/settings'
import { setHidden, setMuted } from './engine'

// Liga o mudo e a aba escondida ao som da sala.
export function useRoomAudio() {
  const muted = useSettings((s) => s.muted)
  useEffect(() => setMuted(muted), [muted])
  useEffect(() => {
    const onChange = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
}
