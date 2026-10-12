"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data/profile";
import { ContactButton } from "@/app/_components/contact/contact-button";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const PORTRAIT = "/about/frames/frame-001.webp";

/**
 * Hero geometry, laid out top-down so spacing holds at every screen size:
 * the eyebrow sits a fixed gap below the header, the name follows, and the
 * portrait starts at the name's baseline (overlapping it by 0.24 of the
 * name's size) and fills the rest of the screen as a square.
 * The eyebrow block is 1.2rem tall plus a 1rem margin before the name.
 */
const STAGE_VARS = {
  "--header": "78px", // fixed site header height
  "--gap": "clamp(1.5rem, 4svh, 3rem)",
  "--name": "clamp(3.75rem, min(17vw, 24svh), 18rem)",
  "--portrait-top":
    "calc(var(--header) + var(--gap) + 2.2rem + 0.64 * var(--name))",
} as React.CSSProperties;
const city = profile.location.split(",")[0];

const primaryCta =
  "group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fg px-7 py-3 text-sm font-medium text-void transition-transform duration-200 hover:scale-[1.03]";
const secondaryCta =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-white/40";

/**
 * Keynote-style hero. A black stage, one oversized name set behind the
 * portrait's hairline, then - pinned while you scroll - the portrait
 * steps back and the statement and calls to action take the stage.
 * Reduced-motion users get the same content as a static layout.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Starts false on server and client alike, then updates after mount, so the
  // pinned and static layouts never mismatch during hydration.
  const reduced = usePrefersReducedMotion();

  // Progress through the pinned section, computed in JS from scrollY.
  // useScroll({ target }) gets hardware-accelerated onto a native scroll
  // timeline, which mis-reports progress in this sticky layout.
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (y) => {
    const el = ref.current;
    if (!el) return 0;
    const range = el.offsetHeight - window.innerHeight;
    return range > 0 ? Math.min(1, Math.max(0, (y - el.offsetTop) / range)) : 0;
  });

  // Beat 1 - the name.
  const nameOpacity = useTransform(p, [0, 0.28], [1, 0]);
  const nameScale = useTransform(p, [0, 0.28], [1, 0.92]);
  const nameY = useTransform(p, [0, 0.28], [0, -60]);

  // The portrait steps back and dims as the statement arrives.
  const portraitScale = useTransform(p, [0, 0.6], [1, 0.84]);
  const portraitY = useTransform(p, [0, 0.6], [0, -30]);
  const portraitOpacity = useTransform(p, [0.25, 0.6], [1, 0.22]);

  // Beat 2 - the statement, then the calls to action.
  const lineOpacity = useTransform(p, [0.3, 0.5], [0, 1]);
  const lineY = useTransform(p, [0.3, 0.5], [50, 0]);
  const ctaOpacity = useTransform(p, [0.48, 0.62], [0, 1]);
  const ctaEvents = useTransform(ctaOpacity, (v) => (v > 0.5 ? "auto" : "none"));

  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  const ctas = (
    <>
      <Link href="#work" className={primaryCta}>
        View work
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
      <ContactButton className={secondaryCta}>Get in touch</ContactButton>
    </>
  );

  const openToWork = (
    <p className="label inline-flex items-center gap-2 text-fg-muted">
      <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
      Open to work · {city}, LK
    </p>
  );

  if (reduced) {
    return (
      <section
        id="hero"
        className="relative flex min-h-[100svh] flex-col items-center justify-center gap-8 bg-black px-5 py-28 text-center"
      >
        <p className="label text-fg-dim">AI &amp; Software Engineer · {city}</p>
        <h1 className="font-display font-semibold leading-[0.9] tracking-[-0.05em] text-fg text-[clamp(3.5rem,15vw,12rem)]">
          {profile.name}.
        </h1>
        <div className="relative h-[40svh] w-[min(40svh,80vw)]">
          <Image src={PORTRAIT} alt={`Portrait of ${profile.name}`} fill priority sizes="40svh" className="object-contain" />
        </div>
        <h2 className="silver font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(2rem,6vw,4.5rem)]">
          Intelligent systems. End to end.
        </h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row">{ctas}</div>
        {openToWork}
      </section>
    );
  }

  return (
    <section ref={ref} id="hero" className="relative h-[230svh]">
      <div
        className="sticky top-0 h-[100svh] overflow-hidden bg-[linear-gradient(to_bottom,#000_0%,#000_72%,transparent_100%)]"
        style={STAGE_VARS}
      >
        {/* Stage light behind the portrait. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[62%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.16), rgba(255,255,255,0.04) 35%, transparent 62%)",
          }}
        />

        {/* Beat 1 - the name, a fixed gap below the header. It sits behind the
            portrait, so the head breaks the baseline of the letters. */}
        <motion.div
          style={{
            opacity: nameOpacity,
            scale: nameScale,
            y: nameY,
            top: "calc(var(--header) + var(--gap))",
            fontSize: "var(--name)",
          }}
          className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-5 text-center"
        >
          {/* Visible from the first paint: the name never waits on JS. */}
          <p className="label text-fg-dim">AI &amp; Software Engineer · {city}</p>
          <h1 className="mt-4 font-display font-semibold leading-[0.88] tracking-[-0.055em] text-fg">
            {profile.name}.
          </h1>
        </motion.div>

        {/* The portrait, in front of the name. */}
        <motion.div
          style={{
            x: "-50%",
            scale: portraitScale,
            y: portraitY,
            opacity: portraitOpacity,
            height: "calc(100svh - var(--portrait-top))",
            width: "calc(100svh - var(--portrait-top))",
          }}
          className="absolute bottom-0 left-1/2 z-20 origin-bottom"
        >
          <motion.div
            className="relative h-full w-full"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={PORTRAIT}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 768px) 80svh, 170vw"
              className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_72%,transparent_98%)]"
            />
          </motion.div>
        </motion.div>

        {/* Beat 2 - the statement and calls to action. */}
        <motion.div
          style={{ opacity: lineOpacity, y: lineY }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-5 text-center"
        >
          <h2 className="silver font-display font-semibold leading-[0.98] tracking-[-0.045em] text-[clamp(2.75rem,9vw,8rem)] [text-wrap:balance]">
            Intelligent systems.
            <br />
            End to end.
          </h2>
          <p className="mt-6 max-w-xl text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug text-fg-dim">
            From the data pipeline to the product people click.
          </p>
          <motion.div
            style={{ opacity: ctaOpacity, pointerEvents: ctaEvents }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row">{ctas}</div>
            {openToWork}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          aria-hidden
          className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
        >
          <span className="flex h-8 w-5 justify-center rounded-full border border-white/25">
            <span className="mt-1.5 h-1.5 w-1.5 animate-scroll-dot rounded-full bg-fg" />
          </span>
        </motion.div>

      </div>
    </section>
  );
}
