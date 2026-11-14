export type CinemaTier = "static" | "css" | "webgl";

export interface TierSignals {
  reducedMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  hasWebGL2: boolean;
  /** Undefined where the browser hides it (Safari, Firefox). */
  hardwareConcurrency?: number;
  /** Undefined where the browser hides it. */
  deviceMemory?: number;
  /** Dev-only manual override. */
  override?: CinemaTier | null;
}

export function decideTier(s: TierSignals): CinemaTier {
  if (s.override) return s.override;
  if (s.reducedMotion || s.saveData) return "static";
  if (s.coarsePointer || !s.hasWebGL2) return "css";
  if (s.hardwareConcurrency !== undefined && s.hardwareConcurrency < 6) return "css";
  if (s.deviceMemory !== undefined && s.deviceMemory < 4) return "css";
  return "webgl";
}

export function parseOverride(raw: string | null): CinemaTier | null {
  return raw === "static" || raw === "css" || raw === "webgl" ? raw : null;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** About two seconds of frames at 30-60 fps. */
export const FRAME_SAMPLES_NEEDED = 60;

export function isFrameBudgetExceeded(samples: number[], maxMedianMs = 24): boolean {
  if (samples.length < FRAME_SAMPLES_NEEDED) return false;
  return median(samples) > maxMedianMs;
}
