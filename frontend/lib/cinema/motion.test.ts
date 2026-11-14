import { test } from "node:test";
import assert from "node:assert/strict";
import { moveStart } from "./motion.ts";

test("static tier never moves", () => {
  for (const m of ["dolly", "pushIn", "rackFocus", "whipPan"] as const) {
    assert.deepEqual(moveStart(m, 80, "static"), { x: 0, y: 0, scale: 1, blur: 0 });
  }
});

test("blur is webgl-only; css tier keeps the transform", () => {
  const css = moveStart("rackFocus", 80, "css");
  const gl = moveStart("rackFocus", 80, "webgl");
  assert.equal(css.blur, 0);
  assert.ok(gl.blur > 0);
  assert.equal(css.scale, gl.scale);
});

test("pushIn starts oversized, dolly starts small and low", () => {
  assert.ok(moveStart("pushIn", 80, "css").scale > 1);
  const d = moveStart("dolly", 80, "css");
  assert.ok(d.scale < 1);
  assert.ok(d.y > 0);
});

test("whipPan travels sideways, scaled by distance", () => {
  assert.ok(Math.abs(moveStart("whipPan", 100, "css").x - 220) < 1e-9);
  assert.ok(Math.abs(moveStart("whipPan", 50, "css").x - 110) < 1e-9);
});
