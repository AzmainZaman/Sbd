export type BlogTag =
  | "buyer-guide"
  | "pre-order-playbook"
  | "behind-the-scenes"
  | "traveler-stories"
  | "authenticity";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown or HTML
  tag: BlogTag;
  author: string;
  authorRole?: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  /** CSS gradient string — Phase 1 placeholder */
  heroGradient: string;
  heroImage?: string; // real image URL in Phase 2+
};
