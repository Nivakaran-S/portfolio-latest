import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
} from "three";
import { smoothstep } from "@/lib/cinema/math";
import type { FrameState, Layer } from "./engine";
import { WARP_FRAG, WARP_VERT } from "./shaders";

const STREAKS = 1400;

/**
 * The jump into the work rail. Streaks of light rush at the camera while the
 * "Then it ships." section passes through the viewport, peaking mid-section and
 * fading out before the rail pins.
 */
export function createWarpLayer(section: HTMLElement): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 80);

  const seed = new Float32Array(STREAKS * 2);
  const end = new Float32Array(STREAKS * 2);
  const angle = new Float32Array(STREAKS * 2);
  const radius = new Float32Array(STREAKS * 2);
  const position = new Float32Array(STREAKS * 2 * 3); // unused by the shader, required by three
  for (let i = 0; i < STREAKS; i++) {
    const s = (i * 0.61803398875) % 1;
    const a = (i * 2.399963) % (Math.PI * 2);
    const r = 0.6 + ((i * 0.7548776662) % 1) * 6.4;
    for (let v = 0; v < 2; v++) {
      const k = i * 2 + v;
      seed[k] = s;
      end[k] = v;
      angle[k] = a;
      radius[k] = r;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  geometry.setAttribute("aEnd", new BufferAttribute(end, 1));
  geometry.setAttribute("aAngle", new BufferAttribute(angle, 1));
  geometry.setAttribute("aRadius", new BufferAttribute(radius, 1));

  const material = new ShaderMaterial({
    vertexShader: WARP_VERT,
    fragmentShader: WARP_FRAG,
    uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 }, uProgress: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const lines = new LineSegments(geometry, material);
  lines.frustumCulled = false;
  scene.add(lines);

  return {
    scene,
    camera,
    update(s: FrameState) {
      const r = section.getBoundingClientRect();
      const p = (s.viewportH - r.top) / (r.height + s.viewportH); // 0 as it enters, 1 as it leaves
      if (p <= 0 || p >= 1) return false;
      material.uniforms.uTime.value = s.time;
      material.uniforms.uProgress.value = p;
      material.uniforms.uIntensity.value = smoothstep(0, 0.35, p) * (1 - smoothstep(0.75, 1, p));
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
