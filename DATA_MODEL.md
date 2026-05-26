# Data Model — SBD Global Shopping

Phase 1 uses typed mock data only. Phase 2 maps these entities to Supabase PostgreSQL tables (snake_case columns). This document is the canonical source of truth for both the TypeScript types in `src/types/` and the SQL schema in `supabase/migrations/`.

**DB notes:**
- `order_lines` and `tracking_steps` are normalized child tables (not JSON columns) — they map to `Order.lines[]` and `Order.trackingSteps[]` in the TypeScript type
- `product_variants` is a child table of `products`
- `shipment_milestones` and `shipment_breakdowns` are child tables of `shipments`
- `addresses` is a child table of `users`
- TypeScript types use camelCase; DB columns use snake_case; `src/types/database.ts` (Supabase-generated) bridges them

---

## Entities

### Product

```ts
type Product = {
  id: string;                     // e.g. "sbd-lan-001834"
  slug: string;                   // URL-safe
  name: string;
  brand: string;
  category: ProductCategory;
  originCountry: CountryCode;     // "US" | "UK" | "EU" | "CN" | "AU" | "AE"
  sourceUrl?: string;             // original retailer URL
  sourceRetailer?: string;        // e.g. "Sephora USA", "John Lewis UK"
  priceBDT: number;
  priceUSD?: number;
  images: string[];               // Supabase Storage public URLs (Phase 2C+); gradient strings in Phase 1 seed
  variants?: ProductVariant[];    // colors, sizes, flavors
  description: string;
  ingredients?: string;
  status: "in-stock" | "pre-order" | "out-of-stock";
  stock?: number;                 // null for pre-order
  shipmentId?: string;            // which shipment carries this pre-order
  eta?: string;                   // ISO date string, pre-order only
  hero: string;                   // CSS gradient fallback — displayed when images[] is empty
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
};

type ProductVariant = {
  id: string;
  name: string;                   // e.g. "Berry", "Vanilla"
  priceDelta?: number;            // BDT difference from base
  available: boolean;
};

type ProductCategory =
  | "electronics"
  | "beauty"
  | "fashion"
  | "supplements"
  | "home"
  | "kids"
  | "other";

type CountryCode = "US" | "UK" | "EU" | "CN" | "AU" | "AE" | "BD";
```

---

### Shipment

```ts
type Shipment = {
  id: string;                     // e.g. "14", "14-uk"
  number: number;                 // display number, e.g. 14
  route: string;                  // "USA → DAC" | "UK → DAC"
  originCountry: CountryCode;
  cutoffDate: string;             // ISO datetime
  liftoffDate: string;            // ISO date
  landingDate: string;            // ISO date (Dhaka arrival)
  status: ShipmentStatus;
  itemCount: number;
  totalValueBDT: number;
  customerNote?: string;          // admin-editable public note
  milestones: ShipmentMilestone[];
  breakdown?: ShipmentBreakdown[];
};

type ShipmentStatus =
  | "accepting"   // open for pre-orders
  | "cutoff"      // past cutoff, sourcing in progress
  | "outbound"    // left origin country
  | "in-transit"  // in the air
  | "customs"     // at Dhaka customs
  | "delivery"    // out for delivery
  | "delivered";  // completed

type ShipmentMilestone = {
  label: string;
  completedAt?: string;           // ISO datetime if done
};

type ShipmentBreakdown = {
  category: string;
  itemCount: number;
  valueBDT: number;
};
```

---

### Order

```ts
type Order = {
  id: string;                     // e.g. "SBD-2026-04812"
  customerId: string;
  placedAt: string;               // ISO datetime
  status: OrderStatus;
  type: "in-stock" | "pre-order" | "mixed";
  lines: OrderLine[];
  deliveryAddress: Address;
  deliveryMethod: "split" | "together";
  shippingBDT: number;
  dutyBDT: number;
  handlingBDT: number;
  localDeliveryBDT: number;
  subtotalBDT: number;
  totalBDT: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentReference?: string;      // manual reference (e.g. bKash transaction ID entered by admin)
  inStockEta?: string;            // ISO date, for in-stock portion
  preOrderEta?: string;           // ISO date, for pre-order portion
  shipmentId?: string;            // linked shipment for pre-order lines
  trackingSteps: TrackingStep[];
};

type OrderStatus =
  | "placed"
  | "sourcing"
  | "outbound"
  | "in-transit"
  | "customs"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

type OrderLine = {
  productId: string;
  productName: string;
  variant?: string;
  quantity: number;
  unitPriceBDT: number;
  totalBDT: number;
  type: "in-stock" | "pre-order";
  quoteId?: string;               // present if this line came from an accepted quote
};

type TrackingStep = {
  label: string;
  description: string;
  timestamp?: string;             // ISO datetime
  status: "done" | "current" | "pending";
};

type PaymentMethod = "bkash" | "nagad" | "card" | "cod";

// DB note: Order.lines maps to the `order_lines` table (child rows with order_id FK).
// Order.trackingSteps maps to the `tracking_steps` table (child rows with order_id FK).
// The TypeScript type keeps them embedded for convenient in-memory use after a joined query.
```

---

### Quote

```ts
type Quote = {
  id: string;                     // e.g. "QR-2026-08412"
  customerId: string;
  customerName: string;
  customerPhone?: string;              // optional until SMS OTP exists in Phase 3
  requestedAt: string;            // ISO datetime
  sourceUrl: string;
  sourceRetailer: string;
  originCountry: CountryCode;
  productName: string;
  productVariant?: string;
  quantity: number;
  notes?: string;
  preferredShipmentId?: string;
  budgetCeilingBDT?: number;
  status: QuoteStatus;
  expiresAt?: string;             // ISO datetime
  // Pricing (filled when quote is sent)
  itemPriceBDT?: number;
  dutyBDT?: number;
  inboundShippingBDT?: number;
  handlingBDT?: number;
  totalBDT?: number;
  shipmentId?: string;            // assigned shipment
  eta?: string;                   // ISO date
  adminNote?: string;             // note to customer from admin
  marginPct?: number;             // internal
};

type QuoteStatus =
  | "pending"           // submitted, awaiting admin quote
  | "quote-sent"        // admin has quoted, awaiting customer decision
  | "customer-replied"  // customer asked a question
  | "accepted"          // customer accepted → added to cart
  | "declined"          // customer declined
  | "expired";          // quote window closed without response
```

---

### User

```ts
type User = {
  id: string;                     // matches auth.users.id (UUID)
  name: string;
  email: string;                  // primary identifier in Phase 2 (email OTP auth)
  phone?: string;                 // added in Phase 3 when SMS OTP is introduced
  addresses: Address[];
  defaultAddressId?: string;
  memberTier: "standard" | "silver" | "gold";
  points: number;
  joinedAt: string;               // ISO date
  role: "customer" | "admin";    // checked by is_admin() SQL function in RLS policies
};

type Address = {
  id: string;
  label?: string;                 // "Home", "Office"
  streetAddress: string;
  apt?: string;
  area: string;
  city: string;
  postalCode: string;
  landmark?: string;
};
```

---

### Blog Post

```ts
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;                   // markdown or HTML
  tag: BlogTag;
  author: string;
  authorRole?: string;
  publishedAt: string;            // ISO date
  readMinutes: number;
  heroGradient: string;           // CSS gradient string (Phase 1 placeholder)
  heroImage?: string;             // real image URL (Phase 2+)
};

type BlogTag =
  | "buyer-guide"
  | "pre-order-playbook"
  | "behind-the-scenes"
  | "traveler-stories"
  | "authenticity";
```

---

## Checkout Pricing Formula

```
subtotal     = sum(line.totalBDT for each line)
inbound      = flat fee per order (varies by origin/weight, stored on quote or shipment)
duty         = sum(line.dutyBDT for each pre-order line)
handling     = SBD flat handling fee (₹500 default)
localDelivery = ৳60 inside Dhaka, ৳120 outside; free over ৳5,000 subtotal
─────────────────────────────────────────────────────
total        = subtotal + inbound + duty + handling + localDelivery
```

COD surcharge: none (COD is available for in-stock items at face value).  
No promo/coupon logic in v1.

---

## Mock Data Files (Phase 1 / Seed)

| File | Contents | Phase 2 status |
|---|---|---|
| `src/data/products.ts` | 8 sample products (4 in-stock, 4 pre-order) | Seed → replaced by DB in 2C |
| `src/data/shipments.ts` | Shipments #13, #14, #15 for USA and UK | Seed → replaced by DB in 2C |
| `src/data/orders.ts` | 7 sample orders for Nuzhat Ahmed | Seed (dev only) → replaced by DB in 2E |
| `src/data/quotes.ts` | 4 sample quotes across all status types | Seed (dev only) → replaced by DB in 2F |
| `src/data/blog.ts` | 6 sample blog posts | Stays as static import until Phase 4 (admin blog editor) |
| `src/data/categories.ts` | 6 categories with counts | Seed → replaced by DB in 2C |

All mock data content is transferred to `supabase/seed.sql` in Phase 2B and used to populate the dev database.

---

## RLS Policy Summary (Phase 2)

| Table | Anon read | Auth customer read | Auth customer write | Admin |
|---|---|---|---|---|
| `products` | ✅ active only | ✅ | ❌ | ✅ all |
| `product_variants` | ✅ | ✅ | ❌ | ✅ |
| `shipments` | ✅ | ✅ | ❌ | ✅ |
| `shipment_milestones` | ✅ | ✅ | ❌ | ✅ |
| `shipment_breakdowns` | ✅ | ✅ | ❌ | ✅ |
| `users` | ❌ | ✅ own row | ✅ own row | ✅ |
| `addresses` | ❌ | ✅ own | ✅ own | ✅ |
| `orders` | ❌ | ✅ own | ✅ insert own | ✅ |
| `order_lines` | ❌ | ✅ via order | ✅ insert via order | ✅ |
| `tracking_steps` | ❌ | ✅ via order | ❌ | ✅ |
| `quotes` | ❌ | ✅ own | ✅ insert | ✅ |

Admin check is enforced via `is_admin()` SQL function: `select exists (select 1 from users where id = auth.uid() and role = 'admin')`.
