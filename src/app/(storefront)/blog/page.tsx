import { blogPosts } from "@/data/blog";
import { BlogIndexClient } from "./BlogIndexClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — SBD Global Shopping",
  description:
    "Buyer guides, pre-order playbooks, authenticity tips, and behind-the-scenes looks at how SBD works.",
};

export default function BlogPage() {
  return <BlogIndexClient posts={blogPosts} />;
}
