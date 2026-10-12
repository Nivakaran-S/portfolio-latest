import type { ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { getMainProjects } from "@/lib/data/projects";
import { StackGrid } from "@/app/_components/sections/stack-grid";
import { featuredCertifications } from "@/lib/data/certifications";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { DepthItem } from "@/app/_components/story/depth-item";
import { WorkRail } from "@/app/_components/story/work-rail";
import { Hero } from "@/app/_components/hero/hero";

const mains = getMainProjects();

const domainBlurbs: Record<string, string> = {
  "AI / ML": "RAG systems, model training, and inference that actually ships.",
  "Software Engineering": "Full-stack products, end to end, built to last.",
  "Data Engineering": "Pipelines that turn raw data into something useful.",
};

const domainDirs = ["left", "up", "right"] as const;

/** Working principles - the "how", told as three keynote beats. */
const principles: { k: string; title: string; body: string }[] = [
  {
    k: "End to end",
    title: "I own the whole loop.",
    body: "From the data pipeline to the button people click - no hand-offs, no gaps. One mind across the stack.",
  },
  {
    k: "Calm under load",
    title: "Precision when it counts.",
    body: "Remote medical scribing and high-volume support taught me to stay exact when the pressure is highest.",
  },
  {
    k: "Built to last",
    title: "Engineered, not hacked.",
    body: "Disciplined engineering over clever shortcuts. I'd rather ship something that holds than something that only demos.",
  },
];

/**
 * A full-screen keynote interstitial - one big line, lots of space.
 * These are the connective beats that turn a list of sections into a
 * story: problem → system → shipped.
 */
function Statement({
  kicker,
  children,
  sub,
}: {
  kicker?: string;
  children: ReactNode;
  sub?: string;
}) {
  return (
    <section className="relative flex min-h-[90svh] flex-col items-center justify-center px-5 text-center sm:px-6">
      {kicker ? (
        <DepthItem from="fade">
          <p className="label text-fg-muted">{kicker}</p>
        </DepthItem>
      ) : null}
      <DepthItem from="up" delay={0.05}>
        <p className="silver mt-6 max-w-4xl font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,7.5vw,5.5rem)] [text-wrap:balance]">
          {children}
        </p>
      </DepthItem>
      {sub ? (
        <DepthItem from="up" delay={0.12}>
          <p className="mt-7 max-w-xl text-fg-muted sm:text-lg">{sub}</p>
        </DepthItem>
      ) : null}
    </section>
  );
}

export default function Home() {
  const latest = getAllPosts()[0];

  return (
    <>
      <Header />

      {/* "The forge" - rising sparks + warm glow drift as you scroll. */}
      <StoryBackdrop variant="ember" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════════ BEAT 01 - THE SPARK ════════════════ */}
        <Hero />

        {/* ════════════════ STATEMENT - THE PROBLEM ════════════════ */}
        <Statement
          kicker="Every build starts the same way"
          sub="Not with a framework. Not with a buzzword. With a problem that's worth the work."
        >
          It starts with a problem.
        </Statement>

        {/* ════════════════ BEAT 01 - THE SYSTEM ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <DepthItem from="left">
              <p className="label text-fg-muted">Then, a system</p>
            </DepthItem>
            <h2 className="mt-6 font-display font-semibold leading-[1.05] tracking-[-0.03em] text-[clamp(2rem,6.5vw,5rem)]">
              <DepthItem from="left" distance={120}>
                <span className="block text-fg">I build</span>
              </DepthItem>
              <DepthItem from="right" distance={120} delay={0.05}>
                <span className="silver block leading-tight ">intelligent systems</span>
              </DepthItem>
              <DepthItem from="up" distance={90} delay={0.1}>
                <span className="block text-fg-dim">
                  from the data to the product people click.
                </span>
              </DepthItem>
            </h2>
          </div>
        </section>

        {/* ════════════════ BEAT 02 - THE DISCIPLINES ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <DepthItem from="up">
              <p className="label text-fg-muted">Three disciplines</p>
            </DepthItem>
            <DepthItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Built where three fields meet.
              </h2>
            </DepthItem>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {profile.domains.map((d, i) => (
                <DepthItem
                  key={d}
                  from={domainDirs[i % 3]}
                  distance={110}
                  delay={i * 0.05}
                  className="h-full"
                >
                  <article className="flex h-full min-h-[16rem] flex-col justify-between rounded-3xl border border-line bg-raised/70 p-8 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    <span className="font-display text-5xl font-semibold text-neon-cyan/40">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="silver font-display text-2xl font-semibold tracking-tight">
                        {d}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                        {domainBlurbs[d] ?? ""}
                      </p>
                    </div>
                  </article>
                </DepthItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 03 - HOW I WORK ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <DepthItem from="up">
              <p className="label text-fg-muted">Principles</p>
            </DepthItem>
            <DepthItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Three rules I don&apos;t break.
              </h2>
            </DepthItem>
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
              {principles.map((p, i) => (
                <DepthItem
                  key={p.k}
                  from={domainDirs[i % 3]}
                  distance={100}
                  delay={i * 0.06}
                  className="h-full"
                >
                  <article className="flex h-full flex-col gap-6 bg-raised/85 p-8 backdrop-blur-sm">
                    <span
                      className="font-mono text-sm text-neon-cyan/70"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <p className="label">{p.k}</p>
                    <h3 className="silver font-display text-2xl font-semibold leading-snug tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-auto text-sm leading-relaxed text-fg-muted">
                      {p.body}
                    </p>
                  </article>
                </DepthItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 04 - THE STACK ════════════════ */}
        <section
          id="skills"
          className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
        >
          <div className="mx-auto w-full max-w-5xl">
            <DepthItem from="left">
              <p className="label text-fg-muted">The stack</p>
            </DepthItem>
            <DepthItem from="up" delay={0.05}>
              <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                A connected stack, not a buzzword list.
              </h2>
            </DepthItem>
            <StackGrid />
          </div>
        </section>

        {/* ════════════════ STATEMENT - IT SHIPS ════════════════ */}
        <Statement
          kicker="A system is just a promise"
          sub="Until it's in production, handling real users, on a real Tuesday. So here's what actually shipped."
        >
          Then it ships.
        </Statement>

        {/* ════════════════ BEAT 05 - THE WORK (horizontal rail) ════════════════ */}
        <WorkRail projects={mains} />

        {/* ════════════════ BEAT 06 - BY THE NUMBERS ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <DepthItem from="up">
              <p className="label text-fg-muted">By the numbers</p>
            </DepthItem>
            <DepthItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                A habit of shipping, kept on the record.
              </h2>
            </DepthItem>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
              {profile.stats.map((s, i) => (
                <DepthItem
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
                </DepthItem>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════════ BEAT 07 - ALWAYS TRAINING ════════════════ */}
        <section
          id="certifications"
          className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
        >
          <div className="mx-auto w-full max-w-6xl">
            <DepthItem from="left">
              <p className="label text-fg-muted">Always sharpening</p>
            </DepthItem>
            <DepthItem from="up" delay={0.05}>
              <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                The learning never stops.
              </h2>
            </DepthItem>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCertifications.map((cert, i) => (
                <DepthItem
                  key={cert.label}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.35, i * 0.04)}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-line bg-raised/70 p-5 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    <h3 className="font-display text-base font-semibold text-fg">
                      {cert.label}
                    </h3>
                    <p className="mt-2 text-sm text-fg-muted">{cert.detail}</p>
                  </div>
                </DepthItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 08 - THE WRITING ════════════════ */}
        {latest ? (
          <section
            id="writing"
            className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
          >
            <div className="mx-auto w-full max-w-5xl">
              <DepthItem from="up">
                <p className="label text-fg-muted">Thinking out loud</p>
              </DepthItem>
              <DepthItem from="up" delay={0.06}>
                <Link
                  href={`/blog/${latest.slug}`}
                  className="group mt-8 block rounded-3xl border border-line bg-raised/80 p-8 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30 hover:bg-elevated md:p-12"
                >
                  <p className="label flex items-center gap-2">
                    <time dateTime={latest.date}>
                      {formatPostDate(latest.date)}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{latest.readingTime}</span>
                  </p>
                  <h3 className="silver mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
                    {latest.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-fg-muted">{latest.excerpt}</p>
                  <span className="label mt-8 inline-flex items-center gap-2 text-neon-cyan transition-transform duration-200 group-hover:translate-x-1">
                    Read post →
                  </span>
                </Link>
              </DepthItem>
              <DepthItem from="fade" delay={0.12}>
                <p className="label mt-8">
                  <Link
                    href="/blog"
                    className="text-fg-muted transition-colors hover:text-fg"
                  >
                    All writing →
                  </Link>
                </p>
              </DepthItem>
            </div>
          </section>
        ) : null}

        {/* ════════════════ BEAT 09 - THE INVITATION (contact) ════════════════ */}
        <section
          id="contact"
          className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center sm:px-6"
        >
          <DepthItem from="up">
            <p className="label text-fg-muted">The invitation</p>
          </DepthItem>
          <DepthItem from="up" delay={0.06}>
            <h2 className="silver mt-6 font-display font-semibold leading-tight tracking-[-0.03em] text-[clamp(2.25rem,8vw,6rem)]">
              Now, let&apos;s build yours.
            </h2>
          </DepthItem>
          <DepthItem from="up" delay={0.12}>
            <p className="mt-6 max-w-xl text-fg-dim sm:text-lg">
              Open to roles and collaborations in AI/ML, software, and data
              engineering.
            </p>
          </DepthItem>
          <DepthItem from="up" delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fg px-7 py-3 text-sm font-medium text-void transition-transform duration-200 hover:scale-[1.03]"
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
          </DepthItem>
        </section>
      </main>

      <Footer />
    </>
  );
}
