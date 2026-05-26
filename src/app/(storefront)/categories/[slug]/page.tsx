"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilters, type FilterState } from "@/components/category/CategoryFilters";
import { FilterDrawer } from "@/components/category/FilterDrawer";
import { ActiveFilterChips } from "@/components/category/ActiveFilterChips";
import { SortSelect, type SortOption } from "@/components/category/SortSelect";
import { FlagBadge } from "@/components/ui/FlagBadge";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { CountryCode } from "@/types/product";

type PageProps = {
  params: { slug: string };
};

export default function CategoryPage({ params }: PageProps) {
  // All hooks must come before any conditional returns
  const [filters, setFilters] = useState<FilterState>({
    countries: [],
    status: [],
    priceMax: null,
  });
  const [sort, setSort] = useState<SortOption>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = categories.find((c) => c.slug === params.slug);

  const filtered = useMemo(() => {
    if (!category) return [];
    let list = products.filter((p) => p.category === params.slug || params.slug === "all");

    if (filters.countries.length > 0) {
      list = list.filter((p) => filters.countries.includes(p.originCountry));
    }
    if (filters.status.length > 0) {
      list = list.filter((p) => filters.status.includes(p.status));
    }
    if (filters.priceMax !== null) {
      list = list.filter((p) => p.priceBDT <= filters.priceMax!);
    }

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.priceBDT - b.priceBDT;
      if (sort === "price-desc") return b.priceBDT - a.priceBDT;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filters, sort, params.slug, category]);

  if (!category) return notFound();

  const activeFilterCount = filters.countries.length + filters.status.length + (filters.priceMax !== null ? 1 : 0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb — desktop only */}
      <nav className="hidden lg:flex items-center gap-2 text-[13px] text-muted mb-6">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <span className="text-ink">{category.label}</span>
      </nav>

      {/* Category hero */}
      <div
        className="relative w-full h-[160px] lg:h-[200px] rounded-2xl overflow-hidden mb-8 flex items-end p-6"
        style={{ background: category.heroGradient }}
      >
        <div>
          <h1 className="text-[28px] lg:text-[36px] font-semibold text-ink">{category.label}</h1>
          <p className="text-[14px] text-muted">{category.productCount} products</p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <CategoryFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4h18M7 12h10M11 20h2" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold text-paper bg-accent">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <span className="text-[13px] text-muted">{filtered.length} products</span>
            </div>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          {/* Active filters */}
          <div className="mb-4">
            <ActiveFilterChips filters={filters} onChange={setFilters} />
          </div>

          {/* Country flag strip */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
            {(["US", "UK", "EU", "CN", "AU", "AE"] as CountryCode[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  const next = filters.countries.includes(c)
                    ? filters.countries.filter((x) => x !== c)
                    : [...filters.countries, c];
                  setFilters({ ...filters, countries: next });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium flex-shrink-0 transition-colors ${
                  filters.countries.includes(c)
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink border-line hover:border-ink"
                }`}
              >
                <FlagBadge country={c} size={14} />
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[16px] text-muted">No products match your filters.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => setFilters({ countries: [], status: [], priceMax: null })}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </div>
  );
}
