import type { Ctx } from './draw'
import type { Frame } from './frame'
import { realScene } from './real'

// As fotos do dia 1. Fotos de verdade, ver photos/real.ts: o aniversário
// da Lúcia, neta da Dona Cida, e um casamento no Bom Retiro fotografado
// pelo Seu Nakamura. Nenhuma figura: o dia 1 mostra como é uma foto normal.

export type Scene = (ctx: Ctx, frame: Frame) => void

export const DAY1_SCENES: Record<string, Scene> = {
  'cida-lucia/presente': realScene('lucia-presente'),
  'cida-lucia/netos': realScene('lucia-netos'),
  'cida-lucia/boneca': realScene('lucia-boneca'),
  'cida-lucia/quintal': realScene('lucia-quintal'),
  'nakamura-casamento/chegada': realScene('retiro-chegada'),
  'nakamura-casamento/dossel': realScene('retiro-dossel'),
  'nakamura-casamento/brinde': realScene('retiro-brinde'),
  'nakamura-casamento/danca': realScene('retiro-danca'),
}
