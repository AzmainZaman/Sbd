import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories — SBD Global Shopping",
};

const labels = {
  heading: "Shop by category",
  subtitle: "Browse our full range of internationally sourced products.",
  products: "products",
  comingSoon: "Coming soon",
  shopNow: "Shop →",
};

// Curated Unsplash hero images per category slug
const CATEGORY_IMAGES: Record<string, { src: string; position: string }> = {
  beauty:      { src: "https://images.unsplash.com/photo-1748543668676-ea8241cb3886?w=900&h=600&fit=crop&q=85", position: "center 40%" },
  electronics: { src: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=600&fit=crop&q=85",    position: "center 50%" },
  fashion:     { src: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=900&h=600&fit=crop&q=85", position: "center center" },
  supplements: { src: "https://images.unsplash.com/photo-1707129785947-ddc627a8bab9?w=900&h=600&fit=crop&q=85", position: "center center" },
  home:        { src: "https://images.unsplash.com/photo-1618221639244-c1a8502c0eb9?w=900&h=600&fit=crop&q=85", position: "center 40%" },
  kids:        { src: "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=900&h=600&fit=crop&q=85",    position: "center 60%" },
};

// Short taglines to add character without real product imagery
const TAGLINES: Record<string, string> = {
  beauty:      "Skincare, makeup & more",
  electronics: "Tech from leading brands",
  fashion:     "Apparel & accessories",
  supplements: "Health & wellness",
  home:        "Furniture & decor",
  kids:        "Toys, clothes & essentials",
};

const CATEGORY_ORDER = ["beauty", "electronics", "fashion", "supplements", "home", "kids"];

export default async function CategoriesPage() {
  const supabase = await createClient();

  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("category").eq("is_active", true),
  ]);

  const allCategories = categoriesRes.data ?? [];
  const products = productsRes.data ?? [];

  const countBySlug = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  // Sort by defined display order; unknown slugs go at the end
  const categories = [
    ...CATEGORY_ORDER
      .map((slug) => allCategories.find((c) => c.slug === slug))
      .filter(Boolean),
    ...allCategories.filter((c) => !CATEGORY_ORDER.includes(c.slug)),
  ] as typeof allCategories;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-[32px] lg:text-[44px] font-semibold text-ink tracking-tight leading-tight">
            {labels.heading}
          </h1>
          <p className="mt-2 text-[16px] text-muted">{labels.subtitle}</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-5">
          {categories.map((cat) => {
            const count = countBySlug[cat.slug] ?? 0;
            const isComingSoon = count === 0;
            const tagline = TAGLINES[cat.slug] ?? "";
            const img = CATEGORY_IMAGES[cat.slug];

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/2] flex flex-col justify-end transition-transform duration-300 ease-out hover:scale-[1.03] hover:z-10"
                style={{ background: cat.hero_gradient }}
              >
                {/* Hero image */}
                {img && (
                  <Image
                    src={img.src}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: img.position }}
                  />
                )}

                {/* Dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Hover brightener */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-300" />

                {/* "Shop →" pill — slides in on hover */}
                <div className="absolute top-4 right-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250">
                  <span className="text-[12px] font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full whitespace-nowrap">
                    {labels.shopNow}
                  </span>
                </div>

                {/* Text — bottom of card */}
                <div className="relative px-5 pb-5 pt-10">
                  {isComingSoon && (
                    <span className="inline-block mb-2 text-[10px] font-bold tracking-widest uppercase border border-white/30 text-white/60 px-2 py-0.5 rounded-full">
                      {labels.comingSoon}
                    </span>
                  )}
                  <p
                    className="font-semibold text-white text-[18px] sm:text-[20px] leading-snug"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                  >
                    {cat.label}
                  </p>
                  <p className="mt-1 text-[13px] text-white/65">
                    {count > 0
                      ? <span className="font-mono">{count} {labels.products}</span>
                      : tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
