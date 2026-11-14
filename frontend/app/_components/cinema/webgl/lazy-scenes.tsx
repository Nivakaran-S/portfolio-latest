"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCinema } from "../cinema-provider";

// ssr: false is only legal inside a Client Component, which is why this file exists.
// A failed chunk load resolves to an empty component: the CSS backdrop simply stays.
const CinemaCanvas = dynamic(
  () => import("./cinema-canvas").catch(() => ({ default: () => null })),
  { ssr: false },
);

/** Loads three.js only on the webgl tier, and only once the page is idle. */
export function LazyScenes({ warpId }: { warpId: string }) {
  const { tier } = useCinema();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (tier !== "webgl") return;
    const arm = () => setArmed(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(arm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, 1200);
    return () => window.clearTimeout(t);
  }, [tier]);

  if (tier !== "webgl" || !armed) return null;
  return <CinemaCanvas warpId={warpId} />;
}
