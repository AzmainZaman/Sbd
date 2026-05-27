import { createClient } from "@/lib/supabase/server";
import { mapProduct, mapCategory } from "@/lib/db";
import { ShopClient } from "./ShopClient";
import type { FilterState } from "@/components/category/CategoryFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — SBD Global Shopping",
  description: "Browse authentic international brands delivered to Bangladesh.",
};

type PageProps = {
  searchParams: Promise<{ cat?: string; type?: string; source?: string; max?: string }>;
};

function parseFilters(sp: {
  type?: string;
  source?: string;
  max?: string;
}): FilterState {
  return {
    status: sp.type ? sp.type.split(",").filter(Boolean) : [],
    countries: sp.source ? sp.source.split(",").filter(Boolean) : [],
    priceMax: sp.max ? parseInt(sp.max, 10) : null,
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const selectedCategory = sp.cat ?? "all";
  const filters = parseFilters(sp);

  const supabase = await createClient();

  let productQuery = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .in("status", ["in-stock", "pre-order"])
    .order("created_at", { ascending: false });

  if (selectedCategory !== "all") {
    productQuery = productQuery.eq("category", selectedCategory);
  }
  if (filters.status.length === 1) {
    productQuery = productQuery.eq("status", filters.status[0]);
  } else if (filters.status.length > 1) {
    productQuery = productQuery.in("status", filters.status);
  }
  if (filters.countries.length === 1) {
    productQuery = productQuery.eq("origin_country", filters.countries[0]);
  } else if (filters.countries.length > 1) {
    productQuery = productQuery.in("origin_country", filters.countries);
  }
  if (filters.priceMax !== null && !isNaN(filters.priceMax)) {
    productQuery = productQuery.lte("price_bdt", filters.priceMax);
  }

  const [productsRes, variantsRes, categoriesRes] = await Promise.all([
    productQuery,
    supabase.from("product_variants").select("*"),
    supabase.from("categories").select("*").order("label", { ascending: true }),
  ]);

  const variantRows = variantsRes.data ?? [];
  const products = (productsRes.data ?? []).map((r) =>
    mapProduct(r, variantRows.filter((v) => v.product_id === r.id))
  );
  const categories = (categoriesRes.data ?? []).map((c) => mapCategory(c, 0));

  return (
    <ShopClient
      products={products}
      categories={categories}
      selectedCategory={selectedCategory}
      initialFilters={filters}
    />
  );
}
