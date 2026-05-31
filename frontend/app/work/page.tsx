import type { Metadata } from "next";
import Link from "next/link";
import { projects, moreProjectsNote } from "@/lib/data/projects";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { WorkCatalog } from "@/app/_components/work/work-catalog";
import { breadcrumbJsonLd } from "@/lib/seo/metadata";
import { StoryItem } from "@/app/_components/story/story-item";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected and catalog projects across Software Engineering, Data Science, Computer Vision, Data Engineering, and Data Analysis.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — Nivakaran S.",
    description:
      "Selected and catalog projects across Software Engineering, Data Science, Computer Vision, Data Engineering, and Data Analysis.",
    url: "/work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work — Nivakaran S.",
    description:
      "Selected and catalog projects across Software Engineering, Data Science, Computer Vision, Data Engineering, and Data Analysis.",
  },
};

export default function WorkIndexPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <Header />

      {/* /work backdrop: glowing seams in cooling metal — "forged". */}
      <StoryBackdrop variant="forge" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ THE COLLECTION ════════════ */}
        <section className="relative flex min-h-[88svh] flex-col justify-end px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="fade">
              <p className="label">Work · the proof</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-4 font-display font-semibold leading-[0.98] tracking-[-0.03em] text-[clamp(2.75rem,9vw,7rem)]">
                Proof, not promises.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="mt-6 max-w-2xl text-fg-dim sm:text-lg">
                Case studies across AI, software, and data, plus a working
                catalog of mini projects from a 72-repo stack. Everything here
                ran. Filter by discipline.
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.18}>
              <p className="label mt-8 inline-flex items-center gap-2 rounded-full bg-void/55 px-4 py-2 backdrop-blur-sm text-fg-muted">
                <span className="animate-pulse-glow" aria-hidden>
                  ↓
                </span>
                See the evidence
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ THE CATALOG ════════════ */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-6">
          <WorkCatalog all={projects} />

          <p className="label mt-14 text-center text-fg-muted">
            <a
              href="https://github.com/Nivakaran-S?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-neon-cyan"
            >
              {moreProjectsNote} ↗
            </a>
          </p>

          <p className="label mt-6 text-center">
            <Link
              href="/"
              className="text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              ← Back to home
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
