"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/lib/data/projects";
import { ALL_CATEGORIES } from "@/lib/data/projects";
import { ProjectGrid } from "./project-grid";

type Filter = "All" | ProjectCategory;

interface WorkCatalogProps {
  /** Pass the full catalog; the component splits Main vs Mini itself. */
  all: Project[];
}

/**
 * The full /work catalog: one filter row controls both the Main grid
 * and the Mini grid beneath it. Categories shown in the filter come
 * from the dataset (skipping empty ones).
 */
export function WorkCatalog({ all }: WorkCatalogProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const categories = useMemo(
    () => ALL_CATEGORIES.filter((c) => all.some((p) => p.category === c)),
    [all]
  );
  const filters: Filter[] = ["All", ...categories];

  const inFilter = (p: Project) =>
    filter === "All" || p.category === filter;
  const mains = useMemo(
    () => all.filter((p) => p.tier === "main" && inFilter(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all, filter]
  );
  const minis = useMemo(
    () => all.filter((p) => p.tier === "mini" && inFilter(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all, filter]
  );

  return (
    <div className="space-y-16">
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`min-h-[44px] rounded-full border px-5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                  : "border-line text-fg-muted hover:border-white/20 hover:text-fg"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <section aria-labelledby="main-heading">
        <h3
          id="main-heading"
          className="label mb-5 text-fg-dim"
        >
          Main projects · {mains.length}
        </h3>
        <ProjectGrid projects={mains} />
      </section>

      <section aria-labelledby="mini-heading">
        <h3
          id="mini-heading"
          className="label mb-5 text-fg-dim"
        >
          Mini projects · {minis.length}
        </h3>
        <ProjectGrid projects={minis} compact />
      </section>
    </div>
  );
}
