"use client";

import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { Reveal } from "@/app/_components/ui/reveal";
import { Tilt } from "@/app/_components/ui/tilt";
import { Parallax } from "@/app/_components/ui/parallax";

interface ProjectGridProps {
  /** Already-filtered list. Filtering is owned by the parent. */
  projects: Project[];
  /** Compact tiles — denser; for the home teaser and the Mini grid. */
  compact?: boolean;
  /** Cap visible items. */
  limit?: number;
}

/**
 * Pure presentation. The parent decides what to render (which tier,
 * which category, how many). Used by the home teaser and the /work
 * catalog (twice — once for Main, once for Mini).
 */
export function ProjectGrid({
  projects,
  compact = false,
  limit,
}: ProjectGridProps) {
  const shown =
    typeof limit === "number" ? projects.slice(0, limit) : projects;

  if (shown.length === 0) {
    return (
      <p className="text-fg-muted">Nothing here yet — coming soon.</p>
    );
  }

  return (
    <div
      className={`grid gap-5 ${
        compact
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {shown.map((p, i) => {
        const cols = compact ? 4 : 3;
        const depth = 20 + (i % cols) * 14;
        return (
        <Parallax key={p.slug} distance={depth} className="h-full">
        <Reveal delay={(i % 3) * 70} className="h-full">
          <Tilt className="h-full" max={compact ? 5 : 9}>
            <article
              className={`bento tile-sheen group relative flex h-full flex-col hover:-translate-y-0.5 hover:border-neon-cyan/30 hover:bg-elevated ${
                compact ? "p-5" : "p-6"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="label rounded-full border border-neon-cyan/30 px-2.5 py-1 text-neon-cyan">
                  {p.category}
                </span>
                {p.tier === "mini" ? (
                  <span className="label text-fg-muted">mini</span>
                ) : null}
              </div>

              <h3
                className={`font-semibold text-fg ${
                  compact ? "text-lg" : "text-xl"
                }`}
              >
                {p.tier === "main" ? (
                  <Link
                    href={`/work/${p.slug}`}
                    className="transition-colors duration-200 hover:text-neon-cyan"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <span>{p.name}</span>
                )}
              </h3>
              <p className="mt-1 text-sm font-medium text-neon-cyan-core/90">
                {p.valueProp}
              </p>
              {!compact ? (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                  {p.description}
                </p>
              ) : null}

              <ul className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-5"}`}>
                {p.stack.slice(0, compact ? 3 : p.stack.length).map((t) => (
                  <li
                    key={t}
                    className="label rounded bg-void/60 px-2 py-1 text-fg-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-4 border-t border-line/60 pt-4">
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
          </Tilt>
        </Reveal>
        </Parallax>
        );
      })}
    </div>
  );
}
