import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/db";
import { PreOrdersClient } from "./PreOrdersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-orders — SBD Global Shopping",
  description: "Pre-order international products and have them shipped to Bangladesh.",
};

export type ShipmentSummary = {
  id: string;
  number: number;
  route: string;
  cutoffDate: string;
  landingDate: string;
};

export default async function PreOrdersPage() {
  const supabase = await createClient();

  const [productsRes, variantsRes, shipmentsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("status", "pre-order")
      .order("eta", { ascending: true }),
    supabase.from("product_variants").select("*"),
    supabase
      .from("shipments")
      .select("id, number, route, cutoff_date, landing_date")
      .eq("status", "accepting")
      .order("cutoff_date", { ascending: true })
      .limit(3),
  ]);

  const variantRows = variantsRes.data ?? [];
  const products = (productsRes.data ?? []).map((r) =>
    mapProduct(r, variantRows.filter((v) => v.product_id === r.id))
  );

  const shipments: ShipmentSummary[] = (shipmentsRes.data ?? []).map((s) => ({
    id: s.id,
    number: s.number,
    route: s.route,
    cutoffDate: s.cutoff_date,
    landingDate: s.landing_date,
  }));

  return <PreOrdersClient products={products} shipments={shipments} />;
}
