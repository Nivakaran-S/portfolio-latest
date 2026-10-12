import type { Metadata } from "next";
import Link from "next/link";
import { getMainProjects } from "@/lib/data/projects";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Case studies from Nivakaran S. - the problem, what was built, and what changed, across ML, RAG, computer vision, data engineering and full-stack projects.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies - Nivakaran S.",
    description:
      "The problem, what was built, and what changed - across ML, RAG, computer vision, data engineering and full-stack projects.",
    url: "/case-studies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies - Nivakaran S.",
    description:
      "The problem, what was built, and what changed - across ML, RAG, computer vision, data engineering and full-stack projects.",
  },
};

const beatLabels = ["The problem", "What I built", "What changed"] as const;

export default function CaseStudiesPage() {
  const studies = getMainProjects().filter((p) => p.detail);
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(crumbsLd) }}
      />
      <Header />

      <StoryBackdrop variant="origin" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ HERO ════════════ */}
        <section className="relative flex flex-col items-center px-5 pb-12 pt-32 text-center sm:px-6 sm:pt-36">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="fade">
              <p className="label">
                {studies.length} case studies
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.08}>
              <h1 className="silver mt-6 font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.5rem,8vw,5.5rem)] [text-wrap:balance]">
                Case studies.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.16}>
              <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-fg-dim sm:text-lg">
                For each project: the problem it solved, what I built, and what
                changed. Every study links to its full page and source repo.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ STUDIES ════════════ */}
        {studies.map((p, i) => (
          <section
            key={p.slug}
            id={p.slug}
            className="relative flex min-h-[80svh] items-center px-5 py-20 sm:px-6"
          >
            <div className="mx-auto w-full max-w-4xl">
              <StoryItem from="left">
                <p className="label text-fg-muted">
                  {String(i + 1).padStart(2, "0")} - {p.category}
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.05}>
                <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.25rem)]">
                  {p.name}
                </h2>
              </StoryItem>
              <StoryItem from="up" delay={0.08}>
                <p className="mt-4 text-lg text-fg-dim">{p.valueProp}</p>
              </StoryItem>
              <StoryItem from="up" delay={0.1}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-line bg-raised/70 px-3 py-1 text-xs text-fg-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </StoryItem>
              <div className="mt-10 space-y-8">
                {beatLabels.map((label, j) => {
                  const body = [p.detail!.problem, p.detail!.approach, p.detail!.outcome][j];
                  return (
                    <StoryItem key={label} from="up" delay={0.12 + j * 0.05}>
                      <div className="border-l border-neon-cyan/30 pl-6">
                        <p className="label">{label}</p>
                        <p className="mt-3 leading-relaxed text-fg-muted">{body}</p>
                      </div>
                    </StoryItem>
                  );
                })}
              </div>
              <StoryItem from="up" delay={0.2}>
                <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
                  <Link
                    href={`/work/${p.slug}`}
                    className="inline-flex min-h-[44px] items-center gap-2 text-neon-cyan-core transition-colors hover:text-neon-cyan"
                  >
                    Full project page →
                  </Link>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 text-fg-dim transition-colors hover:text-fg"
                  >
                    Source ↗
                  </a>
                </div>
              </StoryItem>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
