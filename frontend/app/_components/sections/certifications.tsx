import { featuredCertifications } from "@/lib/data/certifications";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Parallax } from "@/app/_components/ui/parallax";

export function Certifications() {
  return (
    <SectionShell
      id="certifications"
      index="06"
      kicker="Training"
      title="Always training."
    >
      <p className="mb-10 max-w-xl text-fg-muted">
        Continuously certified across the AI stack.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCertifications.map((cert, i) => (
          <Parallax
            key={cert.label}
            distance={18 + (i % 4) * 12}
            className="h-full"
          >
            <Reveal delay={(i % 4) * 80} className="h-full">
              <div className="bento h-full p-5 hover:-translate-y-0.5 hover:border-neon-cyan/30 hover:bg-elevated">
                <h3 className="font-display text-base font-semibold text-fg">
                  {cert.label}
                </h3>
                <p className="mt-2 text-sm text-fg-muted">{cert.detail}</p>
              </div>
            </Reveal>
          </Parallax>
        ))}
      </div>
    </SectionShell>
  );
}
