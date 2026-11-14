import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp01, smoothstep } from "./math.ts";

test("clamp01 bounds its input", () => {
  assert.equal(clamp01(-3), 0);
  assert.equal(clamp01(0.4), 0.4);
  assert.equal(clamp01(9), 1);
});

test("smoothstep is 0 below, 1 above, and 0.5 at the midpoint", () => {
  assert.equal(smoothstep(0, 1, -1), 0);
  assert.equal(smoothstep(0, 1, 2), 1);
  assert.equal(smoothstep(0, 1, 0.5), 0.5);
});

test("smoothstep works for a reversed edge pair", () => {
  assert.equal(smoothstep(1, 0, 0.5), 0.5);
});
