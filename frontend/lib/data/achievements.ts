export interface Achievement {
  /** Competition / event name. */
  title: string;
  /** Placement or status, e.g. "2nd Runner-Up", "Top 10", "Semi-finalist". */
  result: string;
  /** Year (omitted where not applicable). */
  year?: string;
  /** Organizer. */
  org: string;
  /** One-line description of the contest. */
  detail: string;
}

/**
 * Competitions & awards. Ordered best-placement first so the strongest
 * results lead. Rendered on /about ("Proving ground").
 */
export const achievements: Achievement[] = [
  {
    title: "Model X",
    result: "2nd Runner-Up",
    year: "2025",
    org: "IEEE Computational Intelligence Society",
    detail: "Solo competitor in a machine-learning modelling challenge.",
  },
  {
    title: "SLIoT Challenge",
    result: "Semi-finalist",
    year: "2026",
    org: "University of Moratuwa",
    detail: "Sri Lanka's national IoT innovation challenge.",
  },
  {
    title: "SLIITXtreme",
    result: "Top 10",
    year: "2025",
    org: "IEEE Computer Society, SLIIT",
    detail: "Competitive programming — a lead-in to IEEEXtreme.",
  },
  {
    title: "CodeFest Algothon",
    result: "Top 10",
    year: "2025",
    org: "Faculty of Computing, SLIIT",
    detail: "National algorithmic-programming contest across two timed rounds.",
  },
  {
    title: "CodeSprint 11",
    result: "Competing now",
    year: "2026",
    org: "IEEE Student Branch, IIT",
    detail: "Inter-university startup battle — in progress.",
  },
];
