import type { CinemaTier } from "./tier.ts";

export const INTRO_KEY = "cinema:intro";

/** Ignore letterbox pulses that follow another too closely, so fast scrolling never flickers the bars. */
export function shouldPulse(now: number, last: number, minGapMs = 1500): boolean {
  return now - last >= minGapMs;
}

export function shouldShowIntro(i: { tier: CinemaTier; pathname: string; seen: boolean }): boolean {
  return i.tier !== "static" && i.pathname === "/" && !i.seen;
}

/** Blocked or throwing storage counts as "seen": no intro, no exception. */
export function hasSeenIntro(getStorage: () => Pick<Storage, "getItem">): boolean {
  try {
    return getStorage().getItem(INTRO_KEY) === "1";
  } catch {
    return true;
  }
}
