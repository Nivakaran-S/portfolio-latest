import { experience } from "@/lib/data/experience";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Parallax } from "@/app/_components/ui/parallax";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      index="05"
      kicker="Path"
      title="Where the rigor came from."
    >
      <Parallax distance={26} className="bento tile-sheen p-7 sm:p-9">
      <ol className="relative space-y-12 border-l border-line pl-8">
        {experience.map((entry, i) => (
          <Reveal as="li" key={entry.org} delay={i * 120}>
            <span
              className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-neon-cyan ring-4 ring-void"
              aria-hidden="true"
            />
            <p className="label text-fg-muted">
              {entry.period} · {entry.kind === "education" ? "Education" : "Work"}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-fg">
              {entry.role}
            </h3>
            <p className="text-sm font-medium text-neon-cyan/90">
              {entry.org}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
              {entry.summary}
            </p>
          </Reveal>
        ))}
      </ol>
      </Parallax>
    </SectionShell>
  );
}
