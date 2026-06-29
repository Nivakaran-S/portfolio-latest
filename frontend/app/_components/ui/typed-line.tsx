"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface TypedLineProps {
  text: string;
  /** ms per character */
  speed?: number;
  className?: string;
}

/**
 * One-shot typewriter - types `text` in once on mount, then the cursor
 * stops. No looping (a looping eyebrow distracts). The full text is always
 * present for screen readers / no-JS; the animated copy is aria-hidden.
 * Reduced-motion users get the full line immediately.
 *
 * All setState happens inside async callbacks (interval / timeout) to
 * satisfy react-hooks/set-state-in-effect.
 */
export function TypedLine({ text, speed = 38, className = "" }: TypedLineProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => {
        setShown(text);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(t);
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, reduced]);

  return (
    <span className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={`ml-1 inline-block w-[0.55ch] text-neon-cyan ${
          done ? "opacity-0" : "animate-pulse-glow"
        }`}
      >
        ▍
      </span>
    </span>
  );
}
