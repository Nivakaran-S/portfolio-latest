import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { getMainProjects } from "@/lib/data/projects";
import { Reveal } from "@/app/_components/ui/reveal";
import { Tilt } from "@/app/_components/ui/tilt";
import { Parallax } from "@/app/_components/ui/parallax";
import { TypedLine } from "@/app/_components/ui/typed-line";

const mains = getMainProjects();
const featured = mains[0];
const mainCount = mains.length;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-28 sm:px-6 sm:pt-32 lg:pt-36"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {/* ============================ HERO TILE ============================ */}
        {/* The anchor — drifts least. Translucent so the backdrop bleeds through. */}
        <Parallax
          distance={18}
          className="h-full md:col-span-8 md:row-span-2"
        >
          <Reveal className="h-full">
            <article className="tile-sheen group relative flex h-full min-h-[26rem] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-raised/80 p-7 transition-colors duration-300 hover:border-neon-cyan/25 md:p-10">
              <div>
                <p className="label inline-flex items-center gap-2 text-fg-muted">
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
                  <TypedLine text={`${profile.title} · ${profile.location}`} />
                </p>

                <h1 className="silver mt-7 font-display font-semibold leading-[0.98] tracking-[-0.04em] text-[clamp(2.5rem,7.5vw,5.75rem)]">
                  {profile.name}
                </h1>

                <p className="mt-6 max-w-2xl text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug text-fg-dim">
                  {profile.tagline}
                </p>

                <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
                  <span className="h-1 w-1 rounded-full bg-neon-cyan" />
                  {profile.creed}
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="#projects"
                  className="group/cta inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-neon-cyan/15 px-6 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
                >
                  View work
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover/cta:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg"
                >
                  Get in touch
                </Link>
              </div>
            </article>
          </Reveal>
        </Parallax>

        {/* ========================= AVAILABLE TILE ========================== */}
        <Parallax distance={56} className="h-full md:col-span-4">
          <Reveal delay={80} className="h-full">
            <Tilt className="h-full" max={6}>
              <article className="bento flex h-full min-h-[12.5rem] flex-col justify-between p-6">
                <p className="label flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
                  Status
                </p>
                <div>
                  <p className="font-display text-3xl font-semibold tracking-tight text-fg">
                    Available
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    For roles &amp; collaboration in AI/ML, full-stack, and data.
                  </p>
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-medium text-neon-cyan transition-colors hover:text-neon-cyan-core"
                >
                  {profile.email} ↗
                </a>
              </article>
            </Tilt>
          </Reveal>
        </Parallax>

        {/* ========================= LOCATION TILE =========================== */}
        <Parallax distance={40} className="h-full md:col-span-4">
          <Reveal delay={140} className="h-full">
            <Tilt className="h-full" max={6}>
              <article className="bento flex h-full min-h-[12.5rem] flex-col justify-between p-6">
                <p className="label">Now</p>
                <div>
                  <p className="font-display text-3xl font-semibold tracking-tight text-fg">
                    {profile.location.split(",")[0]}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    {profile.location.split(",")[1]?.trim()} · GMT+5:30
                  </p>
                </div>
                <p className="text-sm text-fg-dim">
                  B.Sc (Hons) IT @ SLIIT — final year, Software Engineering.
                </p>
              </article>
            </Tilt>
          </Reveal>
        </Parallax>

        {/* ========================== DOMAINS TILE =========================== */}
        <Parallax distance={48} className="h-full md:col-span-5">
          <Reveal delay={200} className="h-full">
            <Tilt className="h-full" max={6}>
              <article className="bento flex h-full min-h-[12rem] flex-col justify-between p-6">
                <p className="label">Working at the intersection of</p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {profile.domains.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3.5 py-1.5 text-sm text-neon-cyan-core"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-fg-muted">
                  I build end to end — pipelines, models, and the products
                  people actually click.
                </p>
              </article>
            </Tilt>
          </Reveal>
        </Parallax>

        {/* ========================= FEATURED TILE =========================== */}
        <Parallax distance={28} className="h-full md:col-span-7">
          <Reveal delay={260} className="h-full">
            <Tilt className="h-full" max={5}>
              <Link
                href={`/work/${featured.slug}`}
                className="group block h-full"
              >
                <article className="bento tile-sheen flex h-full min-h-[12rem] flex-col justify-between p-6 transition-colors duration-200 group-hover:border-neon-cyan/30 group-hover:bg-elevated">
                  <p className="label">Latest work · {featured.category}</p>
                  <div>
                    <p className="font-display text-3xl font-semibold tracking-tight text-fg">
                      {featured.name}
                    </p>
                    <p className="mt-1 text-sm text-neon-cyan-core/90">
                      {featured.valueProp}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {featured.stack.map((s) => (
                      <li
                        key={s}
                        className="label rounded bg-void/60 px-2 py-1 text-fg-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-line/60 pt-3">
                    <span className="label text-fg-muted">
                      01 / {String(mainCount).padStart(2, "0")} · latest
                    </span>
                    <span className="label text-neon-cyan transition-transform duration-200 group-hover:translate-x-1">
                      Read case study →
                    </span>
                  </div>
                </article>
              </Link>
            </Tilt>
          </Reveal>
        </Parallax>
      </div>

      {/* Scroll cue */}
      <div className="mt-10 flex justify-center">
        <span className="label inline-flex items-center gap-2 text-fg-muted">
          <span className="animate-pulse-glow" aria-hidden>
            ↓
          </span>
          Continue
        </span>
      </div>
    </section>
  );
}
