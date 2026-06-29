"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  certifications,
  certCategories,
  type Certification,
} from "@/lib/data/certifications";

/**
 * One certificate tile. By default it shows a cropped preview with an info
 * bar pinned to the bottom; on hover/focus the certificate "swipes up" to
 * reveal itself fully while the info bar slides out of frame. The whole
 * tile is a button that opens the lightbox. Transforms are disabled under
 * `prefers-reduced-motion` via Tailwind's `motion-reduce:` variants.
 */
function CertCard({
  cert,
  onOpen,
}: {
  cert: Certification;
  onOpen: (cert: Certification) => void;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(cert)}
      aria-label={`View certificate: ${cert.title}`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-raised/70 text-left backdrop-blur-sm transition-colors duration-300 hover:border-neon-cyan/40 focus-visible:border-neon-cyan/60 focus-visible:outline-none"
    >
      {errored ? (
        // Graceful placeholder until the real image is dropped in.
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-elevated to-raised p-4 text-center">
          <span className="label text-neon-cyan/70">{cert.issuer}</span>
          <span className="font-display text-sm font-semibold text-fg-dim">
            {cert.label}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cert.image}
          alt={`${cert.title} — ${cert.issuer} certificate`}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          className="absolute inset-0 h-full w-full translate-y-[10%] scale-[1.06] object-cover transition-transform duration-500 ease-out group-hover:translate-y-0 group-hover:scale-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 motion-reduce:transform-none"
        />
      )}

      {/* Info bar — slides down out of frame on hover to reveal the cert. */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-void via-void/85 to-transparent p-4 pt-10 transition-transform duration-500 ease-out group-hover:translate-y-full group-focus-visible:translate-y-full motion-reduce:transform-none">
        <div className="min-w-0">
          <h3 className="truncate font-display text-sm font-semibold text-fg">
            {cert.label}
          </h3>
          <p className="mt-0.5 text-xs text-neon-cyan/80">{cert.issuer}</p>
        </div>
        <span className="label shrink-0 text-fg-muted">{cert.date}</span>
      </div>

      {/* Zoom affordance, fades in on hover. */}
      <span
        aria-hidden
        className="absolute right-3 top-3 rounded-full border border-neon-cyan/30 bg-void/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-neon-cyan opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        View ↗
      </span>
    </button>
  );
}

/** Full-screen certificate viewer. ESC / backdrop / button all close it. */
function Lightbox({
  cert,
  onClose,
}: {
  cert: Certification;
  onClose: () => void;
}) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock background scroll while open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 p-5 backdrop-blur-md sm:p-10"
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 8 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-raised shadow-2xl"
      >
        {errored ? (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gradient-to-br from-elevated to-raised p-8 text-center">
            <span className="label text-neon-cyan/70">{cert.issuer}</span>
            <span className="font-display text-lg font-semibold text-fg">
              {cert.title}
            </span>
            <span className="text-sm text-fg-muted">
              Certificate image coming soon.
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cert.image}
            alt={`${cert.title} — ${cert.issuer} certificate`}
            onError={() => setErrored(true)}
            className="block max-h-[80svh] w-full object-contain"
          />
        )}
        <div className="flex items-center justify-between gap-4 border-t border-line bg-void/60 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold text-fg">
              {cert.title}
            </h3>
            <p className="mt-0.5 text-xs text-neon-cyan/80">
              {cert.issuer} · {cert.date}
            </p>
          </div>
          {cert.credentialUrl ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-full border border-neon-cyan/40 px-4 py-2 text-xs font-medium text-neon-cyan-core transition-colors hover:bg-neon-cyan/15"
            >
              Verify ↗
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-void/60 text-fg-dim backdrop-blur-sm transition-colors hover:border-white/30 hover:text-fg"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

/**
 * Certifications gallery for /about — all credentials grouped by category,
 * each tile revealing its certificate on hover and zooming in a lightbox on
 * click. Owns the lightbox state so the page can stay a server component.
 */
export function CertificationGallery() {
  const [active, setActive] = useState<Certification | null>(null);

  return (
    <>
      <div className="mt-10 space-y-10">
        {certCategories.map((category) => {
          const items = certifications.filter((c) => c.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <p className="label text-fg-muted">{category}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((cert) => (
                  <CertCard key={cert.slug} cert={cert} onOpen={setActive} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {active ? (
          <Lightbox cert={active} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
