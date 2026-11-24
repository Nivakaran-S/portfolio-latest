import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { routeNav } from "@/lib/sections";
import { ContactButton } from "@/app/_components/contact/contact-button";

const linkClass =
  "inline-flex min-h-[44px] items-center text-sm text-[#d8d5cc] transition-colors duration-200 hover:text-ember";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = profile.socials.filter((s) => s.label !== "Email");

  return (
    <footer className="relative mt-24 overflow-hidden bg-[#0b0b0b] text-[#faf9f4]">
      {/* giant wordmark, clipped at the edge */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.16em] left-1/2 w-max -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(4rem,17vw,16rem)] font-bold leading-none tracking-tighter text-white opacity-[0.06]"
      >
        {profile.shortName}.dev
      </p>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 pb-12 pt-20 sm:px-10">
        <div className="grid gap-12 md:grid-cols-2">
          {/* brand + CTA */}
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center font-display text-2xl font-bold tracking-tight"
            >
              {profile.shortName}
              <span className="text-ember">.dev</span>
            </Link>
            <p className="mt-4 leading-relaxed text-[#a8a8a8]">{profile.tagline}</p>
            <ContactButton className="group mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ember px-6 py-2.5 text-sm font-medium text-[#0b0b0b] transition-colors duration-200 hover:bg-[#ff8f66]">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-[#0b0b0b]" />
              Get in touch
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </ContactButton>
          </div>

          {/* navigate + connect */}
          <div className="grid grid-cols-2 gap-8 sm:max-w-md md:justify-self-end">
            <nav aria-label="Footer">
              <p className="label mb-4 text-[#a8a8a8]">Navigate</p>
              <ul className="flex flex-col">
                {routeNav.map((r) =>
                  r.href === "/#contact" ? (
                    <li key={r.href}>
                      <ContactButton className={linkClass}>{r.label}</ContactButton>
                    </li>
                  ) : (
                    <li key={r.href}>
                      <Link href={r.href} className={linkClass}>
                        {r.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div>
              <p className="label mb-4 text-[#a8a8a8]">Connect</p>
              <ul className="flex flex-col">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group gap-1.5 ${linkClass}`}
                    >
                      {s.label}
                      <span
                        aria-hidden="true"
                        className="text-[#a8a8a8] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ember"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${profile.email}`} className={linkClass}>
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="label text-[#a8a8a8]">
            © {year} {profile.name} · {profile.location}
          </p>
          <p className="label text-[#a8a8a8]">Built with Next.js, Tailwind &amp; Motion · Vercel</p>
          <a
            href="#main"
            className="label inline-flex min-h-[44px] items-center text-[#a8a8a8] transition-colors duration-200 hover:text-ember"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
