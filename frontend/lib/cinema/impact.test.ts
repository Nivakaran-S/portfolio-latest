import { test } from "node:test";
import assert from "node:assert/strict";
import { warpImpact, igniteProgress } from "./impact.ts";

test("warp impact is silent while the streaks build and after the rail lands", () => {
  assert.deepEqual(warpImpact(0.2), { flash: 0, ring: 0 });
  assert.equal(warpImpact(0.5).flash, 0);
  assert.equal(warpImpact(1).flash, 0);
});

test("warp impact flashes at full strength at the peak, with the ring not yet expanding", () => {
  const at = warpImpact(0.8);
  assert.equal(at.flash, 1);
  assert.equal(at.ring, 0);
});

test("warp impact ring expands from 0 to 1 after the peak and then holds", () => {
  const a = warpImpact(0.84).ring;
  const b = warpImpact(0.9).ring;
  assert.ok(a > 0 && a < b && b < 1);
  assert.equal(warpImpact(0.95).ring, 1);
  assert.equal(warpImpact(1).ring, 1);
});

test("flash rises into the peak and falls away after it", () => {
  assert.ok(warpImpact(0.76).flash > 0);
  assert.ok(warpImpact(0.76).flash < warpImpact(0.79).flash);
  assert.ok(warpImpact(0.85).flash < 1);
  assert.ok(warpImpact(0.85).flash > warpImpact(0.93).flash);
});

test("ignite progress runs 0..1 over its duration and clamps", () => {
  assert.equal(igniteProgress(10, 10, 1.8), 0);
  assert.ok(Math.abs(igniteProgress(10.9, 10, 1.8) - 0.5) < 1e-9);
  assert.equal(igniteProgress(12, 10, 1.8), 1);
  assert.equal(igniteProgress(5, 10, 1.8), 0); // clock before the start never goes negative
});
