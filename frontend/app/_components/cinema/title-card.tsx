"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/data/profile";
import { hasSeenIntro, shouldShowIntro, INTRO_KEY } from "@/lib/cinema/timing";
import { useCinema } from "./cinema-provider";

const DURATION_MS = 2400;

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage blocked: nothing to persist */
  }
}

/**
 * First-visit title card. An overlay only: the hero h1 is already in the DOM,
 * so this never delays LCP or hides content from crawlers. It decides once,
 * after the tier is known, and marks the session seen on any first landing so
 * a deep link does not trigger it on a later trip home.
 */
export function TitleCard() {
  const { tier, ready, setLetterbox } = useCinema();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const decided = useRef(false);

  useEffect(() => {
    if (!ready || decided.current) return;
    decided.current = true;
    const show = shouldShowIntro({
      tier,
      pathname,
      seen: hasSeenIntro(() => sessionStorage),
    });
    markSeen();
    if (show) setVisible(true);
  }, [ready, tier, pathname]);

  useEffect(() => {
    if (!visible) return;
    setLetterbox(true);
    const close = () => {
      setVisible(false);
      setLetterbox(false);
    };
    const timer = window.setTimeout(close, DURATION_MS);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, close, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, close));
      setLetterbox(false);
    };
  }, [visible, setLetterbox]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="title-card"
          aria-hidden="true"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black px-5 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.p
            className="label text-fg-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A film by
          </motion.p>
          <motion.h2
            className="mt-4 font-display font-semibold uppercase text-fg text-[clamp(1.25rem,4.2vw,3rem)]"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ delay: 0.45, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {profile.name}
          </motion.h2>
          <motion.span
            className="mt-8 h-px w-[min(60vw,28rem)] origin-center bg-gradient-to-r from-transparent via-neon-cyan-core to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 1.2 }}
          />
          <p className="label mt-10 text-fg-disabled">Scroll, tap or press any key to skip</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
