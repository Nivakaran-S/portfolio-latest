export interface ExperienceEntry {
  org: string;
  role: string;
  period: string;
  kind: "work" | "education";
  summary: string;
}

export const experience: ExperienceEntry[] = [
  {
    org: "Healplace LLC",
    role: "Associate Software Engineer",
    period: "Sep 2026 - Present",
    kind: "work",
    summary:
      "Promoted from Junior Full Stack Developer. Owning features end to end on Healplace's healthcare platform.",
  },
  {
    org: "Healplace LLC",
    role: "Junior Full Stack Developer",
    period: "Mar 2026 - Aug 2026",
    kind: "work",
    summary:
      "Built and shipped features for Healplace's healthcare platform, front to back.",
  },
  {
    org: "HealthRecon Connect LLC",
    role: "Operations Analyst - Associate, Collections",
    period: "Jan 2026 - July 2026",
    kind: "work",
    summary:
      "Turning collections and operations data into decisions for a US healthcare revenue-cycle provider.",
  },
  {
    org: "Medsource Healthcare LLC",
    role: "Medical Scribe",
    period: "Jul 2022 - Dec 2024",
    kind: "work",
    summary:
      "Documented clinical encounters for US cardiologists in real time - accuracy, speed, and zero tolerance for error. It rewired how I think about reliable systems.",
  },
  {
    org: "Startek · Commercial Bank PLC",
    role: "Customer Service Executive",
    period: "Feb 2022 - Jun 2022",
    kind: "work",
    summary:
      "High-volume customer support. Learned to stay calm and precise when everything is on fire - useful in production.",
  },
  {
    org: "SLIIT",
    role: "B.Sc (Hons) in Information Technology - Specialization in Software Engineering",
    period: "2023 - 2027 (expected)",
    kind: "education",
    summary:
      "Foundations in algorithms, systems, and the engineering discipline to actually ship.",
  },
  {
    org: "St. Benedict's College",
    role: "G.C.E. Advanced Level - Biological Science stream",
    period: "2021 (2022)",
    kind: "education",
    summary:
      "A science foundation in the Bio stream before the pivot into software and AI.",
  },
  {
    org: "IDM Nations Campus",
    role: "Diploma in Graphic Designing",
    period: "2015",
    kind: "education",
    summary:
      "Completed with Distinction - a foundation in visual design, typography, and composition.",
  },
];

/** Work history only - rendered as its own timeline. */
export const workExperience: ExperienceEntry[] = experience.filter(
  (e) => e.kind === "work"
);

/** Education only - rendered as its own timeline. */
export const education: ExperienceEntry[] = experience.filter(
  (e) => e.kind === "education"
);
