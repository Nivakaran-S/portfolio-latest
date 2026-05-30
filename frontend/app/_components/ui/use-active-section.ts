"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/sections";

/**
 * Tracks the section currently in view via IntersectionObserver.
 * Shared by the header and the HUD nav rail.
 */
export function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const observed = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}
