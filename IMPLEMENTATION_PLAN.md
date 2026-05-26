# Implementation Plan — SBD Global Shopping

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 16.2.6** via `create-next-app@latest` | App Router, SSR, file-based routing, Server Actions in Phase 2, Vercel-ready |
| Language | **TypeScript** | Enforces data model types defined in DATA_MODEL.md |
| Styling | **Tailwind CSS** | Maps directly to the design token system; utility classes for spacing/color |
| Components | **Custom only** (no UI library) | Design is bespoke; any component library would require significant overriding |
| Fonts | **next/font** (Google Fonts) | Geist, Manrope, Plus Jakarta Sans — switchable via CSS vars |
| Icons | Custom SVG `Icon` component | Mirrors the `Icon` component from the prototype exactly (24×24 viewBox, 30+ paths) |
| State (Phase 1) | **React context** | Cart drawer open/close + line items; no persistence needed until Phase 2 |
| Linting | ESLint + Prettier (Next.js default config) | Standard Next.js scaffold |
| Deployment | Vercel — **deferred until after local review** | Not part of Phase 1 |

---

## Folder Structure

```
sbd/
├── public/
│   └── assets/
│       └── sbd-logo.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout: fonts, CSS vars, CartProvider
│   │   ├── globals.css                   # Design tokens as CSS custom properties
│   │   ├── page.tsx                      # Homepage /
│   │   │
│   │   ├── (storefront)/                 # Route group — shared SBDHeader + SBDFooter
│   │   │   ├── layout.tsx
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # /categories/beauty
│   │   │   ├── products/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # /products/dyson-airwrap
│   │   │   └── search/
│   │   │       └── page.tsx              # /search?q=... (Variant A auto-detect)
│   │   │
│   │   ├── (checkout)/                   # Route group — minimal logo-only header
│   │   │   ├── layout.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx              # /checkout
│   │   │   └── order-confirmation/
│   │   │       └── page.tsx              # /order-confirmation
│   │   │
│   │   ├── (account)/                    # Route group — dashboard sidebar layout
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx              # /dashboard (overview)
│   │   │       ├── orders/
│   │   │       │   └── page.tsx          # /dashboard/orders
│   │   │       ├── quotes/
│   │   │       │   └── page.tsx          # /dashboard/quotes
│   │   │       └── tracking/
│   │   │           └── [id]/
│   │   │               └── page.tsx      # /dashboard/tracking/[id]
│   │   │
│   │   ├── (admin)/                      # Route group — dark admin sidebar
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx              # Redirects → /admin/quotes
│   │   │       ├── quotes/
│   │   │       │   └── page.tsx
│   │   │       ├── orders/
│   │   │       │   └── page.tsx
│   │   │       ├── shipments/
│   │   │       │   └── page.tsx
│   │   │       └── catalog/
│   │   │           └── page.tsx
│   │   │
│   │   ├── shipments/
│   │   │   └── page.tsx                  # /shipments (public schedule)
│   │   ├── blog/
│   │   │   ├── page.tsx                  # /blog
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # /blog/[slug]
│   │   ├── track/
│   │   │   └── page.tsx                  # /track (public order tracking)
│   │   └── traveler/
│   │       └── page.tsx                  # "Coming in Phase 2" placeholder
│   │
│   ├── components/
│   │   ├── ui/                           # Primitives — zero business logic
│   │   │   ├── Button.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── FlagBadge.tsx
│   │   │   ├── Money.tsx
│   │   │   ├── Star.tsx
│   │   │   ├── ShipBar.tsx
│   │   │   └── QuantityInput.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── TopBar.tsx                # Shipment countdown + trust signals strip
│   │   │   ├── SBDHeader.tsx             # Desktop: TopBar + logo + search + nav
│   │   │   ├── SBDHeaderMobile.tsx       # Mobile: logo + search bar
│   │   │   ├── SBDFooter.tsx             # Full footer with link columns + payment logos
│   │   │   ├── CheckoutHeader.tsx        # Minimal header for checkout route group
│   │   │   ├── CartDrawer.tsx            # Slide-in cart panel
│   │   │   ├── MobileBottomNav.tsx       # Shop · Categories · Quote · Orders · Account
│   │   │   └── ChatWidget.tsx            # Floating WhatsApp / Messenger widget
│   │   │
│   │   ├── storefront/
│   │   │   ├── Hero.tsx
│   │   │   ├── CountryStrip.tsx
│   │   │   ├── ShipmentBanner.tsx
│   │   │   ├── ProductRow.tsx            # Section with title + 4-col product grid
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TravelerCTA.tsx           # Links to /traveler placeholder
│   │   │   ├── Testimonials.tsx
│   │   │   └── Newsletter.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx           # Card for grids (in-stock + pre-order variants)
│   │   │   ├── ProductGallery.tsx        # Thumbnail strip + main image area
│   │   │   ├── ETABlock.tsx              # Dark ETA card with ShipBar (pre-order only)
│   │   │   ├── VariantSelector.tsx       # Color / size / flavor chips
│   │   │   ├── TrustBadges.tsx           # Authenticity / return / WhatsApp row
│   │   │   ├── ReviewSummary.tsx         # Rating bar breakdown + star average
│   │   │   ├── ReviewList.tsx            # 2×2 review card grid
│   │   │   └── RelatedProducts.tsx
│   │   │
│   │   ├── category/
│   │   │   ├── CategoryFilters.tsx       # Desktop sidebar filter panel
│   │   │   ├── FilterDrawer.tsx          # Mobile bottom-sheet filter drawer
│   │   │   ├── ActiveFilterChips.tsx     # Applied filter chips with ✕ clear
│   │   │   └── SortSelect.tsx
│   │   │
│   │   ├── search/
│   │   │   └── SearchField.tsx           # Variant A: detects URL → quote mode
│   │   │
│   │   ├── quote/
│   │   │   ├── QuoteRequestForm.tsx      # Step 1 — item details + shipment preference
│   │   │   ├── QuoteRequestStep2.tsx     # Step 2 — review + confirm
│   │   │   └── QuoteThread.tsx           # Quote card: breakdown + accept / decline
│   │   │
│   │   ├── checkout/
│   │   │   ├── CartLines.tsx             # Line items with qty controls + remove
│   │   │   ├── OrderSummary.tsx          # Right panel: lines + fee breakdown + total
│   │   │   ├── ShipmentNote.tsx          # "Pre-orders arrive with Shipment #14" note
│   │   │   ├── DeliveryOptions.tsx       # Split shipment vs. hold together selector
│   │   │   ├── PaymentSelector.tsx       # bKash / Nagad / Card / COD tiles
│   │   │   └── ConsentBlock.tsx          # T&C checkbox + place order button
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashSidebar.tsx           # 8-item nav + traveler promo block
│   │   │   ├── StatCard.tsx              # KPI tile (accent or default)
│   │   │   ├── QuotePromptCard.tsx       # Highlighted "New Quote" accept/decline card
│   │   │   ├── OrderTimeline.tsx         # ShipBar + step labels for an order
│   │   │   ├── NextShipmentCard.tsx      # Dark card with shipment countdown
│   │   │   ├── ReorderRow.tsx            # Compact "buy again" product row
│   │   │   ├── QuoteListItem.tsx         # Row in quotes list with status chip
│   │   │   ├── TrackingTimeline.tsx      # Vertical timeline: done / current / pending
│   │   │   └── TrackingMap.tsx           # Route map placeholder (JFK→DXB→DAC)
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx          # Dark sidebar navigation (9 items)
│   │   │   ├── AdminTopBar.tsx           # Page title + breadcrumb + action buttons
│   │   │   ├── AdminStatRow.tsx          # KPI card row used on quotes + orders pages
│   │   │   ├── QuoteComposePane.tsx      # Pricing fields + customer preview panel
│   │   │   └── ShipmentCalendar.tsx      # 31-day grid with cutoff/landing highlights
│   │   │
│   │   ├── shipment/
│   │   │   └── ShipmentCard.tsx          # Public schedule card (open/delivered)
│   │   │
│   │   └── blog/
│   │       ├── PostCard.tsx
│   │       └── FeaturedPost.tsx
│   │
│   ├── context/
│   │   └── CartContext.tsx               # items, addItem, removeItem, updateQty, drawer
│   │
│   ├── data/                             # Mock data — Phase 1 only, replaced in Phase 2
│   │   ├── products.ts
│   │   ├── shipments.ts
│   │   ├── orders.ts
│   │   ├── quotes.ts
│   │   ├── blog.ts
│   │   └── categories.ts
│   │
│   ├── lib/
│   │   ├── utils.ts                      # cn(), formatBDT(), formatDate()
│   │   └── shipment-utils.ts             # getNextCutoff(), formatCountdown()
│   │
│   └── types/
│       ├── product.ts
│       ├── shipment.ts
│       ├── order.ts
│       ├── quote.ts
│       ├── user.ts
│       └── blog.ts
│
├── CLAUDE.md
├── DESIGN_AUDIT.md
├── PROJECT_BRIEF.md
├── IMPLEMENTATION_PLAN.md
├── DATA_MODEL.md
├── PHASES.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Phase 1 Sub-phases

Each sub-phase follows this protocol:
1. State the files to be created/edited
2. Implement only that sub-phase
3. Run `npm run lint` and `npm run build`
4. Fix all errors before declaring done
5. Summarize what changed
6. **Wait for approval before moving to the next sub-phase**

---

### Phase 1A — Scaffold + Config + Foundation

**Goal:** Runnable Next.js project with the full design system wired up and all static data ready. No visible UI yet.

**Files to create:**
```
(project root, via create-next-app@latest)
src/app/globals.css                   ← design tokens as CSS custom properties
src/app/layout.tsx                    ← root layout with font imports + CartProvider stub
tailwind.config.ts                    ← extend theme with token-aware values
src/lib/utils.ts                      ← cn(), formatBDT(), formatDate()
src/lib/shipment-utils.ts             ← getNextCutoff(), formatCountdown()
src/types/product.ts
src/types/shipment.ts
src/types/order.ts
src/types/quote.ts
src/types/user.ts
src/types/blog.ts
src/data/products.ts                  ← 8 products (4 in-stock, 4 pre-order)
src/data/shipments.ts                 ← #13 #14 #15 for USA + UK
src/data/orders.ts                    ← 7 sample orders
src/data/quotes.ts                    ← 4 sample quotes
src/data/blog.ts                      ← 6 sample posts
src/data/categories.ts                ← 6 categories
public/assets/sbd-logo.png            ← copy from design bundle
```

**Acceptance criteria:**
- `npm run dev` starts without errors
- `npm run build` produces a clean build
- `npm run lint` reports zero errors
- All design tokens are visible in browser DevTools as CSS custom properties on `:root`

---

### Phase 1B — UI Primitives

**Goal:** All atomic building blocks are built, documented with usage examples in a single `/dev/components` route (not linked from main nav — dev only).

**Files to create:**
```
src/components/ui/Button.tsx          ← variant: primary|accent|ghost · size: sm|md|lg
src/components/ui/Chip.tsx            ← variant: stock|pre|accent|line|dark|default
src/components/ui/Icon.tsx            ← 30+ SVG paths, 24×24 viewBox, stroke-based
src/components/ui/FlagBadge.tsx       ← inline SVG flags: US UK EU CN AU AE BD
src/components/ui/Money.tsx           ← ৳ BDT + optional $USD · size: sm|md|lg
src/components/ui/Star.tsx            ← filled/outline, configurable size
src/components/ui/ShipBar.tsx         ← progress bar with fill width prop
src/components/ui/QuantityInput.tsx   ← − qty + stepper with min/max
src/app/dev/components/page.tsx       ← dev-only visual test page for all primitives
```

**Acceptance criteria:**
- Dev page at `/dev/components` renders every primitive variant
- `npm run build` clean · `npm run lint` clean

---

### Phase 1C — Layout Chrome

**Goal:** Every page has the correct shell. Navigation links exist (href only — pages built later). Cart drawer opens/closes.

**Files to create:**
```
src/context/CartContext.tsx
src/components/layout/TopBar.tsx
src/components/layout/SBDHeader.tsx
src/components/layout/SBDHeaderMobile.tsx
src/components/layout/SBDFooter.tsx
src/components/layout/CheckoutHeader.tsx
src/components/layout/CartDrawer.tsx
src/components/layout/MobileBottomNav.tsx
src/components/layout/ChatWidget.tsx
src/app/(storefront)/layout.tsx       ← SBDHeader + SBDFooter + MobileBottomNav
src/app/(checkout)/layout.tsx         ← CheckoutHeader only
src/app/(account)/layout.tsx          ← DashSidebar placeholder (built in 1G)
src/app/(admin)/layout.tsx            ← AdminSidebar placeholder (built in 1H)
```

**Files to edit:**
```
src/app/layout.tsx                    ← wrap with CartProvider
```

**Acceptance criteria:**
- Homepage renders with full header and footer
- Cart drawer opens/closes (empty state shows)
- Mobile header is visible at 390px; desktop header at 1280px
- MobileBottomNav visible on mobile viewports only
- TopBar shows next cutoff countdown from mock shipment data
- `npm run build` clean · `npm run lint` clean

---

### Phase 1D — Storefront Pages

**Goal:** Homepage, category page, product detail page (both variants), and search page are fully built and match the design.

**Files to create:**
```
src/components/storefront/Hero.tsx
src/components/storefront/CountryStrip.tsx
src/components/storefront/ShipmentBanner.tsx
src/components/storefront/ProductRow.tsx
src/components/storefront/HowItWorks.tsx
src/components/storefront/TravelerCTA.tsx
src/components/storefront/Testimonials.tsx
src/components/storefront/Newsletter.tsx
src/components/product/ProductCard.tsx
src/components/product/ProductGallery.tsx
src/components/product/ETABlock.tsx
src/components/product/VariantSelector.tsx
src/components/product/TrustBadges.tsx
src/components/product/ReviewSummary.tsx
src/components/product/ReviewList.tsx
src/components/product/RelatedProducts.tsx
src/components/category/CategoryFilters.tsx
src/components/category/FilterDrawer.tsx
src/components/category/ActiveFilterChips.tsx
src/components/category/SortSelect.tsx
src/components/search/SearchField.tsx
src/app/(storefront)/layout.tsx       ← finalize (was placeholder in 1C)
src/app/page.tsx                      ← Homepage
src/app/(storefront)/categories/[slug]/page.tsx
src/app/(storefront)/products/[slug]/page.tsx
src/app/(storefront)/search/page.tsx
src/app/traveler/page.tsx             ← "Coming in Phase 2" placeholder
```

**Acceptance criteria:**
- Homepage matches all 9 sections of the design (Hero through Newsletter)
- Category page (Beauty slug) shows sidebar filters on desktop, filter drawer on mobile
- Product page for in-stock product matches design A (editorial split)
- Product page for pre-order product matches design B (gallery-led + ETA block, **no deposit button**)
- SearchField Variant A: text query shows search icon; URL paste morphs to accent/quote mode
- TravelerCTA links to `/traveler` placeholder page
- All pages render correctly at 390px (mobile) and 1280px (desktop)
- `npm run build` clean · `npm run lint` clean

---

### Phase 1E — Quote Frontend

**Goal:** The full pre-order quote flow is interactive with mock data.

**Files to create:**
```
src/components/quote/QuoteRequestForm.tsx   ← Step 1: URL + item details
src/components/quote/QuoteRequestStep2.tsx  ← Step 2: review + confirm (new design)
src/components/quote/QuoteThread.tsx        ← Quote received → accept / decline card
```

**Notes:**
- Step 2 needs to be designed during implementation — it should be a review/confirmation screen showing the parsed URL, variant, quantity, shipment preference, and a "Submit request" CTA
- The form has no submission action in Phase 1 — the CTA triggers a mock success state inline
- QuoteThread uses mock quote data from `src/data/quotes.ts`

**Acceptance criteria:**
- Pasting a URL in SearchField leads to the QuoteRequestForm (step 1)
- "Next" on step 1 advances to step 2
- "Submit request" on step 2 shows a mock success state
- QuoteThread card shows quote breakdown (no promo fields)
- Accept CTA adds the quoted item to the cart drawer and closes the thread
- `npm run build` clean · `npm run lint` clean

---

### Phase 1F — Cart and Checkout Frontend

**Goal:** Cart drawer is fully functional with mock data. Checkout page renders on desktop and mobile. Order confirmation renders.

**Files to create:**
```
src/components/checkout/CartLines.tsx
src/components/checkout/OrderSummary.tsx
src/components/checkout/ShipmentNote.tsx
src/components/checkout/DeliveryOptions.tsx
src/components/checkout/PaymentSelector.tsx
src/components/checkout/ConsentBlock.tsx
src/app/(checkout)/checkout/page.tsx
src/app/(checkout)/order-confirmation/page.tsx
```

**Files to edit:**
```
src/components/layout/CartDrawer.tsx   ← wire up CartLines + summary + checkout link
```

**Accepted rules:**
- No promo code field anywhere
- No deposit button anywhere
- COD tile is shown but disabled with tooltip "Available for in-stock items only" for carts with pre-order lines
- T&C text: "I agree to the Terms & Conditions, the Pre-order Policy (custom quotes are non-refundable once shipping begins), and the Refund Policy."
- Checkout "Place order" button navigates to `/order-confirmation` (no real submission)
- Order summary shows duty as a separate line item — no "duty included" copy
- Checkout is two-col on desktop (form left, summary right) · single-col on mobile

**Acceptance criteria:**
- Cart drawer shows correct line items, ETAs, subtotal
- Checkout page renders both desktop and mobile layouts
- Delivery options (split/together) are selectable
- Payment tiles (bKash/Nagad/Card/COD) are selectable; COD is disabled for pre-order carts
- T&C checkbox required before place order is enabled
- Order confirmation shows split ETA cards (in-stock / pre-order)
- `npm run build` clean · `npm run lint` clean

---

### Phase 1G — Customer Dashboard Frontend

**Goal:** All four dashboard pages render with mock data and the sidebar layout is complete.

**Files to create:**
```
src/components/dashboard/DashSidebar.tsx
src/components/dashboard/StatCard.tsx
src/components/dashboard/QuotePromptCard.tsx
src/components/dashboard/OrderTimeline.tsx
src/components/dashboard/NextShipmentCard.tsx
src/components/dashboard/ReorderRow.tsx
src/components/dashboard/QuoteListItem.tsx
src/components/dashboard/TrackingTimeline.tsx
src/components/dashboard/TrackingMap.tsx
src/app/(account)/layout.tsx                          ← replace placeholder with DashSidebar
src/app/(account)/dashboard/page.tsx
src/app/(account)/dashboard/orders/page.tsx
src/app/(account)/dashboard/quotes/page.tsx
src/app/(account)/dashboard/tracking/[id]/page.tsx
```

**Notes:**
- Dashboard mobile layout is handled by the same pages — sidebar collapses to `MobileBottomNav` below 768px, main content stacks
- All data comes from `src/data/orders.ts` and `src/data/quotes.ts`
- TrackingMap is a styled placeholder gradient — no real map integration

**Acceptance criteria:**
- Dashboard overview shows: 4 stat cards, quote prompt card, active orders with progress bars, next shipment card, reorder section
- Orders page shows table on desktop, card stack on mobile
- Quotes page shows all 4 quote status types
- Tracking detail shows full vertical timeline + map placeholder + "need help?" action buttons
- Sidebar is sticky on desktop; disappears on mobile (MobileBottomNav takes over)
- `npm run build` clean · `npm run lint` clean

---

### Phase 1H — Admin Frontend

**Goal:** All four admin pages render with mock data. Admin is desktop-only; a banner is shown on mobile.

**Files to create:**
```
src/components/admin/AdminSidebar.tsx
src/components/admin/AdminTopBar.tsx
src/components/admin/AdminStatRow.tsx
src/components/admin/QuoteComposePane.tsx
src/components/admin/ShipmentCalendar.tsx
src/app/(admin)/layout.tsx                   ← replace placeholder with AdminSidebar
src/app/(admin)/admin/page.tsx               ← redirect to /admin/quotes
src/app/(admin)/admin/quotes/page.tsx
src/app/(admin)/admin/orders/page.tsx
src/app/(admin)/admin/shipments/page.tsx
src/app/(admin)/admin/catalog/page.tsx
```

**Notes:**
- Admin sidebar uses `#0e0e0c` (same `--ink` token) — not a separate dark token value
- Mobile banner: "Admin panel is optimised for desktop. Please use a screen wider than 768px."
- No auth gate in Phase 1 — admin is accessible at `/admin` without a password

**Acceptance criteria:**
- Quote inbox renders table + stat row + compose pane below
- Shipments page shows calendar grid + table + detail edit panel
- Orders page shows stat row + status filter tabs + table
- Catalog page shows stat row + search + filter tabs + table
- Admin sidebar nav is visually correct (dark background, 9 items)
- Mobile warning banner appears below 768px
- `npm run build` clean · `npm run lint` clean

---

### Phase 1I — Public Pages, Polish, and QA

**Goal:** Remaining public pages are complete, all edge states are handled, and the full site passes a mobile and accessibility review.

**Files to create:**
```
src/components/shipment/ShipmentCard.tsx
src/components/blog/PostCard.tsx
src/components/blog/FeaturedPost.tsx
src/app/shipments/page.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/track/page.tsx
src/app/not-found.tsx                        ← 404 page
src/app/error.tsx                            ← root error boundary
src/app/loading.tsx                          ← root loading state
src/app/(storefront)/loading.tsx             ← storefront skeleton
src/app/(account)/dashboard/loading.tsx      ← dashboard skeleton
```

**Polish tasks (no new files, edits to existing):**
- Empty state for cart drawer (no items)
- Empty state for orders list (no orders)
- Empty state for quotes list (no quotes)
- Empty state for admin quote inbox (queue is empty)
- Mobile QA pass: every page at 390px width
- Desktop QA pass: every page at 1280px width
- Keyboard navigation check on interactive elements (drawers, forms, selectors)
- `<title>` and `<meta description>` on every page
- Favicon and OG image placeholders
- `/blog/[slug]` renders the first mock blog article in full

**Acceptance criteria:**
- All pages from the route structure exist and render without errors
- Cart empty state is shown when no items in cart
- 404 page is shown for unknown routes
- Loading skeletons appear before content on storefront and dashboard
- Full mobile QA pass: no horizontal scroll, no broken layouts at 390px
- `npm run build` produces zero errors and zero TypeScript errors
- `npm run lint` produces zero warnings

---

---

# Phase 2 — Auth + Backend + Quote Flow

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Database | **Supabase PostgreSQL** | Hosted Postgres with built-in Auth, Storage, and RLS |
| Data access | **Supabase client** (`supabase-js`) | Single layer for DB, auth, and storage — no ORM |
| Session | **`@supabase/ssr`** | Cookie-based sessions that work with Next.js App Router server components |
| Auth (v1) | **Email OTP** | No Twilio account needed; phone OTP added in Phase 3 |
| Mutations | **Next.js Server Actions** | No separate API routes; works in server and client components |
| Email | **Resend** | Simple SDK; free tier covers v1 volume |
| Images | **Supabase Storage** (`products` bucket) | Replaces Phase 1 gradient placeholders from Phase 2C |
| Schema management | **Supabase CLI** (`supabase db push`) | SQL migration files in `supabase/migrations/`, committed to git |
| Type generation | **`supabase gen types typescript`** | Outputs `src/types/database.ts`; never edit manually |

Same sub-phase protocol as Phase 1: each sub-phase must pass `npm run lint` and `npm run build` before the next begins.

---

### Phase 2A — Schema + RLS Design

**Goal:** Complete SQL migration files and RLS policies designed before any application code. No running DB yet.

**Files to create:**
```
supabase/migrations/20260526000001_init.sql         ← all CREATE TABLE statements
supabase/migrations/20260526000002_rls.sql          ← all RLS ENABLE + POLICY statements
supabase/migrations/20260526000003_functions.sql    ← is_admin(), handle_new_user() trigger
supabase/seed.sql                                   ← INSERT statements from src/data/*.ts
```

**Tables:** `users`, `addresses`, `products`, `product_variants`, `shipments`, `shipment_milestones`, `shipment_breakdowns`, `orders`, `order_lines`, `tracking_steps`, `quotes`

`order_lines` and `tracking_steps` are normalized child tables (not JSON columns); they map to `Order.lines[]` and `Order.trackingSteps[]` in the TypeScript type after a joined query.

**Key SQL functions:**
```sql
-- RLS admin check
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- Auto-create users row on first auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'Customer'));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**RLS policy matrix:** See `DATA_MODEL.md` → RLS Policy Summary.

**Acceptance criteria:**
- `supabase db lint` passes with zero errors on all migration files
- RLS policy matrix reviewed against all Phase 2 read/write paths
- TypeScript types in `src/types/` audited against table designs; any gaps noted
- `npm run lint` and `npm run build` still pass (no DB connection yet)

---

### Phase 2B — Supabase Project Setup + Seed

**Goal:** Supabase project running, tables created, RLS enabled, mock data seeded. All Phase 1 pages still render (still reading `src/data/` — migration per entity happens in 2C+).

**Files to create:**
```
.env.local                                   ← NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
                                                SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, ADMIN_EMAIL
src/lib/supabase/server.ts                  ← createClient() using @supabase/ssr + cookies()
src/lib/supabase/client.ts                  ← createBrowserClient() singleton
src/lib/auth-guard.ts                       ← assertAuth(), assertAdmin()
src/proxy.ts                                ← session refresh + route protection matchers (Next.js 16: proxy, not middleware)
src/types/database.ts                       ← generated; committed to git
supabase/config.toml                        ← supabase init output
supabase/.gitignore                         ← ignore .branches, .temp
```

**Files to edit:**
```
package.json                                ← add scripts: "db:push", "db:types", "db:studio", "db:seed"
next.config.ts                              ← add Supabase Storage hostname to images.remotePatterns
.gitignore                                  ← ensure .env.local present
```

**`src/proxy.ts` route matchers:**
```
/dashboard/*  → require auth → redirect /login?next=...
/checkout     → require auth → redirect /login?next=/checkout
/admin/*      → require auth + is_admin → redirect /login
```

**Acceptance criteria:**
- `supabase db push` completes without errors; dashboard shows all tables with RLS enabled
- `supabase/seed.sql` runs successfully; all Phase 1 mock data visible in Supabase Table Editor
- `src/types/database.ts` generated and committed
- `npm run dev` starts; all Phase 1 pages render as before
- `npm run lint` and `npm run build` clean

---

### Phase 2C — Products + Categories + Shipments from DB

**Goal:** Storefront reads from Supabase. Admin CRUD functional. Real product images via Supabase Storage.

**Storage setup:**
- Create `products` bucket (public read)
- `uploadProductImage(productId, file)` Server Action uploads to `products/{productId}/{filename}`, stores URL in `products.images[]`
- Add Supabase Storage hostname to `next.config.ts` `images.remotePatterns`

**Pages to migrate to DB queries:**
```
src/app/page.tsx
src/app/(storefront)/categories/[slug]/page.tsx
src/app/(storefront)/products/[slug]/page.tsx
src/app/(storefront)/search/page.tsx
src/app/(storefront)/shipments/page.tsx
src/lib/shipment-utils.ts                   ← getNextCutoff() reads from DB instead of src/data/
```

**Server Actions to create:**
```
src/actions/admin/products.ts               ← createProduct(), updateProduct(), deleteProduct(), uploadProductImage()
src/actions/admin/shipments.ts              ← createShipment(), updateShipment(), updateShipmentStatus(), updateMilestone()
```

**Admin pages to wire up:**
```
src/app/(admin)/admin/catalog/page.tsx      ← real DB + CRUD modals
src/app/(admin)/admin/shipments/page.tsx    ← real DB + status/milestone controls
```

**Gradient fallback:** When `product.images` is empty, display `product.hero` gradient as before. `next/image` is used when at least one URL is present.

**Files retired from page imports** (kept as seed data only):
- `src/data/products.ts`, `src/data/categories.ts`, `src/data/shipments.ts`

**Acceptance criteria:**
- Product/category/shipment pages load real DB data
- Adding a product in admin catalog persists across refreshes with real image displayed
- `next/image` renders Supabase Storage images; gradient fallback shows for empty `images[]`
- `generateStaticParams` for `/products/[slug]` queries DB
- `npm run lint` and `npm run build` clean

---

### Phase 2D — Auth (Email OTP)

**Goal:** Email OTP login works end-to-end. Protected routes redirect unauthenticated users. Session available in all server components.

**Login flow:**
1. `/login` page — user enters email → `sendOtp(email)` Server Action → `supabase.auth.signInWithOtp({ email })`
2. Supabase sends 6-digit code email
3. User enters code → `verifyOtp(email, token)` Server Action → `supabase.auth.verifyOtp({ type: 'email' })`
4. `handle_new_user()` trigger creates `public.users` row on first login
5. `@supabase/ssr` sets session cookie; middleware refreshes it on every request
6. Redirect to `?next=` param on success (defaults to `/dashboard`)

**Files to create:**
```
src/app/(auth)/layout.tsx                   ← centered card, no storefront chrome
src/app/(auth)/login/page.tsx               ← server component; redirects if already authed
src/app/(auth)/login/LoginClient.tsx        ← "use client"; email step → code step
src/actions/auth.ts                         ← sendOtp(), verifyOtp(), signOut(), getUser()
```

**Files to edit:**
```
src/proxy.ts                                ← add auth route matchers
src/components/layout/SBDHeader.tsx        ← show user name when session exists
src/components/layout/MobileBottomNav.tsx  ← Account tab → /dashboard or /login
src/components/dashboard/DashSidebar.tsx   ← show real user name; Sign out button
src/app/(account)/layout.tsx              ← read session; pass user to DashSidebar
```

**Acceptance criteria:**
- Unauthenticated `/dashboard` redirects to `/login?next=/dashboard`
- Email OTP arrives; entering code creates session and redirects correctly
- `public.users` row created on first login via trigger
- Sign out clears session, redirects to `/`
- `role = admin` account (seeded via `supabase/seed.sql`); `/admin/*` blocks non-admin
- `npm run lint` and `npm run build` clean

---

### Phase 2E — Cart Persistence + Order Creation

**Goal:** Cart persists across sessions. Checkout creates real `orders` + `order_lines` + `tracking_steps` rows. Dashboard reads real orders.

**Cart:** `CartContext` upgraded to sync to `localStorage`; restored on mount. No `carts` table.

**`createOrder()` Server Action:**
1. Receives cart items + address + payment method
2. Validates auth via `assertAuth()`
3. Computes fees (same formula as `OrderSummary.tsx`)
4. Inserts `orders` row → gets `orderId`
5. Inserts `order_lines` rows
6. Inserts initial `tracking_steps` (`placed` = done, rest = pending)
7. Sends order confirmation email via Resend
8. Returns `orderId`

**Files to create:**
```
src/actions/orders.ts                       ← createOrder(), getOrder(), getOrdersByCustomer(), lookupOrder()
src/lib/email.ts                            ← Resend client; sendOrderConfirmationEmail(), sendQuoteEmail(), sendDeliveryEmail()
```

**Files to edit:**
```
src/context/CartContext.tsx                 ← localStorage persistence
src/components/checkout/ConsentBlock.tsx    ← call createOrder(); navigate to confirmation
src/app/(checkout)/order-confirmation/page.tsx  ← query order from DB
src/app/(account)/dashboard/page.tsx       ← real orders from DB
src/app/(account)/dashboard/orders/page.tsx
src/app/(account)/dashboard/tracking/[id]/page.tsx  ← order + tracking_steps from DB
src/data/orders.ts                          ← seed-only
```

**Acceptance criteria:**
- Cart survives page refresh
- Placing an order inserts rows in `orders`, `order_lines`, `tracking_steps`
- `/order-confirmation` shows real `orderId`
- `/dashboard/orders` shows placed order
- RLS verified: user A cannot read user B's orders
- `npm run lint` and `npm run build` clean

---

### Phase 2F — Quote Lifecycle

**Goal:** Full quote flow database-driven with Resend email at the `quote-sent` stage.

**Server Actions:**
```
src/actions/quotes.ts
  createQuote()             ← customer submits; status = 'pending'
  getQuotesByCustomer()     ← customer dashboard
  acceptQuote()             ← status = 'accepted'; returns cart item
  declineQuote()            ← status = 'declined'

src/actions/admin/quotes.ts
  getAdminQuoteInbox()      ← all quotes, filterable by status
  sendQuote()               ← update pricing + status = 'quote-sent'; send Resend email
```

**Files to edit:**
```
src/components/quote/QuoteRequestForm.tsx       ← calls createQuote()
src/components/quote/QuoteRequestStep2.tsx      ← confirm → createQuote() → success state
src/components/quote/QuoteThread.tsx            ← accept/decline call Server Actions
src/app/(admin)/admin/quotes/page.tsx           ← real DB
src/components/admin/QuoteComposePane.tsx       ← calls sendQuote()
src/app/(account)/dashboard/quotes/page.tsx    ← real DB
src/data/quotes.ts                              ← seed-only
```

**Acceptance criteria:**
- Quote submission creates DB row
- Admin inbox shows new request
- Admin sends quote → customer receives Resend email
- Customer accepts → `status = accepted`; item enters cart
- Customer declines → `status = declined`
- RLS: customers read only their own quotes
- `npm run lint` and `npm run build` clean

---

### Phase 2G — Admin Route Guards + Shipment CRUD

**Goal:** All admin Server Actions are server-side protected. `assertAdmin()` enforced everywhere. Shipment CRUD wired to DB.

**`assertAdmin()` pattern — every admin action starts with this:**
```ts
export async function sendQuote(...) {
  await assertAdmin()
  // ...
}
```

**Files to create:**
```
src/actions/admin/orders.ts    ← getAllOrders(), updateOrderStatus(), updatePaymentStatus()
```

**Files to edit:**
```
src/actions/admin/products.ts  ← add assertAdmin() to all functions
src/actions/admin/shipments.ts ← add assertAdmin() to all functions
src/actions/admin/quotes.ts    ← add assertAdmin() to all functions
src/app/(admin)/admin/orders/page.tsx  ← real DB + status/payment controls
```

**Acceptance criteria:**
- Calling any admin Server Action as a customer throws `Forbidden` (test with non-admin session)
- Admin can update shipment status and milestone completion from the UI
- `/shipments` public page reflects milestone changes
- `npm run lint` and `npm run build` clean

---

### Phase 2H — Public Tracking (Real DB)

**Goal:** `/track` does a real Supabase lookup. Email used as the verification token (no auth required, but email must match the order's customer).

**`lookupOrder(orderId, email)` logic:**
1. Query `orders` by `id`
2. Query `users` by `order.user_id` — check `user.email === input.email`
3. If match: return order with `tracking_steps`; else: return `null`

Uses the **service role client** (bypasses RLS) because the caller is unauthenticated — but explicitly checks email ownership in application code before returning data.

**Files to edit:**
```
src/app/(storefront)/track/TrackClient.tsx   ← call lookupOrder() instead of mock find
src/actions/orders.ts                         ← add lookupOrder(orderId, email)
```

**Acceptance criteria:**
- Real order ID + correct email shows tracking timeline
- Wrong email returns "Order not found" (no data leak)
- `npm run lint` and `npm run build` clean

---

### Phase 2I — Manual Payment Workflow + Emails

**Goal:** COD orders live. bKash/Nagad/Card show payment instructions. All Resend email triggers firing.

**COD:** `createOrder()` with `paymentMethod = 'cod'` → `paymentStatus = 'pending'` → confirmation email sent immediately.

**bKash/Nagad/Card (Phase 2 stub):** Order created with `paymentStatus = 'pending'`. Order confirmation page shows: *"Please send ৳[total] to [bKash number]. Include your order ID as the reference. We'll confirm within 2 hours."*

Admin marks `paymentStatus = 'paid'` from orders page → order moves to `sourcing`.

**Resend email triggers:**
| Event | Function |
|---|---|
| Order placed | `sendOrderConfirmationEmail()` |
| Quote sent | `sendQuoteEmail()` |
| Order delivered | `sendDeliveryEmail()` |

**Files to edit:**
```
src/lib/email.ts                                   ← implement all three email functions
src/components/checkout/ConsentBlock.tsx           ← payment instructions for non-COD
src/app/(checkout)/order-confirmation/page.tsx     ← show instructions if paymentStatus = 'pending'
src/app/(admin)/admin/orders/page.tsx              ← paymentStatus update control
```

**Acceptance criteria:**
- COD order → DB row + confirmation email received
- bKash order → DB row + payment instructions on confirmation page
- Admin marks payment paid → DB updated; order card in dashboard reflects change
- Resend dashboard shows sent emails for all three triggers
- `npm run lint` and `npm run build` clean

---

### Phase 2J — Deployment + Production QA ✅ Complete

**Deployed:** https://shob.ai · https://sbd-five.vercel.app
**Production Supabase:** `jywdtdhkftrvcunqbcbd`
**Email:** team@shob.ai (Resend, shob.ai domain verified)
**CI:** `.github/workflows/ci.yml` — lint + build on push/PR to `main` and `Production`

**Goal:** Live on Vercel, connected to Supabase production project, full QA pass.

**Steps:**
1. Create Supabase **production** project (separate from dev)
2. Run `supabase db push --linked` against production
3. Create Vercel project; connect GitHub repo; set all env vars
4. Add production domain to Supabase Auth → Site URL + Redirect URLs
5. Configure Resend domain DNS for `sbd.com.bd`
6. Set `ADMIN_EMAIL` env var; set `role = admin` on the admin user in Supabase dashboard
7. Create `.github/workflows/ci.yml` — lint + build on every PR

**Vercel environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL                 ← team@shob.ai
ADMIN_EMAIL
BKASH_MERCHANT_NUMBER
NAGAD_MERCHANT_NUMBER
```

**Files to create:**
```
.github/workflows/ci.yml          ← npm run lint + npm run build on every PR
```

**Production QA checklist:**
- [ ] Email OTP arrives within 30s on a real email address
- [ ] Full flow: quote → admin quotes → accept → checkout → confirmation email
- [ ] Admin login; order status and payment status update
- [ ] Public `/track` with real order + correct email shows timeline
- [ ] Public `/track` with wrong email returns error (no data leak)
- [ ] Cart persists across browser sessions
- [ ] RLS spot-check: authenticated request for another user's order returns empty
- [ ] All 37+ pages load without 404 errors
- [ ] No secrets in git history (`git log --all -S "supabase"`)
- [ ] Supabase RLS enabled on all tables (verify in dashboard)

**Acceptance criteria:**
- Production URL loads without errors
- Full end-to-end business flow completes on production
- CI passes on GitHub
- Supabase dashboard shows RLS enabled on every table

---

---

# Phase 3 — Production Fixes + Customer Account Completion + Catalog Polish

## Stack additions

| Layer | Choice | Reason |
|---|---|---|
| Address storage | Existing `addresses` table (Phase 2A schema) | Already in DB; needs CRUD actions + UI |
| Static pages | Next.js App Router static page files | Terms, Refund Policy, Pre-order Policy, Contact, FAQ, About — no DB needed |

Payment gateway additions (bKash, Nagad, SSLCommerz) deferred to Phase 4.

**Sub-phase protocol:** For each sub-phase — inspect relevant files and DB tables first, identify root cause before editing anything, implement only the approved scope, run `npm run lint` and `npm run build`, summarize files changed + DB rows changed + QA result, stop for approval before the next sub-phase.

---

### Phase 3A — Production Blocker Fixes + Auth Polish

**Goal:** Every broken or dead route fixed on production. Every disabled auth stub wired up. Zero placeholder content visible to real users.

**Investigate before editing each item. Identify root cause first.**

---

**Fix 1 — `/categories/beauty` 404**

Inspect: `src/app/(storefront)/categories/[slug]/page.tsx`
- Does `generateStaticParams` query the DB? Does it return slugs? Is the production DB populated with category rows?
- Is the slug format in the URL matching what's in `categories.slug` column?
- Does the page render at runtime when `generateStaticParams` is bypassed? Try `export const dynamic = 'force-dynamic'` temporarily to isolate build-time vs runtime.
- Root cause determines fix: missing DB data → add categories via admin or migration; slug mismatch → fix slug; broken `generateStaticParams` → fix query.

---

**Fix 2 — Homepage vs `/shipments` data inconsistency**

Inspect: `src/app/(storefront)/shipments/page.tsx`, `src/components/storefront/ShipmentBanner.tsx`, `src/components/layout/TopBar.tsx`, `src/actions/shipments.ts`
- Is one of these still reading from `src/data/shipments.ts` instead of Supabase?
- Does the production DB have rows in the `shipments` table with `status = 'accepting'`?
- Do not run `seed.sql` on production. If production is missing shipment data, add shipments via the admin UI or a targeted migration.

---

**Fix 3 — `/search` and quote URL flow**

Inspect: `src/app/(storefront)/search/SearchResults.tsx`, `src/components/search/SearchField.tsx`
- Does the search page render a visible UI with a search box?
- Does text query return products from DB, or does it error/return empty?
- Does pasting `https://amazon.com/...` in the search field route to the quote request form?
- Fix what is broken. No new features here.

---

**Fix 4 — `/traveler` coming-soon confirmation**

Inspect: `src/app/(storefront)/traveler/page.tsx`
- Confirm it renders only a "Coming soon" placeholder. No code change needed if already correct — just document in summary.

---

**Fix 5 — Footer/policy link audit**

Inspect: `src/components/layout/SBDFooter.tsx`
- List every `href`. For each link pointing to a missing page, create a minimal static page.
- Target pages: `/terms`, `/refund-policy`, `/pre-order-policy`, `/pricing`, `/contact`, `/faq`, `/about`
- Content: plain text, one or two paragraphs of real policy text — no DB, no dynamic data
- Strongly prefer live static pages. Remove a link only if the page genuinely should not exist in v1.

---

**Fix 6 — DashSidebar sign out**

Inspect: `src/components/dashboard/DashSidebar.tsx` — the disabled div at lines 85–91
- Replace with: `<form action={signOut}><button type="submit" className="...">Sign out</button></form>`
- Import: `import { signOut } from "@/actions/auth"`
- Use the same visual classes as the disabled div, minus `cursor-not-allowed`, `select-none`, `opacity-40`
- Match the `AdminSidebar` form pattern exactly

---

**Fix 7 — DashSidebar real user name**

Inspect: `src/components/dashboard/DashSidebar.tsx` — hardcoded `"Nuzhat Ahmed"` / `"NA"` labels; `src/context/UserContext.tsx`
- Add `import { useUser } from "@/context/UserContext"`
- Derive name from `user?.name`; derive initials: first letter of first word + first letter of last word (or first two chars for single-word names)
- Show a neutral `?` initial when user is null/loading

---

**Fix 8 — SBDHeader and SBDHeaderMobile auth state**

Inspect: `src/components/layout/SBDHeader.tsx`, `src/components/layout/SBDHeaderMobile.tsx` — current auth slot (may be empty or static)
- Import `useUser` context
- When `user` exists: show initials avatar linking to `/dashboard`
- When `user` is null: show "Sign in" text link to `/login`
- Minimal change — do not redesign the header, just swap the auth slot

---

**Fix 9 — OTP email template runbook** (Supabase dashboard — no code change)

Steps to execute after this sub-phase ships:
1. Supabase dashboard → Authentication → Email Templates → "Magic Link"
2. Replace template body with:
```
Your SBD Global Shopping login code:

{{ .Token }}

This code expires in 60 minutes. If you did not request this, ignore this email.
```
3. Remove all `{{ .ConfirmationURL }}` references
4. Save

Document this step in the sub-phase summary so it is executed on the dashboard.

---

**Fix 10 — LoginClient magic-link fallback**

Inspect: `src/app/(auth)/login/LoginClient.tsx`
- On mount, check `window.location.search` for `?code=` or `?token_hash=` params
- If present: call `supabase.auth.exchangeCodeForSession(code)` (browser client from `@/lib/supabase/client`), then redirect to `searchParams.get('next') ?? '/dashboard'`
- Ensures users who click a magic link from an older email are logged in without manual code entry

---

**Files to inspect first:**
```
src/app/(storefront)/categories/[slug]/page.tsx
src/app/(storefront)/categories/[slug]/CategoryClient.tsx
src/app/(storefront)/shipments/page.tsx
src/components/storefront/ShipmentBanner.tsx
src/components/layout/TopBar.tsx
src/actions/shipments.ts
src/app/(storefront)/search/SearchResults.tsx
src/components/search/SearchField.tsx
src/app/(storefront)/traveler/page.tsx
src/components/layout/SBDFooter.tsx
src/components/dashboard/DashSidebar.tsx
src/components/layout/SBDHeader.tsx
src/components/layout/SBDHeaderMobile.tsx
src/app/(auth)/login/LoginClient.tsx
src/context/UserContext.tsx
```

**Acceptance criteria:**
- `/categories/beauty` (and all active category slugs) load without 404
- `/shipments` and homepage TopBar/ShipmentBanner show the same shipment data from production DB
- `/search` renders a usable search UI; text query returns DB products; URL paste routes to quote form
- `/traveler` is coming-soon only
- All footer links load a real page; no broken 404 links
- Customer can sign out from dashboard sidebar
- DashSidebar shows logged-in user's real name and initials
- SBDHeader/SBDHeaderMobile shows "Dashboard" when logged in, "Sign in" when logged out
- Clicking a magic link in an old email logs the user in without code entry
- `npm run lint` and `npm run build` clean

---

### Phase 3B — Address Management + Checkout Address Form

**Goal:** Checkout has a real address form. Customers can save and manage delivery addresses. Checkout uses saved addresses.

**Inspect first:**
```
src/app/(checkout)/checkout/page.tsx            ← current address section (hardcoded placeholder)
src/actions/orders.ts                           ← createOrder() signature — does it accept an address?
supabase/migrations/20260526000001_init.sql     ← addresses table schema
supabase/migrations/20260526000003_rls.sql      ← addresses RLS policies
```

**Part 1 — Real checkout address form:**
- Replace `addressPlaceholder` static text block with a controlled form: Full name, Street address, Area/Thana, City, Postal code
- Wire fields into `createOrder()` as a `deliveryAddress` object snapshotted into `orders.delivery_address` (JSONB)

**Part 2 — Saved addresses page (`/dashboard/addresses`):**
- List saved addresses with label, full address, default badge
- "Add new address" form (same fields as checkout)
- Edit and delete per address row
- "Set as default" action

**Part 3 — Checkout address selector:**
1. If customer has saved addresses: selectable tiles; default pre-selected
2. "Use a different address" expander → inline form → optional "Save for later" checkbox
3. If no saved addresses: show inline form directly
4. Address passed to `createOrder()` is always a JSONB snapshot — not a FK

**Server Actions — `src/actions/addresses.ts`:**
```ts
getAddresses()           ← customer's saved addresses, sorted default first
createAddress(input)     ← insert; if is_default, unset existing default first
updateAddress(id, input) ← edit
deleteAddress(id)        ← remove; if was default, promote next address
setDefaultAddress(id)    ← is_default = true on this row, false on all others
```
All guarded by `assertAuth()`. `is_default` logic enforced in the action.

**Files to create:**
```
src/app/(account)/dashboard/addresses/page.tsx
src/actions/addresses.ts
```

**Files to edit:**
```
src/components/dashboard/DashSidebar.tsx   ← add Addresses nav item
src/app/(checkout)/checkout/page.tsx       ← real form + address selector
src/actions/orders.ts                      ← createOrder() accepts deliveryAddress snapshot
```

**Acceptance criteria:**
- Checkout shows real address fields (no placeholder text)
- Customers with saved addresses see tile selector at checkout
- Customer can add, edit, delete, set default from `/dashboard/addresses`
- Placed orders have `delivery_address` as a JSON snapshot in DB
- RLS: user A cannot read or write user B's addresses
- `npm run lint` and `npm run build` clean

---

### Phase 3C — Account Settings

**Goal:** Customer can view and update their profile from a dedicated settings page.

**Inspect first:**
```
src/context/UserContext.tsx
src/types/user.ts
supabase/migrations/20260526000001_init.sql   ← users table columns
src/components/dashboard/DashSidebar.tsx      ← current Account settings entry
```

**New page: `/dashboard/settings`**
- Name: editable text input
- Phone: editable text input, no SMS verification (deferred to Phase 4)
- Email: read-only with note "To change your email, contact support"
- Danger zone: "Delete account" — shows a `mailto:` link to the support email (`ADMIN_EMAIL` env var); no automated deletion in v1

**Server Actions — `src/actions/profile.ts`:**
```ts
getProfile()                     ← read name + phone from public.users
updateProfile({ name, phone })   ← update public.users; guarded by assertAuth()
```

**Files to create:**
```
src/app/(account)/dashboard/settings/page.tsx
src/actions/profile.ts
```

**Files to edit:**
```
src/components/dashboard/DashSidebar.tsx   ← "Account settings" → /dashboard/settings; remove "Soon" chip
```

**Acceptance criteria:**
- Name change saves to `public.users`; DashSidebar reflects updated name on next page load
- Phone saves without any SMS trigger
- Email field is visually read-only
- "Account settings" nav item has no "Soon" chip and routes to `/dashboard/settings`
- `npm run lint` and `npm run build` clean

---

### Phase 3D — Search + Catalog Completeness

**Goal:** Category filters and product search are DB-driven. No hardcoded mock data visible on the public site. Admin catalog CRUD works end-to-end.

**Inspect before each change:**
```
src/app/(storefront)/categories/[slug]/page.tsx
src/app/(storefront)/categories/[slug]/CategoryClient.tsx
src/app/(storefront)/search/SearchResults.tsx
src/components/product/ReviewList.tsx
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/catalog/page.tsx
src/actions/admin/products.ts
```

**Category filters:**
- Verify whether current filters are client-side array ops or DB queries
- Fix: filters become URL search params (`?type=pre-order&min=5000&max=20000&source=usa`)
- Server Component reads params and applies `.eq()` / `.gte()` / `.lte()` clauses to Supabase query
- Active filters reflected in URL (shareable, back-button-safe)
- No client-side re-filtering on top of DB results

**Product search:**
- Text query: `.ilike('name', '%query%')` on `products` — acceptable for Phase 3; Algolia/Meilisearch upgrade in Phase 5
- URL paste detection and quote flow routing: unchanged
- Clear empty state when no results

**Product reviews:**
- Inspect `src/components/product/ReviewList.tsx` — hardcoded `mockReviews`
- Replace with empty state: "No reviews yet" / "Reviews will appear here after verified delivery"
- Do not add a `reviews` table or any DB queries for reviews in this phase

**Admin overview (`/admin`):**
- Currently redirects to `/admin/quotes` — replace with a real stats page
- Stats: pending quote count, open order count, total revenue (sum of `total_bdt` where `payment_status = 'paid'`), active shipment count
- All queries guarded by `assertAdmin()`

**Admin catalog QA:**
- Walk through: create product → upload image → verify URL stored in `products.images[]` → verify image renders on storefront PDP
- Fix any broken upload path, storage bucket config, or image rendering
- Variant management: only QA what the current `product_variants` schema already supports — do not add new tables or rework the schema

**Acceptance criteria:**
- Category filter changes update URL params and trigger a fresh DB query
- Text search returns matching products from DB (case-insensitive name match)
- URL paste in search routes to quote request form (unchanged)
- Product PDPs show "No reviews yet" empty state — no fake reviews
- `/admin` shows real KPI numbers from DB
- Admin can create a product with a Supabase Storage image that appears on storefront
- `npm run lint` and `npm run build` clean

---

*Payment integration (bKash, Nagad, SSLCommerz) is Phase 4A. See PHASES.md → Phase 4 for detail.*
