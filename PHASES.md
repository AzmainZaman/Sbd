# Project Phases — SBD Global Shopping

---

## Phase 1 — Static Frontend (Current)

**Goal:** Pixel-perfect implementation of every approved screen using mock data. No backend, no database, no auth, no real payments. Every page is navigable and interactive (drawer opens, filters toggle, tabs switch) but all data comes from `src/data/`.

Phase 1 is split into 9 sequential sub-phases. Each sub-phase must pass `npm run lint` and `npm run build` before the next begins.

| Sub-phase | Scope |
|---|---|
| **1A** | Scaffold, config (TypeScript/Tailwind/ESLint), CSS tokens, mock data, types, utilities |
| **1B** | UI primitives: Button, Chip, Icon, FlagBadge, Money, Star, ShipBar, QuantityInput |
| **1C** | Layout chrome: TopBar, Header, MobileHeader, Footer, CartDrawer, MobileBottomNav, CheckoutHeader, ChatWidget |
| **1D** | Storefront: Homepage, Category page, Product pages (in-stock + pre-order), Search (Variant A) |
| **1E** | Quote frontend: request form step 1 + step 2, quote thread (mock data) |
| **1F** | Cart and checkout frontend: CartDrawer, Checkout page, Order confirmation (mock data) |
| **1G** | Customer dashboard: Overview, Orders, Quotes, Tracking detail (mock data) |
| **1H** | Admin frontend: Quotes inbox, Orders, Shipments, Catalog (mock data, desktop-only) |
| **1I** | Public pages (Shipment schedule, Blog, Public tracking), loading/error/empty states, responsive QA, accessibility polish |

**Not in Phase 1:**
- Real API calls, database, authentication, payment gateway
- Supabase or any backend service
- Admin blog editor
- Traveler portal (placeholder page only)
- Full Bangla content (strings are i18n-structured from day one, English only)
- Deployment (comes after local review is complete)

---

## Phase 2 — Auth + Backend + Quote Flow

**Goal:** Core business flow functional end-to-end: `quote request → admin quotes → customer accepts → checkout → order created`.

**Stack:** Supabase (PostgreSQL + Auth + Storage + RLS), `@supabase/ssr`, Resend. No ORM — Supabase client only.

**Auth in Phase 2:** Email OTP. Phone/SMS OTP deferred to Phase 3.

**In scope:**
- Supabase schema matching `DATA_MODEL.md` exactly; RLS on every table from day one
- Email OTP authentication (`signInWithOtp({ email })`)
- Protected routes: `/dashboard`, `/checkout`, `/quotes/*` require login; `/admin/*` requires `role = admin`
- Products, categories, and shipments served from DB (real product images via Supabase Storage)
- Quote request form submits to DB → admin queue → admin prices + sends → Resend email → customer accepts/declines
- Accepted quote → cart → checkout → order + order_lines + tracking_steps created in DB
- Manual payment workflow: COD live; bKash/Nagad/Card show payment instructions (gateway in Phase 3)
- Admin updates order status and payment status; customer sees changes in dashboard
- Public `/track` does real DB lookup verified by email
- Resend emails: quote sent, order confirmation, delivery notification
- Shipment CRUD (admin create/edit shipments, update milestones)
- Product CRUD (admin add/edit products, upload images to Supabase Storage)
- `supabase/migrations/*.sql` committed to git; `supabase/seed.sql` from Phase 1 mock data

| Sub-phase | Scope | Key output |
|---|---|---|
| **2A** | SQL schema + RLS design | `supabase/migrations/*.sql`, RLS policies reviewed |
| **2B** | Supabase project + seed | Running DB, types generated, middleware wired |
| **2C** | Products/categories/shipments from DB | Storefront off mock data; admin CRUD + real images live |
| **2D** | Email OTP auth + protected routes | Login flow + session + route guards |
| **2E** | Cart persistence + order creation | Orders write to DB; confirmation real |
| **2F** | Quote lifecycle end-to-end | Submit → admin → accept → cart; Resend emails |
| **2G** | Admin guards + shipment CRUD | All admin actions server-side protected |
| **2H** | Public tracking (real DB) | `/track` real lookup + email verification |
| **2I** | Manual payment workflow + emails | COD live; all Resend triggers firing |
| **2J** | Deployment + production QA | Live on sbd.com.bd |

See `IMPLEMENTATION_PLAN.md` for full sub-phase detail.

---

## Phase 3 — Payment Integration

**Goal:** Real money flows through the platform.

**In scope:**
- bKash Payment Gateway (redirect flow)
- Nagad integration
- SSLCommerz for card payments
- COD order flag (in-stock orders only, confirmed manually by admin)
- Payment status webhook handling
- Order confirmation email (receipt + ETAs)
- SMS notification on key order status changes (placed, shipped, delivered)

---

## Phase 4 — Traveler Portal + Advanced Features

**In scope:**
- Traveler portal: landing, sign-up, identity verification (NID/passport upload)
- Traveler dashboard: trip management, item queue, earnings, drop-off scheduling
- Traveler → shopper account duality (single account, role switch)
- Full Bangla language support (all UI strings translated)
- Admin: Customers management page
- Admin: Travelers management page
- Admin: Blog editor (rich text, draft/publish)
- Admin: Settings (delivery zones, fee config, payment method toggles)
- Promo/coupon code engine with input field at checkout
- Review submission flow (gated to verified delivered orders)
- WhatsApp Business API (automated quote and status notifications)
- SEO: sitemap.xml, robots.txt, structured data, OG tags per page

---

## Phase 5 — Scale + Optimisation

**In scope:**
- Real product photography (replace gradient placeholders) + image CDN
- Search with Algolia or Meilisearch
- Real-time tracking updates (courier API webhook)
- Customer loyalty points redemption at checkout
- Admin analytics dashboard
- Core Web Vitals audit and performance optimisation
- EU / China / Australia / UAE shipment cycle activation
