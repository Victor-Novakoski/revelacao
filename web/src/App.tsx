import { Darkroom } from './scenes/darkroom/Darkroom'
import { TitleCard } from './ui/TitleCard'
import { DevelopHud } from './ui/DevelopHud'
import { TrayControls } from './ui/TrayControls'
import { useGame } from './game/store'
import { useReducedMotion } from './game/motion'

export default function App() {
  const screen = useGame((s) => s.screen)
  const enter = useGame((s) => s.enter)
  const leave = useGame((s) => s.leave)
  const reducedMotion = useReducedMotion()

  return (
    <main className="app">
      <div className="stage">
        <Darkroom reducedMotion={reducedMotion} active={screen === 'darkroom'} />
      </div>
      {screen === 'title' ? (
        <TitleCard onEnter={enter} />
      ) : (
        <>
          <TrayControls />
          <DevelopHud onLeave={leave} />
        </>
      )}
    </main>
  )
}
