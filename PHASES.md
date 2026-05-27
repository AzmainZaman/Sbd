# Project Phases — SBD Global Shopping

---

## Phase 1 — Static Frontend ✅ Complete

**Goal:** Pixel-perfect implementation of every approved screen using mock data. No backend, no database, no auth, no real payments. Every page is navigable and interactive (drawer opens, filters toggle, tabs switch) but all data comes from `src/data/`.

Phase 1 is split into 9 sequential sub-phases. Each sub-phase must pass `npm run lint` and `npm run build` before the next begins.

| Sub-phase | Scope |
|---|---|
| **1A** ✅ | Scaffold, config (TypeScript/Tailwind/ESLint), CSS tokens, mock data, types, utilities |
| **1B** ✅ | UI primitives: Button, Chip, Icon, FlagBadge, Money, Star, ShipBar, QuantityInput |
| **1C** ✅ | Layout chrome: TopBar, Header, MobileHeader, Footer, CartDrawer, MobileBottomNav, CheckoutHeader, ChatWidget |
| **1D** ✅ | Storefront: Homepage, Category page, Product pages (in-stock + pre-order), Search (Variant A) |
| **1E** ✅ | Quote frontend: request form step 1 + step 2, quote thread (mock data) |
| **1F** ✅ | Cart and checkout frontend: CartDrawer, Checkout page, Order confirmation (mock data) |
| **1G** ✅ | Customer dashboard: Overview, Orders, Quotes, Tracking detail (mock data) |
| **1H** ✅ | Admin frontend: Quotes inbox, Orders, Shipments, Catalog (mock data, desktop-only) |
| **1I** ✅ | Public pages (Shipment schedule, Blog, Public tracking), loading/error/empty states, responsive QA, accessibility polish |

**Not in Phase 1:**
- Real API calls, database, authentication, payment gateway
- Supabase or any backend service
- Admin blog editor
- Traveler portal (placeholder page only)
- Full Bangla content (strings are i18n-structured from day one, English only)
- Deployment (comes after local review is complete)

---

## Phase 2 — Auth + Backend + Quote Flow ✅ Complete

**Deployed:** https://shob.ai (primary) · https://sbd-five.vercel.app (Vercel URL)
**Production Supabase project:** `jywdtdhkftrvcunqbcbd` (https://jywdtdhkftrvcunqbcbd.supabase.co)
**Email:** team@shob.ai via Resend (shob.ai verified domain)

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
| **2A** ✅ | SQL schema + RLS design | `supabase/migrations/*.sql`, RLS policies reviewed |
| **2B** ✅ | Supabase project + seed | Running DB, types generated, proxy wired |
| **2C** ✅ | Products/categories/shipments from DB | Storefront off mock data; admin CRUD + real images live |
| **2D** ✅ | Email OTP auth + protected routes | Login flow + session + route guards |
| **2E** ✅ | Cart persistence + order creation | Orders write to DB; confirmation real |
| **2F** ✅ | Quote lifecycle end-to-end | Submit → admin → accept → cart; Resend emails |
| **2G** ✅ | Admin guards + shipment CRUD | All admin actions server-side protected |
| **2H** ✅ | Public tracking (real DB) | `/track` real lookup + email verification |
| **2I** ✅ | Manual payment workflow + emails | COD live; all Resend triggers firing |
| **2J** ✅ | Deployment + production QA | Live on shob.ai; CI on GitHub |

**Known issue (Phase 3):** Supabase Magic Link email template sends both a clickable link and the 6-digit code. The `/login` UI expects code-only. Fix: remove `{{ .ConfirmationURL }}` from Supabase Auth → Email Templates → Magic Link, leaving only `{{ .Token }}`.

See `IMPLEMENTATION_PLAN.md` for full sub-phase detail.

---

## Phase 3 — Production Fixes + Customer Account Completion + Catalog Polish ✅ 3A Complete

**Goal:** Make the entire deployed site fully functional with no dead stubs, broken routes, or missing data. Give customers complete account management. Polish search and admin catalog. Payment gateway integration deferred to Phase 4 (API credentials collected then).

**SMS OTP, SMS notifications, and payment gateways deferred to Phase 4.**

**Sub-phase protocol:** For each sub-phase — inspect first, identify root cause, implement only the approved scope, run `npm run lint` and `npm run build`, summarize files changed + DB rows changed + QA result, then stop for approval.

| Sub-phase | Scope | Key output |
|---|---|---|
| **3A** ✅ | Production blocker fixes + auth polish | All dead routes fixed; sign out works; real user name; auth state in header; OTP email code-only |
| **3B** ✅ | Address management + checkout address form | Real address form at checkout; saved addresses CRUD; checkout address selector |
| **3C** ✅ | Account settings | `/dashboard/settings`: edit name + phone; email display; remove "Soon" chip |
| **3D** | Search + catalog completeness | DB-backed category filters; real product search; empty-state reviews; admin stats + CRUD QA |

See `IMPLEMENTATION_PLAN.md` for full sub-phase detail.

### Phase 3A — Production Blocker Fixes + Auth Polish ✅ Complete

**Goal:** Every broken or dead route fixed on production. Every disabled auth stub wired up. Zero placeholder content visible to real users.

**Investigate before editing each item. Root cause first.**

**1. `/categories/beauty` 404**
Investigate: Is the slug missing from production DB? Is `generateStaticParams` returning no slugs? Is the route config wrong? Is the DB query failing silently? Fix whichever layer is broken — do not add workarounds that mask the root cause.

**2. Homepage vs `/shipments` data inconsistency**
Homepage TopBar/ShipmentBanner shows active shipment data, but `/shipments` shows no shipments (or different data). Investigate: are they reading from the same Supabase query? Is one still reading from `src/data/`? Is `seed.sql` data in production when it shouldn't be? Make both read from the same production DB source. Do not run `seed.sql` on production.

**3. `/search` and quote URL flow**
Verify: does the search page render a usable search UI? Does text search return products from DB? Does pasting a URL route correctly to the quote request form? Fix whatever is broken. No new features — just verify and fix.

**4. `/traveler` is coming-soon only**
Confirm the traveler portal page is only a "Coming soon" placeholder. Traveler portal is Phase 4 — nothing live.

**5. Footer/policy link audit**
Audit every footer link. For links pointing to missing pages (`/terms`, `/refund-policy`, `/pre-order-policy`, `/pricing`, `/contact`, `/faq`, `/about`): implement basic static pages (plain text, no DB). Strongly prefer live static pages over removing links — missing pages erode trust. Remove a link only if it genuinely should not exist in v1.

**6. DashSidebar sign out**
Replace the disabled `<div>` with `<form action={signOut}><button type="submit">Sign out</button></form>`. Same pattern as `AdminSidebar`. Files: `src/components/dashboard/DashSidebar.tsx`, import `signOut` from `@/actions/auth`.

**7. DashSidebar real user name**
Import `useUser` context. Replace hardcoded `"Nuzhat Ahmed"` / `"NA"` with `user?.name` and initials derived from name. Show a neutral placeholder (e.g. empty avatar) while loading.

**8. SBDHeader and SBDHeaderMobile auth state**
When a session exists: show avatar/name chip linking to `/dashboard`. When logged out: show "Sign in" linking to `/login`. Read session state from `useUser()` context. Files: `src/components/layout/SBDHeader.tsx`, `src/components/layout/SBDHeaderMobile.tsx`.

**9. OTP email template runbook** (manual Supabase dashboard step)
Document exact steps: Auth → Email Templates → "Magic Link" → replace template body with `{{ .Token }}`-only version (no `{{ .ConfirmationURL }}`). This is not a code change — document in sub-phase summary so it can be executed on the dashboard.

**10. LoginClient magic-link fallback**
On mount, detect `?code=` or `?token_hash=` query param. Call `supabase.auth.exchangeCodeForSession(code)` and redirect to `?next` (default `/dashboard`) without requiring manual code entry. This keeps older magic-link emails working during the template transition. File: `src/app/(auth)/login/LoginClient.tsx`.

**Files to inspect first:**
```
src/app/(storefront)/categories/[slug]/page.tsx        ← generateStaticParams, DB query
src/app/(storefront)/shipments/page.tsx                ← how it fetches shipments
src/components/storefront/ShipmentBanner.tsx           ← how banner fetches shipments
src/components/layout/TopBar.tsx                       ← how TopBar fetches cutoff
src/app/(storefront)/search/SearchResults.tsx          ← search implementation
src/app/(storefront)/traveler/page.tsx                 ← confirm it's a stub
src/components/layout/SBDFooter.tsx                    ← all footer links
src/components/dashboard/DashSidebar.tsx
src/components/layout/SBDHeader.tsx
src/components/layout/SBDHeaderMobile.tsx
src/app/(auth)/login/LoginClient.tsx
```

**Acceptance criteria:**
- `/categories/beauty` loads product grid without 404
- `/shipments` and homepage TopBar/ShipmentBanner show the same shipment data from production DB
- `/search` renders search UI; text query returns DB results; URL paste routes to quote form
- `/traveler` shows coming-soon only; no real portal content
- All footer links either load a real page or are removed; no broken 404 footer links
- Customer can sign out from dashboard sidebar on desktop
- DashSidebar shows logged-in user's real name and initials
- SBDHeader/SBDHeaderMobile shows correct auth state (Dashboard link when logged in, Sign in when logged out)
- Clicking a magic link in an old email still logs the user in without requiring code entry
- `npm run lint` and `npm run build` clean

---

### Phase 3B — Address Management + Checkout Address Form ✅ Complete

**Goal:** Checkout has a real, usable address form. Customers can save and manage delivery addresses.

**Part 1 — Real checkout address form** (previously in 3A, moved here because it depends on the address data model):
- Replace `addressPlaceholder` hardcoded text block in `src/app/(checkout)/checkout/page.tsx` with a real form: Full name, Street address, Area/Thana, City, Postal code
- Pass structured address object to `createOrder()` as `delivery_address` JSON snapshot

**Part 2 — Saved addresses page:**
- `/dashboard/addresses` — list saved addresses; add new; edit; delete; mark default

**Part 3 — Checkout address selector:**
1. Fetch customer's saved addresses on checkout load
2. Show as selectable tiles; default address pre-selected
3. "Use a different address" expander → inline form → optional "Save for later" checkbox
4. Selected/entered address is snapshotted into `orders.delivery_address` (JSONB) — not a FK, so the order record is immutable even if the saved address is later changed or deleted

**Server Actions:**
```
src/actions/addresses.ts
  getAddresses()         ← customer's saved addresses
  createAddress()        ← insert into addresses table
  updateAddress()        ← edit fields
  deleteAddress()        ← remove
  setDefaultAddress()    ← set is_default = true, others false
```

**Files to create/edit:**
```
src/app/(account)/dashboard/addresses/page.tsx   ← new page
src/actions/addresses.ts                         ← new file
src/components/dashboard/DashSidebar.tsx         ← add Addresses nav item
src/app/(checkout)/checkout/page.tsx             ← real address form + selector
src/actions/orders.ts                            ← createOrder() accepts address snapshot
```

**RLS:** `addresses` table already has customer-scoped RLS from Phase 2A. Verify policies before writing actions.

**Acceptance criteria:**
- Checkout shows real address fields (not placeholder text)
- Customers with saved addresses see tiles; selecting one populates the form
- Customer can add, edit, delete, set default from `/dashboard/addresses`
- Order row in DB has `delivery_address` as a JSON snapshot, not a FK
- RLS spot-check: user A cannot read user B's addresses
- `npm run lint` and `npm run build` clean

---

### Phase 3C — Account Settings ✅ Complete

**Goal:** Customer can view and update their profile.

**New page:** `/dashboard/settings`
- Name: editable text field
- Phone: editable, no SMS verification yet (deferred to Phase 4)
- Email: read-only with a note ("To change your email, contact support")
- Danger zone: "Delete account" — shows a mailto link to the support email in v1; no automated deletion

**Server Actions:**
```
src/actions/profile.ts
  updateProfile(name, phone)   ← updates public.users row
  getProfile()                 ← read current name + phone
```

**Files to create/edit:**
```
src/app/(account)/dashboard/settings/page.tsx   ← new page
src/actions/profile.ts                          ← new file
src/components/dashboard/DashSidebar.tsx        ← "Account settings" → /dashboard/settings; remove "Soon" chip
```

**Acceptance criteria:**
- Name change saves to `public.users` and reflects in DashSidebar on next load
- Phone field accepts and saves a number without triggering any verification
- Email field is visually read-only
- "Account settings" in DashSidebar has no "Soon" chip and navigates to `/dashboard/settings`
- `npm run lint` and `npm run build` clean

---

### Phase 3D — Search + Catalog Completeness

**Goal:** Category filters and product search hit the real DB. Admin catalog CRUD is fully end-to-end. No mock/hardcoded data visible on the public site.

**Inspect before editing each item.**

**Category filters** (`src/app/(storefront)/categories/[slug]/CategoryClient.tsx` or the server page):
- Filters (in-stock/pre-order, price range, source country) become URL search params (`?type=pre-order&min=5000&max=20000&source=usa`)
- Server Component reads params and applies `.eq()` / `.gte()` / `.lte()` clauses to the Supabase query — no client-side array filtering
- Active filters reflected in URL so they are shareable and back-button-safe

**Product search** (`src/app/(storefront)/search/SearchResults.tsx`):
- Text query hits `products` table: `.ilike('name', '%query%')` is acceptable for Phase 3 (Algolia/Meilisearch upgrade in Phase 5)
- URL paste detection and quote flow routing: unchanged
- Show clear empty state when no results

**Product reviews** (`src/components/product/ReviewList.tsx`):
- Replace `mockReviews` hardcode with an empty state: "No reviews yet" — review submission is Phase 4
- Do not introduce any DB `reviews` table or queries

**Admin overview** (`src/app/(admin)/admin/page.tsx`):
- Currently just redirects to `/admin/quotes` — replace with a real stats page showing: pending quote count, open order count, total revenue (sum of `orders.total_bdt` where `payment_status = 'paid'`), active shipment count
- Read from DB with `assertAdmin()`

**Admin catalog QA** (`src/app/(admin)/admin/catalog/page.tsx`):
- Walk through: create product → add image via Supabase Storage upload → verify image appears on storefront PDP
- Fix any broken paths (upload URL, image rendering, slug generation)
- Variant management: only if the current `product_variants` schema already cleanly supports it — do not add new tables or rework the schema for variant inventory management in this phase

**Acceptance criteria:**
- Category filter changes update the URL and trigger a fresh DB query; results reflect applied filters
- Searching "dyson" (or any real product name in DB) returns matching products (case-insensitive)
- URL paste in search routes to quote request form (unchanged)
- Product detail pages show "No reviews yet" instead of fake reviews
- `/admin` shows real KPI numbers pulled from DB
- Admin can create a product with a Supabase Storage image; that image appears on the storefront PDP
- `npm run lint` and `npm run build` clean

---

## Phase 4 — Payments + Traveler Portal + Advanced Features

**In scope:**

### Payment integration (4A)
- bKash Payment Gateway redirect flow + IPN webhook
- Nagad redirect flow + IPN webhook
- SSLCommerz for card payments + IPN webhook
- Payment status auto-updates on webhook received; receipt email
- Webhook handlers in `app/api/webhooks/` (the one exception to "no `app/api/` route handlers")
- New env vars: `BKASH_APP_KEY/SECRET/USERNAME/PASSWORD`, `NAGAD_MERCHANT_ID/KEYS`, `SSLCOMMERZ_STORE_ID/PASS`

### Traveler portal + advanced features (4B+)
- **SMS OTP auth** — phone number login + SMS verification (Twilio or local Bangladesh SMS provider)
- **SMS notifications** — order placed, shipped, delivered
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
