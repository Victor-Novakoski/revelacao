import { Darkroom } from './scenes/darkroom/Darkroom'
import { TitleCard } from './ui/TitleCard'
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
        <div className="hud">
          <p className="soon">A primeira bandeja chega na etapa 2.</p>
          <button className="ghost" onClick={leave}>
            Voltar
          </button>
        </div>
      )}
    </main>
  )
}
