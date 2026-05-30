import Link from "next/link";
import { getMainProjects } from "@/lib/data/projects";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { ProjectGrid } from "@/app/_components/work/project-grid";

/**
 * Home teaser — top 3 main projects + a link to the full /work index.
 * The filterable grid lives on /work; this section is intentionally
 * light to keep the home a visuals-first bento overview.
 */
export function Projects() {
  const featured = getMainProjects().slice(0, 3);

  return (
    <SectionShell
      id="projects"
      kicker="Selected work"
      title="Things I've shipped."
    >
      <p className="mb-8 max-w-xl text-fg-muted">
        Three of the catalog — a slice of what I&apos;ve built across AI/ML,
        full-stack, and data.
      </p>

      <ProjectGrid projects={featured} />

      <p className="label mt-10 text-center">
        <Link
          href="/work"
          className="text-neon-cyan transition-colors duration-200 hover:text-neon-cyan-core"
        >
          See all work →
        </Link>
      </p>
    </SectionShell>
  );
}
