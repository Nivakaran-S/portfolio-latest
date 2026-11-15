"use client";

import { motion, useScroll, useTransform } from "motion/react";

/**
 * Persistent film look: grain, vignette, scroll-driven teal/orange light leaks, a sweep
 * and letterbox bars. Fixed, pointer-transparent, transform/opacity only.
 * Sits above page content (z-30) and below the header (z-50). The bars get
 * their own container at z-55 so the top bar is not hidden by the solid header.
 */
export function FilmLayer() {
  const { scrollYProgress } = useScroll();
  const leakAY = useTransform(scrollYProgress, [0, 1], ["-10%", "-55%"]);
  const leakBY = useTransform(scrollYProgress, [0, 1], ["35%", "80%"]);

  return (
    <>
      <div aria-hidden="true" className="cine-root pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <motion.div className="cine-leak cine-leak-cool -left-[20vmax] top-0" style={{ y: leakAY }} />
        <motion.div className="cine-leak cine-leak-hot -right-[25vmax] top-0" style={{ y: leakBY }} />
        <div className="cine-sweep" />
        <div className="cine-vignette" />
        <div className="cine-grain" />
      </div>
      <div aria-hidden="true" className="cine-bars pointer-events-none fixed inset-0 z-[55]">
        <div className="cine-bar cine-bar-top" />
        <div className="cine-bar cine-bar-bottom" />
      </div>
    </>
  );
}
