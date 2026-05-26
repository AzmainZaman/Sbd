# SBD Global Shopping — Project Brief

## Business Overview

**SBD Global Shopping** is a pre-order e-commerce platform that imports products from the USA, UK, Europe, China, Australia, and UAE to Bangladesh. The business has operated since 2019 and runs **two shipments per month** per region.

Customers browse or paste product links, receive a transparent quote (price + duties + handling fee), accept it, and track delivery through shipment milestones. A secondary **traveler program** lets frequent flyers earn money by carrying items in their luggage.

**Current site:** sbd.com.bd

---

## Core Features

### Customer-facing
- Storefront with in-stock and pre-order product listings
- Smart search: text query OR paste a product URL (Variant A auto-detect)
- Pre-order request → quote → cart → checkout flow
- Checkout with bKash, Nagad, card, and COD (in-stock only) payment options
- Order and shipment tracking (milestone-based)
- Customer dashboard: orders, quotes, tracking, saved items, addresses
- Public shipment schedule page
- Public order tracking (order number + phone verification)
- Blog (read-only, public)

### Admin-facing
- Quote request inbox with compose/pricing pane
- Shipment management (calendar, cutoff dates, landing dates, status updates)
- Order management with status tracking
- Product catalog (in-stock + pre-order, by shipment)

### Deferred to Phase 2
- Traveler portal (landing, sign-up, dashboard, earnings)
- Full Bangla language support (UI is i18n-ready from Phase 1)

---

## Source Countries (v1 active)
USA and UK shipments are fully modeled in v1. EU, China, Australia, UAE appear in the country strip and category filters but do not have active shipment cycles at launch.

---

## Business Rules (v1)

| Rule | Decision |
|---|---|
| Auth required for quote submission and checkout | Yes — phone OTP login |
| Guest checkout | Not supported in v1 |
| COD | In-stock items only, not pre-orders |
| Deposit / partial payment | Deferred — remove CTA from v1 |
| Duty display | Always a separate checkout line item; remove "duty included" copy from PDPs |
| Promo codes | Deferred — no input field or backend coupon logic in v1 |
| Bangla language | UI i18n-ready; launch English only |
| Traveler portal | Deferred to Phase 2 |

---

## Payment Methods (v1)
- **bKash** — primary mobile banking (redirect via bKash Payment Gateway)
- **Nagad** — secondary mobile banking
- **Card** — via SSLCommerz
- **COD** — in-stock orders only

---

## Design System
- **Accent color:** Vermillion `#c8472b`
- **Type:** Geist (primary), with Manrope and Plus Jakarta as swappable alternates
- **Mono:** Geist Mono (tracking numbers, dates, codes)
- **Breakpoints:** 1280px desktop, 390px mobile (tablet deferred)
- **Color tokens:** See `DESIGN_AUDIT.md` → Section 3

---

## Key Pages

| URL | Page |
|---|---|
| `/` | Homepage |
| `/categories/[slug]` | Category listing |
| `/products/[slug]` | Product detail |
| `/checkout` | Checkout (authenticated) |
| `/order-confirmation` | Post-checkout confirmation |
| `/dashboard` | Customer dashboard overview |
| `/dashboard/orders` | Orders list |
| `/dashboard/quotes` | Quotes list |
| `/dashboard/tracking/[id]` | Tracking detail |
| `/track` | Public order tracking (order # + phone) |
| `/shipments` | Public shipment schedule |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog article |
| `/admin/quotes` | Admin: quote inbox |
| `/admin/orders` | Admin: orders |
| `/admin/shipments` | Admin: shipment management |
| `/admin/catalog` | Admin: product catalog |
| `/login` | Phone OTP login (Phase 2) |
