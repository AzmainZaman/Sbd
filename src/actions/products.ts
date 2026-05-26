"use server";

import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/db";
import type { Product } from "@/types/product";

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const q = query.trim().toLowerCase();

  const [productsRes, variantsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(
        `name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`
      )
      .order("rating", { ascending: false })
      .limit(20),
    supabase.from("product_variants").select("*"),
  ]);

  const rows = productsRes.data ?? [];
  const variantRows = variantsRes.data ?? [];

  return rows.map((r) =>
    mapProduct(
      r,
      variantRows.filter((v) => v.product_id === r.id)
    )
  );
}
