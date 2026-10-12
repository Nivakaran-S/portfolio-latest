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
 * ponytail: MOCK entries for layout - replace with the real papers before
 * sharing the site; /research stays noindexed until then.
 */
export const research: ResearchProject[] = [
  {
    slug: "agentic-denial-triage",
    title: "Agentic triage of insurance claim denials in US revenue-cycle management",
    status: "In preparation",
    year: "2026",
    area: "Healthcare AI",
    abstract:
      "A multi-agent LLM pipeline that reads a denied claim, classifies the denial reason, gathers the supporting documentation, and drafts an appeal for human review. Evaluated against a held-out set of de-identified denials on routing accuracy and reviewer edit distance.",
    contribution:
      "Shows where agents can take the repetitive work out of denial management - and where a human still has to sign off.",
    stack: ["Python", "LangGraph", "LangChain", "FastAPI"],
  },
  {
    slug: "ward-early-warning",
    title: "Continuous early-warning scoring from low-cost wearable vitals",
    status: "In preparation",
    year: "2026",
    area: "Medical Signal Processing",
    abstract:
      "Compares on-device signal-quality gating and lightweight models for turning noisy wearable heart-rate and SpO2 streams into a continuous early-warning score for general-ward patients, measured against public benchmark datasets.",
    contribution:
      "Brings ICU-style continuous monitoring a step closer to wards that only get spot checks every few hours.",
    stack: ["Python", "PyTorch", "C++", "ESP32"],
  },
  {
    slug: "zero-cost-rag-eval",
    title: "How far can retrieval-augmented generation go without paid APIs?",
    status: "In preparation",
    year: "2026",
    area: "Natural Language Processing",
    abstract:
      "Benchmarks fully local embedding and generation stacks against API-based baselines on grounded question answering over private documents, reporting answer faithfulness, citation accuracy, and cost per thousand queries.",
    contribution:
      "A practical answer to when a self-hosted RAG stack is good enough - and when it is not.",
    stack: ["Python", "Hugging Face", "LangChain", "FAISS"],
  },
];
