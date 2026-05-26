"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth-guard";
import { mapProduct } from "@/lib/db";
import type { Product } from "@/types/product";
import type { Database } from "@/types/database";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  originCountry: string;
  sourceUrl?: string;
  sourceRetailer?: string;
  priceBDT: number;
  priceUSD?: number;
  description: string;
  ingredients?: string;
  status: "in-stock" | "pre-order" | "out-of-stock";
  stock?: number;
  shipmentId?: string;
  eta?: string;
  hero: string;
  tags?: string[];
  isActive?: boolean;
};

export async function getAllProducts(): Promise<Product[]> {
  await assertAdmin();
  const supabase = await createClient();

  const [productsRes, variantsRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
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

export async function createProduct(input: ProductInput): Promise<string> {
  await assertAdmin();
  const supabase = await createClient();

  const id = input.id ?? `sbd-prd-${Date.now()}`;

  const { data, error } = await supabase
    .from("products")
    .insert({
      id,
      slug: input.slug,
      name: input.name,
      brand: input.brand,
      category: input.category,
      origin_country: input.originCountry,
      source_url: input.sourceUrl ?? null,
      source_retailer: input.sourceRetailer ?? null,
      price_bdt: input.priceBDT,
      price_usd: input.priceUSD ?? null,
      description: input.description,
      ingredients: input.ingredients ?? null,
      status: input.status,
      stock: input.stock ?? null,
      shipment_id: input.shipmentId ?? null,
      eta: input.eta ?? null,
      hero: input.hero,
      images: [],
      tags: input.tags ?? [],
      is_active: input.isActive ?? true,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/catalog");
  return data.id;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const patch: ProductUpdate = {
    ...(input.slug !== undefined && { slug: input.slug }),
    ...(input.name !== undefined && { name: input.name }),
    ...(input.brand !== undefined && { brand: input.brand }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.originCountry !== undefined && { origin_country: input.originCountry }),
    ...(input.sourceUrl !== undefined && { source_url: input.sourceUrl }),
    ...(input.sourceRetailer !== undefined && { source_retailer: input.sourceRetailer }),
    ...(input.priceBDT !== undefined && { price_bdt: input.priceBDT }),
    ...(input.priceUSD !== undefined && { price_usd: input.priceUSD }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.ingredients !== undefined && { ingredients: input.ingredients }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.stock !== undefined && { stock: input.stock }),
    ...(input.shipmentId !== undefined && { shipment_id: input.shipmentId }),
    ...(input.eta !== undefined && { eta: input.eta }),
    ...(input.hero !== undefined && { hero: input.hero }),
    ...(input.tags !== undefined && { tags: input.tags }),
    ...(input.isActive !== undefined && { is_active: input.isActive }),
  };

  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/catalog");
  revalidatePath(`/products/${input.slug ?? id}`);
}

export async function deleteProduct(id: string): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/admin/catalog");
}

export async function uploadProductImage(
  productId: string,
  formData: FormData
): Promise<string> {
  await assertAdmin();
  const supabase = createServiceClient();

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Append URL to product.images[]
  const regularClient = await createClient();
  const { data: product } = await regularClient
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  const images = [...(product?.images ?? []), publicUrl];

  const { error: updateError } = await regularClient
    .from("products")
    .update({ images })
    .eq("id", productId);

  if (updateError) throw updateError;

  revalidatePath("/admin/catalog");
  revalidatePath(`/products`);
  return publicUrl;
}
