import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMainProjects, getProject } from "@/lib/data/projects";
import { projectJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import { GlowButton } from "@/app/_components/ui/glow-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  // Only main projects have a full case-study detail.
  return getMainProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work not found" };
  return {
    title: `${project.name} — ${project.valueProp}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${project.valueProp}`,
      description: project.description,
      url: `/work/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${project.valueProp}`,
      description: project.description,
    },
  };
}

const categoryColor: Record<string, string> = {
  "Software Engineering": "text-neon-cyan border-neon-cyan/30",
  "Data Science": "text-neon-cyan-core border-neon-cyan-core/30",
  "Computer Vision": "text-neon-violet border-neon-violet/40",
  "Data Engineering": "text-fg-dim border-white/15",
  "Data Analysis": "text-neon-lime border-neon-lime/30",
};

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.detail) notFound();

  const beats: { n: string; label: string; body: string }[] = [
    { n: "01", label: "The problem", body: project.detail.problem },
    { n: "02", label: "What I built", body: project.detail.approach },
    { n: "03", label: "What changed", body: project.detail.outcome },
  ];

  const projectLd = projectJsonLd({
    slug: project.slug,
    name: project.name,
    valueProp: project.valueProp,
    description: project.description,
    stack: project.stack,
    repo: project.repo,
    live: project.live,
  });
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" },
    { name: project.name, url: `/work/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }}
      />

      {/* Case-study backdrop: glowing seams in cooling metal — "forged". */}
      <StoryBackdrop variant="forge" />

      <header className="fixed inset-x-0 top-0 z-50 glass py-4">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/work"
            className="label text-fg-muted transition-colors hover:text-neon-cyan"
          >
            ← Back to work
          </Link>
          <Link
            href="/"
            className="font-display text-base font-bold tracking-tight text-fg"
          >
            nivakaran<span className="text-neon-cyan">.dev</span>
          </Link>
        </nav>
      </header>

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ TITLE ════════════ */}
        <section className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <StoryItem from="fade">
              <p className="label text-neon-cyan/80">
                {project.category} · One build, frame by frame
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-5 max-w-full font-display font-semibold leading-[0.98] tracking-[-0.03em] text-[clamp(2.25rem,10vw,7rem)] [overflow-wrap:anywhere] [text-wrap:balance]">
                {project.name}
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-5 font-display text-[clamp(1.2rem,2.4vw,1.9rem)] text-fg-dim">
                {project.valueProp}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.15}>
              <p className="mt-5 max-w-2xl leading-relaxed text-fg-muted">
                {project.description}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span
                  className={`label rounded-full border px-3 py-1.5 ${categoryColor[project.category]}`}
                >
                  {project.category}
                </span>
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="label rounded bg-void/60 px-2.5 py-1.5 text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ PROBLEM / APPROACH / OUTCOME ════════════ */}
        {beats.map((b) => (
          <section
            key={b.n}
            className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6"
          >
            <div className="mx-auto w-full max-w-4xl">
              <StoryItem from="left">
                <p className="label text-fg-muted">
                  {b.n} — {b.label}
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.06} distance={70}>
                <p className="mt-6 font-display text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.25] tracking-tight text-fg-dim">
                  {b.body}
                </p>
              </StoryItem>
            </div>
          </section>
        ))}

        {/* ════════════ LINKS ════════════ */}
        <section className="relative flex min-h-[70svh] flex-col items-center justify-center px-5 text-center sm:px-6">
          <StoryItem from="up">
            <p className="label text-fg-muted">See it for yourself</p>
          </StoryItem>
          <StoryItem from="up" delay={0.06}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <GlowButton href={project.repo} external>
                View on GitHub
              </GlowButton>
              {project.live ? (
                <GlowButton href={project.live} variant="ghost" external>
                  Live site
                </GlowButton>
              ) : null}
            </div>
          </StoryItem>
          <StoryItem from="fade" delay={0.12}>
            <p className="label mt-12">
              <Link
                href="/work"
                className="text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                ← All work
              </Link>
            </p>
          </StoryItem>
        </section>
      </main>

      <Footer />
    </>
  );
}
