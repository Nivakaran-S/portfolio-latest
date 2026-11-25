import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getMainProjects, getProject } from "@/lib/data/projects";
import { caseStudyExtras } from "@/lib/data/case-studies";
import { ArchitectureDiagram } from "@/app/_components/work/architecture-diagram";
import { projectJsonLd, breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo/metadata";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
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
    title: `${project.name} - ${project.valueProp}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} - ${project.valueProp}`,
      description: project.description,
      url: `/work/${project.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} - ${project.valueProp}`,
      description: project.description,
    },
  };
}

const categoryColor: Record<string, string> = {
  "Software Engineering": "text-neon-cyan border-neon-cyan/30",
  "Data Science": "text-neon-cyan-core border-neon-cyan-core/30",
  "Computer Vision": "text-neon-violet border-neon-violet/40",
  "Data Engineering": "text-fg-dim border-fg/15",
  "Data Analysis": "text-neon-lime border-neon-lime/30",
};

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.detail) notFound();

  const extras = caseStudyExtras[project.slug];
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
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(projectLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(crumbsLd) }}
      />

      {/* Case-study backdrop: glowing seams in cooling metal - "forged". */}

      <Header />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ TITLE ════════════ */}
        <section className="relative flex flex-col px-5 pb-16 pt-28 sm:px-6 sm:pt-32">
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-6">
              <Link
                href="/work"
                className="label -ml-1 inline-flex min-h-[44px] items-center px-1 text-fg-muted transition-colors hover:text-fg"
              >
                ← All work
              </Link>
            </p>
            <StoryItem from="fade">
              <p className="label">
                {project.category} · Case study
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

        {/* ════════════ SNAPSHOT ════════════ */}
        {extras ? (
          <section className="px-5 pb-12 sm:px-6">
            <div
              className={`mx-auto grid w-full max-w-5xl gap-5 ${
                extras.screenshot ? "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" : ""
              }`}
            >
              <StoryItem from="up">
                <div
                  className={`feature-dark flex h-full gap-6 rounded-3xl p-8 ${
                    extras.screenshot ? "flex-col justify-between" : "flex-col md:flex-row md:items-end md:justify-between"
                  }`}
                >
                  <p className="font-display text-[clamp(3.5rem,8vw,6rem)] font-semibold leading-none tracking-tight text-[#faf9f4]">
                    {extras.metric.value}
                  </p>
                  <div className="md:max-w-md">
                    <p className="text-sm leading-relaxed text-[#d8d5cc]">{extras.metric.label}</p>
                    <p className="label mt-4 text-[#a8a8a8]">
                      {extras.metric.kind === "measured" ? "Measured" : "Structural, not a benchmark"}
                    </p>
                  </div>
                </div>
              </StoryItem>
              {extras.screenshot ? (
                <StoryItem from="up" delay={0.06}>
                  <figure className="overflow-hidden rounded-3xl border border-line bg-raised">
                    <Image
                      src={extras.screenshot.src}
                      alt={extras.screenshot.alt}
                      width={1440}
                      height={900}
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className="h-auto w-full"
                    />
                    <figcaption className="label border-t border-line px-5 py-3">{extras.screenshot.caption}</figcaption>
                  </figure>
                </StoryItem>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ════════════ PROBLEM / APPROACH / OUTCOME ════════════ */}
        <section className="px-5 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
            {beats.map((b, i) => (
              <StoryItem key={b.n} from="up" delay={i * 0.05}>
                <div className="border-t border-fg pt-5">
                  <p className="label">
                    {b.n} - {b.label}
                  </p>
                  <p className="mt-4 leading-relaxed text-fg-dim">{b.body}</p>
                </div>
              </StoryItem>
            ))}
          </div>
        </section>

        {extras ? (
          <>
            {/* ════════════ ARCHITECTURE ════════════ */}
            <section className="px-5 py-12 sm:px-6 sm:py-16">
              <div className="mx-auto w-full max-w-5xl">
                <StoryItem from="up">
                  <ArchitectureDiagram title={extras.diagram.title} layers={extras.diagram.layers} />
                </StoryItem>
              </div>
            </section>

            {/* ════════════ TRADE-OFF + NEXT TIME ════════════ */}
            <section className="px-5 py-12 sm:px-6 sm:py-16">
              <div className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-2">
                <StoryItem from="up" className="h-full">
                  <div className="h-full rounded-3xl border border-line bg-raised p-8">
                    <p className="label">The hard trade-off</p>
                    <h2 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight">
                      {extras.tradeoff.choice}
                    </h2>
                    <dl className="mt-6 space-y-4 text-sm leading-relaxed">
                      <div>
                        <dt className="label text-ember-button">What it bought</dt>
                        <dd className="mt-1 text-fg-dim">{extras.tradeoff.gained}</dd>
                      </div>
                      <div>
                        <dt className="label text-ember-button">What it cost</dt>
                        <dd className="mt-1 text-fg-dim">{extras.tradeoff.cost}</dd>
                      </div>
                    </dl>
                  </div>
                </StoryItem>
                <StoryItem from="up" delay={0.06} className="h-full">
                  <div className="h-full rounded-3xl border border-line bg-raised p-8">
                    <p className="label">What I would change next time</p>
                    <ul className="mt-5 space-y-4 text-sm leading-relaxed text-fg-dim">
                      {extras.nextTime.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-0.5 text-ember-button">
                            →
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {extras.related ? (
                      <p className="label mt-6 border-t border-line pt-4">
                        <Link href={extras.related.href} className="text-ember-button transition-colors hover:text-ember-hover">
                          Related: {extras.related.label} →
                        </Link>
                      </p>
                    ) : null}
                  </div>
                </StoryItem>
              </div>
            </section>
          </>
        ) : null}

        {/* ════════════ LINKS ════════════ */}
        <section className="relative flex flex-col items-center justify-center px-5 py-24 text-center sm:px-6">
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
                className="inline-flex min-h-[44px] items-center text-fg-muted transition-colors duration-200 hover:text-fg"
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
