import { creature } from './draw'
import type { Scene } from './day1'
import { PLACEMENTS } from './figures'
import { X, Y } from './places'
import { realFigure } from './real'
import { WEEK1_SCENES } from './week1'
import { WEEK2_SCENES } from './week2'

// As fotos dos dias 2 a 10 e a figura em cada uma, saída de figures.ts.
export const STORY_SCENES: Record<string, Scene> = { ...WEEK1_SCENES, ...WEEK2_SCENES }

export const STORY_FIGURES: Record<string, Scene> = Object.fromEntries(
  Object.entries(PLACEMENTS).map(([key, p]) => [
    key,
    p.real ? realFigure(p.x, p.foot, p.h, p.front) : (((ctx) => creature(ctx, X(p.x), Y(p.foot), Y(p.h))) as Scene),
  ]),
)
