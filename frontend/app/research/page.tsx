import type { Metadata } from "next";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import { research } from "@/lib/data/research";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research by Nivakaran S. - completed work currently in the publication process.",
  alternates: { canonical: "/research" },
  // ponytail: placeholder content - drop noindex and add to sitemap.ts once real papers are in.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Research - Nivakaran S.",
    description:
      "Completed research by Nivakaran S., currently in the publication process.",
    url: "/research",
    type: "website",
  },
};

export default function ResearchPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Research", url: "/research" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(crumbsLd) }}
      />
      <Header />

      <StoryBackdrop variant="ink" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ INTRO ════════════ */}
        <section className="relative flex flex-col px-5 pb-12 pt-32 sm:px-6 sm:pt-36">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver max-w-4xl font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,6.5vw,5rem)] [text-wrap:balance]">
                Questions I chased to the end.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="mt-6 max-w-2xl text-fg-dim sm:text-lg">
                Completed research, now working through the publication
                process. Full papers will be linked here as they come out.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ PAPERS ════════════ */}
        <section className="relative px-5 pb-28 sm:px-6">
          <div className="mx-auto grid w-full max-w-6xl gap-5">
            {research.map((r, i) => (
              <StoryItem
                key={r.slug}
                from="up"
                distance={60}
                delay={Math.min(0.2, i * 0.08)}
              >
                <article className="grid gap-6 rounded-2xl border border-line bg-raised/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30 sm:p-8 md:grid-cols-[1fr_16rem]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="label text-fg-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="label rounded-full border border-neon-cyan/30 px-3 py-1 text-neon-cyan">
                        {r.status}
                      </span>
                      <span className="label text-fg-muted">{r.area}</span>
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-fg sm:text-3xl [text-wrap:balance]">
                      {r.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-fg-dim">
                      {r.abstract}
                    </p>
                    <p className="mt-4 border-l-2 border-neon-cyan/40 pl-4 text-sm leading-relaxed text-fg-muted">
                      {r.contribution}
                    </p>
                  </div>

                  <dl className="grid content-start gap-4 border-t border-line pt-5 text-sm md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    <div>
                      <dt className="label text-fg-muted">Year</dt>
                      <dd className="mt-1 text-fg">{r.year}</dd>
                    </div>
                    {r.venue ? (
                      <div>
                        <dt className="label text-fg-muted">Venue</dt>
                        <dd className="mt-1 text-fg">{r.venue}</dd>
                      </div>
                    ) : null}
                    {r.coAuthors?.length ? (
                      <div>
                        <dt className="label text-fg-muted">With</dt>
                        <dd className="mt-1 text-fg">{r.coAuthors.join(", ")}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="label text-fg-muted">Stack</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {r.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-line px-2.5 py-0.5 text-xs text-fg-dim"
                          >
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                    {r.link ? (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-cyan underline-offset-4 hover:underline"
                      >
                        Read the paper ↗
                      </a>
                    ) : (
                      <p className="text-fg-muted">Paper link coming soon.</p>
                    )}
                  </dl>
                </article>
              </StoryItem>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
