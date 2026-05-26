import { notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { mapProduct, mapCategory } from "@/lib/db";
import { CategoryClient } from "./CategoryClient";
import type { FilterState } from "@/components/category/CategoryFilters";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("categories").select("slug");
  return (data ?? []).map((row) => ({ slug: row.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string; source?: string; max?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("label")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Category — SBD Global Shopping" };
  return { title: `${data.label} — SBD Global Shopping` };
}

function parseFilters(sp: { type?: string; source?: string; max?: string }): FilterState {
  return {
    status: sp.type ? sp.type.split(",").filter(Boolean) : [],
    countries: sp.source ? sp.source.split(",").filter(Boolean) : [],
    priceMax: sp.max ? parseInt(sp.max, 10) : null,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const filters = parseFilters(sp);

  const supabase = await createClient();

  const [categoryRes, variantsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", slug).single(),
    supabase.from("product_variants").select("*"),
  ]);

  if (!categoryRes.data) notFound();

  let query = supabase
    .from("products")
    .select("*")
    .eq("category", slug)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters.status.length === 1) {
    query = query.eq("status", filters.status[0]);
  } else if (filters.status.length > 1) {
    query = query.in("status", filters.status);
  }
  if (filters.countries.length === 1) {
    query = query.eq("origin_country", filters.countries[0]);
  } else if (filters.countries.length > 1) {
    query = query.in("origin_country", filters.countries);
  }
  if (filters.priceMax !== null && !isNaN(filters.priceMax)) {
    query = query.lte("price_bdt", filters.priceMax);
  }

  const productsRes = await query;

  const variantRows = variantsRes.data ?? [];
  const productRows = productsRes.data ?? [];

  const products = productRows.map((r) =>
    mapProduct(r, variantRows.filter((v) => v.product_id === r.id))
  );

  const category = mapCategory(categoryRes.data, products.length);

  return <CategoryClient category={category} products={products} initialFilters={filters} />;
}
