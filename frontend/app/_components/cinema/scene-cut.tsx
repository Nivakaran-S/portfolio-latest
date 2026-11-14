"use client";

import { useEffect, useRef } from "react";
import { useCinema } from "./cinema-provider";

/**
 * A 1px sentinel placed between story beats. When it crosses the middle of
 * the viewport it pulses the letterbox (throttled by the provider), which
 * reads as a cut between scenes. Renders nothing on the static tier.
 */
export function SceneCut() {
  const ref = useRef<HTMLDivElement>(null);
  const { tier, pulseLetterbox } = useCinema();

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === "static") return;
    let first = true; // the observer's initial callback is not a crossing
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          return;
        }
        if (entry.isIntersecting) pulseLetterbox();
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tier, pulseLetterbox]);

  if (tier === "static") return null;
  return <div ref={ref} aria-hidden="true" className="h-px w-full" />;
}
