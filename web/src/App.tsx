import { useState } from 'react'
import { Darkroom } from './scenes/darkroom/Darkroom'
import { TitleCard } from './ui/TitleCard'
import { DevelopHud } from './ui/DevelopHud'
import { TrayControls } from './ui/TrayControls'
import { SoundControls } from './ui/SoundControls'
import { Captions } from './ui/Captions'
import { Counter } from './ui/Counter'
import { EnlargerPanel } from './ui/EnlargerPanel'
import { LinePanel } from './ui/LinePanel'
import { Wall } from './ui/Wall'
import { EndCard } from './ui/EndCard'
import { BurnPanel } from './ui/BurnPanel'
import { ChoiceCard } from './ui/ChoiceCard'
import { currentStep } from './game/day'
import { hasProgress, script, useGame, viewOf } from './game/store'
import { useSettings } from './game/settings'
import { useReducedMotion } from './game/motion'
import { start } from './audio/engine'
import { useRoomAudio } from './audio/useRoomAudio'

export default function App() {
  const screen = useGame((s) => s.screen)
  const day = useGame((s) => s.day)
  const cursor = useGame((s) => s.cursor)
  const ending = useGame((s) => s.ending)
  const resume = useGame(hasProgress)
  const game = useGame.getState()
  const view = viewOf({ screen, day, cursor, ending })
  const reducedMotion = useReducedMotion()
  // No fim do dia, o jogador pode rever o mural sem andar o roteiro.
  const [reviewing, setReviewing] = useState(false)
  useRoomAudio()

  // O som da sala começa no clique de abrir a loja, nunca antes.
  const withSound = (go: () => void) => () => {
    start(useSettings.getState().muted)
    go()
  }

  const step = currentStep(script(day), cursor)
  const wallHint = step.kind === 'wall' ? step.hint : undefined

  const overlay = () => {
    if (screen === 'title')
      return (
        <TitleCard
          resume={resume}
          onEnter={withSound(game.open)}
          onRestart={withSound(game.restart)}
          onGallery={game.showGallery}
        />
      )
    if (screen === 'gallery') return <Wall gallery onDone={game.leave} doneLabel="Voltar" />
    if (reviewing) return <Wall gallery={false} onDone={() => setReviewing(false)} doneLabel="Voltar" />
    switch (view) {
      case 'counter':
        return <Counter />
      case 'enlarger':
        return <EnlargerPanel />
      case 'tray':
        return (
          <>
            <TrayControls />
            <DevelopHud />
          </>
        )
      case 'line':
        return <LinePanel />
      case 'wall':
        return <Wall gallery={false} hint={wallHint} onDone={game.next} doneLabel="Pôr nos envelopes" />
      case 'burn':
        return <BurnPanel />
      case 'choice':
        return <ChoiceCard />
      case 'end':
        return (
          <EndCard onWall={() => setReviewing(true)} onTitle={game.leave} onNext={game.nextDay} onRestart={game.restart} />
        )
      default:
        return null
    }
  }

  const dim =
    view === 'counter' ||
    view === 'wall' ||
    view === 'burn' ||
    view === 'choice' ||
    view === 'end' ||
    screen === 'gallery' ||
    reviewing

  return (
    <main className="app">
      <div className={`stage ${dim ? 'dim' : ''}`}>
        <Darkroom reducedMotion={reducedMotion} view={view} />
      </div>
      {overlay()}
      {screen !== 'title' && (
        <button className="icon exit" onClick={game.leave} aria-label="Sair para o título" title="Sair para o título">
          <span aria-hidden="true">✕</span>
        </button>
      )}
      <Captions />
      <SoundControls />
    </main>
  )
}
