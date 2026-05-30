"use client";

import { useEffect } from "react";
import { profile } from "@/lib/data/profile";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * (1) A console signature for the curious.
 * (2) Konami code → dispatches `lattice:overclock`, which scene-canvas
 *     turns into a brief magenta hero-core surge.
 */
export function EasterEggs() {
  useEffect(() => {
    console.log(
      `%c
      ◢ NIVAKARAN.DEV ◣
   ·  ·  ·  ·  ·  ·  ·  ·
   You found the source.
   Built with Next.js · R3F · Vercel.
   Let's talk: ${profile.email}
   PRs welcome → github.com/Nivakaran-S
`,
      "color:#cfcdd8;font-family:monospace"
    );

    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        window.dispatchEvent(new CustomEvent("lattice:overclock"));
        console.log("%c> overclock engaged", "color:#b08aa6");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
