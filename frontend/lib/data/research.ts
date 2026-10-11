export type ResearchStatus = "In preparation" | "Submitted" | "Under review" | "Published";

export interface ResearchProject {
  slug: string;
  title: string;
  status: ResearchStatus;
  /** Target or submitted venue - leave unset until it's safe to name. */
  venue?: string;
  /** Year the work was completed. */
  year: string;
  /** Research area, e.g. "Medical Imaging". */
  area: string;
  /** Short public abstract - check the venue's preprint policy first. */
  abstract: string;
  /** Plain-language "why it matters" line. */
  contribution: string;
  stack: string[];
  coAuthors?: string[];
  /** Paper / preprint link, only once public. */
  link?: string;
}

/**
 * Completed research awaiting publication. Status labels must stay honest:
 * never "Published" until the paper is actually out.
 *
 * PLACEHOLDERS - replace titles, abstracts and stacks with the real papers.
 */
export const research: ResearchProject[] = [
  {
    slug: "research-1",
    title: "Research Project One - working title",
    status: "In preparation",
    year: "2026",
    area: "Machine Learning",
    abstract:
      "Placeholder abstract. Two or three sentences on the problem, the method, and the headline result - kept at a level the venue's preprint policy allows.",
    contribution:
      "Placeholder: the one-line takeaway a non-specialist should leave with.",
    stack: ["Python", "PyTorch"],
  },
  {
    slug: "research-2",
    title: "Research Project Two - working title",
    status: "In preparation",
    year: "2026",
    area: "Natural Language Processing",
    abstract:
      "Placeholder abstract. Two or three sentences on the problem, the method, and the headline result - kept at a level the venue's preprint policy allows.",
    contribution:
      "Placeholder: the one-line takeaway a non-specialist should leave with.",
    stack: ["Python", "Hugging Face"],
  },
];
