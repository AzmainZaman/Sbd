import type { Category } from "@/types/category";
export type { Category };

export const categories: Category[] = [
  {
    slug: "beauty",
    label: "Beauty & Skincare",
    productCount: 124,
    heroGradient: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e8bdd8 100%)",
  },
  {
    slug: "electronics",
    label: "Electronics",
    productCount: 86,
    heroGradient: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #c5cae9 100%)",
  },
  {
    slug: "fashion",
    label: "Fashion & Apparel",
    productCount: 98,
    heroGradient: "linear-gradient(135deg, #faf0e6 0%, #f5e6d3 50%, #ede0d4 100%)",
  },
  {
    slug: "supplements",
    label: "Health & Supplements",
    productCount: 52,
    heroGradient: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #b2dfdb 100%)",
  },
  {
    slug: "home",
    label: "Home & Living",
    productCount: 43,
    heroGradient: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe0b2 100%)",
  },
  {
    slug: "kids",
    label: "Kids & Baby",
    productCount: 37,
    heroGradient: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #bbdefb 100%)",
  },
];
