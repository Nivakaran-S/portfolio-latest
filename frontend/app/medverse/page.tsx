import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import {
  medverse,
  problemStats,
  buildItems,
  models,
  engineeringStats,
} from "@/lib/data/medverse";
import { breadcrumbJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "MedVerse",
  description:
    "MedVerse - a full-stack clinical telemetry platform I build with Team ADAGARD: wearable hardware, on-device signal processing, trained ML, a backend, and clinician apps. An engineering & research project; selected into NIBM Neo Ventures.",
  alternates: { canonical: "/medverse" },
  openGraph: {
    title: "MedVerse - Nivakaran S.",
    description:
      "A full-stack clinical telemetry platform - hardware, signal processing, ML, backend, and apps, built end to end. Selected into NIBM Neo Ventures.",
    url: "/medverse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedVerse - Nivakaran S.",
    description:
      "A full-stack clinical telemetry platform, engineered end to end. Selected into NIBM Neo Ventures.",
  },
};

export default function MedVersePage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "MedVerse", url: "/medverse" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />
      <Header />

      <StoryBackdrop variant="ink" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ HERO ════════════ */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-28 text-center sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="fade">
              <p className="label text-neon-cyan/80">
                {medverse.name} · {medverse.team}
              </p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <div
                role="img"
                aria-label={`${medverse.name} logo`}
                className="mx-auto mt-8 h-32 w-full max-w-xl bg-contain bg-center bg-no-repeat sm:h-44"
                style={{ backgroundImage: `url(${medverse.logo})` }}
              />
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <h1 className="silver mt-8 font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.25rem,7vw,5rem)] [text-wrap:balance]">
                <span className="sr-only">MedVerse - </span>
                {medverse.tagline}
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.16}>
              <p className="label mt-7 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-neon-cyan-core">
                ★ {medverse.selection}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.22}>
              <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-fg-dim sm:text-lg">
                {medverse.oneLiner}
              </p>
            </StoryItem>
            <StoryItem from="fade" delay={0.3}>
              <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-fg-muted">
                {medverse.disclaimer}
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ THE PROBLEM (MOTIVATION) ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">01 - The motivation</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Wards are reactive, not predictive.
              </h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
                Vitals are spot-checked every few hours and continuous monitoring
                is ICU-only - so between checks the ward is largely blind. Those
                public-health gaps are what made the engineering problem worth
                taking on.
              </p>
            </StoryItem>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
              {problemStats.map((s, i) => (
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
                    <dt className="text-sm leading-snug text-fg-muted">
                      {s.label}
                    </dt>
                  </div>
                </StoryItem>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════ WHAT I BUILT ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">02 - What I built</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                A full stack, sensor to dashboard.
              </h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
                {medverse.contribution}
              </p>
            </StoryItem>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buildItems.map((b, i) => (
                <StoryItem
                  key={b.area}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-line bg-raised/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    <p className="label text-neon-cyan/80">{b.area}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {b.detail}
                    </p>
                  </div>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ THE MODELS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">03 - The model layer</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                Models trained on public benchmarks.
              </h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-fg-muted">
                Research models, each trained on a public dataset with a held-out
                metric. These are engineering artifacts - not clinically
                validated, and not diagnostic.
              </p>
            </StoryItem>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((m, i) => (
                <StoryItem
                  key={m.title}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-raised/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30">
                    <h3 className="font-display text-lg font-semibold text-fg">
                      {m.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fg-muted">
                      {m.detail}
                    </p>
                    <p className="mt-auto text-xs text-neon-cyan/80">
                      {m.backing}
                    </p>
                  </div>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ ENGINEERING PRINCIPLES ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">04 - How it&apos;s built</p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <p className="silver mt-6 font-display text-[clamp(1.6rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.02em] [text-wrap:balance]">
                Honest by design, and built end to end.
              </p>
            </StoryItem>
            <div className="mt-10 space-y-5 text-fg-muted">
              <StoryItem from="up" delay={0.05}>
                <p className="leading-relaxed">
                  <span className="text-fg">A validated core, honestly labelled.</span>{" "}
                  A small set of models trained on real public benchmarks with
                  held-out metrics, surrounded by an explicitly-labelled layer of
                  published clinical equations and signal-processing proxies - so
                  nothing is dressed up as more than it is.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.1}>
                <p className="leading-relaxed">
                  <span className="text-fg">Provenance enforced in CI.</span> A
                  build-time check fails if an unvalidated model is ever surfaced
                  as trustworthy, and the UI flags anything that isn&apos;t
                  held-out-validated.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.15}>
                <p className="leading-relaxed">
                  <span className="text-fg">Resilient by default.</span> On-device
                  DSP and local BLE keep the bedside live through network outages;
                  a full offline demo mode means the app never fails to show.
                </p>
              </StoryItem>
            </div>
          </div>
        </section>

        {/* ════════════ THE ENGINEERING, IN NUMBERS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className="label text-fg-muted">05 - In numbers</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className="silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]">
                The engineering, in numbers.
              </h2>
            </StoryItem>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
              {engineeringStats.map((s, i) => (
                <StoryItem
                  key={s.label}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={70}
                  delay={i * 0.06}
                  className="h-full"
                >
                  <div className="flex h-full flex-col justify-between gap-6 bg-raised/85 p-7 backdrop-blur-sm sm:p-8">
                    <dd className="silver font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none tracking-tight">
                      {s.value}
                    </dd>
                    <dt className="text-sm leading-snug text-fg-muted">
                      {s.label}
                    </dt>
                  </div>
                </StoryItem>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <section className="relative flex min-h-[70svh] flex-col items-center justify-center px-5 text-center sm:px-6">
          <StoryItem from="up">
            <p className="label text-neon-cyan/80">{medverse.selection}</p>
          </StoryItem>
          <StoryItem from="up" delay={0.06}>
            <h2 className="silver mt-6 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,6vw,4rem)]">
              Built end to end. Still building.
            </h2>
          </StoryItem>
          <StoryItem from="up" delay={0.12}>
            <p className="mt-6 max-w-xl text-fg-dim">
              Happy to walk through the engineering - the hardware, the models, or
              the platform.
            </p>
          </StoryItem>
          <StoryItem from="up" delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neon-cyan/15 px-7 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
              >
                Talk about MedVerse
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
