import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { getMainProjects } from "@/lib/data/projects";
import { StackGrid } from "@/app/_components/sections/stack-grid";
import { featuredCertifications } from "@/lib/data/certifications";
import { getAllPosts, formatPostDate } from "@/lib/data/blog";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { DepthItem } from "@/app/_components/story/depth-item";
import { WorkRail } from "@/app/_components/story/work-rail";
import { Hero } from "@/app/_components/hero/hero";
import { MaskReveal } from "@/app/_components/ui/mask-reveal";
import { CountUp } from "@/app/_components/ui/count-up";

const mains = getMainProjects();

const domainBlurbs: Record<string, string> = {
  "AI / ML": "RAG systems, model training, and inference that actually ships.",
  "Software Engineering": "Full-stack products, end to end, built to last.",
  "Data Engineering": "Pipelines that turn raw data into something useful.",
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
    <section id={id} className="section-rule px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto w-full max-w-[1320px]">
        <DepthItem from="up">
          <p className="label">{eyebrow}</p>
        </DepthItem>
        <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] [text-wrap:balance]">
          <MaskReveal lines={lines} />
        </h2>
        {sub ? (
          <DepthItem from="up" delay={0.1}>
            <p className="mt-6 max-w-xl text-fg-muted sm:text-lg">{sub}</p>
          </DepthItem>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const latest = getAllPosts()[0];

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
            {profile.domains.map((d, i) => (
              <DepthItem key={d} from="up" delay={i * 0.06} className="h-full">
                <article
                  className={`flex h-full min-h-[18rem] flex-col justify-between rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                    i === 1 ? "feature-dark border-transparent" : "border-line bg-raised hover:border-fg"
                  }`}
                >
                  <span
                    className={`font-mono text-sm ${i === 1 ? "text-ember" : "text-ember-button"}`}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{d}</h3>
                    <p
                      className={`mt-3 text-sm leading-relaxed ${i === 1 ? "text-[#d8d5cc]" : "text-fg-muted"}`}
                    >
                      {domainBlurbs[d] ?? ""}
                    </p>
                  </div>
                </article>
              </DepthItem>
            ))}
          </div>
        </Band>

        {/* PRINCIPLES */}
        <Band eyebrow="Principles" lines={["Three rules I don't break."]}>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <DepthItem key={p.k} from="up" delay={i * 0.06} className="h-full">
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
        <Band id="skills" eyebrow="The stack" lines={["A connected stack, not a buzzword list."]}>
          <StackGrid />
        </Band>

        {/* THE WORK */}
        <WorkRail projects={mains} />

        {/* BY THE NUMBERS */}
        <Band eyebrow="By the numbers" lines={["A habit of shipping, kept on the record."]}>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
            {profile.stats.map((s, i) => (
              <DepthItem key={s.label} from="up" delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col justify-between gap-8 bg-raised p-7 sm:p-8">
                  <dd className="font-display text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-none tracking-tight text-fg">
                    <CountUp value={String(s.value)} />
                  </dd>
                  <dt className="label">{s.label}</dt>
                </div>
              </DepthItem>
            ))}
          </dl>
        </Band>

        {/* ALWAYS TRAINING */}
        <Band id="certifications" eyebrow="Always sharpening" lines={["The learning never stops."]}>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCertifications.map((cert, i) => (
              <DepthItem key={cert.label} from="up" delay={Math.min(0.3, i * 0.04)} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-raised p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fg">
                  <h3 className="font-display text-base font-semibold text-fg">{cert.label}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{cert.detail}</p>
                </div>
              </DepthItem>
            ))}
          </div>
        </Band>

        {/* THE WRITING */}
        {latest ? (
          <Band id="writing" eyebrow="Thinking out loud" lines={["Latest from the blog."]}>
            <DepthItem from="up" delay={0.06}>
              <Link
                href={`/blog/${latest.slug}`}
                className="group feature-dark mt-12 block rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 md:p-12"
              >
                <p className="label flex items-center gap-2 text-[#a8a8a8]">
                  <time dateTime={latest.date}>{formatPostDate(latest.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{latest.readingTime}</span>
                </p>
                <h3 className="mt-5 font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-[#faf9f4]">
                  {latest.title}
                </h3>
                <p className="mt-4 max-w-2xl text-[#d8d5cc]">{latest.excerpt}</p>
                <span className="label mt-8 inline-flex items-center gap-2 text-ember transition-transform duration-200 group-hover:translate-x-1">
                  Read post →
                </span>
              </Link>
            </DepthItem>
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
            <DepthItem from="up">
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
            <DepthItem from="up" delay={0.12}>
              <p className="mt-6 max-w-xl text-fg-dim sm:text-lg">
                Open to roles and collaborations in AI/ML, software, and data engineering.
              </p>
            </DepthItem>
            <DepthItem from="up" delay={0.18}>
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
