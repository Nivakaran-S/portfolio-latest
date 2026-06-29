import { skills, skillCategories } from "@/lib/data/skills";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Parallax } from "@/app/_components/ui/parallax";

const categoryStyles: Record<string, string> = {
  "Software Engineering":
    "border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10",
  "Data Science":
    "border-neon-cyan-core/30 text-neon-cyan-core hover:bg-neon-cyan-core/10",
  "Computer Vision":
    "border-neon-violet/40 text-neon-violet hover:bg-neon-violet/10",
  "Data Engineering":
    "border-white/15 text-fg-dim hover:bg-white/5",
  "Data Analysis":
    "border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10",
};

export function Skills() {
  return (
    <SectionShell
      id="skills"
      index="03"
      kicker="Stack"
      title="A connected stack, not a buzzword list."
    >
      <Parallax distance={26} className="bento tile-sheen p-7 sm:p-9">
        <p className="mb-8 max-w-xl text-fg-dim">
          Everything I work with relates to everything else - models need
          pipelines, pipelines need products.
        </p>

        <div className="mb-7 flex flex-wrap gap-5">
          {skillCategories.map((c) => (
            <span
              key={c.id}
              className="label flex items-center gap-2"
            >
              <span
                className="h-2 w-2 rounded-full ring-1 ring-white/10"
                style={{ background: c.color }}
              />
              {c.id}
            </span>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2.5">
          {skills.map((skill, i) => (
            <Reveal as="li" key={skill.name} delay={i * 25}>
              <span
                className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                  categoryStyles[skill.category]
                } ${skill.weight === 3 ? "font-semibold" : ""}`}
              >
                {skill.name}
              </span>
            </Reveal>
          ))}
        </ul>
      </Parallax>
    </SectionShell>
  );
}
