import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldPulse, shouldShowIntro, hasSeenIntro, INTRO_KEY, INTRO_MAX_DELAY_MS } from "./timing.ts";

test("pulses closer than the min gap are ignored", () => {
  assert.equal(shouldPulse(1000, 0), false);
  assert.equal(shouldPulse(1499, 0), false);
  assert.equal(shouldPulse(1500, 0), true);
});

test("the very first pulse always fires", () => {
  assert.equal(shouldPulse(5, -Infinity), true);
});

test("intro plays only on first home visit with motion allowed", () => {
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/", seen: false, elapsedMs: 400, scrollY: 0 }), true);
  assert.equal(shouldShowIntro({ tier: "webgl", pathname: "/", seen: false, elapsedMs: 400, scrollY: 0 }), true);
});

test("intro never plays on static, repeat visits, or deep links", () => {
  assert.equal(shouldShowIntro({ tier: "static", pathname: "/", seen: false, elapsedMs: 400, scrollY: 0 }), false);
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/", seen: true, elapsedMs: 400, scrollY: 0 }), false);
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/work/medverse", seen: false, elapsedMs: 400, scrollY: 0 }), false);
});

test("hasSeenIntro reads the flag", () => {
  assert.equal(hasSeenIntro(() => ({ getItem: (k: string) => (k === INTRO_KEY ? "1" : null) })), true);
  assert.equal(hasSeenIntro(() => ({ getItem: () => null })), false);
});

test("hasSeenIntro treats blocked or throwing storage as seen (no intro, no throw)", () => {
  assert.equal(
    hasSeenIntro(() => {
      throw new DOMException("denied", "SecurityError");
    }),
    true,
  );
  assert.equal(
    hasSeenIntro(() => ({
      getItem: () => {
        throw new Error("boom");
      },
    })),
    true,
  );
});

test("intro never snaps over a page the visitor has already been reading (slow JS)", () => {
  const base = { tier: "css", pathname: "/", seen: false, scrollY: 0 } as const;
  assert.equal(shouldShowIntro({ ...base, elapsedMs: INTRO_MAX_DELAY_MS }), true);
  assert.equal(shouldShowIntro({ ...base, elapsedMs: INTRO_MAX_DELAY_MS + 1 }), false);
});

test("intro never plays once the visitor has scrolled", () => {
  assert.equal(
    shouldShowIntro({ tier: "css", pathname: "/", seen: false, elapsedMs: 300, scrollY: 40 }),
    false,
  );
});
