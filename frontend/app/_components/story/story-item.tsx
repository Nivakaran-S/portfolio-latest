"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

type From = "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "fade";

interface StoryItemProps {
  children: ReactNode;
  /** Kept for call-site compatibility; entrances no longer travel sideways or zoom. */
  from?: From;
  /** Kept for call-site compatibility; rise distance is fixed. */
  distance?: number;
  /** Stagger in seconds (capped at 0.3). */
  delay?: number;
  className?: string;
}

/** Headings rise this far; everything else only fades. */
const RISE_PX = 16;

/**
 * A story element that is always rendered visible, so content never depends
 * on JavaScript or on scroll position to appear. Elements already on screen
 * at load stay still; elements below the fold get one brief entrance the
 * first time they come into view - a short rise for headings, a fade for
 * everything else. No scroll-scrubbing, no sideways travel, no zoom.
 * Reduced motion: no entrance at all.
 */
export function StoryItem({ children, from = "up", delay = 0, className = "" }: StoryItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const rise = from !== "fade" && el.querySelector("h1, h2, h3") ? RISE_PX : 0;
    el.style.opacity = "0";
    if (rise) el.style.transform = `translateY(${rise}px)`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(
          el,
          { opacity: 1, transform: "translateY(0px)" },
          { duration: 0.5, delay: Math.min(0.3, delay), ease: [0.22, 1, 0.36, 1] },
        );
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [reduced, from, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
