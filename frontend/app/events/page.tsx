import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import { achievements } from "@/lib/data/achievements";
import { events } from "@/lib/data/events";
import { breadcrumbJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Competitions and events Nivakaran S. has competed in and attended - hackathons, algorithm contests, and tech conferences across Sri Lanka.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events - Nivakaran S.",
    description:
      "Competitions and events Nivakaran S. has competed in and attended - hackathons, algorithm contests, and tech conferences.",
    url: "/events",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events - Nivakaran S.",
    description:
      "Competitions and events Nivakaran S. has competed in and attended.",
  },
};

export default function EventsPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Events", url: "/events" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <Header />

      <StoryBackdrop variant="forge" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ THE ARENA ════════════ */}
        <section className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="fade">
              <p className="label">Events · in the arena</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-4 max-w-4xl font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,6.5vw,5rem)] [text-wrap:balance]">
                Where I show up.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="mt-6 max-w-2xl text-fg-dim sm:text-lg">
                The competitions I&apos;ve been tested in and the events I&apos;ve
                shown up for - hackathons, algorithm contests, and the wider tech
                community.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ COMPETITIONS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">01 - Proving ground</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Tested in competition.
              </h2>
            </StoryItem>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {achievements.map((a, i) => (
                <StoryItem
                  key={a.title}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <article className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-raised/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    <div className="flex items-center justify-between gap-3">
                      <span className="label rounded-full border border-neon-cyan/30 px-3 py-1 text-neon-cyan">
                        {a.result}
                      </span>
                      {a.year ? (
                        <span className="label text-fg-muted">{a.year}</span>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-fg">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-sm text-neon-cyan/80">{a.org}</p>
                    </div>
                    <p className="mt-auto text-sm leading-relaxed text-fg-muted">
                      {a.detail}
                    </p>
                  </article>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ EVENTS & COMMUNITY ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">02 - In the community</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Out in the community.
              </h2>
            </StoryItem>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {events.map((ev, i) => (
                <StoryItem
                  key={ev.title}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <article className="group/ev flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised/70 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    {ev.image ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-void">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ev.image}
                          alt={`${ev.title} - event`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/ev:scale-105 motion-reduce:transform-none"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="label rounded-full border border-neon-cyan/30 px-3 py-1 text-neon-cyan">
                          {ev.role}
                        </span>
                        <span className="label text-fg-muted">{ev.date}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-fg">
                          {ev.title}
                        </h3>
                        <p className="mt-1 text-sm text-neon-cyan/80">
                          {ev.location}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-fg-muted">
                        {ev.detail}
                      </p>
                      {ev.team ? (
                        <p className="mt-auto text-xs text-fg-muted">
                          With {ev.team.join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <section className="relative flex min-h-[60svh] flex-col items-center justify-center px-5 text-center sm:px-6">
          <StoryItem from="up">
            <h2 className="silver font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
              More to come.
            </h2>
          </StoryItem>
          <StoryItem from="up" delay={0.08}>
            <p className="mt-5 max-w-xl text-fg-dim">
              Always up for the next contest or meetup.
            </p>
          </StoryItem>
          <StoryItem from="up" delay={0.16}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neon-cyan/15 px-7 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
              >
                {profile.email}
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Link
                href="/about"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg"
              >
                About me ↗
              </Link>
            </div>
          </StoryItem>
        </section>
      </main>
      <Footer />
    </>
  );
}
