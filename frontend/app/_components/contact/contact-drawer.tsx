"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profile } from "@/lib/data/profile";

/* ------------------------------------------------------------------ */
/*  Context - lets any button anywhere open the panel without a route  */
/*  change. Mounted once in the layout via <ContactDrawerProvider>.    */
/* ------------------------------------------------------------------ */

interface ContactDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const ContactDrawerContext = createContext<ContactDrawerContextValue | null>(
  null
);

export function useContactDrawer(): ContactDrawerContextValue {
  const ctx = useContext(ContactDrawerContext);
  if (!ctx) {
    throw new Error(
      "useContactDrawer must be used inside <ContactDrawerProvider>"
    );
  }
  return ctx;
}

export function ContactDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <ContactDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <ContactDrawer isOpen={isOpen} onClose={close} />
    </ContactDrawerContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  The panel itself - slides in from the right, dim backdrop behind.  */
/*  Always in the DOM (translate-x toggles); `inert` keeps it out of   */
/*  the tab order while closed.                                        */
/* ------------------------------------------------------------------ */

function ContactDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Escape to close · lock background scroll · manage focus.
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      cancelAnimationFrame(id);
      lastFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) - mailto still works.
    }
  }, []);

  const socials = profile.socials.filter((s) => s.label !== "Email");
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    "Let's work together"
  )}`;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[80] ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close contact panel"
        onClick={onClose}
        className={`absolute inset-0 h-full w-full cursor-default bg-void/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch"
        inert={!isOpen}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-base shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* warm accent rail at the top edge */}
        <div
          aria-hidden="true"
          className="h-1 w-full shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-neon-cyan), transparent)",
          }}
        />

        <div className="flex flex-1 flex-col gap-9 px-6 py-7 sm:px-8">
          {/* top row */}
          <div className="flex items-center justify-between">
            <p className="label inline-flex items-center gap-2 text-fg-muted">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
              Open to work
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-fg-muted transition-colors duration-200 hover:border-white/30 hover:text-fg"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* heading */}
          <div>
            <h2 className="silver font-display text-[clamp(2rem,7vw,2.75rem)] font-semibold leading-[1.02] tracking-tight">
              Let&apos;s talk.
            </h2>
            <p className="mt-4 text-fg-muted">
              Got a problem worth solving - a role, a build, or just an idea?
              Send it over. I read everything and usually reply within a day.
            </p>
          </div>

          {/* email - primary action */}
          <div className="rounded-2xl border border-line bg-raised/70 p-5">
            <p className="label text-fg-muted">Email</p>
            <p className="mt-2 break-all font-display text-lg font-medium text-fg">
              {profile.email}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={mailto}
                className="group inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-neon-cyan/15 px-5 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-all duration-200 hover:bg-neon-cyan/25 hover:ring-2 hover:ring-neon-cyan/60"
              >
                Send email
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>

          {/* résumé / CV */}
          <a
            href={profile.resumeUrl}
            download
            className="group flex items-center justify-between rounded-2xl border border-line bg-raised/50 px-5 py-4 transition-colors duration-200 hover:border-neon-cyan/30 hover:bg-elevated"
          >
            <span className="flex flex-col">
              <span className="font-display font-medium text-fg">
                Download CV
              </span>
              <span className="label mt-0.5 text-fg-muted">PDF résumé</span>
            </span>
            <span
              aria-hidden="true"
              className="text-fg-muted transition-all duration-200 group-hover:translate-y-0.5 group-hover:text-neon-cyan"
            >
              ↓
            </span>
          </a>

          {/* socials */}
          <div>
            <p className="label text-fg-muted">Elsewhere</p>
            <ul className="mt-3 flex flex-col gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-line bg-raised/50 px-5 py-4 transition-colors duration-200 hover:border-neon-cyan/30 hover:bg-elevated"
                  >
                    <span className="flex flex-col">
                      <span className="font-display font-medium text-fg">
                        {s.label}
                      </span>
                      <span className="label mt-0.5 text-fg-muted">
                        {s.handle}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-neon-cyan"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* footer */}
          <p className="label mt-auto border-t border-line/60 pt-6 text-fg-muted">
            Based in {profile.location}
          </p>
        </div>
      </aside>
    </div>
  );
}
