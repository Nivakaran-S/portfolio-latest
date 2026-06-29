export interface Capability {
  /** Capability name. */
  title: string;
  /** One-line value statement. */
  detail: string;
  /** "core" leads the section; "support" is framed as secondary skills. */
  tier: "core" | "support";
}

/**
 * What I can help with. Ordered AI/ML + data first so the headline stays
 * "AI & Software Engineer"; UI/UX and mobile are surfaced as *supporting*
 * capabilities, never as the lead. Rendered on /about ("What I can do").
 */
export const capabilities: Capability[] = [
  {
    title: "AI & Machine Learning",
    detail: "Intelligent systems that learn and adapt - from models to apps.",
    tier: "core",
  },
  {
    title: "Data Analytics & Engineering",
    detail: "Turning raw data into pipelines, insight, and decisions.",
    tier: "core",
  },
  {
    title: "Custom Software",
    detail: "Tailored, end-to-end solutions built to actually ship.",
    tier: "core",
  },
  {
    title: "Web Development",
    detail: "Fast, responsive, and scalable web applications.",
    tier: "support",
  },
  {
    title: "Mobile Apps",
    detail: "Native & cross-platform applications.",
    tier: "support",
  },
  {
    title: "UI/UX Design",
    detail: "Intuitive interfaces that delight users.",
    tier: "support",
  },
];
