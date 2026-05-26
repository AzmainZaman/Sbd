import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories — SBD Global Shopping",
};

const labels = {
  heading: "Shop by category",
  subtitle: "Browse our full range of internationally sourced products.",
  products: "products",
  noProducts: "Coming soon",
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("category").eq("is_active", true),
  ]);

  const categories = categoriesRes.data ?? [];
  const products = productsRes.data ?? [];

  const countBySlug = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-[28px] lg:text-[36px] font-semibold text-ink mb-2">
        {labels.heading}
      </h1>
      <p className="text-[15px] text-muted mb-8">{labels.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const count = countBySlug[cat.slug] ?? 0;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] flex items-end p-5"
              style={{ background: cat.hero_gradient }}
            >
              <div>
                <p className="text-[17px] font-semibold text-ink leading-snug">
                  {cat.label}
                </p>
                <p className="text-[12px] text-muted mt-0.5">
                  {count > 0
                    ? `${count} ${labels.products}`
                    : labels.noProducts}
                </p>
              </div>
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors rounded-2xl" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
