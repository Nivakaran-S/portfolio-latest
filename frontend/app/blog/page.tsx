import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { Reveal } from "@/app/_components/ui/reveal";
import { breadcrumbJsonLd } from "@/lib/seo/metadata";
import { Tilt } from "@/app/_components/ui/tilt";
import { Parallax } from "@/app/_components/ui/parallax";
import { StoryItem } from "@/app/_components/story/story-item";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on AI, engineering, and the craft choices that make a product feel fast.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog - Nivakaran S.",
    description:
      "Notes on AI, engineering, and the craft choices that make a product feel fast.",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Nivakaran S.",
    description:
      "Notes on AI, engineering, and the craft choices that make a product feel fast.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <Header />

      {/* /blog backdrop: ruled-paper notebook with a soft wash - "the notebook". */}
      <StoryBackdrop variant="ink" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ THE NOTEBOOK ════════════ */}
        <section className="relative flex min-h-[80svh] flex-col justify-end px-5 pb-14 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
          <div className="mx-auto w-full max-w-5xl">
            <StoryItem from="fade">
              <p className="label">Blog · thinking out loud</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-4 font-display font-semibold leading-[0.98] tracking-[-0.03em] text-[clamp(2.5rem,8vw,6rem)]">
                Thinking out loud.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="mt-6 max-w-2xl text-fg-dim sm:text-lg">
                The decisions behind the builds - short, opinionated posts on AI,
                engineering, and the craft choices most people skip.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ POSTS ════════════ */}
        <div className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-fg-muted">
            No posts yet - drop the first MDX file into{" "}
            <code className="rounded bg-elevated px-1.5 py-0.5 text-fg-dim">
              content/blog/
            </code>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((p, i) => (
              <Parallax
                as="li"
                key={p.slug}
                distance={22 + (i % 2) * 20}
                className="h-full"
              >
                <Reveal delay={(i % 2) * 80} className="h-full">
                  <Tilt className="h-full" max={5}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="bento tile-sheen group flex h-full flex-col p-6 hover:-translate-y-0.5 hover:border-neon-cyan/30 hover:bg-elevated"
                  >
                    <p className="label flex items-center gap-2">
                      <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                      <span aria-hidden>·</span>
                      <span>{p.readingTime}</span>
                    </p>
                    <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-fg transition-colors duration-200 group-hover:text-neon-cyan">
                      {p.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                      {p.excerpt}
                    </p>
                    {p.tags.length > 0 ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <li
                            key={t}
                            className="label rounded bg-void/60 px-2 py-1 text-fg-muted"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="label mt-5 border-t border-line/60 pt-4 text-neon-cyan">
                      Read post →
                    </p>
                  </Link>
                  </Tilt>
                </Reveal>
              </Parallax>
            ))}
          </ul>
        )}

        <p className="label mt-12 text-center">
          <Link
            href="/"
            className="text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            ← Back to home
          </Link>
        </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
