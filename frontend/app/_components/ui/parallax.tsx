"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

interface ParallaxProps {
  children: ReactNode;
  /** Vertical travel in px across the element's scroll pass. +down, -up. */
  distance?: number;
  /** Semantic tag for the wrapper (keeps grid/list markup valid). */
  as?: "div" | "li" | "section";
  className?: string;
}

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const;

/**
 * Spring-smoothed layered parallax. Each element drifts at its own rate as
 * it crosses the viewport; the spring adds a buttery lag so the movement
 * reads as depth, not a 1:1 scrub. Apply with different `distance` values
 * to neighbouring blocks so they move independently → a 3D parallax field.
 *
 * Transform-only (GPU composited) so it never triggers layout. Disabled
 * for reduced-motion and on mobile (touch parallax stutters and tires).
 */
export function Parallax({
  children,
  distance = 60,
  as = "div",
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const enabled = !reduced && !mobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(yRaw, {
    stiffness: 90,
    damping: 30,
    mass: 0.5,
    restDelta: 0.5,
  });

  const Tag = tags[as];

  return (
    <Tag
      // @ts-expect-error — ref union across motion tag variants
      ref={ref}
      style={enabled ? { y } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
