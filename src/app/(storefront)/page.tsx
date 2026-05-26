import { Hero } from "@/components/storefront/Hero";
import { CountryStrip } from "@/components/storefront/CountryStrip";
import { ShipmentBanner } from "@/components/storefront/ShipmentBanner";
import { ProductRow } from "@/components/storefront/ProductRow";
import { HowItWorks } from "@/components/storefront/HowItWorks";
import { TravelerCTA } from "@/components/storefront/TravelerCTA";
import { Testimonials } from "@/components/storefront/Testimonials";
import { Newsletter } from "@/components/storefront/Newsletter";
import { products } from "@/data/products";

const inStock = products.filter((p) => p.status === "in-stock");
const preOrder = products.filter((p) => p.status === "pre-order");

export default function HomePage() {
  return (
    <>
      <Hero />
      <CountryStrip />
      <ShipmentBanner />
      <ProductRow
        title="Available now"
        subtitle="In-stock products — order today, ships with the next batch"
        products={inStock}
        viewAllHref="/categories/beauty"
        viewAllLabel="View all"
      />
      <ProductRow
        title="Pre-order · Arriving June 2026"
        subtitle="Join Shipment #14 — cutoff 2 June"
        products={preOrder}
        viewAllHref="/categories/beauty"
        viewAllLabel="View all pre-orders"
      />
      <HowItWorks />
      <TravelerCTA />
      <Testimonials />
      <Newsletter />
    </>
  );
}
