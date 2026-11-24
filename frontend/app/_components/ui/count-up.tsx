"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counts the leading number in `value` up from zero when scrolled into view
 * ("12+" -> 0..12 then "+"). Non-numeric values render as-is. The final text is
 * always in the markup, so it is correct before JavaScript.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
    if (!el || !m || reduced) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: target,
      duration: 1.4,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${pre}${Math.round(state.n).toLocaleString("en-US")}${post}`;
      },
    });
    el.textContent = `${pre}0${post}`;
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
    return () => {
      st.kill();
      tween.kill();
      el.textContent = value;
    };
  }, [value, reduced]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
