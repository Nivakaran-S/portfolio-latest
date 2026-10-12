"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  /** Vertical travel in px across the element's scroll pass. +down, -up. */
  distance?: number;
  /** Semantic tag for the wrapper (keeps grid/list markup valid). */
  as?: "div" | "li" | "section";
  className?: string;
}

/** Largest drift in px either way. */
const MAX_TRAVEL = 24;

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const;

/**
 * Subtle layered parallax for section headers. The element drifts at most
 * MAX_TRAVEL px as it crosses the viewport, mapped 1:1 to scroll so it
 * tracks the reader's input and stops when they stop. Keep it off content
 * cards - cards drifting against each other read as noise, not depth.
 *
 * Transform-only (GPU composited) so it never triggers layout. Reduced
 * motion: zero travel.
 */
export function Parallax({
  children,
  distance = 60,
  as = "div",
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Subtle by design: drift is capped and maps 1:1 to scroll (no spring lag).
  const travel = reduced ? 0 : Math.min(Math.abs(distance), MAX_TRAVEL) * Math.sign(distance);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  const Tag = tags[as];

  return (
    <Tag
      // @ts-expect-error - ref union across motion tag variants
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </Tag>
  );
}
