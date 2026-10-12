"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

interface FaceRotationProps {
  /** Total frames in `public/<route>/frames/`. */
  count?: number;
  /** URL prefix joined with a zero-padded index. */
  prefix?: string;
  /** File extension including the leading dot. */
  ext?: string;
  /** Zero-padding width for the index (default 3 → `001`). */
  pad?: number;
  /** Native frame side in CSS pixels - caps the rendered size so the
   *  image never upscales beyond the source resolution. */
  nativeSize?: number;
}

type Phase = "probing" | "loading" | "ready" | "missing";

function frameUrl(i: number, prefix: string, pad: number, ext: string): string {
  return `${prefix}${String(i + 1).padStart(pad, "0")}${ext}`;
}

/**
 * Background portrait - a fixed centered square canvas behind page
 * content. Full-page scroll drives the rotation; the canvas is sized to
 * `min(85vw, 85svh, nativeSize)` so on every screen the image renders at
 * native pixel scale or smaller - no upscale blur. A soft dim + vignette
 * frame the centered subject.
 *
 * Renders as `pointer-events-none fixed inset-0` at z = -5 (between the
 * layout's Aurora at -10 and the page content at +10). Reduced-motion
 * users see a static mid-rotation frame in the same centered square.
 * Missing-frame state renders `null` so the layout's Aurora shows
 * through cleanly.
 */
export function FaceRotation({
  count = 90,
  prefix = "/about/frames/frame-",
  ext = ".webp",
  pad = 3,
  nativeSize = 720,
}: FaceRotationProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const wantedRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("probing");
  const [progress, setProgress] = useState(0);

  // Only honour reduced-motion as the fallback trigger - the canvas is
  // light enough (DPR-clamped draw of ~27 KB WebPs) to run on mobile.
  const fallback = Boolean(reduced);

  // Full-page scroll progress (no target → window scroll).
  const { scrollYProgress } = useScroll();

  // CSS sizing string for the centered subject - capped at the source's
  // native pixel size so the image never upscales beyond 1:1.
  // On desktop the subject sits right of centre and smaller, leaving the left
  // for the page's text (and keeping it distinct from the home hero portrait).
  const sizeVars = {
    "--face": `min(85vw, 85svh, ${nativeSize}px)`,
    "--face-lg": `min(46vw, 80svh, ${nativeSize}px)`,
  } as React.CSSProperties;
  const subjectClass =
    "block aspect-square h-[var(--face)] w-[var(--face)] [mask-image:linear-gradient(to_bottom,black_72%,transparent_98%)] lg:h-[var(--face-lg)] lg:w-[var(--face-lg)]";

  // ───────────────── canvas paint (1:1 cover on a square canvas) ───────
  const drawAt = useCallback((i: number) => {
    wantedRef.current = i;
    if (i === lastFrameRef.current) return;
    const canvas = canvasRef.current;
    // Frame not decoded yet → show the nearest one that is.
    let src = i;
    for (let d = 0; d < count; d++) {
      const a = imagesRef.current[i - d];
      const b = imagesRef.current[i + d];
      if (a?.complete && a.naturalWidth) { src = i - d; break; }
      if (b?.complete && b.naturalWidth) { src = i + d; break; }
    }
    const img = imagesRef.current[src];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetW = Math.max(1, Math.floor(rect.width * dpr));
    const targetH = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // Cover-fit on a square canvas with a square source ≈ 1:1 mapping.
    // We never make the canvas larger than the source's native size, so
    // `scale` is always ≤ 1 and the result is crisp at every viewport.
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastFrameRef.current = src === i ? i : -1;
  }, [count]);

  // ───────────────── preload (probe → batch with yields) ─────────────────
  useEffect(() => {
    let cancelled = false;

    const probe = new Image();
    probe.src = frameUrl(0, prefix, pad, ext);
    // First frame loads immediately (cheap); the rest start when idle.
    probe.onload = async () => {
      if (cancelled) return;
      imagesRef.current[0] = probe;
      // Reduced-motion users only need the probe to confirm frames exist.
      if (fallback) {
        setPhase("ready");
        return;
      }
      setPhase("loading");
      requestAnimationFrame(() => drawAt(0));
      // let the page's critical work finish before pulling ~3 MB of frames
      await new Promise<void>((r) =>
        "requestIdleCallback" in window
          ? window.requestIdleCallback(() => r(), { timeout: 1500 })
          : setTimeout(r, 300)
      );
      if (cancelled) return;

      let loaded = 1;
      setProgress(loaded / count);

      // Coarse pass first (every 6th frame) so scrubbing is usable almost
      // immediately; the remaining frames fill in the gaps afterwards.
      const STRIDE = 6;
      const order: number[] = [];
      for (let i = STRIDE; i < count; i += STRIDE) order.push(i);
      for (let i = 1; i < count; i++) if (i % STRIDE) order.push(i);

      const batch: Promise<void>[] = [];
      const BATCH_SIZE = 6;
      for (const i of order) {
        const img = new Image();
        img.src = frameUrl(i, prefix, pad, ext);
        imagesRef.current[i] = img;
        batch.push(
          img
            .decode()
            .catch(() => {})
            .then(() => {
              loaded += 1;
              setProgress(loaded / count);
            })
        );
        if (batch.length >= BATCH_SIZE) {
          await Promise.all(batch);
          batch.length = 0;
          if (cancelled) return;
          // repaint in case the wanted frame just arrived
          lastFrameRef.current = -1;
          drawAt(wantedRef.current);
          // Yield to the main thread between batches so scroll doesn't
          // stutter during the preload.
          await new Promise<void>((r) => setTimeout(r, 0));
        }
      }
      await Promise.all(batch);
      if (cancelled) return;
      setPhase("ready");
      lastFrameRef.current = -1;
      drawAt(wantedRef.current);
    };
    probe.onerror = () => {
      if (!cancelled) setPhase("missing");
    };

    return () => {
      cancelled = true;
    };
  }, [count, prefix, pad, ext, fallback, drawAt]);

  // ───────────────── scroll → frame index (rAF-coalesced) ───────────────
  useEffect(() => {
    if (fallback || phase === "missing") return;

    let pending = false;
    let nextIdx = -1;

    const schedule = (v: number) => {
      const idx = Math.max(
        0,
        Math.min(count - 1, Math.floor(v * (count - 0.001)))
      );
      if (idx === lastFrameRef.current) return;
      nextIdx = idx;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        drawAt(nextIdx);
        pending = false;
      });
    };

    schedule(scrollYProgress.get());
    return scrollYProgress.on("change", schedule);
  }, [phase, fallback, scrollYProgress, count, drawAt]);

  // ───────────────── redraw on resize ─────────────────────────────────
  useEffect(() => {
    if (fallback) return;
    const onResize = () => {
      const last = lastFrameRef.current >= 0 ? lastFrameRef.current : 0;
      lastFrameRef.current = -1;
      drawAt(last);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fallback, drawAt]);

  // ───────────────── render ─────────────────────────────────────────────

  // Missing frames → render nothing so the layout's Aurora shows through.
  if (phase === "missing") return null;

  // Reduced-motion → static mid-rotation frame in the same centered
  // square so the resolution is preserved (no upscale).
  if (fallback) {
    const midIndex = Math.max(1, Math.floor(count / 2));
    const staticSrc = frameUrl(midIndex - 1, prefix, pad, ext);
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[5] flex items-center justify-center overflow-hidden lg:justify-end lg:pr-[6vw] [--face-x:50%] lg:[--face-x:72%]"
        style={sizeVars}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={staticSrc}
          alt=""
          className={`${subjectClass} object-contain`}
          loading="eager"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-void/25" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(95% 70% at var(--face-x) 50%, transparent 45%, rgba(10,10,12,0.92) 100%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5] flex items-center justify-center overflow-hidden lg:justify-end lg:pr-[6vw] [--face-x:50%] lg:[--face-x:72%]"
        style={sizeVars}
    >
      <canvas
        ref={canvasRef}
        className={subjectClass}
      />
      {/* light dim + vignette so foreground content stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-void/25" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(95% 70% at var(--face-x) 50%, transparent 45%, rgba(10,10,12,0.92) 100%)",
        }}
      />
      {phase !== "ready" ? (
        <div className="pointer-events-none absolute bottom-6 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-line">
          <div
            className="h-px bg-neon-cyan transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
