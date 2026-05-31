import type { Metadata } from "next";
import { profile } from "@/lib/data/profile";

export const siteUrl = "https://nivakaran.dev";

const description = profile.mission;

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Nivakaran",
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Data Engineer",
    "Full Stack Developer",
    "RAG",
    "Sri Lanka",
    "SLIIT",
    "Next.js",
    "Python",
    "PyTorch",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.title}`,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

/* ------------------------------------------------------------------ */
/*  Structured data — JSON-LD helpers                                  */
/*  Each returns a plain object; pages embed them in a                 */
/*  <script type="application/ld+json"> tag.                           */
/* ------------------------------------------------------------------ */

const personObject = () => ({
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.mission,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  image: `${siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Sri Lanka Institute of Information Technology (SLIIT)",
  },
  worksFor: [
    { "@type": "Organization", name: "Healplace" },
    { "@type": "Organization", name: "HealthRecon Connect LLC" },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Software Engineering",
    "Data Engineering",
    "Retrieval-Augmented Generation",
  ],
  sameAs: profile.socials
    .filter((s) => s.label !== "Email")
    .map((s) => s.href),
});

export function personJsonLd() {
  return { "@context": "https://schema.org", ...personObject() };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: siteUrl,
    description: profile.mission,
    inLanguage: "en",
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.url}`,
    })),
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${profile.name} — About`,
    url: `${siteUrl}/about`,
    inLanguage: "en",
    mainEntity: personObject(),
  };
}

export interface BlogPostingSeed {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
}

export function blogPostingJsonLd(post: BlogPostingSeed) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    keywords: post.tags?.join(", "),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    publisher: { "@type": "Person", name: profile.name, url: siteUrl },
  };
}

export interface ProjectSeed {
  slug: string;
  name: string;
  valueProp: string;
  description: string;
  stack: string[];
  repo: string;
  live?: string;
}

export function projectJsonLd(project: ProjectSeed) {
  const url = `${siteUrl}/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    headline: `${project.name} — ${project.valueProp}`,
    description: project.description,
    url,
    codeRepository: project.repo,
    programmingLanguage: project.stack.join(", "),
    image: `${url}/opengraph-image`,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    creator: { "@type": "Person", name: profile.name, url: siteUrl },
    inLanguage: "en",
    ...(project.live ? { sameAs: project.live } : {}),
  };
}
