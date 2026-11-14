"use client";

import { useEffect, useRef } from "react";
import { useCinema } from "../cinema-provider";
import { createEngine, type Layer } from "./engine";
import { createHeroLayer } from "./hero-layer";
import { createWarpLayer } from "./warp-layer";

/**
 * The single shared WebGL canvas. Sits at z -5: above the CSS StoryBackdrop
 * (-z-10) and below page content. The engine fades it out whenever neither
 * scene is on screen. Any failure hands control back to the CSS tier.
 */
export default function CinemaCanvas({ warpId }: { warpId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reportFrameTime, downgrade } = useCinema();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const warpEl = document.getElementById(warpId);
    const layers: Layer[] = [createHeroLayer(), ...(warpEl ? [createWarpLayer(warpEl)] : [])];
    try {
      const engine = createEngine(canvas, layers, { onFrameTime: reportFrameTime, onFail: downgrade });
      return () => engine.dispose();
    } catch {
      layers.forEach((l) => l.dispose());
      downgrade();
    }
  }, [warpId, reportFrameTime, downgrade]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-5] h-full w-full opacity-0 transition-opacity duration-500"
    />
  );
}
