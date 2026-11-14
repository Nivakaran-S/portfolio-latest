import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
} from "three";
import { clamp01 } from "@/lib/cinema/math";
import type { FrameState, Layer } from "./engine";
import { HERO_POINTS_FRAG, HERO_POINTS_VERT, RAYS_FRAG, RAYS_VERT } from "./shaders";

const COUNT = 4500;

/** Small deterministic PRNG so the field is identical every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Light field behind the pinned hero (230svh tall): the camera dollies forward as you scroll. */
export function createHeroLayer(): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const rand = mulberry32(1337);
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (rand() - 0.5) * 18;
    positions[i * 3 + 1] = (rand() - 0.5) * 10;
    positions[i * 3 + 2] = rand() * 15 - 12;
    seeds[i] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

  const pointsMat = new ShaderMaterial({
    vertexShader: HERO_POINTS_VERT,
    fragmentShader: HERO_POINTS_FRAG,
    uniforms: { uTime: { value: 0 }, uFocus: { value: 4 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, pointsMat);
  points.frustumCulled = false;

  const raysGeo = new PlaneGeometry(2, 2);
  const raysMat = new ShaderMaterial({
    vertexShader: RAYS_VERT,
    fragmentShader: RAYS_FRAG,
    uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const rays = new Mesh(raysGeo, raysMat);
  rays.frustumCulled = false;
  rays.renderOrder = -1;

  scene.add(rays, points);

  return {
    scene,
    camera,
    update(s: FrameState) {
      if (s.scrollY > s.viewportH * 2.3) return false; // past the hero
      const p = clamp01(s.scrollY / (s.viewportH * 1.3));
      camera.position.set(s.pointer.x * 0.35, -s.pointer.y * 0.2, 6 - p * 5);
      camera.lookAt(0, 0, -5);
      pointsMat.uniforms.uTime.value = s.time;
      pointsMat.uniforms.uFocus.value = 4 - p * 1.5;
      raysMat.uniforms.uTime.value = s.time;
      raysMat.uniforms.uProgress.value = p;
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pointsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.5);
    },
    dispose() {
      geometry.dispose();
      pointsMat.dispose();
      raysGeo.dispose();
      raysMat.dispose();
    },
  };
}
