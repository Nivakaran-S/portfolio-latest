"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes every `motion` component honor the OS
 * setting automatically - transforms are dropped, opacity is kept.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6 }}>
      {children}
    </MotionConfig>
  );
}
