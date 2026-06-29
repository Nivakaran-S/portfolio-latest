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
    title: "SLIITXtreme 4.0",
    result: "Finalist · 6th",
    year: "2025",
    org: "IEEE Computer Society, SLIIT",
    detail:
      "24-hour hackathon - 6th on the live leaderboard, top five teams tied on score.",
  },
  {
    title: "CodeFest Algothon",
    result: "Finalist · 11th/170",
    year: "2025",
    org: "Faculty of Computing, SLIIT",
    detail:
      "National algorithmic contest - 11th of ~170 teams across a quiz and a logistics shortest-path round.",
  },
  {
    title: "CodeSprint 11",
    result: "Competing now",
    year: "2026",
    org: "IEEE Student Branch, IIT",
    detail: "Inter-university startup battle - in progress.",
  },
];
