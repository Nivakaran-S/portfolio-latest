import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags: string[];
  readingTime: string; // "4 min read"
  /** Raw MDX body (frontmatter stripped). */
  content: string;
}

function wordsToReading(words: number): string {
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function readOne(file: string): BlogPost {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? "1970-01-01"),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: wordsToReading(wordCount),
    content,
  };
}

/** Reads every MDX file in content/blog and returns posts sorted newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map(readOne)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Quick helper for cards: "May 20, 2026" from ISO. */
export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
