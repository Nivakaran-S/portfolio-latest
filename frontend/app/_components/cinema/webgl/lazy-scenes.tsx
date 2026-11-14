"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useCinema } from "../cinema-provider";

type CanvasComponent = ComponentType<{ warpId: string }>;

/**
 * Loads three.js only on the webgl tier, and only once the page is idle.
 *
 * The chunk is fetched with a plain import() from an effect (client-only by
 * construction, so no ssr:false is needed) rather than next/dynamic, because a
 * failed load must be able to call downgrade(): otherwise the tier stays
 * "webgl" with no canvas, leaving the hero transparent and the CSS sparks off.
 */
export function LazyScenes({ warpId }: { warpId: string }) {
  const { tier, downgrade } = useCinema();
  const [Canvas, setCanvas] = useState<CanvasComponent | null>(null);

  useEffect(() => {
    if (tier !== "webgl") return;
    let cancelled = false;
    const load = () => {
      import("./cinema-canvas")
        .then((m) => {
          if (!cancelled) setCanvas(() => m.default);
        })
        .catch(() => {
          if (!cancelled) downgrade();
        });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [tier, downgrade]);

  if (tier !== "webgl" || !Canvas) return null;
  return <Canvas warpId={warpId} />;
}
