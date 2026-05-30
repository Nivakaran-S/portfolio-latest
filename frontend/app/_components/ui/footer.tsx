import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { routeNav } from "@/lib/sections";
import { ContactButton } from "@/app/_components/contact/contact-button";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = profile.socials.filter((s) => s.label !== "Email");

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-base/40">
      {/* giant faded wordmark — the closing flourish, clipped at the edge */}
      <p
        aria-hidden="true"
        className="silver pointer-events-none absolute -bottom-[0.16em] left-1/2 w-max -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,17vw,14rem)] font-bold leading-none tracking-tighter opacity-[0.05]"
      >
        {profile.shortName}.dev
      </p>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* brand + CTA */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-tight text-fg"
            >
              {profile.shortName}
              <span className="text-neon-cyan">.dev</span>
            </Link>
            <p className="mt-4 leading-relaxed text-fg-muted">
              {profile.tagline}
            </p>
            <ContactButton className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-fg-dim transition-colors duration-200 hover:border-neon-cyan/40 hover:text-fg">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-neon-lime" />
              Open to work — let&apos;s talk
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </ContactButton>
          </div>

          {/* navigate + connect */}
          <div className="grid grid-cols-2 gap-8 sm:max-w-md md:justify-self-end">
            <nav aria-label="Footer">
              <p className="label mb-4 text-fg-muted">Navigate</p>
              <ul className="flex flex-col gap-3">
                {routeNav.map((r) =>
                  r.href === "/#contact" ? (
                    <li key={r.href}>
                      <ContactButton className="text-sm text-fg-dim transition-colors duration-200 hover:text-neon-cyan">
                        {r.label}
                      </ContactButton>
                    </li>
                  ) : (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="text-sm text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
                      >
                        {r.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div>
              <p className="label mb-4 text-fg-muted">Connect</p>
              <ul className="flex flex-col gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
                    >
                      {s.label}
                      <span
                        aria-hidden="true"
                        className="text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-neon-cyan"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-fg-dim transition-colors duration-200 hover:text-neon-cyan"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-6 text-center sm:flex-row sm:text-left">
          <p className="label text-fg-muted">
            © {year} {profile.name} · {profile.location}
          </p>
          <p className="label text-fg-muted">
            Built with Next.js, Tailwind &amp; Motion · Vercel
          </p>
          <a
            href="#main"
            className="label text-fg-muted transition-colors duration-200 hover:text-fg"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
