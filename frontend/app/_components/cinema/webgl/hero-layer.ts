import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
} from "three";
import { clamp01 } from "@/lib/cinema/math";
import { igniteProgress } from "@/lib/cinema/impact";
import type { FrameState, Layer } from "./engine";
import {
  DUST_FRAG,
  DUST_VERT,
  FULLSCREEN_VERT,
  REACTOR_FRAG,
  SPARKS_FRAG,
  SPARKS_VERT,
} from "./shaders";

const DUST = 1800;
const SPARKS = 900;
/** Seconds the ignition blast takes to play out. */
const IGNITE_SECONDS = 1.8;

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

/**
 * The hero: an arc-reactor glow with a hard anamorphic streak behind the
 * portrait, orange-and-white sparks streaking upward, cold dust for depth. On
 * the first drawn frame it ignites: white flash, a shockwave ring, sparks thrown
 * outward, and a short camera shake. The camera then dollies forward on scroll.
 */
export function createHeroLayer(): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 60);
  camera.position.set(0, 0, 6);
  const rand = mulberry32(1337);

  // Cold dust (hard-edged points).
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (rand() - 0.5) * 18;
    dustPos[i * 3 + 1] = (rand() - 0.5) * 10;
    dustPos[i * 3 + 2] = rand() * 15 - 12;
    dustSeed[i] = rand();
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute("position", new BufferAttribute(dustPos, 3));
  dustGeo.setAttribute("aSeed", new BufferAttribute(dustSeed, 1));
  const dustMat = new ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: DUST_FRAG,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const dust = new Points(dustGeo, dustMat);
  dust.frustumCulled = false;

  // Sparks (line segments: head + tail per spark).
  const sparkSeed = new Float32Array(SPARKS * 2);
  const sparkEnd = new Float32Array(SPARKS * 2);
  const sparkX = new Float32Array(SPARKS * 2);
  const sparkZ = new Float32Array(SPARKS * 2);
  const sparkPos = new Float32Array(SPARKS * 2 * 3); // unused by the shader, required by three
  for (let i = 0; i < SPARKS; i++) {
    const seed = rand();
    const x = (rand() - 0.5) * 14;
    const z = rand() * 12 - 10;
    for (let v = 0; v < 2; v++) {
      const k = i * 2 + v;
      sparkSeed[k] = seed;
      sparkEnd[k] = v;
      sparkX[k] = x;
      sparkZ[k] = z;
    }
  }
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute("position", new BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute("aSeed", new BufferAttribute(sparkSeed, 1));
  sparkGeo.setAttribute("aEnd", new BufferAttribute(sparkEnd, 1));
  sparkGeo.setAttribute("aX", new BufferAttribute(sparkX, 1));
  sparkGeo.setAttribute("aZ", new BufferAttribute(sparkZ, 1));
  const sparkMat = new ShaderMaterial({
    vertexShader: SPARKS_VERT,
    fragmentShader: SPARKS_FRAG,
    uniforms: { uTime: { value: 0 }, uIgnite: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const sparks = new LineSegments(sparkGeo, sparkMat);
  sparks.frustumCulled = false;

  // Reactor glow + streak + ignition blast, a fullscreen quad drawn first.
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
  reactor.renderOrder = -1;

  scene.add(reactor, dust, sparks);

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

      dustMat.uniforms.uTime.value = s.time;
      sparkMat.uniforms.uTime.value = s.time;
      sparkMat.uniforms.uIgnite.value = ignite;
      reactorMat.uniforms.uTime.value = s.time;
      reactorMat.uniforms.uProgress.value = p;
      reactorMat.uniforms.uIgnite.value = ignite;
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      reactorMat.uniforms.uAspect.value = w / h;
      dustMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.5);
    },
    dispose() {
      dustGeo.dispose();
      dustMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      reactorGeo.dispose();
      reactorMat.dispose();
    },
  };
}
