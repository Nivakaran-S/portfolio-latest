import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { profile } from "@/lib/data/profile";
import { ContactButton } from "@/app/_components/contact/contact-button";
import { MaskReveal } from "@/app/_components/ui/mask-reveal";
import { Marquee } from "@/app/_components/ui/marquee";

const PORTRAIT = "/about/frames/frame-001.webp";
const city = profile.location.split(",")[0];

/** Floating chips around the portrait. */
const chips: { label: string; className: string; style: React.CSSProperties }[] = [
  { label: "LangGraph", className: "left-[-6%] top-[14%]", style: { ["--r" as string]: "-6deg", ["--dx" as string]: "10px", ["--dy" as string]: "-16px" } },
  { label: "RAG", className: "right-[-4%] top-[26%]", style: { ["--r" as string]: "5deg", ["--dx" as string]: "-8px", ["--dy" as string]: "-12px", animationDelay: "-2s" } },
  { label: "Multi-agent", className: "left-[-8%] bottom-[24%]", style: { ["--r" as string]: "4deg", ["--dx" as string]: "12px", ["--dy" as string]: "-10px", animationDelay: "-4s" } },
  { label: "Ships to prod", className: "right-[-2%] bottom-[12%]", style: { ["--r" as string]: "-4deg", ["--dx" as string]: "-10px", ["--dy" as string]: "-14px", animationDelay: "-1s" } },
];

const primaryCta =
  "group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember-button px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-ember-hover";
const secondaryCta =
  "inline-flex min-h-[48px] items-center gap-2 rounded-full border border-fg px-7 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:bg-fg hover:text-void";

/**
 * Z Crew hero: paper ground, mono eyebrow, a masked headline with a Caveat
 * script accent, and a dark feature card holding the portrait with drifting
 * stack chips. Everything is in the first paint; the rise is CSS-only.
 */
export function Hero() {
  return (
    <section id="hero" className="relative px-5 pb-10 pt-32 sm:px-10 sm:pt-40">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="label animate-hero-in inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
            Open to work · {city}, LK
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,6.1vw,6rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-fg">
            <MaskReveal
              immediate
              lines={[
                profile.name.split(" ")[0],
                <Fragment key="l1">
                  <span className="script text-[1.1em] font-bold leading-none">builds</span>{" "}
                  intelligent
                </Fragment>,
                "systems.",
              ]}
            />
          </h1>

          <p
            className="animate-hero-in mt-8 max-w-xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug text-fg-dim"
            style={{ animationDelay: "0.5s" }}
          >
            AI &amp; software engineer. From the data pipeline to the product people click, end to end.
          </p>

          <div
            className="animate-hero-in mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "0.65s" }}
          >
            <Link href="/work" className={primaryCta}>
              View work
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
            <ContactButton className={secondaryCta}>Get in touch</ContactButton>
          </div>
        </div>

        {/* Portrait feature card */}
        <div className="animate-hero-in relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "0.3s" }}>
          <div className="feature-dark relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 55% at 50% 78%, rgba(255,120,73,0.45), transparent 70%)",
              }}
            />
            <Image
              src={PORTRAIT}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-contain object-bottom"
            />
          </div>
          {chips.map((c) => (
            <span
              key={c.label}
              aria-hidden
              style={c.style}
              className={`animate-drift absolute hidden rounded-full border border-fg/10 bg-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-fg shadow-[0_10px_30px_-12px_rgba(11,11,11,0.35)] sm:block ${c.className}`}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Domains marquee */}
      <div className="mx-auto mt-20 w-full max-w-[1320px]">
        <Marquee duration={32}>
          {[...profile.domains, "Agentic AI", "LangGraph", "RAG", "MLOps", "Full-stack"].map((d) => (
            <span
              key={d}
              className="flex items-center gap-10 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-semibold tracking-tight text-fg"
            >
              {d}
              <span className="h-2 w-2 rounded-full bg-ember" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
