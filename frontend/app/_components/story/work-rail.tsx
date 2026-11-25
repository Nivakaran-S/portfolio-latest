import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { DepthItem } from "@/app/_components/story/depth-item";
import { MaskReveal } from "@/app/_components/ui/mask-reveal";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];

function Card({ p, index, total, featured }: { p: Project; index: number; total: number; featured?: boolean }) {
  const dark = featured;
  return (
    <article
      className={`group flex h-full flex-col justify-between rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 lg:p-9 ${
        dark
          ? "feature-dark border-transparent md:col-span-2"
          : "border-line bg-raised hover:border-fg"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`label rounded-full border px-2.5 py-1 ${
            dark ? "border-white/20 text-[#d8d5cc]" : "border-line text-fg-muted"
          }`}
        >
          {p.category}
        </span>
        <span className={`label ${dark ? "text-[#a8a8a8]" : ""}`}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-12">
        <h3
          className={`font-display font-semibold leading-[1.02] tracking-tight [overflow-wrap:anywhere] [text-wrap:balance] ${
            dark ? "text-4xl text-[#faf9f4] lg:text-6xl" : "text-3xl text-fg lg:text-4xl"
          }`}
        >
          {p.name}
        </h3>
        <p className={`mt-3 text-lg ${dark ? "text-ember" : "text-fg-dim"}`}>{p.valueProp}</p>
        <p className={`mt-4 max-w-xl text-sm leading-relaxed ${dark ? "text-[#d8d5cc]" : "text-fg-muted"}`}>
          {p.description}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        {p.tier === "main" ? (
          <Link
            href={`/work/${p.slug}`}
            className={`label inline-flex min-h-[44px] items-center transition-colors duration-200 ${
              dark ? "text-ember hover:text-white" : "text-ember-button hover:text-ember-hover"
            }`}
          >
            Case study →
          </Link>
        ) : null}
        <a
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          className={`label inline-flex min-h-[44px] items-center transition-colors duration-200 ${
            dark ? "text-[#d8d5cc] hover:text-white" : "text-fg-dim hover:text-ember-button"
          }`}
        >
          GitHub ↗
        </a>
        {p.live ? (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className={`label inline-flex min-h-[44px] items-center transition-colors duration-200 ${
              dark ? "text-[#d8d5cc] hover:text-white" : "text-fg-dim hover:text-ember-button"
            }`}
          >
            Live ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The home page work section: a Z Crew card grid. The first project is a wide
 * dark feature card; the rest are paper cards that lift and gain an ink border
 * on hover.
 */
export function WorkRail({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="section-rule px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <DepthItem from="up" distance={20}>
          <p className="label">The work</p>
        </DepthItem>
        <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          <MaskReveal lines={[`${COUNT_WORDS[projects.length] ?? projects.length}, end to end.`]} />
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <DepthItem key={p.slug} from="up" delay={Math.min(0.2, (i % 3) * 0.06)} className={`h-full ${i === 0 ? "md:col-span-2" : ""}`}>
              <Card p={p} index={i} total={projects.length} featured={i === 0} />
            </DepthItem>
          ))}
        </div>
        <p className="label mt-12">
          <Link
            href="/work"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-fg px-6 py-3 text-fg transition-colors hover:bg-fg hover:text-void"
          >
            See all work →
          </Link>
        </p>
      </div>
    </section>
  );
}
