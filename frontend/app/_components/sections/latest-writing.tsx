import Link from "next/link";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Tilt } from "@/app/_components/ui/tilt";
import { Parallax } from "@/app/_components/ui/parallax";

/**
 * Home teaser for the latest blog post. Hidden entirely when there
 * are no posts (e.g., empty content/blog/).
 */
export function LatestWriting() {
  const latest = getAllPosts()[0];
  if (!latest) return null;

  return (
    <SectionShell
      id="writing"
      kicker="Latest writing"
      title="From the studio notebook."
    >
      <Parallax distance={32}>
        <Reveal>
        <Tilt max={5}>
          <Link
            href={`/blog/${latest.slug}`}
            className="bento tile-sheen group flex flex-col gap-6 p-7 transition-colors duration-200 hover:border-neon-cyan/30 hover:bg-elevated md:flex-row md:items-center md:gap-10 md:p-9"
          >
            <div className="md:w-2/3">
              <p className="label flex items-center gap-2">
                <time dateTime={latest.date}>{formatPostDate(latest.date)}</time>
                <span aria-hidden>·</span>
                <span>{latest.readingTime}</span>
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-fg transition-colors duration-200 group-hover:text-neon-cyan sm:text-3xl">
                {latest.title}
              </h3>
              <p className="mt-3 text-fg-muted">{latest.excerpt}</p>
            </div>
            <div className="md:w-1/3 md:text-right">
              <span className="label inline-flex items-center gap-2 text-neon-cyan">
                Read post →
              </span>
            </div>
          </Link>
        </Tilt>
        </Reveal>
      </Parallax>

      <p className="label mt-8 text-center">
        <Link
          href="/blog"
          className="text-fg-muted transition-colors duration-200 hover:text-fg"
        >
          All writing →
        </Link>
      </p>
    </SectionShell>
  );
}
