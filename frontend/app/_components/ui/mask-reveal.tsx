"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

interface MaskRevealProps {
  /** One entry per line; each rises out of its own overflow-hidden mask. */
  lines: ReactNode[];
  /** Hero use: play a CSS rise on load instead of waiting to scroll into view. */
  immediate?: boolean;
  /** Stagger between lines, seconds. */
  stagger?: number;
  className?: string;
}

/**
 * Z Crew's masked heading reveal. Lines are always rendered visible; below
 * the fold they slide up out of a mask the first time they enter the viewport.
 */
export function MaskReveal({ lines, immediate = false, stagger = 0.09, className = "" }: MaskRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || immediate) return;
    if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    const inner = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"));
    inner.forEach((el) => (el.style.transform = "translateY(108%)"));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        inner.forEach((el, i) =>
          animate(el, { transform: "translateY(0%)" }, { duration: 0.9, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }),
        );
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      inner.forEach((el) => (el.style.transform = ""));
    };
  }, [reduced, immediate, stagger]);

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span
            data-line
            className={`block ${immediate ? "animate-rise" : ""}`}
            style={immediate ? { animationDelay: `${0.12 + i * stagger}s` } : undefined}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
