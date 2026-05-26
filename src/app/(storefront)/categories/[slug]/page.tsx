import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapProduct, mapCategory } from "@/lib/db";
import { CategoryClient } from "./CategoryClient";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [categoryRes, productsRes, variantsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", slug).single(),
    supabase
      .from("products")
      .select("*")
      .eq("category", slug)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase.from("product_variants").select("*"),
  ]);

  if (!categoryRes.data) notFound();

  const variantRows = variantsRes.data ?? [];
  const productRows = productsRes.data ?? [];

  const products = productRows.map((r) =>
    mapProduct(
      r,
      variantRows.filter((v) => v.product_id === r.id)
    )
  );

  const category = mapCategory(categoryRes.data, products.length);

  return <CategoryClient category={category} products={products} />;
}
