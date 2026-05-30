import type { ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { getMainProjects } from "@/lib/data/projects";
import { skills, skillCategories } from "@/lib/data/skills";
import { certifications } from "@/lib/data/certifications";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { ContactButton } from "@/app/_components/contact/contact-button";
import { RotatingText } from "@/app/_components/ui/rotating-text";
import { StoryItem } from "@/app/_components/story/story-item";
import { WorkRail } from "@/app/_components/story/work-rail";

const mains = getMainProjects();
const cityShort = profile.location.split(",")[0];

const domainBlurbs: Record<string, string> = {
  "AI / ML": "RAG systems, model training, and inference that actually ships.",
  "Software Engineering": "Full-stack products, end to end, built to last.",
  "Data Engineering": "Pipelines that turn raw data into something useful.",
};

const domainDirs = ["left", "up", "right"] as const;

/** Working principles — the "how", told as three keynote beats. */
const principles: { k: string; title: string; body: string }[] = [
  {
    k: "End to end",
    title: "I own the whole loop.",
    body: "From the data pipeline to the button people click — no hand-offs, no gaps. One mind across the stack.",
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

const skillCategoryStyles: Record<string, string> = {
  "Software Engineering": "border-neon-cyan/30 text-neon-cyan",
  "Data Science": "border-neon-cyan-core/30 text-neon-cyan-core",
  "Computer Vision": "border-neon-violet/40 text-neon-violet",
  "Data Engineering": "border-white/15 text-fg-dim",
  "Data Analysis": "border-neon-lime/30 text-neon-lime",
};

/**
 * A full-screen keynote interstitial — one big line, lots of space.
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
        <StoryItem from="fade">
          <p className="label text-fg-muted">{kicker}</p>
        </StoryItem>
      ) : null}
      <StoryItem from="up" delay={0.05}>
        <p className="silver mt-6 max-w-4xl font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,7.5vw,5.5rem)] [text-wrap:balance]">
          {children}
        </p>
      </StoryItem>
      {sub ? (
        <StoryItem from="up" delay={0.12}>
          <p className="mt-7 max-w-xl text-fg-muted sm:text-lg">{sub}</p>
        </StoryItem>
      ) : null}
    </section>
  );
}

export default function Home() {
  const latest = getAllPosts()[0];

  return (
    <>
      <Header />

      {/* "The forge" — rising sparks + warm glow drift as you scroll. */}
      <StoryBackdrop variant="ember" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════════ BEAT 01 — THE SPARK ════════════════ */}
        <section
          id="hero"
          className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center sm:px-6"
        >
          <StoryItem from="fade">
            <p className="label text-fg-dim">
              <RotatingText
                items={[
                  "AI & Software Engineer",
                  "Full-stack builder",
                  "Data-driven systems",
                ]}
              />
            </p>
          </StoryItem>

          <StoryItem from="up" delay={0.05}>
            <h1 className="text-shine mt-7 font-display font-semibold leading-[0.95] tracking-[-0.04em] text-[clamp(3rem,11vw,9rem)]">
              {profile.name}
            </h1>
          </StoryItem>

          <StoryItem from="up" delay={0.12}>
            <p className="mt-6 max-w-2xl text-[clamp(1.1rem,2vw,1.6rem)] leading-snug text-fg-dim">
              {profile.tagline}
            </p>
          </StoryItem>

          <StoryItem from="up" delay={0.18}>
            <ul className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <li className="label rounded-full border border-line bg-raised/50 px-3.5 py-1.5 text-fg-dim">
                AI / ML · Software · Data
              </li>
              <li className="label inline-flex items-center gap-2 rounded-full border border-neon-lime/30 bg-raised/50 px-3.5 py-1.5 text-fg-dim">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
                Open to work · {cityShort}, LK
              </li>
            </ul>
          </StoryItem>

          <StoryItem from="up" delay={0.24}>
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="#work"
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neon-cyan/15 px-7 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
              >
                View work
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <ContactButton className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg">
                Get in touch
              </ContactButton>
            </div>
          </StoryItem>

          {/* refined scroll cue */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5">
            <span className="flex h-9 w-5 justify-center rounded-full border border-line/80">
              <span className="mt-1.5 h-1.5 w-1.5 animate-scroll-dot rounded-full bg-neon-cyan" />
            </span>
            <span className="label text-fg-muted">Scroll</span>
          </div>
        </section>

        {/* ════════════════ STATEMENT — THE PROBLEM ════════════════ */}
        <Statement
          kicker="Every build starts the same way"
          sub="Not with a framework. Not with a buzzword. With a problem that's worth the work."
        >
          It starts with a problem.
        </Statement>

        {/* ════════════════ BEAT 01 — THE SYSTEM ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">01 — Then, a system</p>
            </StoryItem>
            <h2 className="mt-6 font-display font-semibold leading-[1.05] tracking-[-0.03em] text-[clamp(2rem,6.5vw,5rem)]">
              <StoryItem from="left" distance={120}>
                <span className="block text-fg">I build</span>
              </StoryItem>
              <StoryItem from="right" distance={120} delay={0.05}>
                <span className="silver block">intelligent systems</span>
              </StoryItem>
              <StoryItem from="up" distance={90} delay={0.1}>
                <span className="block text-fg-dim">
                  from the data to the product people click.
                </span>
              </StoryItem>
            </h2>
          </div>
        </section>

        {/* ════════════════ BEAT 02 — THE DISCIPLINES ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="up">
              <p className="label text-fg-muted">02 — Three disciplines</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Built where three fields meet.
              </h2>
            </StoryItem>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {profile.domains.map((d, i) => (
                <StoryItem
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
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 03 — HOW I WORK ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="up">
              <p className="label text-fg-muted">03 — Principles</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Three rules I don&apos;t break.
              </h2>
            </StoryItem>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
              {principles.map((p, i) => (
                <StoryItem
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
                    <p className="label text-neon-cyan">{p.k}</p>
                    <h3 className="silver font-display text-2xl font-semibold leading-snug tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-auto text-sm leading-relaxed text-fg-muted">
                      {p.body}
                    </p>
                  </article>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 04 — THE STACK ════════════════ */}
        <section
          id="skills"
          className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
        >
          <div className="mx-auto w-full max-w-5xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">04 — The stack</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                A connected stack, not a buzzword list.
              </h2>
            </StoryItem>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {skills.map((skill, i) => (
                <StoryItem
                  key={skill.name}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={50}
                  delay={Math.min(0.4, i * 0.015)}
                >
                  <span
                    className={`inline-block rounded-full border px-4 py-2 text-sm ${
                      skillCategoryStyles[skill.category]
                    } ${skill.weight === 3 ? "font-semibold" : ""}`}
                  >
                    {skill.name}
                  </span>
                </StoryItem>
              ))}
            </div>
            <StoryItem from="fade" delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-5">
                {skillCategories.map((c) => (
                  <span
                    key={c.id}
                    className="label flex items-center gap-2 text-fg-muted"
                  >
                    <span
                      className="h-2 w-2 rounded-full ring-1 ring-white/10"
                      style={{ background: c.color }}
                    />
                    {c.id}
                  </span>
                ))}
              </div>
            </StoryItem>
          </div>
        </section>

        {/* ════════════════ STATEMENT — IT SHIPS ════════════════ */}
        <Statement
          kicker="A system is just a promise"
          sub="Until it's in production, handling real users, on a real Tuesday. So here's what actually shipped."
        >
          Then it ships.
        </Statement>

        {/* ════════════════ BEAT 05 — THE WORK (pinned scroll-jack) ════════════════ */}
        <WorkRail projects={mains} />

        {/* ════════════════ BEAT 06 — BY THE NUMBERS ════════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="up">
              <p className="label text-fg-muted">06 — By the numbers</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                A habit of shipping, kept on the record.
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

        {/* ════════════════ BEAT 07 — ALWAYS TRAINING ════════════════ */}
        <section
          id="certifications"
          className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
        >
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">07 — Always sharpening</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                The learning never stops.
              </h2>
            </StoryItem>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert, i) => (
                <StoryItem
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
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ BEAT 08 — THE WRITING ════════════════ */}
        {latest ? (
          <section
            id="writing"
            className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
          >
            <div className="mx-auto w-full max-w-5xl">
              <StoryItem from="up">
                <p className="label text-fg-muted">08 — Thinking out loud</p>
              </StoryItem>
              <StoryItem from="up" delay={0.06}>
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
              </StoryItem>
              <StoryItem from="fade" delay={0.12}>
                <p className="label mt-8">
                  <Link
                    href="/blog"
                    className="text-fg-muted transition-colors hover:text-fg"
                  >
                    All writing →
                  </Link>
                </p>
              </StoryItem>
            </div>
          </section>
        ) : null}

        {/* ════════════════ BEAT 09 — THE INVITATION (contact) ════════════════ */}
        <section
          id="contact"
          className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center sm:px-6"
        >
          <StoryItem from="up">
            <p className="label text-fg-muted">09 — The invitation</p>
          </StoryItem>
          <StoryItem from="up" delay={0.06}>
            <h2 className="silver mt-6 font-display font-semibold leading-[1.02] tracking-[-0.03em] text-[clamp(2.25rem,8vw,6rem)]">
              Now, let&apos;s build yours.
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
        </section>
      </main>

      <Footer />
    </>
  );
}
