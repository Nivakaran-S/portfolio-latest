export interface ExperienceEntry {
  org: string;
  role: string;
  period: string;
  kind: "work" | "education";
  summary: string;
}

export const experience: ExperienceEntry[] = [
  {
    org: "Healplace",
    role: "Junior Developer",
    period: "Mar 2026 - Present",
    kind: "work",
    summary:
      "Building and shipping features for Healplace's healthcare platform, front to back.",
  },
  {
    org: "HealthRecon Connect LLC",
    role: "Operations Analyst - Associate, Collections",
    period: "Jan 2026 - Present",
    kind: "work",
    summary:
      "Turning collections and operations data into decisions for a US healthcare revenue-cycle provider.",
  },
  {
    org: "Medsource Healthcare LLC",
    role: "Remote Medical Scribe",
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
    role: "B.Sc (Hons) IT - Software Engineering",
    period: "2021 - 2025",
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
];

/** Work history only - rendered as its own timeline. */
export const workExperience: ExperienceEntry[] = experience.filter(
  (e) => e.kind === "work"
);

/** Education only - rendered as its own timeline. */
export const education: ExperienceEntry[] = experience.filter(
  (e) => e.kind === "education"
);
