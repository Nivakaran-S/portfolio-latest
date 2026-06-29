export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  name: string;
  shortName: string;
  title: string;
  domains: string[];
  tagline: string;
  creed: string;
  mission: string;
  about: string[];
  location: string;
  email: string;
  /** Path to the downloadable CV/résumé in /public. */
  resumeUrl: string;
  education: {
    institution: string;
    degree: string;
    specialization: string;
    period: string;
  };
  socials: SocialLink[];
  stats: { value: string; label: string }[];
}

export const profile: Profile = {
  name: "Nivakaran S.",
  shortName: "Nivakaran",
  title: "AI & Software Engineer",
  domains: ["AI / ML", "Software Engineering", "Data Engineering"],
  tagline: "I build intelligent, data-driven systems - end to end.",
  creed: "Forged under pressure. Engineered with discipline.",
  mission:
    "Building intelligent, data-driven systems end to end - from data pipelines and ML models to the products people use.",
  about: [
    "I'm Nivakaran - an AI and software engineer who builds data-driven systems end to end, from data pipelines and ML models to the product people actually click. I work across AI/ML, software engineering, and data engineering.",
    "Along the way I've worked across healthcare - as a medical scribe for US cardiologists, then in revenue-cycle operations, and now building for a healthcare platform. That taught me precision and calm under load, habits I bring to systems that have to work.",
  ],
  location: "Colombo, Sri Lanka",
  email: "nivakaran@hotmail.com",
  resumeUrl: "/Nivakaran-S-CV.pdf",
  education: {
    institution: "SLIIT - Sri Lanka Institute of Information Technology",
    degree: "B.Sc (Hons) Information Technology",
    specialization: "Software Engineering",
    period: "2021 - 2025",
  },
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Nivakaran-S",
      handle: "Nivakaran-S",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nivakaran",
      handle: "in/nivakaran",
    },
    {
      label: "Email",
      href: "mailto:nivakaran@hotmail.com",
      handle: "nivakaran@hotmail.com",
    },
  ],
  stats: [
    { value: "72", label: "Repositories" },
    { value: "6", label: "Competitions" },
    { value: "15+", label: "Tech stacks" },
    { value: "Colombo, LK", label: "Based in" },
  ],
};
