"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";

type From = "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "fade";

interface StoryItemProps {
  children: ReactNode;
  /** Direction the element travels in from as the beat is reached. */
  from?: From;
  /** Travel distance in px (or zoom delta basis). */
  distance?: number;
  /** Shifts when the entrance starts within the element's scroll pass (0-0.5). */
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

const SPRING = { stiffness: 80, damping: 26, mass: 0.45, restDelta: 0.5 };

/**
 * One independently-travelling story element. As the element crosses into
 * the viewport its scroll progress (bottom→centre) drives a directional
 * fly-in that settles by the time it reaches centre screen. Give siblings
 * different `from` / `distance` / `delay` so they travel independently and
 * the beat composes itself as you scroll.
 *
 * Transform + opacity only (GPU). Reduced-motion → rendered static.
 */
export function StoryItem({
  children,
  from = "up",
  distance = 80,
  delay = 0,
  className = "",
}: StoryItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const o = OFFSET[from];
  const start = Math.min(0.5, Math.max(0, delay));
  const end = 0.92;

  const opacity = useTransform(scrollYProgress, [start, start + 0.45], [0, 1]);
  const xRaw = useTransform(scrollYProgress, [start, end], [(o.x ?? 0) * distance, 0]);
  const yRaw = useTransform(scrollYProgress, [start, end], [(o.y ?? 0) * distance, 0]);
  const sRaw = useTransform(
    scrollYProgress,
    [start, end],
    [1 + (o.z ?? 0) * 0.16, 1]
  );

  const x = useSpring(xRaw, SPRING);
  const y = useSpring(yRaw, SPRING);
  const scale = useSpring(sRaw, SPRING);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ opacity, x, y, scale }}>
      {children}
    </motion.div>
  );
}
