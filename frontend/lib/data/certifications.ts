export type CertCategory = "AI / ML" | "Data" | "Software" | "Design";

export interface Certification {
  /** Stable id — also the image filename under /public/certifications. */
  slug: string;
  /** Short, on-brand name (used by the homepage cards). */
  label: string;
  /** Full course title (used as image alt + in the lightbox). */
  title: string;
  /** One-line description (used by the homepage cards). */
  detail: string;
  /** Issuing platform. */
  issuer: string;
  /** Completion date, short form e.g. "Jul 2025". */
  date: string;
  /** Certificate image path under /public. */
  image: string;
  /** Grouping for the About gallery + sharp homepage subset. */
  category: CertCategory;
  /** Public credential URL, when available. */
  credentialUrl?: string;
}

/**
 * Training & certifications (all Udemy). Ordered AI/ML → Data → Software →
 * Design so the strongest, on-brand credentials lead. Rendered in full on
 * /about; the homepage shows the on-brand `featuredCertifications` subset.
 */
export const certifications: Certification[] = [
  // ── AI / ML ──────────────────────────────────────────────────────────
  {
    slug: "agentic-ai",
    label: "Agentic AI",
    title: "Complete Agentic AI Bootcamp with LangGraph and LangChain",
    detail: "LangChain / LangGraph orchestration",
    issuer: "Udemy",
    date: "Jun 2025",
    image: "/certifications/agentic-ai.jpg",
    category: "AI / ML",
  },
  {
    slug: "generative-ai",
    label: "Generative AI",
    title: "Complete Generative AI Course with LangChain and HuggingFace",
    detail: "LLM application development",
    issuer: "Udemy",
    date: "Dec 2024",
    image: "/certifications/generative-ai.jpg",
    category: "AI / ML",
  },
  {
    slug: "data-science",
    label: "Data Science & ML",
    title: "Complete Data Science, Machine Learning, DL, NLP Bootcamp",
    detail: "Analysis, statistics & visualization",
    issuer: "Udemy",
    date: "May 2025",
    image: "/certifications/data-science.jpg",
    category: "AI / ML",
  },
  {
    slug: "computer-vision",
    label: "Computer Vision",
    title: "Complete Computer Vision Bootcamp with PyTorch & TensorFlow",
    detail: "CNNs & image classification",
    issuer: "Udemy",
    date: "Apr 2025",
    image: "/certifications/computer-vision.jpg",
    category: "AI / ML",
  },
  {
    slug: "machine-learning",
    label: "Machine Learning",
    title: "Complete AI & Machine Learning, Data Science Bootcamp",
    detail: "Supervised & unsupervised modelling",
    issuer: "Udemy",
    date: "Feb 2024",
    image: "/certifications/machine-learning.jpg",
    category: "AI / ML",
  },
  {
    slug: "tensorflow",
    label: "TensorFlow",
    title: "TensorFlow for Deep Learning Bootcamp",
    detail: "Deep learning in production",
    issuer: "Udemy",
    date: "Jul 2024",
    image: "/certifications/tensorflow.jpg",
    category: "AI / ML",
  },
  // ── Data ─────────────────────────────────────────────────────────────
  {
    slug: "big-data-engineering",
    label: "Big Data Engineering",
    title: "Big Data Engineering Bootcamp with GCP and Azure Cloud",
    detail: "Hadoop · Spark · Kafka · GCP & Azure",
    issuer: "Udemy",
    date: "Jul 2025",
    image: "/certifications/big-data-engineering.jpg",
    category: "Data",
  },
  // ── Software ─────────────────────────────────────────────────────────
  {
    slug: "dsa",
    label: "Data Structures & Algorithms",
    title: "The Complete Data Structures and Algorithms Course in Python",
    detail: "Problem-solving & complexity in Python",
    issuer: "Udemy",
    date: "Jan 2025",
    image: "/certifications/dsa.jpg",
    category: "Software",
  },
  {
    slug: "nodejs",
    label: "Node.js Development",
    title: "Complete NodeJS Developer (GraphQL, MongoDB & more)",
    detail: "GraphQL · MongoDB · REST APIs",
    issuer: "Udemy",
    date: "Mar 2025",
    image: "/certifications/nodejs.jpg",
    category: "Software",
  },
  {
    slug: "web-development",
    label: "Web Development",
    title: "The Complete Web Developer in 2023: Zero to Mastery",
    detail: "Full-stack, zero to mastery",
    issuer: "Udemy",
    date: "Nov 2023",
    image: "/certifications/web-development.jpg",
    category: "Software",
  },
  {
    slug: "react-native",
    label: "React Native",
    title: "React Native — The Practical Guide [2024]",
    detail: "Cross-platform mobile apps",
    issuer: "Udemy",
    date: "Jun 2024",
    image: "/certifications/react-native.jpg",
    category: "Software",
  },
  {
    slug: "ethical-hacking",
    label: "Python & Ethical Hacking",
    title: "Learn Python & Ethical Hacking from Scratch",
    detail: "Security fundamentals in Python",
    issuer: "Udemy",
    date: "Apr 2024",
    image: "/certifications/ethical-hacking.jpg",
    category: "Software",
  },
  // ── Design ───────────────────────────────────────────────────────────
  {
    slug: "ui-ux-design",
    label: "UI/UX Design",
    title: "Complete Web & Mobile Designer in 2023: UI/UX with Figma",
    detail: "Figma · interface & product design",
    issuer: "Udemy",
    date: "Dec 2023",
    image: "/certifications/ui-ux-design.jpg",
    category: "Design",
  },
];

/** Ordered list of categories present, for grouped rendering. */
export const certCategories: CertCategory[] = [
  "AI / ML",
  "Data",
  "Software",
  "Design",
];

/**
 * On-brand subset for the homepage — AI/ML + Data only — so the landing
 * page keeps the sharp "AI & Software Engineer" positioning. The full set
 * (incl. Software & Design) lives on /about.
 */
export const featuredCertifications: Certification[] = certifications.filter(
  (c) => c.category === "AI / ML" || c.category === "Data"
);
