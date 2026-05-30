"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}

const tags = {
  div: motion.div,
  li: motion.li,
  section: motion.section,
} as const;

/**
 * In-view fade/rise. Powered by `motion`; the MotionConfig provider's
 * `reducedMotion="user"` automatically drops the transform for users who
 * request reduced motion (opacity still fades in).
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: RevealProps) {
  const Tag = tags[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}
