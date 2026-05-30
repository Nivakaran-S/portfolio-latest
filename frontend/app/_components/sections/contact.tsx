import { profile } from "@/lib/data/profile";
import { SectionShell } from "@/app/_components/ui/section-shell";
import { Reveal } from "@/app/_components/ui/reveal";
import { Parallax } from "@/app/_components/ui/parallax";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <SectionShell
      id="contact"
      index="07"
      kicker="Get in touch"
      title="Let's build something intelligent."
    >
      <div className="grid items-start gap-12 md:grid-cols-2">
        <Parallax distance={26}>
        <Reveal>
          <p className="mb-8 max-w-md text-lg leading-relaxed text-fg-dim">
            Open to roles and collaborations in AI/ML, full-stack, and data
            engineering. Send a message or reach me directly.
          </p>
          <ContactForm />
        </Reveal>
        </Parallax>

        <Parallax distance={50}>
        <Reveal delay={150}>
          <ul className="bento divide-y divide-line/60 overflow-hidden">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-5 py-4 transition-colors duration-300 hover:bg-elevated/70"
                >
                  <span className="label text-fg-muted">{s.label}</span>
                  <span className="text-sm text-fg-dim transition-colors group-hover:text-neon-cyan">
                    {s.handle} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        </Parallax>
      </div>
    </SectionShell>
  );
}
