import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — SBD Blog`,
    description: post.excerpt,
  };
}

const tagLabels: Record<string, string> = {
  "buyer-guide": "Buyer Guide",
  "pre-order-playbook": "Pre-order",
  "behind-the-scenes": "Behind the scenes",
  "traveler-stories": "Traveler stories",
  authenticity: "Authenticity",
};

const labels = {
  backLink: "← Back to Blog",
  minRead: "min read",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.id !== post.id && p.tag === post.tag)
    .slice(0, 2);

  const htmlContent = renderMarkdown(post.body);

  return (
    <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Back link */}
      <Link
        href="/blog"
        className="text-[13px] text-muted hover:text-ink transition-colors"
      >
        {labels.backLink}
      </Link>

      {/* Hero gradient */}
      <div
        className="mt-6 h-52 sm:h-72 rounded-2xl w-full"
        style={{ background: post.heroGradient }}
        aria-hidden="true"
      />

      {/* Tag + meta */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <span
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          {tagLabels[post.tag] ?? post.tag}
        </span>
        <span className="text-muted text-[12px]">·</span>
        <span className="font-mono text-[12px] text-muted">
          {formatDate(post.publishedAt, "short")}
        </span>
        <span className="text-muted text-[12px]">·</span>
        <span className="font-mono text-[12px] text-muted">
          {post.readMinutes} {labels.minRead}
        </span>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-[30px] sm:text-[40px] font-semibold text-ink leading-tight tracking-tight">
        {post.title}
      </h1>

      {/* Author */}
      <div className="mt-4 mb-8 pb-8 border-b border-line flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-paper shrink-0"
          style={{ backgroundColor: "var(--ink)" }}
          aria-hidden="true"
        >
          {post.author.charAt(0)}
        </div>
        <div>
          <p className="text-[13px] font-medium text-ink">{post.author}</p>
          {post.authorRole && (
            <p className="text-[11px] text-muted">{post.authorRole}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        className="prose-sbd"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-line">
          <h2 className="text-[16px] font-semibold text-ink mb-4">Related articles</h2>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="flex items-start gap-3 p-4 rounded-xl border border-line bg-paper hover:border-[var(--ink)] transition-colors group"
              >
                <div
                  className="w-14 h-14 rounded-lg shrink-0"
                  style={{ background: r.heroGradient }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink leading-snug group-hover:opacity-80 transition-opacity">
                    {r.title}
                  </p>
                  <p className="font-mono text-[11px] text-muted mt-0.5">
                    {formatDate(r.publishedAt, "short")} · {r.readMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
