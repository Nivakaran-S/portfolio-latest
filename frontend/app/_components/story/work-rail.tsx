"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/data/projects";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

function Card({ p, index, total }: { p: Project; index: number; total: number }) {
  return (
    <article className="group flex w-[80vw] shrink-0 flex-col justify-between rounded-3xl border border-line bg-raised/80 p-7 backdrop-blur-sm sm:w-[52vw] lg:w-[34vw] lg:p-9">
      <div className="flex items-center justify-between">
        <span className="label rounded-full border border-line px-2.5 py-1 text-fg-muted">
          {p.category}
        </span>
        <span className="label text-fg-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-10">
        <h3 className="silver font-display text-4xl font-semibold leading-[1.02] tracking-tight lg:text-5xl [overflow-wrap:anywhere] [text-wrap:balance]">
          {p.name}
        </h3>
        <p className="mt-3 text-lg text-fg-dim">{p.valueProp}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
          {p.description}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        {p.tier === "main" ? (
          <Link
            href={`/work/${p.slug}`}
            className="label inline-flex min-h-[44px] items-center text-neon-cyan transition-colors duration-200 hover:text-neon-cyan-core"
          >
            Case study →
          </Link>
        ) : null}
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="label inline-flex min-h-[44px] items-center text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
        >
          GitHub ↗
        </a>
        {p.live ? (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex min-h-[44px] items-center text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
          >
            Live ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The signature pinned rail: a section taller than the viewport whose inner
 * stage stays pinned while the project rail slides sideways as you scroll
 * down. Travel maps 1:1 to scroll (no spring), so the rail stops the moment
 * the reader stops. Reduced motion gets a plain vertical grid instead.
 *
 * The horizontal travel is measured (rail width minus viewport) rather than
 * guessed in vw, so it aligns at every card-width breakpoint. The section
 * height scales to that travel so the pace stays consistent.
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  // Read inside the scroll transform, so it lives in a ref, not state.
  const travelRef = useRef(0);
  const [heightSvh, setHeightSvh] = useState(200);

  // Measure how far the rail must slide so its end reaches the viewport edge,
  // and size the scroll length to match. Re-measures on resize.
  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const rail = railRef.current;
      if (!rail) return;
      const t = Math.max(0, rail.scrollWidth - window.innerWidth);
      travelRef.current = t;
      // ~1 screen-height of vertical scroll per screen-width of horizontal travel.
      setHeightSvh(100 + (t / window.innerHeight) * 100);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (railRef.current) ro.observe(railRef.current);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, projects.length]);

  // Progress through the pinned section, computed in JS from scrollY:
  // useScroll({ target }) is hardware-accelerated onto a native scroll
  // timeline that mis-reports progress inside sticky layouts.
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, (y) => {
    const el = sectionRef.current;
    if (!el) return 0;
    const range = el.offsetHeight - window.innerHeight;
    const p = range > 0 ? Math.min(1, Math.max(0, (y - el.offsetTop) / range)) : 0;
    return -p * travelRef.current;
  });

  if (reduced) {
    return (
      <section id="work" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
        <p className="label">The work</p>
        <h2 className="silver mt-3 font-display text-[clamp(2rem,6vw,4rem)] font-semibold tracking-tight">
          Thirteen, end to end.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Card key={p.slug} p={p} index={i} total={projects.length} />
          ))}
        </div>
        <p className="label mt-10">
          <Link
            href="/work"
            className="inline-flex min-h-[44px] items-center text-neon-cyan transition-colors hover:text-neon-cyan-core"
          >
            See all work →
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{ height: `${heightSvh}svh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-5 sm:px-6">
          <p className="label">The work</p>
          <h2 className="silver mt-3 font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-tight">
            Thirteen, end to end.
          </h2>
        </div>
        <motion.div ref={railRef} style={{ x }} className="flex gap-6 pl-[4vw] pr-[8vw]">
          {projects.map((p, i) => (
            <Card key={p.slug} p={p} index={i} total={projects.length} />
          ))}
          <Link
            href="/work"
            className="flex w-[60vw] shrink-0 items-center justify-center sm:w-[30vw]"
          >
            <span className="label inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-fg-dim transition-colors hover:border-white/30 hover:text-fg">
              See all work →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
