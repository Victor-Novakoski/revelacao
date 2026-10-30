import { Darkroom } from './scenes/darkroom/Darkroom'
import { TitleCard } from './ui/TitleCard'
import { DevelopHud } from './ui/DevelopHud'
import { TrayControls } from './ui/TrayControls'
import { SoundControls } from './ui/SoundControls'
import { Captions } from './ui/Captions'
import { useGame } from './game/store'
import { useSettings } from './game/settings'
import { useReducedMotion } from './game/motion'
import { start } from './audio/engine'
import { useRoomAudio } from './audio/useRoomAudio'

export default function App() {
  const screen = useGame((s) => s.screen)
  const enter = useGame((s) => s.enter)
  const leave = useGame((s) => s.leave)
  const reducedMotion = useReducedMotion()
  useRoomAudio()

  // O som da sala começa no clique de abrir a loja, nunca antes.
  const open = () => {
    start(useSettings.getState().muted)
    enter()
  }

  return (
    <main className="app">
      <div className="stage">
        <Darkroom reducedMotion={reducedMotion} active={screen === 'darkroom'} />
      </div>
      {screen === 'title' ? (
        <TitleCard onEnter={open} />
      ) : (
        <>
          <TrayControls />
          <DevelopHud onLeave={leave} />
        </>
      )}
      <Captions />
      <SoundControls />
    </main>
  )
}
