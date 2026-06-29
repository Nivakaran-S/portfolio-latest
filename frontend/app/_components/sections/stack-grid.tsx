import { skills, skillCategories } from "@/lib/data/skills";
import { StoryItem } from "@/app/_components/story/story-item";
import { TechLogo } from "@/app/_components/ui/tech-logo";

const categoryStyles: Record<string, string> = {
  "AI / ML & LLMs": "border-neon-cyan-core/30 text-neon-cyan-core",
  "Software Engineering": "border-neon-cyan/30 text-neon-cyan",
  "Data Engineering": "border-neon-violet/40 text-neon-violet",
  "DevOps / MLOps & Cloud": "border-neon-lime/30 text-neon-lime",
};

/**
 * The tech stack as four labelled, colour-coded groups of logo pills.
 * Each pill is a `group` so its muted logo tints to brand colour on hover.
 * Shared by the homepage ("The stack") and /about so the two never drift.
 */
export function StackGrid() {
  return (
    <div className="mt-10 space-y-9">
      {skillCategories.map((cat) => {
        const items = skills.filter((s) => s.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id}>
            <StoryItem from="left">
              <p className="label flex items-center gap-2 text-fg-muted">
                <span
                  className="h-2 w-2 rounded-full ring-1 ring-white/10"
                  style={{ background: cat.color }}
                />
                {cat.id}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.05} distance={50}>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <span
                    key={skill.name}
                    className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                      categoryStyles[skill.category]
                    } ${skill.weight === 3 ? "font-semibold" : ""}`}
                  >
                    {skill.icon && skill.iconColor ? (
                      <TechLogo icon={skill.icon} color={skill.iconColor} />
                    ) : null}
                    {skill.name}
                  </span>
                ))}
              </div>
            </StoryItem>
          </div>
        );
      })}
    </div>
  );
}
