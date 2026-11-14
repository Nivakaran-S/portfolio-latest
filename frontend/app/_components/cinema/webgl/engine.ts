import { WebGLRenderer, type PerspectiveCamera, type Scene } from "three";

export interface FrameState {
  time: number;
  dt: number;
  scrollY: number;
  viewportH: number;
  /** Eased pointer position, -1..1 on both axes. */
  pointer: { x: number; y: number };
}

export interface Layer {
  scene: Scene;
  camera: PerspectiveCamera;
  /** Return true when this layer should draw this frame. */
  update(s: FrameState): boolean;
  resize(w: number, h: number): void;
  dispose(): void;
}

export interface EngineHooks {
  onFrameTime(ms: number): void;
  onFail(): void;
}

const MAX_DPR = 1.5;

/** One renderer, one loop, any number of layers. Throws if a context cannot be created. */
export function createEngine(
  canvas: HTMLCanvasElement,
  layers: Layer[],
  hooks: EngineHooks,
): { dispose(): void } {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let raf = 0;
  let last = performance.now();
  let shown = false;

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(w, h, false);
    layers.forEach((l) => l.resize(w, h));
  };

  const onPointer = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    hooks.onFail();
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const rawMs = now - last;
    last = now;
    const dt = Math.min(0.1, rawMs / 1000);
    const k = Math.min(1, dt * 3);
    pointer.x += (target.x - pointer.x) * k;
    pointer.y += (target.y - pointer.y) * k;

    const state: FrameState = {
      time: now / 1000,
      dt,
      scrollY: window.scrollY,
      viewportH: window.innerHeight,
      pointer,
    };

    renderer.clear();
    let drew = false;
    for (const layer of layers) {
      if (layer.update(state)) {
        renderer.render(layer.scene, layer.camera);
        drew = true;
      }
    }
    if (drew !== shown) {
      shown = drew;
      canvas.style.opacity = drew ? "1" : "0";
    }
    // Only judge frames that did real work. Slow frames count (they are the point);
    // only the huge gap after a hidden tab is ignored.
    if (drew && rawMs < 1000) hooks.onFrameTime(rawMs);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  canvas.addEventListener("webglcontextlost", onLost);
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      layers.forEach((l) => l.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
