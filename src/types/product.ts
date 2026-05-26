export type CountryCode = "US" | "UK" | "EU" | "CN" | "AU" | "AE" | "BD";

export type ProductCategory =
  | "electronics"
  | "beauty"
  | "fashion"
  | "supplements"
  | "home"
  | "kids"
  | "other";

export type ProductVariant = {
  id: string;
  name: string;
  priceDelta?: number; // BDT difference from base price
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  originCountry: CountryCode;
  sourceUrl?: string;
  sourceRetailer?: string;
  priceBDT: number;
  priceUSD?: number;
  /** CSS gradient string used as placeholder in Phase 1 */
  hero: string;
  images: string[];
  variants?: ProductVariant[];
  description: string;
  ingredients?: string;
  status: "in-stock" | "pre-order" | "out-of-stock";
  stock?: number;
  shipmentId?: string;
  eta?: string; // ISO date, pre-order only
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
};
