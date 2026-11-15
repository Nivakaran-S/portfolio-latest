import { clamp01, smoothstep } from "./math.ts";

/** Scroll progress through "Then it ships." at which the warp slams into the work rail. */
const IMPACT_START = 0.74;
const IMPACT_PEAK = 0.8;
const IMPACT_END = 0.95;

/**
 * The warp's landing. `flash` rises to 1 at the peak then drains; `ring` is the
 * shockwave's expansion, 0 until the peak and 1 once it has fully swept out.
 */
export function warpImpact(p: number): { flash: number; ring: number } {
  const flash = smoothstep(IMPACT_START, IMPACT_PEAK, p) * (1 - smoothstep(IMPACT_PEAK, IMPACT_END, p));
  const span = IMPACT_END - IMPACT_PEAK;
  const ring = clamp01((p - IMPACT_PEAK) / span);
  return { flash, ring };
}

/** 0 at `start`, 1 after `duration` seconds; never negative. Drives the hero's ignition blast. */
export function igniteProgress(now: number, start: number, duration: number): number {
  return clamp01((now - start) / duration);
}
