import {
  AdditiveBlending,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
} from "three";
import { clamp01 } from "@/lib/cinema/math";
import { igniteProgress } from "@/lib/cinema/impact";
import type { FrameState, Layer } from "./engine";
import { FULLSCREEN_VERT, REACTOR_FRAG } from "./shaders";

/** Seconds the ignition blast takes to play out. */
const IGNITE_SECONDS = 1.8;

/**
 * The hero: an arc-reactor glow with a hard anamorphic streak behind the
 * portrait. On the first drawn frame it ignites: a white flash, a shockwave ring
 * and a short camera shake. No particles, by design: the hero stays clean.
 * The camera still dollies forward on scroll, which pushes the glow back.
 */
export function createHeroLayer(): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const reactorGeo = new PlaneGeometry(2, 2);
  const reactorMat = new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader: REACTOR_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uIgnite: { value: 0 },
      uAspect: { value: 1 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const reactor = new Mesh(reactorGeo, reactorMat);
  reactor.frustumCulled = false;
  scene.add(reactor);

  let startedAt: number | null = null;

  return {
    scene,
    camera,
    update(s: FrameState) {
      if (s.scrollY > s.viewportH * 2.3) return false; // past the hero
      if (startedAt === null) startedAt = s.time; // the blast fires on the first drawn frame
      const ignite = igniteProgress(s.time, startedAt, IGNITE_SECONDS);
      const p = clamp01(s.scrollY / (s.viewportH * 1.3));

      const shake = Math.pow(1 - ignite, 2) * 0.12;
      camera.position.set(
        s.pointer.x * 0.35 + Math.sin(s.time * 60) * shake,
        -s.pointer.y * 0.2 + Math.cos(s.time * 53) * shake,
        6 - p * 5,
      );
      camera.lookAt(0, 0, -5);

      reactorMat.uniforms.uTime.value = s.time;
      reactorMat.uniforms.uProgress.value = p;
      reactorMat.uniforms.uIgnite.value = ignite;
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      reactorMat.uniforms.uAspect.value = w / h;
    },
    dispose() {
      reactorGeo.dispose();
      reactorMat.dispose();
    },
  };
}
