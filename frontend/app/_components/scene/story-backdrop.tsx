"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

export type BackdropVariant = "ember" | "forge" | "ink" | "origin";

/** Deterministic ember particles (no Math.random → SSR-stable, lint-safe). */
const EMBERS = Array.from({ length: 16 }, (_, i) => {
  const rand = (seed: number) => {
    const x = Math.sin((i + 1) * seed + 11.3) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: Math.round(rand(12.9) * 100),
    size: 2 + Math.round(rand(78.2) * 3),
    delay: -(rand(3.1) * 16).toFixed(2),
    dur: (9 + rand(45.7) * 10).toFixed(2),
    hot: rand(91.7) > 0.62,
  };
});

/** Deterministic starfield for the /about "origin" backdrop. */
const STARS = Array.from({ length: 30 }, (_, i) => {
  const rand = (seed: number) => {
    const x = Math.sin((i + 1) * seed + 4.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: (rand(31.7) * 100).toFixed(2),
    top: (rand(57.1) * 100).toFixed(2),
    size: rand(12.3) > 0.85 ? 2 : 1,
    op: (0.1 + rand(73.9) * 0.4).toFixed(2),
  };
});

interface StoryBackdropProps {
  variant: BackdropVariant;
}

/**
 * Per-page themed backdrop that matches each page's story. Fixed behind
 * the content (-z-10), pointer-transparent, scroll-reactive (layers drift
 * at different rates), CSS/SVG only — no WebGL, no video frames.
 *
 *  - ember : home — a forge of rising sparks + warm glow ("the spark")
 *  - forge : work — glowing seams in cooling metal ("forged")
 *  - ink   : blog — ruled-paper notebook with a soft wash ("the notebook")
 *
 * The face-rotation video stays exclusive to /about.
 * Reduced-motion / mobile drop the scroll parallax (CSS drift is killed
 * globally by the reduced-motion media query).
 */
export function StoryBackdrop({ variant }: StoryBackdropProps) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const enabled = !reduced && !mobile;

  const { scrollYProgress } = useScroll();
  const yFarRaw = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yNearRaw = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yFar = useSpring(yFarRaw, { stiffness: 80, damping: 30, mass: 0.5 });
  const yNear = useSpring(yNearRaw, { stiffness: 80, damping: 30, mass: 0.5 });
  const far = enabled ? { y: yFar } : undefined;
  const near = enabled ? { y: yNear } : undefined;

  const wash: Record<BackdropVariant, string> = {
    ember:
      "radial-gradient(120% 80% at 50% 100%, #1c160f 0%, #0e0c0d 45%, #0a0a0c 100%)",
    forge:
      "radial-gradient(120% 90% at 50% 10%, #16171b 0%, #0d0e11 45%, #0a0a0c 100%)",
    ink: "radial-gradient(120% 80% at 50% 0%, #121319 0%, #0c0d11 45%, #0a0a0c 100%)",
    origin:
      "radial-gradient(90% 70% at 50% 45%, #15110c 0%, #0d0c0d 50%, #08080a 100%)",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      <div className="absolute inset-0" style={{ background: wash[variant] }} />

      {/* ───────────── EMBER ───────────── */}
      {variant === "ember" ? (
        <>
          <motion.div className="absolute inset-0" style={far}>
            <div
              className="animate-pulse-glow absolute bottom-[-12%] left-1/2 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full blur-[150px]"
              style={{ background: "rgba(245,158,11,0.12)" }}
            />
            <div
              className="animate-aurora absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full blur-[160px]"
              style={{ background: "rgba(217,119,6,0.07)" }}
            />
          </motion.div>
          <motion.div className="absolute inset-0" style={near}>
            {EMBERS.map((e, i) => (
              <span
                key={i}
                className="animate-ember absolute bottom-0 rounded-full"
                style={{
                  left: `${e.left}%`,
                  width: e.size,
                  height: e.size,
                  animationDelay: `${e.delay}s`,
                  animationDuration: `${e.dur}s`,
                  background: e.hot ? "#fbbf24" : "#d97706",
                  boxShadow: `0 0 ${e.size * 3}px ${
                    e.hot ? "rgba(251,191,36,0.8)" : "rgba(217,119,6,0.7)"
                  }`,
                }}
              />
            ))}
          </motion.div>
        </>
      ) : null}

      {/* ───────────── FORGE ───────────── */}
      {variant === "forge" ? (
        <>
          <motion.div className="absolute inset-0" style={far}>
            <div
              className="animate-pulse-glow absolute -left-32 top-1/3 h-[36rem] w-[36rem] rounded-full blur-[150px]"
              style={{ background: "rgba(245,158,11,0.08)" }}
            />
            <div
              className="animate-aurora-alt absolute -right-24 bottom-0 h-[34rem] w-[34rem] rounded-full blur-[160px]"
              style={{ background: "rgba(120,120,128,0.06)" }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 opacity-70"
            style={near}
          >
            <svg
              className="h-full w-full"
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 1200 800"
              fill="none"
            >
              <defs>
                <linearGradient id="seam" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>
                <filter id="seamGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              <g
                stroke="url(#seam)"
                strokeWidth="1.4"
                filter="url(#seamGlow)"
                className="animate-pulse-glow"
              >
                <path d="M-50 220 L500 300 L760 240 L1260 360" />
                <path d="M-50 520 L380 460 L720 560 L1260 500" />
                <path d="M120 -50 L260 360 L180 820" />
                <path d="M980 -50 L880 380 L1020 820" />
              </g>
            </svg>
          </motion.div>
        </>
      ) : null}

      {/* ───────────── INK ───────────── */}
      {variant === "ink" ? (
        <>
          <motion.div className="absolute inset-0" style={far}>
            <div
              className="animate-aurora absolute left-1/3 top-1/4 h-[40rem] w-[40rem] rounded-full blur-[170px]"
              style={{ background: "rgba(148,163,184,0.06)" }}
            />
            <div
              className="animate-pulse-glow absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full blur-[150px]"
              style={{ background: "rgba(245,158,11,0.05)" }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              ...near,
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 37px, rgba(255,255,255,0.035) 38px, transparent 39px)",
            }}
          />
        </>
      ) : null}

      {/* ───────────── ORIGIN (/about) ───────────── */}
      {variant === "origin" ? (
        <>
          {/* dawn halo + orbit rings stay locked to the centered portrait */}
          <div className="absolute inset-0">
            <div
              className="animate-pulse-glow absolute left-1/2 top-1/2 h-[52rem] w-[52rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[170px]"
              style={{ background: "rgba(245,158,11,0.16)" }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
              style={{ background: "rgba(217,119,6,0.12)" }}
            />

            {/* three concentric rings, two carrying an orbiting node */}
            <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border border-white/[0.10]" />
              <div className="animate-orbit absolute inset-0">
                <span
                  className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neon-cyan-core"
                  style={{ boxShadow: "0 0 12px rgba(251,191,36,0.8)" }}
                />
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border border-neon-cyan/[0.11]" />
              <div className="animate-orbit-rev absolute inset-0">
                <span
                  className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-neon-violet"
                  style={{ boxShadow: "0 0 10px rgba(217,119,6,0.8)" }}
                />
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
          </div>

          {/* sparse starfield drifts a touch with scroll for depth */}
          <motion.div className="absolute inset-0" style={near}>
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  opacity: Number(s.op),
                }}
              />
            ))}
          </motion.div>
        </>
      ) : null}

      {/* faint grid + vignette shared across variants */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(10,10,12,0.9) 100%)",
        }}
      />
    </div>
  );
}
