import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { getMainProjects, getProject } from "@/lib/data/projects";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { DepthItem } from "@/app/_components/story/depth-item";
import { WorkRail } from "@/app/_components/story/work-rail";
import { Hero } from "@/app/_components/hero/hero";
import { MaskReveal } from "@/app/_components/ui/mask-reveal";
import { CountUp } from "@/app/_components/ui/count-up";

const mains = getMainProjects();

/** Each discipline, with the one project that proves it. */
const disciplines: Record<string, { blurb: string; proof: string }> = {
  "AI / ML": {
    blurb: "RAG systems, model training, and inference that actually ships.",
    proof: "freerag",
  },
  "Software Engineering": {
    blurb: "Full-stack products, end to end, built to last.",
    proof: "medsync",
  },
  "Data Engineering": {
    blurb: "Pipelines that turn raw data into something useful.",
    proof: "phishing-detection",
  },
};

/** Working principles: the "how". */
const principles: { k: string; title: string; body: string }[] = [
  {
    k: "End to end",
    title: "I own the whole loop.",
    body: "From the data pipeline to the button people click - no hand-offs, no gaps. One mind across the stack.",
  },
  {
    k: "Calm under load",
    title: "Precision when it counts.",
    body: "Remote medical scribing and high-volume support taught me to stay exact when the pressure is highest.",
  },
  {
    k: "Built to last",
    title: "Engineered, not hacked.",
    body: "Disciplined engineering over clever shortcuts. I'd rather ship something that holds than something that only demos.",
  },
];

/** A hairline-ruled section band with a mono eyebrow and a masked heading. */
function Band({
  id,
  eyebrow,
  lines,
  sub,
  children,
}: {
  id?: string;
  eyebrow: string;
  lines: ReactNode[];
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="section-rule px-5 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto w-full max-w-[1320px]">
        <DepthItem from="up" distance={20}>
          <p className="label">{eyebrow}</p>
        </DepthItem>
        <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]">
          <MaskReveal lines={lines} />
        </h2>
        {sub ? (
          <DepthItem from="up" distance={30} delay={0.1}>
            <p className="mt-6 max-w-xl text-fg-muted sm:text-lg">{sub}</p>
          </DepthItem>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const recent = getAllPosts().slice(0, 3);

  return (
    <>
      <Header />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        <Hero />

        {/* THE PROBLEM */}
        <Band
          eyebrow="Every build starts the same way"
          lines={[
            "It starts with",
            <Fragment key="l1">
              a <span className="script text-[1.15em]">problem</span> worth the work.
            </Fragment>,
          ]}
          sub="Not with a framework. Not with a buzzword. Then a system, built from the data to the product people click."
        />

        {/* THE DISCIPLINES */}
        <Band eyebrow="Three disciplines" lines={["Built where three fields meet."]}>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {profile.domains.map((d, i) => {
              const dark = i === 1;
              const proof = getProject(disciplines[d]?.proof ?? "");
              return (
                <DepthItem key={d} from="up" distance={90 + (i % 3) * 60} delay={i * 0.06} className="h-full">
                  <article
                    className={`flex h-full flex-col gap-6 rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                      dark ? "feature-dark border-transparent" : "border-line bg-raised hover:border-fg"
                    }`}
                  >
                    <span className={`font-mono text-sm ${dark ? "text-ember" : "text-ember-button"}`}>
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight">{d}</h3>
                      <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-[#d8d5cc]" : "text-fg-muted"}`}>
                        {disciplines[d]?.blurb}
                      </p>
                    </div>
                    {proof ? (
                      <Link
                        href={proof.tier === "main" ? `/work/${proof.slug}` : proof.repo}
                        className={`group mt-auto block border-t pt-5 ${dark ? "border-white/15" : "border-line"}`}
                      >
                        <p className={`label ${dark ? "text-[#a8a8a8]" : ""}`}>Best proof</p>
                        <p className="mt-2 font-display text-lg font-semibold tracking-tight">{proof.name}</p>
                        <p className={`mt-1 text-sm ${dark ? "text-[#d8d5cc]" : "text-fg-muted"}`}>{proof.valueProp}</p>
                        <span
                          className={`label mt-3 inline-flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1 ${
                            dark ? "text-ember" : "text-ember-button"
                          }`}
                        >
                          Case study →
                        </span>
                      </Link>
                    ) : null}
                  </article>
                </DepthItem>
              );
            })}
          </div>
        </Band>

        {/* PRINCIPLES */}
        <Band eyebrow="Principles" lines={["Three rules I don't break."]}>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <DepthItem key={p.k} from="up" distance={90 + (i % 3) * 60} delay={i * 0.06} className="h-full">
                <article className="flex h-full flex-col gap-6 bg-raised p-8 transition-colors duration-300 hover:bg-warm">
                  <span className="font-mono text-sm text-ember-button" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <p className="label">{p.k}</p>
                  <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-auto text-sm leading-relaxed text-fg-muted">{p.body}</p>
                </article>
              </DepthItem>
            ))}
          </div>
        </Band>

        {/* THE STACK */}
        <Band id="skills" eyebrow="The stack" lines={["Tools I'd defend,", "tied to what shipped."]}>
          <ul className="mt-14 divide-y divide-line border-y border-line">
            {mains.slice(0, 5).map((p, i) => (
              <DepthItem key={p.slug} from="up" distance={40} delay={Math.min(0.2, i * 0.04)}>
                <li className="grid gap-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center md:gap-10">
                  <Link
                    href={`/work/${p.slug}`}
                    className="font-display text-xl font-semibold tracking-tight transition-colors hover:text-ember-button"
                  >
                    {p.name}
                  </Link>
                  <ul className="flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <li key={t} className="rounded-full border border-line bg-raised px-3.5 py-1.5 text-sm text-fg-dim">
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              </DepthItem>
            ))}
          </ul>
          <p className="label mt-8">
            <Link href="/about#toolkit" className="text-fg-muted transition-colors hover:text-fg">
              Full toolkit →
            </Link>
          </p>
        </Band>

        {/* THE WORK */}
        <WorkRail projects={mains} />

        {/* BY THE NUMBERS */}
        <Band eyebrow="By the numbers" lines={["A habit of shipping, kept on the record."]}>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
            {profile.stats.map((s, i) => (
              <DepthItem key={s.label} from="up" distance={90 + (i % 3) * 60} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col justify-between gap-8 bg-raised p-7 sm:p-8">
                  <dd
                    className={`font-display font-semibold tracking-tight text-fg [text-wrap:balance] ${
                      String(s.value).length > 6
                        ? "text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.1]"
                        : "text-[clamp(2.5rem,6vw,4.25rem)] leading-none"
                    }`}
                  >
                    <CountUp value={String(s.value)} />
                  </dd>
                  <dt className="label">{s.label}</dt>
                </div>
              </DepthItem>
            ))}
          </dl>
        </Band>

        {/* THE WRITING */}
        {recent.length > 0 ? (
          <Band id="writing" eyebrow="Thinking out loud" lines={["Latest from the blog."]}>
            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {recent.map((post, i) => (
                <DepthItem key={post.slug} from="up" distance={60 + i * 30} delay={i * 0.06} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`group flex h-full flex-col rounded-3xl border p-7 transition-transform duration-300 hover:-translate-y-1 md:p-8 ${
                      i === 0 ? "feature-dark border-transparent" : "border-line bg-raised hover:border-fg"
                    }`}
                  >
                    <p className={`label flex items-center gap-2 ${i === 0 ? "text-[#a8a8a8]" : ""}`}>
                      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readingTime}</span>
                    </p>
                    <h3
                      className={`mt-5 font-display text-2xl font-semibold leading-tight tracking-tight ${
                        i === 0 ? "text-[#faf9f4]" : "text-fg"
                      }`}
                    >
                      {post.title}
                    </h3>
                    <p className={`mt-4 text-sm leading-relaxed ${i === 0 ? "text-[#d8d5cc]" : "text-fg-muted"}`}>
                      {post.excerpt}
                    </p>
                    <span
                      className={`label mt-auto inline-flex items-center gap-2 pt-8 transition-transform duration-200 group-hover:translate-x-1 ${
                        i === 0 ? "text-ember" : "text-ember-button"
                      }`}
                    >
                      Read post →
                    </span>
                  </Link>
                </DepthItem>
              ))}
            </div>
            <p className="label mt-8">
              <Link href="/blog" className="text-fg-muted transition-colors hover:text-fg">
                All writing →
              </Link>
            </p>
          </Band>
        ) : null}

        {/* THE INVITATION */}
        <section id="contact" className="section-rule px-5 py-24 sm:px-10 sm:py-36">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center text-center">
            <DepthItem from="up" distance={20}>
              <p className="label">The invitation</p>
            </DepthItem>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,8vw,6.5rem)] font-semibold leading-[1] tracking-[-0.04em]">
              <MaskReveal
                lines={[
                  "Now, let's",
                  <Fragment key="l2">
                    <span className="script text-[1.15em]">build</span> yours.
                  </Fragment>,
                ]}
              />
            </h2>
            <DepthItem from="up" distance={30} delay={0.12}>
              <p className="mt-6 max-w-xl text-fg-dim sm:text-lg">
                Open to roles and collaborations in AI/ML, software, and data engineering.
              </p>
            </DepthItem>
            <DepthItem from="up" distance={30} delay={0.18}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ember-button px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-ember-hover"
                >
                  {profile.email}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
                {profile.socials
                  .filter((s) => s.label !== "Email")
                  .map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-fg px-7 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:bg-fg hover:text-void"
                    >
                      {s.label} ↗
                    </a>
                  ))}
              </div>
            </DepthItem>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
