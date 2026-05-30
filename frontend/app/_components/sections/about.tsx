import { profile } from "@/lib/data/profile";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Parallax } from "@/app/_components/ui/parallax";

export function About() {
  return (
    <SectionShell
      id="about"
      index="02"
      kicker="About"
      title="Signal from noise."
    >
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Parallax distance={28} className="space-y-6">
          {profile.about.map((para, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className="text-lg leading-relaxed text-fg-dim sm:text-xl">
                {para}
              </p>
            </Reveal>
          ))}
        </Parallax>

        <Parallax distance={55}>
        <Reveal delay={200}>
          <dl className="bento grid grid-cols-2 gap-px overflow-hidden bg-line">
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-raised/60 p-5 transition-colors duration-300 hover:bg-elevated"
              >
                <dt className="label mb-2 text-fg-muted">{stat.label}</dt>
                <dd className="silver font-display text-3xl font-semibold">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
        </Parallax>
      </div>
    </SectionShell>
  );
}
