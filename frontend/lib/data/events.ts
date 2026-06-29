export interface CommunityEvent {
  /** Event name. */
  title: string;
  /** Your role, e.g. "Finalist", "Participant". */
  role: string;
  /** Short date, e.g. "Dec 2024". */
  date: string;
  /** City / location. */
  location: string;
  /** One- or two-line description of the event and your part in it. */
  detail: string;
  /** Teammates, where it was a team event. */
  team?: string[];
}

/**
 * Events & community — conferences attended and hackathons/competitions
 * participated in. Distinct from `achievements.ts` (which records ranked
 * competition *placements*); this captures presence and participation in
 * the wider tech community. Rendered on /about ("Events & community").
 * Ordered most recent first.
 */
export const events: CommunityEvent[] = [
  {
    title: "SLIITXtreme 4.0",
    role: "Finalist",
    date: "Oct 2025",
    location: "Colombo, Sri Lanka",
    detail:
      "24-hour hackathon — climbed to 6th on the live leaderboard in a race where the top five teams finished on identical scores.",
    team: ["Duwaragie Kugaraj", "Zayan Mohamed"],
  },
  {
    title: "iCIIT Conclave",
    role: "Participant",
    date: "Jun 2025",
    location: "Colombo, Sri Lanka",
    detail:
      "A day of talks on AI, digital transformation, interpretable AI, and AI in precision medicine across Sri Lanka's tech landscape.",
  },
  {
    title: "CodeFest Algothon",
    role: "Finalist",
    date: "Jan 2025",
    location: "Colombo, Sri Lanka",
    detail:
      "Ranked 11th of nearly 170 teams across an algorithm-knowledge quiz and a complex logistics shortest-path challenge.",
    team: ["Hariswara Sidambaram", "Imadh Ifham"],
  },
  {
    title: "Google DevFest 2024",
    role: "Participant",
    date: "Dec 2024",
    location: "Colombo, Sri Lanka",
    detail:
      "GDG Sri Lanka's flagship event — sessions on LLMs, multimodal search with Gemini Vision and RAG, responsible AI, and high-performance Flutter web with WASM.",
  },
];
