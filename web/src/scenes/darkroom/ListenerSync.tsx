import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { setListener } from '../../audio/engine'

const forward = new Vector3()
const up = new Vector3()

// O ouvido do jogador fica onde está a câmera.
export function ListenerSync() {
  useFrame(({ camera }) => {
    camera.getWorldDirection(forward)
    up.set(0, 1, 0).applyQuaternion(camera.quaternion)
    const p = camera.position
    setListener([p.x, p.y, p.z], [forward.x, forward.y, forward.z], [up.x, up.y, up.z])
  })
  return null
}
