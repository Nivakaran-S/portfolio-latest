"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";

// Module state: false on the server and on first client render, so the very
// first paint is never faded (content must never wait on JS). Flips true after
// the first mount; every later navigation remounts the template and fades in.
let mountedOnce = false;

/**
 * Cross-page transition: a soft fade. The wrapper keeps the body's flex chain
 * intact. Opacity only: a persistent transform would become the containing
 * block for the fixed header.
 */
export default function Template({ children }: { children: ReactNode }) {
  const fadeIn = mountedOnce;

  useEffect(() => {
    mountedOnce = true;
  }, []);

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
