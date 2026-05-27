import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/db";
import { Hero } from "@/components/storefront/Hero";
import { CountryStrip } from "@/components/storefront/CountryStrip";
import { ShipmentBanner } from "@/components/storefront/ShipmentBanner";
import { ProductRow } from "@/components/storefront/ProductRow";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { QuoteCTA } from "@/components/storefront/QuoteCTA";
import { TravelerCTA } from "@/components/storefront/TravelerCTA";
import { Testimonials } from "@/components/storefront/Testimonials";
import { Newsletter } from "@/components/storefront/Newsletter";

export default async function HomePage() {
  const supabase = await createClient();

  const [productsRes, variantsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .in("status", ["in-stock", "pre-order"])
      .order("created_at", { ascending: false }),
    supabase.from("product_variants").select("*"),
  ]);

  const rows = productsRes.data ?? [];
  const variantRows = variantsRes.data ?? [];

  const products = rows.map((r) =>
    mapProduct(
      r,
      variantRows.filter((v) => v.product_id === r.id)
    )
  );

  const inStock = products.filter((p) => p.status === "in-stock");
  const preOrder = products.filter((p) => p.status === "pre-order");

  return (
    <>
      <Hero />
      <CountryStrip />
      <ShipmentBanner />
      <ProductRow
        title="Available now"
        subtitle="In-stock products — order today, ships with the next batch"
        products={inStock}
        viewAllHref="/shop?type=in-stock"
        viewAllLabel="View all"
      />
      <ProductRow
        title="Pre-order · Arriving June 2026"
        subtitle="Join Shipment #14 — cutoff 2 June"
        products={preOrder}
        viewAllHref="/pre-orders"
        viewAllLabel="View all pre-orders"
      />
      <QuoteCTA />
      <HowItWorks />
      <TravelerCTA />
      <Testimonials />
      <Newsletter />
    </>
  );
}
