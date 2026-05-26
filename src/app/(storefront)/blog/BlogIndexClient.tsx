"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost, BlogTag } from "@/types/blog";
import { formatDate } from "@/lib/utils";

const labels = {
  heading: "Blog",
  sub: "Guides, stories, and behind-the-scenes looks at how SBD works.",
  filterAll: "All",
  readMore: "Read article",
  minRead: "min read",
};

const tagLabels: Record<BlogTag | "all", string> = {
  all: "All",
  "buyer-guide": "Buyer Guide",
  "pre-order-playbook": "Pre-order",
  "behind-the-scenes": "Behind the scenes",
  "traveler-stories": "Traveler stories",
  authenticity: "Authenticity",
};

const allTags = Object.keys(tagLabels) as (BlogTag | "all")[];

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-paper overflow-hidden hover:border-[var(--ink)] transition-colors">
      {/* Hero gradient */}
      <div
        className="h-44 w-full shrink-0"
        style={{ background: post.heroGradient }}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-5">
        {/* Tag + read time */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            {tagLabels[post.tag]}
          </span>
          <span className="font-mono text-[11px] text-muted">
            {post.readMinutes} {labels.minRead}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[16px] font-semibold text-ink leading-snug mb-2 group-hover:opacity-80 transition-opacity">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-[13px] text-muted leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium text-ink">{post.author}</p>
            {post.authorRole && (
              <p className="text-[11px] text-muted">{post.authorRole}</p>
            )}
          </div>
          <span className="font-mono text-[11px] text-muted">
            {formatDate(post.publishedAt, "short")}
          </span>
        </div>
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="block px-5 pb-5"
        aria-label={`Read: ${post.title}`}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ color: "var(--accent)" }}
        >
          {labels.readMore}
          <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14} aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </Link>
    </article>
  );
}

export function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState<BlogTag | "all">("all");

  const filtered =
    activeTag === "all" ? posts : posts.filter((p) => p.tag === activeTag);

  // Sort newest first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[36px] sm:text-[48px] font-semibold text-ink tracking-tight">
          {labels.heading}
        </h1>
        <p className="mt-2 text-[15px] text-muted">{labels.sub}</p>
      </div>

      {/* Tag filters */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter by tag"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className="px-3.5 h-8 rounded-full text-[12px] font-medium border transition-colors cursor-pointer"
            style={{
              backgroundColor: activeTag === tag ? "var(--ink)" : "var(--paper)",
              borderColor: activeTag === tag ? "var(--ink)" : "var(--line)",
              color: activeTag === tag ? "var(--paper)" : "var(--muted)",
            }}
          >
            {tagLabels[tag]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-line rounded-2xl">
          <p className="text-[16px] font-medium text-ink">No posts in this category</p>
          <p className="mt-1 text-[14px] text-muted">Try selecting a different tag above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
