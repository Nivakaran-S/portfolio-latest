import type { Metadata } from "next";
import Link from "next/link";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";

export const metadata: Metadata = {
  title: "Off the path",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <StoryBackdrop variant="ember" />

      <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="label mb-5 text-fg-muted">Error 404</p>
        <h1 className="silver font-display text-6xl font-bold tracking-tight sm:text-8xl">
          Off the path
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-fg-muted">
          This route doesn&apos;t exist. Let&apos;s get you back to a known
          good state.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-neon-cyan/15 px-7 py-3 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-colors duration-200 hover:bg-neon-cyan/25"
        >
          Return home
          <span aria-hidden="true">→</span>
        </Link>
      </main>
    </>
  );
}
