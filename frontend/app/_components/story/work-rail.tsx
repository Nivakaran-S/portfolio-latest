"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import type { Project } from "@/lib/data/projects";

function Card({ p, index, total }: { p: Project; index: number; total: number }) {
  return (
    <article className="group flex w-[80vw] shrink-0 flex-col justify-between rounded-3xl border border-line bg-raised/80 p-7 backdrop-blur-sm sm:w-[52vw] lg:w-[34vw] lg:p-9">
      <div className="flex items-center justify-between">
        <span className="label rounded-full border border-neon-cyan/30 px-2.5 py-1 text-neon-cyan">
          {p.category}
        </span>
        <span className="label text-fg-muted">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-10">
        <h3 className="silver font-display text-4xl font-semibold leading-[1.02] tracking-tight lg:text-5xl">
          {p.name}
        </h3>
        <p className="mt-3 text-lg text-neon-cyan-core/90">{p.valueProp}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
          {p.description}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        {p.tier === "main" ? (
          <Link
            href={`/work/${p.slug}`}
            className="label text-neon-cyan transition-colors duration-200 hover:text-neon-cyan-core"
          >
            Case study →
          </Link>
        ) : null}
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="label text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
        >
          GitHub ↗
        </a>
        {p.live ? (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="label text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
          >
            Live ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The signature scroll-jack: a section taller than the viewport whose
 * inner stage is pinned (sticky) while the project rail scrubs sideways
 * with vertical scroll. Reduced-motion / mobile get a normal vertical
 * stack instead (no pinning, no horizontal hijack).
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // travel from a small inset to fully revealing the last card
  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ["4vw", `-${(projects.length - 1) * 38 + 6}vw`]
  );
  const x = useSpring(xRaw, { stiffness: 70, damping: 30, mass: 0.6, restDelta: 0.5 });

  if (reduced || mobile) {
    return (
      <section id="work" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
        <p className="label">05 — The work</p>
        <h2 className="silver mt-3 font-display text-[clamp(2rem,6vw,4rem)] font-semibold tracking-tight">
          Eight, end to end.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Card key={p.slug} p={p} index={i} total={projects.length} />
          ))}
        </div>
        <p className="label mt-10">
          <Link
            href="/work"
            className="text-neon-cyan transition-colors hover:text-neon-cyan-core"
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
      ref={ref}
      style={{ height: `${projects.length * 55 + 90}svh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-5 sm:px-6">
          <p className="label">05 — The work</p>
          <h2 className="silver mt-3 font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-tight">
            Eight, end to end.
          </h2>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-[4vw] pr-[40vw]">
          {projects.map((p, i) => (
            <Card key={p.slug} p={p} index={i} total={projects.length} />
          ))}
          <Link
            href="/work"
            className="flex w-[60vw] shrink-0 items-center justify-center sm:w-[30vw]"
          >
            <span className="label inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-fg-dim transition-colors hover:border-white/30 hover:text-fg">
              See all work →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
