"use client";

import { useEffect } from "react";
import { useCinema } from "../cinema-provider";
import { createEngine, type Layer } from "./engine";
import { createHeroLayer } from "./hero-layer";
import { createWarpLayer } from "./warp-layer";

/**
 * The single shared WebGL canvas. Sits at z -5: above the CSS StoryBackdrop
 * (-z-10) and below page content. The engine fades it out whenever neither
 * scene is on screen. Any failure hands control back to the CSS tier.
 *
 * The canvas is created inside the effect, not rendered by React: disposing
 * the engine force-loses its GL context, and a context cannot be reused, so
 * every mount (including Strict Mode's second one in dev) needs a fresh element.
 */
export default function CinemaCanvas({ warpId }: { warpId: string }) {
  const { reportFrameTime, downgrade } = useCinema();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className =
      "pointer-events-none fixed inset-0 z-[-5] h-full w-full opacity-0 transition-opacity duration-500";
    document.body.appendChild(canvas);

    const warpEl = document.getElementById(warpId);
    const layers: Layer[] = [createHeroLayer(), ...(warpEl ? [createWarpLayer(warpEl)] : [])];
    try {
      const engine = createEngine(canvas, layers, { onFrameTime: reportFrameTime, onFail: downgrade });
      return () => {
        engine.dispose();
        canvas.remove();
      };
    } catch {
      layers.forEach((l) => l.dispose());
      canvas.remove();
      downgrade();
    }
  }, [warpId, reportFrameTime, downgrade]);

  return null;
}
