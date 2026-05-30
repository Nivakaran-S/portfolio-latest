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

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.mission,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Colombo",
      addressCountry: "LK",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sri Lanka Institute of Information Technology (SLIIT)",
    },
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
  };
}
