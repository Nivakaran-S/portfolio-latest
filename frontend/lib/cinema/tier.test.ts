import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decideTier,
  parseOverride,
  median,
  isFrameBudgetExceeded,
  hasEnoughSamples,
  FRAME_SAMPLES_NEEDED,
  type TierSignals,
} from "./tier.ts";

const capable: TierSignals = {
  reducedMotion: false,
  saveData: false,
  coarsePointer: false,
  hasWebGL2: true,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

test("capable desktop gets webgl", () => {
  assert.equal(decideTier(capable), "webgl");
});

test("unknown cores and memory still get webgl (Safari/Firefox hide them)", () => {
  assert.equal(
    decideTier({ ...capable, hardwareConcurrency: undefined, deviceMemory: undefined }),
    "webgl",
  );
});

test("reduced motion and saveData force static", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true }), "static");
  assert.equal(decideTier({ ...capable, saveData: true }), "static");
});

test("touch, no WebGL2, few cores or low memory fall to css", () => {
  assert.equal(decideTier({ ...capable, coarsePointer: true }), "css");
  assert.equal(decideTier({ ...capable, hasWebGL2: false }), "css");
  assert.equal(decideTier({ ...capable, hardwareConcurrency: 4 }), "css");
  assert.equal(decideTier({ ...capable, deviceMemory: 2 }), "css");
});

test("reduced motion beats capability", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true, coarsePointer: false }), "static");
});

test("override wins over everything", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true, override: "webgl" }), "webgl");
  assert.equal(decideTier({ ...capable, override: "css" }), "css");
});

test("parseOverride accepts only the three tiers", () => {
  assert.equal(parseOverride("css"), "css");
  assert.equal(parseOverride("webgl"), "webgl");
  assert.equal(parseOverride("static"), "static");
  assert.equal(parseOverride("nonsense"), null);
  assert.equal(parseOverride(null), null);
});

test("median of odd, even and empty input", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), 0);
});

test("frame budget: fewer than 8 samples never downgrades", () => {
  const slow = Array.from({ length: 7 }, () => 400);
  assert.equal(hasEnoughSamples(slow), false);
  assert.equal(isFrameBudgetExceeded(slow), false);
});

test("enough samples: a full 60-frame window, or 2s of slow frames", () => {
  assert.equal(hasEnoughSamples(Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 16.7)), true);
  assert.equal(hasEnoughSamples(Array.from({ length: 10 }, () => 250)), true); // 2.5 s elapsed
  assert.equal(hasEnoughSamples(Array.from({ length: 10 }, () => 16.7)), false); // only 0.17 s elapsed
});

test("frame budget: a slideshow (500ms frames) downgrades after about 2s, not 30s", () => {
  assert.equal(isFrameBudgetExceeded(Array.from({ length: 8 }, () => 500)), true);
});

test("frame budget: median over 24ms downgrades, at or under does not", () => {
  const slow = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 30);
  const edge = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 24);
  const fast = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 16.7);
  assert.equal(isFrameBudgetExceeded(slow), true);
  assert.equal(isFrameBudgetExceeded(edge), false);
  assert.equal(isFrameBudgetExceeded(fast), false);
});

test("frame budget: a few spikes do not trip the median", () => {
  const mostlyFast = Array.from({ length: FRAME_SAMPLES_NEEDED }, (_, i) => (i < 5 ? 120 : 16.7));
  assert.equal(isFrameBudgetExceeded(mostlyFast), false);
});
