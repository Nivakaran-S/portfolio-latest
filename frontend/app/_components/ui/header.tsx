"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routeNav } from "@/lib/sections";
import { profile } from "@/lib/data/profile";
import { ContactButton } from "@/app/_components/contact/contact-button";

function isActive(pathname: string, href: string): boolean {
  // route links like "/work" or "/blog" - match the route prefix.
  if (href.startsWith("/#")) return false; // anchors don't get active state
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the mobile menu when the route changes (deferred so the
  // setState lands in an async callback, per react-hooks/set-state-in-effect).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 sm:px-8"
      >
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-fg"
        >
          {profile.shortName}
          <span className="text-neon-cyan">.dev</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {routeNav.map((r) => {
            // Contact opens the slide-in drawer instead of routing home.
            if (r.href === "/#contact") {
              return (
                <li key={r.href}>
                  <ContactButton className="label text-fg-muted transition-colors duration-300 hover:text-fg">
                    {r.label}
                  </ContactButton>
                </li>
              );
            }
            const active = isActive(pathname, r.href);
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={`label transition-colors duration-300 ${
                    active ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <ContactButton className="label hidden rounded-full border border-white/15 px-4 py-2 text-fg-dim transition-all duration-300 hover:border-white/35 hover:text-fg md:inline-block">
          Get in touch
        </ContactButton>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`h-px w-6 bg-fg transition-all duration-300 ${
              menuOpen ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-fg transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-fg transition-all duration-300 ${
              menuOpen ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-7 bg-void/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {routeNav.map((r) => {
          if (r.href === "/#contact") {
            return (
              <ContactButton
                key={r.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl tracking-tight text-fg-muted transition-colors"
              >
                {r.label}
              </ContactButton>
            );
          }
          const active = isActive(pathname, r.href);
          return (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setMenuOpen(false)}
              className={`font-display text-2xl tracking-tight transition-colors ${
                active ? "text-fg" : "text-fg-muted"
              }`}
            >
              {r.label}
            </Link>
          );
        })}
        <ContactButton
          onClick={() => setMenuOpen(false)}
          className="label mt-4 rounded-full border border-white/15 px-6 py-3 text-fg-dim"
        >
          Get in touch
        </ContactButton>
      </div>
    </header>
  );
}
