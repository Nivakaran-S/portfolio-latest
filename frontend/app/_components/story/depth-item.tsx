"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { StoryItem } from "@/app/_components/story/story-item";

type From = "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "fade";

interface DepthItemProps {
  children: ReactNode;
  /** Direction the element travels in from as it reaches centre screen. */
  from?: From;
  /** Travel distance in px (or zoom delta basis). */
  distance?: number;
  /** Shifts when the travel starts within the element's scroll pass (0-0.5); also staggers the entrance. */
  delay?: number;
  className?: string;
}

const OFFSET: Record<From, { x?: number; y?: number; z?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  "zoom-in": { z: -1 },
  "zoom-out": { z: 1 },
  fade: {},
};

/**
 * The home page's layered parallax. Each element travels in from its own
 * direction and distance as it crosses into view, settling by the time it
 * reaches centre screen, so neighbouring elements move at different rates.
 *
 * Travel maps 1:1 to scroll position (no spring), so it tracks the reader's
 * input and stops the moment they stop. Transform only - opacity is never
 * driven by scroll here. The Z Crew fade-and-rise entrance (StoryItem) runs
 * inside the parallax wrapper, on its own element, so the two transforms never
 * fight. Reduced motion: no parallax travel.
 */
export function DepthItem({
  children,
  from = "up",
  distance = 80,
  delay = 0,
  className = "",
}: DepthItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const o = OFFSET[from];
  const k = reduced ? 0 : 1;
  const start = Math.min(0.5, Math.max(0, delay));
  const range = [start, 0.92];

  const x = useTransform(scrollYProgress, range, [(o.x ?? 0) * distance * k, 0]);
  const y = useTransform(scrollYProgress, range, [(o.y ?? 0) * distance * k, 0]);
  const scale = useTransform(scrollYProgress, range, [1 + (o.z ?? 0) * 0.16 * k, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ x, y, scale }}>
      <StoryItem from={from} delay={delay} className="h-full">
        {children}
      </StoryItem>
    </motion.div>
  );
}
