"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface RotatingTextProps {
  items: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  pause?: number;
  className?: string;
}

/**
 * Looping typewriter that types each phrase, holds, erases, and moves to the
 * next. Reduced-motion users see the first phrase statically. All setState is
 * deferred inside timeouts (satisfies react-hooks/set-state-in-effect).
 */
export function RotatingText({
  items,
  typeSpeed = 55,
  eraseSpeed = 28,
  pause = 1700,
  className = "",
}: RotatingTextProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">("typing");

  useEffect(() => {
    if (reduced || items.length === 0) return;
    const current = items[index % items.length];
    let timer: number;

    if (phase === "typing") {
      if (display.length < current.length) {
        timer = window.setTimeout(
          () => setDisplay(current.slice(0, display.length + 1)),
          typeSpeed
        );
      } else {
        timer = window.setTimeout(() => setPhase("pausing"), pause);
      }
    } else if (phase === "pausing") {
      timer = window.setTimeout(() => setPhase("erasing"), 150);
    } else {
      if (display.length > 0) {
        timer = window.setTimeout(
          () => setDisplay(current.slice(0, display.length - 1)),
          eraseSpeed
        );
      } else {
        timer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % items.length);
          setPhase("typing");
        }, 200);
      }
    }
    return () => window.clearTimeout(timer);
  }, [display, phase, index, items, typeSpeed, eraseSpeed, pause, reduced]);

  if (reduced) {
    return <span className={className}>{items[0]}</span>;
  }

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{items[0]}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block w-[0.5ch] animate-pulse-glow text-neon-cyan"
      >
        ▍
      </span>
    </span>
  );
}
