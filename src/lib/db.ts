import type { Database } from "@/types/database";
import type { Product, ProductVariant, ProductCategory, CountryCode } from "@/types/product";
import type { Shipment, ShipmentStatus } from "@/types/shipment";
import type { Category } from "@/types/category";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];
type DbVariant = Database["public"]["Tables"]["product_variants"]["Row"];
type DbShipment = Database["public"]["Tables"]["shipments"]["Row"];
type DbMilestone = Database["public"]["Tables"]["shipment_milestones"]["Row"];
type DbBreakdown = Database["public"]["Tables"]["shipment_breakdowns"]["Row"];
type DbCategory = Database["public"]["Tables"]["categories"]["Row"];

export function mapProduct(row: DbProduct, variants: DbVariant[] = []): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category as ProductCategory,
    originCountry: row.origin_country as CountryCode,
    sourceUrl: row.source_url ?? undefined,
    sourceRetailer: row.source_retailer ?? undefined,
    priceBDT: row.price_bdt,
    priceUSD: row.price_usd ?? undefined,
    images: row.images ?? [],
    variants: variants.map(mapVariant),
    description: row.description,
    ingredients: row.ingredients ?? undefined,
    status: row.status as Product["status"],
    stock: row.stock ?? undefined,
    shipmentId: row.shipment_id ?? undefined,
    eta: row.eta ?? undefined,
    hero: row.hero,
    rating: row.rating,
    reviewCount: row.review_count,
    tags: row.tags ?? [],
    isActive: row.is_active,
  };
}

function mapVariant(row: DbVariant): ProductVariant {
  return {
    id: row.id,
    name: row.name,
    priceDelta: row.price_delta ?? undefined,
    available: row.available,
  };
}

export function mapShipment(
  row: DbShipment,
  milestones: DbMilestone[] = [],
  breakdowns: DbBreakdown[] = []
): Shipment {
  return {
    id: row.id,
    number: row.number,
    route: row.route,
    originCountry: row.origin_country as CountryCode,
    cutoffDate: row.cutoff_date,
    liftoffDate: row.liftoff_date,
    landingDate: row.landing_date,
    status: row.status as ShipmentStatus,
    itemCount: row.item_count,
    totalValueBDT: row.total_value_bdt,
    customerNote: row.customer_note ?? undefined,
    milestones: [...milestones]
      .sort((a, b) => a.position - b.position)
      .map((m) => ({
        label: m.label,
        completedAt: m.completed_at ?? undefined,
      })),
    breakdown: breakdowns.map((b) => ({
      category: b.category,
      itemCount: b.item_count,
      valueBDT: b.value_bdt,
    })),
  };
}

export function mapCategory(row: DbCategory, productCount = 0): Category {
  return {
    slug: row.slug as ProductCategory,
    label: row.label,
    productCount,
    heroGradient: row.hero_gradient,
  };
}
