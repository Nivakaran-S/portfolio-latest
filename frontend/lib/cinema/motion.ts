import type { CinemaTier } from "./tier.ts";

export type CinemaMove = "dolly" | "pushIn" | "rackFocus" | "whipPan";

export interface MoveStart {
  x: number;
  y: number;
  scale: number;
  /** Gaussian blur radius in px at the start of the move. */
  blur: number;
}

/**
 * Where a scroll-scrubbed element starts before settling to identity.
 * Blur is expensive, so only the webgl tier (capable desktops) gets it;
 * the css tier keeps the transform half of each move.
 */
export function moveStart(move: CinemaMove, distance: number, tier: CinemaTier): MoveStart {
  if (tier === "static") return { x: 0, y: 0, scale: 1, blur: 0 };
  const base: Record<CinemaMove, MoveStart> = {
    dolly: { x: 0, y: distance * 0.6, scale: 0.9, blur: 0 },
    pushIn: { x: 0, y: 0, scale: 1.14, blur: 0 },
    rackFocus: { x: 0, y: distance * 0.2, scale: 1.04, blur: 12 },
    whipPan: { x: distance * 2.2, y: 0, scale: 1, blur: 10 },
  };
  const s = base[move];
  return { ...s, blur: tier === "webgl" ? s.blur : 0 };
}
