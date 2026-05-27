"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryFilters, type FilterState } from "@/components/category/CategoryFilters";
import { FilterDrawer } from "@/components/category/FilterDrawer";
import { ActiveFilterChips } from "@/components/category/ActiveFilterChips";
import { SortSelect, type SortOption } from "@/components/category/SortSelect";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

type Props = {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  initialFilters: FilterState;
};

function buildQS(cat: string, filters: FilterState): string {
  const p = new URLSearchParams();
  if (cat !== "all") p.set("cat", cat);
  if (filters.status.length > 0) p.set("type", filters.status.join(","));
  if (filters.countries.length > 0) p.set("source", filters.countries.join(","));
  if (filters.priceMax !== null) p.set("max", String(filters.priceMax));
  return p.toString();
}

export function ShopClient({ products, categories, selectedCategory, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [sort, setSort] = useState<SortOption>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  function applyFilters(next: FilterState) {
    const qs = buildQS(selectedCategory, next);
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function selectCategory(cat: string) {
    const qs = buildQS(cat, initialFilters);
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === "price-asc") return a.priceBDT - b.priceBDT;
      if (sort === "price-desc") return b.priceBDT - a.priceBDT;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [sort, products]);

  const activeFilterCount =
    initialFilters.countries.length +
    initialFilters.status.length +
    (initialFilters.priceMax !== null ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || selectedCategory !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[28px] lg:text-[36px] font-semibold text-[var(--ink)]">Shop</h1>
        <p className="mt-1 text-[14px] text-[var(--muted)]">
          Authentic international brands, delivered to Bangladesh.
        </p>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => selectCategory("all")}
          className={cn(
            "px-4 py-1.5 rounded-full border text-[13px] font-medium shrink-0 transition-colors",
            selectedCategory === "all"
              ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
              : "bg-[var(--paper)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--ink)]"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => selectCategory(cat.slug)}
            className={cn(
              "px-4 py-1.5 rounded-full border text-[13px] font-medium shrink-0 transition-colors",
              selectedCategory === cat.slug
                ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]"
                : "bg-[var(--paper)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--ink)]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <div className="hidden lg:block shrink-0">
          <CategoryFilters filters={initialFilters} onChange={applyFilters} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
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
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold text-[var(--paper)] bg-[var(--accent)]">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <span className="text-[13px] text-[var(--muted)]">{sorted.length} products</span>
            </div>
            <SortSelect value={sort} onChange={setSort} />
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-4">
              <ActiveFilterChips filters={initialFilters} onChange={applyFilters} />
            </div>
          )}

          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[16px] text-[var(--muted)]">No products match your filters.</p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const qs = buildQS("all", { countries: [], status: [], priceMax: null });
                    router.replace(qs ? `${pathname}?${qs}` : pathname);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((p) => (
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
        filters={initialFilters}
        onChange={applyFilters}
      />
    </div>
  );
}
