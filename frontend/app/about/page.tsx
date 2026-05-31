import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { FaceRotation } from "@/app/_components/scene/face-rotation";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import {
  workExperience,
  education,
  type ExperienceEntry,
} from "@/lib/data/experience";
import { achievements } from "@/lib/data/achievements";
import { profilePageJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Nivakaran S. — full-stack engineer working at the intersection of AI/ML, software engineering, and data.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Nivakaran S.",
    description:
      "About Nivakaran S. — full-stack engineer working at the intersection of AI/ML, software engineering, and data.",
    url: "/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Nivakaran S.",
    description:
      "About Nivakaran S. — full-stack engineer working at the intersection of AI/ML, software engineering, and data.",
  },
};

/** One vertical timeline (used twice: work experience + education). */
function PathTimeline({
  kicker,
  entries,
}: {
  kicker: string;
  entries: ExperienceEntry[];
}) {
  return (
    <div>
      <StoryItem from="up">
        <p className="label text-neon-cyan">{kicker}</p>
      </StoryItem>
      <div className="mt-6 space-y-8 border-l border-line pl-8">
        {entries.map((entry, i) => (
          <StoryItem
            key={entry.org}
            from="up"
            distance={60}
            delay={0.05 + i * 0.05}
            className="relative"
          >
            <span
              className="absolute -left-[39px] mt-1.5 h-3 w-3 rounded-full bg-neon-cyan ring-4 ring-void"
              aria-hidden="true"
            />
            {entry.period ? (
              <p className="label text-fg-muted">{entry.period}</p>
            ) : null}
            <h3 className="mt-2 font-display text-xl font-semibold text-fg">
              {entry.role}
            </h3>
            <p className="text-sm font-medium text-neon-cyan/90">{entry.org}</p>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {entry.summary}
            </p>
          </StoryItem>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const profileLd = profilePageJsonLd();
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <Header />

      {/* Coded "origin" backdrop (halo + orbit rings + starfield) sits at
          -z-10; the cut-out portrait turns in front of it at -z-5. */}
      <StoryBackdrop variant="origin" />
      <FaceRotation />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ THE SPARK ════════════ */}
        <section className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 sm:px-6 sm:pt-32 lg:pt-36">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="fade">
              <p className="label">About · the origin</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-4 max-w-4xl font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,6.5vw,5rem)] [text-wrap:balance]">
                Before the systems, the person.
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="label mt-8 inline-flex items-center gap-2 rounded-full bg-void/55 px-4 py-2 backdrop-blur-sm text-fg-muted">
                <span className="animate-pulse-glow" aria-hidden>
                  ↓
                </span>
                Scroll the origin
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ WHERE IT STARTED — WHO I AM ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">01 — Where it started</p>
            </StoryItem>
            <div className="mt-8 space-y-7">
              {profile.about.map((para, i) => (
                <StoryItem key={i} from="up" delay={i * 0.06} distance={70}>
                  <p className="font-display text-[clamp(1.4rem,3.2vw,2.4rem)] font-medium leading-[1.3] tracking-tight text-fg-dim">
                    {para}
                  </p>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ WHAT SHAPED ME ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 text-center sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="fade">
              <p className="label text-fg-muted">02 — What shaped me</p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <p className="silver mx-auto mt-8 max-w-3xl font-display text-[clamp(2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
                {profile.creed}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.14}>
              <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-fg-muted sm:text-lg">
                Real-time clinical documentation for US cardiologists taught me
                precision and calm under load — habits I bring to systems that
                have to work.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ THE PATH — EXPERIENCE + EDUCATION ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">03 — The path</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Where the rigor came from.
              </h2>
            </StoryItem>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10">
              <PathTimeline kicker="Experience" entries={workExperience} />
              <PathTimeline kicker="Education" entries={education} />
            </div>
          </div>
        </section>

        {/* ════════════ PROVING GROUND — COMPETITIONS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">04 — Proving ground</p>
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

        {/* ════════════ BY THE NUMBERS — STATS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">05 — By the numbers</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                The shape of it, in numbers.
              </h2>
            </StoryItem>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
              {profile.stats.map((s, i) => (
                <StoryItem
                  key={s.label}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={70}
                  delay={i * 0.06}
                  className="h-full"
                >
                  <div className="flex h-full flex-col justify-between gap-6 bg-raised/85 p-7 backdrop-blur-sm sm:p-8">
                    <dd className="silver font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-none tracking-tight">
                      {s.value}
                    </dd>
                    <dt className="label text-fg-muted">{s.label}</dt>
                  </div>
                </StoryItem>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════ WHAT'S NEXT — CONTACT ════════════ */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center sm:px-6">
          <StoryItem from="up">
            <p className="label text-fg-muted">06 — What&apos;s next</p>
          </StoryItem>
          <StoryItem from="up" delay={0.06}>
            <h2 className="silver mt-6 font-display font-semibold leading-[1.02] tracking-[-0.03em] text-[clamp(2.25rem,8vw,6rem)]">
              Let&apos;s build something.
            </h2>
          </StoryItem>
          <StoryItem from="up" delay={0.12}>
            <p className="mt-6 max-w-xl text-fg-dim sm:text-lg">
              Open to roles and collaborations in AI/ML, software, and data
              engineering.
            </p>
          </StoryItem>
          <StoryItem from="up" delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neon-cyan/15 px-7 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
              >
                {profile.email}
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              {profile.socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg"
                  >
                    {s.label} ↗
                  </a>
                ))}
            </div>
          </StoryItem>
          <StoryItem from="fade" delay={0.24}>
            <p className="label mt-12">
              <Link
                href="/"
                className="text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                ← Back to home
              </Link>
            </p>
          </StoryItem>
        </section>
      </main>
      <Footer />
    </>
  );
}
