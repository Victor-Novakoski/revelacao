import { Component, type ReactNode } from 'react'

// Sem WebGL, ou se a sala não baixar, o resto do jogo continua: as telas,
// as falas e "Ver as fotos sem revelar" não dependem da cena 3D.
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
