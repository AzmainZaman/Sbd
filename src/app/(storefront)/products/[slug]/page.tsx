import { notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { mapProduct, mapShipment } from "@/lib/db";
import { ProductClient } from "./ProductClient";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("slug").eq("is_active", true);
  return (data ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, brand, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Product — SBD Global Shopping" };
  return {
    title: `${data.name} by ${data.brand} — SBD Global Shopping`,
    description: data.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const [productRes, variantsRes] = await Promise.all([
    supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).single(),
    supabase.from("product_variants").select("*"),
  ]);

  if (!productRes.data) notFound();

  const productRow = productRes.data;
  const variantRows = (variantsRes.data ?? []).filter(
    (v) => v.product_id === productRow.id
  );
  const product = mapProduct(productRow, variantRows);

  // Fetch shipment + related in parallel
  const [shipmentRes, relatedRes] = await Promise.all([
    product.shipmentId
      ? supabase
          .from("shipments")
          .select("*, shipment_milestones(*), shipment_breakdowns(*)")
          .eq("id", product.shipmentId)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("category", productRow.category)
      .eq("is_active", true)
      .neq("id", productRow.id)
      .limit(4),
  ]);

  const shipment =
    shipmentRes.data
      ? mapShipment(
          shipmentRes.data,
          shipmentRes.data.shipment_milestones ?? [],
          shipmentRes.data.shipment_breakdowns ?? []
        )
      : null;

  const related = (relatedRes.data ?? []).map((r) =>
    mapProduct(r, r.product_variants ?? [])
  );

  return <ProductClient product={product} shipment={shipment} related={related} />;
}
