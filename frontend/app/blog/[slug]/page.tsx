import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import { getAllPosts, getPost, formatPostDate } from "@/lib/data/blog";
import { profile } from "@/lib/data/profile";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
    },
  };
}

/**
 * Tailwind-styled MDX element map — no separate prose stylesheet needed.
 * Inline-code is amber-tinted; fenced code is a zinc card; blockquote
 * gets the accent border.
 */
const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      className="silver mt-12 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className="silver mt-12 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className="mt-8 font-display text-xl font-semibold leading-tight tracking-tight text-fg"
    />
  ),
  p: (props) => (
    <p
      {...props}
      className="mt-5 leading-relaxed text-fg-dim sm:text-lg"
    />
  ),
  a: ({ href, ...props }) => (
    <a
      {...props}
      href={href}
      className="text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 transition-colors hover:text-neon-cyan-core hover:decoration-neon-cyan-core"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
  ul: (props) => (
    <ul
      {...props}
      className="mt-5 list-disc space-y-2 pl-6 text-fg-dim marker:text-fg-muted sm:text-lg"
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="mt-5 list-decimal space-y-2 pl-6 text-fg-dim marker:text-fg-muted sm:text-lg"
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-neon-cyan/50 pl-5 italic text-fg-dim"
    />
  ),
  code: (props) => (
    <code
      {...props}
      className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-neon-cyan-core"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="mt-6 overflow-x-auto rounded-2xl border border-line bg-base p-5 font-mono text-sm leading-relaxed text-fg-dim ring-1 ring-white/5"
    />
  ),
  hr: () => <hr className="my-10 border-line/60" />,
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt ?? ""}
      className="mt-6 h-auto max-w-full rounded-2xl border border-line"
    />
  ),
  strong: (props) => (
    <strong {...props} className="font-semibold text-fg" />
  ),
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const postJsonLd = blogPostingJsonLd({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
  });
  const crumbsJsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsJsonLd) }}
      />

      {/* Post backdrop: ruled-paper notebook with a soft wash — "the notebook". */}
      <StoryBackdrop variant="ink" />

      <header className="fixed inset-x-0 top-0 z-50 glass py-4">
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-6">
          <Link
            href="/blog"
            className="label text-fg-muted transition-colors hover:text-neon-cyan"
          >
            ← Back to blog
          </Link>
          <Link
            href="/"
            className="font-display text-base font-bold tracking-tight text-fg"
          >
            nivakaran<span className="text-neon-cyan">.dev</span>
          </Link>
        </nav>
      </header>

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ TITLE BEAT ════════════ */}
        <section className="relative flex min-h-[72svh] flex-col justify-end px-5 pb-12 pt-32 sm:px-6 sm:pt-36">
          <div className="mx-auto w-full max-w-3xl">
            <StoryItem from="fade">
              <p className="label">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{" "}
                {post.readingTime}
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h1 className="silver mt-5 font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,6vw,4rem)] [text-wrap:balance]">
                {post.title}
              </h1>
            </StoryItem>
            {post.tags.length > 0 ? (
              <StoryItem from="up" delay={0.12}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <li
                      key={t}
                      className="label rounded-full border border-line bg-raised/50 px-3 py-1 text-fg-muted"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </StoryItem>
            ) : null}
          </div>
        </section>

        {/* ════════════ READING BODY (calm — no scroll-jack) ════════════ */}
        <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-6">
          <article className="rounded-3xl border border-line bg-raised/70 p-6 backdrop-blur-sm sm:p-10">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>

          <footer className="mt-12 border-t border-line/60 pt-8">
            <Link
              href="/blog"
              className="label text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              ← All posts
            </Link>
          </footer>
        </div>
      </main>

      <Footer />
    </>
  );
}
