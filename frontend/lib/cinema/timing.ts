import type { CinemaTier } from "./tier.ts";

export const INTRO_KEY = "cinema:intro";

/** Ignore letterbox pulses that follow another too closely, so fast scrolling never flickers the bars. */
export function shouldPulse(now: number, last: number, minGapMs = 1500): boolean {
  return now - last >= minGapMs;
}

/** Past this, the visitor is already reading the page; a black overlay would be an ambush. */
export const INTRO_MAX_DELAY_MS = 2000;

export function shouldShowIntro(i: {
  tier: CinemaTier;
  pathname: string;
  seen: boolean;
  /** Milliseconds since navigation start, at decision time. */
  elapsedMs: number;
  scrollY: number;
}): boolean {
  return (
    i.tier !== "static" &&
    i.pathname === "/" &&
    !i.seen &&
    i.elapsedMs <= INTRO_MAX_DELAY_MS &&
    i.scrollY < 1
  );
}

/** Blocked or throwing storage counts as "seen": no intro, no exception. */
export function hasSeenIntro(getStorage: () => Pick<Storage, "getItem">): boolean {
  try {
    return getStorage().getItem(INTRO_KEY) === "1";
  } catch {
    return true;
  }
}
