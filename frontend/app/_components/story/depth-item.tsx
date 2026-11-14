"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useCinemaTier } from "@/app/_components/cinema/cinema-provider";
import { moveStart, type CinemaMove } from "@/lib/cinema/motion";

type From = "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "fade";

interface DepthItemProps {
  children: ReactNode;
  /** Direction the element travels in from as it reaches centre screen. */
  from?: From;
  /** Travel distance in px (or zoom delta basis). */
  distance?: number;
  /** Shifts when the travel starts within the element's scroll pass (0-0.5). */
  delay?: number;
  className?: string;
  /** Named camera move; when set it replaces `from`. */
  cinema?: CinemaMove;
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
 * animated, so content is readable before JavaScript and at every scroll
 * position. Reduced motion: no travel. An optional named camera move
 * (`cinema`) swaps the entry for a push-in, dolly, rack-focus or whip-pan.
 */
export function DepthItem({
  children,
  from = "up",
  distance = 80,
  delay = 0,
  className = "",
  cinema,
}: DepthItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const tier = useCinemaTier();
  const o = OFFSET[from];
  const cm = cinema ? moveStart(cinema, distance, tier) : null;
  const k = reduced ? 0 : 1;
  const start = Math.min(0.5, Math.max(0, delay));
  const range = [start, 0.92];

  const x = useTransform(scrollYProgress, range, [(cm ? cm.x : (o.x ?? 0) * distance) * k, 0]);
  const y = useTransform(scrollYProgress, range, [(cm ? cm.y : (o.y ?? 0) * distance) * k, 0]);
  const scale = useTransform(scrollYProgress, range, [
    cm ? 1 + (cm.scale - 1) * k : 1 + (o.z ?? 0) * 0.16 * k,
    1,
  ]);
  const blur = useTransform(scrollYProgress, range, [(cm ? cm.blur : 0) * k, 0]);
  const filter = useTransform(blur, (v) => (v < 0.2 ? "none" : `blur(${v}px)`));

  return (
    <motion.div
      ref={ref}
      className={className}
      style={cm ? { x, y, scale, filter } : { x, y, scale }}
    >
      {children}
    </motion.div>
  );
}
