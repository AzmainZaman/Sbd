# CLAUDE.md — SBD Global Shopping

This is a pre-order e-commerce platform for SBD Global Shopping (sbd.com.bd), targeting Bangladesh.
**Phase 2 complete and deployed:** https://shob.ai · https://sbd-five.vercel.app
Read `PROJECT_BRIEF.md`, `DESIGN_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, `DATA_MODEL.md`, and `PHASES.md` before starting any work.

---

## Stack

### Phase 1 (complete)
- **Next.js 16.2.6** (App Router, TypeScript) — scaffolded with `create-next-app@latest` 2026-05-25
- **Tailwind CSS v4** — no `tailwind.config.ts`; all token extensions in `globals.css @theme inline`
- **Custom components only** — no shadcn/ui, no MUI, no Chakra
- **React Context** for cart state — `localStorage` persistence added in Phase 2
- Phase 1 data: `src/data/` mock files (seed-only after Phase 2C migrates each entity to DB)

### Phase 2 (complete)
- **Supabase** (`supabase-js`, `@supabase/ssr`) — PostgreSQL database, Auth (email OTP), Storage (product images), Row Level Security
- **Resend** — transactional email: quote sent, order confirmation, delivery notification (from address: team@shob.ai)
- **Next.js Server Actions** — all form mutations; no separate REST API routes (`app/api/`)
- **No ORM** — Supabase client is the sole data access layer; do not introduce Prisma or any ORM without explicit discussion
- **`src/proxy.ts`** — session refresh proxy + route guards (Next.js 16 uses `proxy`, not `middleware`)
- **Production Supabase project:** `jywdtdhkftrvcunqbcbd`

---

## Design System Rules

### Always use CSS custom properties for colors — never hardcode hex values in components
```tsx
// ✅ correct
style={{ color: "var(--accent)" }}
className="text-[var(--accent)]"

// ❌ wrong
style={{ color: "#c8472b" }}
```

### Design token reference
| Token | Value | Use for |
|---|---|---|
| `--accent` | `#c8472b` | Pre-order / quote CTAs, active chips |
| `--accent-soft` | `#fbeae4` | Quote highlights, form tints |
| `--ink` | `#0e0e0c` | Primary text, dark buttons |
| `--muted` | `#6b6a64` | Labels, captions, helper text |
| `--bg` | `#faf8f4` | Page background |
| `--paper` | `#ffffff` | Card surfaces |
| `--line` | `#e8e4dc` | Borders, dividers |
| `--ok` | `#1f8a5b` | In-stock, success |
| `--warn` | `#b45309` | Urgency, warnings |

### Button variants (use `Button` component from `src/components/ui/Button.tsx`)
- `variant="primary"` → near-black background — for "Add to cart", "Pay", "Submit"
- `variant="accent"` → vermillion — for "Pre-order", "Request quote", "Accept quote"
- `variant="ghost"` → outlined — for secondary/destructive actions

### Chip variants (use `Chip` component)
- `variant="stock"` — green dot · "In stock"
- `variant="pre"` — accent text · "Pre-order · ETA 28 May"
- `variant="accent"` — accent background · "New quote"
- `variant="line"` — outlined · country filters, neutral labels
- `variant="dark"` — near-black · "Shipment #14"

---

## Typography Rules

Use `font-sans` (Geist) for body. Use `font-mono` (Geist Mono) for:
- Order IDs: `SBD-2026-04812`
- Dates and ETAs: `28 MAY 2026`
- Tracking numbers
- Shipment numbers: `SHIPMENT #14`
- Price sub-labels: `$49.98`

Heading sizes:
- Display: `text-[56px]` / `text-[64px]` · weight 600 · tracking tight
- H1 page: `text-[32px]`–`text-[48px]` · weight 600
- H2 section: `text-[28px]`–`text-[36px]` · weight 600
- Body: `text-[14px]`–`text-[16px]` · leading relaxed

---

## File Conventions

- Route groups: `(storefront)`, `(checkout)`, `(account)`, `(admin)`, `(auth)` — group without URL segment
- All client-only pages/components get `"use client"` at top
- Server components are the default — avoid `"use client"` unless strictly needed (event handlers, browser APIs)
- Mock data lives in `src/data/` — seed-only from Phase 2; never inline data in components
- Types live in `src/types/` — import from there, never re-declare inline
- `src/types/database.ts` — Supabase-generated types; **never edit manually** (regenerate with `supabase gen types typescript --linked`)
- `src/lib/supabase/server.ts` — `createClient()` for Server Components and Server Actions
- `src/lib/supabase/client.ts` — `createBrowserClient()` for Client Components
- `src/actions/` — all Server Actions (mutations); grouped by domain (`orders.ts`, `quotes.ts`, `auth.ts`, `admin/products.ts`, …)
- `src/lib/auth-guard.ts` — `assertAdmin()` and `assertAuth()` helpers; call at the top of every protected Server Action
- `supabase/migrations/` — SQL migration files; committed to git; never edit applied migrations
- `supabase/seed.sql` — INSERT statements for dev/staging seed data

---

## v1 Scope Constraints (do not implement without discussion)

| Feature | Status |
|---|---|
| Guest checkout | ❌ Not in v1 |
| Email OTP auth | ✅ Phase 2 |
| Phone / SMS OTP auth | Phase 3 |
| Real payment (bKash/Nagad/card) | Phase 3 |
| 30% deposit CTA | ❌ Hidden in v1 |
| Promo code input + display | ❌ Hidden in v1 |
| Real product images | ✅ Phase 2C (Supabase Storage) |
| Traveler portal | Phase 4 |
| Bangla language content | Phase 4 |
| Admin blog editor | Phase 4 |
| COD for pre-orders | ❌ In-stock only |
| Duty "included in price" copy | ❌ Always show as line item |

---

## Component Patterns

### Always use `next/link` for internal navigation (never `<a href="...">`)
### Always use `next/image` for product images (Phase 2C+); gradient fallback via `product.hero` until then
### All visible strings should be assigned to a const — prep for i18n (Phase 4)

```tsx
// ✅ i18n-ready
const labels = {
  inStock: "In stock",
  preOrder: "Pre-order",
  addToCart: "Add to cart",
};

// ❌ not i18n-ready
<button>Add to cart</button>
```

---

## Cart Context Usage

```tsx
import { useCart } from "@/context/CartContext";

const { items, addItem, removeItem, updateQty, isOpen, openCart, closeCart, clearItems } = useCart();
```

Phase 1: React state only. Phase 2+: cart persists to `localStorage`; restored on mount. No `carts` table — cart lives client-side until `createOrder()` is called at checkout.

---

## Supabase Client Usage (Phase 2+)

**Server Components and Server Actions** — always use `createClient()` from `src/lib/supabase/server.ts`:
```ts
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data, error } = await supabase.from('products').select('*, product_variants(*)').eq('is_active', true)
```

**Client Components** — use `createBrowserClient()` from `src/lib/supabase/client.ts`:
```ts
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

**Never** call `createServerClient` from a Client Component or `createBrowserClient` from a Server Component.

---

## Auth Usage (Phase 2+)

**Get current user in a Server Component or Action:**
```ts
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

**Protected Server Actions** — always guard with `assertAuth()` or `assertAdmin()`:
```ts
import { assertAdmin } from '@/lib/auth-guard'

export async function sendQuote(quoteId: string, pricing: QuotePricing) {
  await assertAdmin()
  // ...
}
```

**Login flow (email OTP):**
1. `sendOtp(email)` → `supabase.auth.signInWithOtp({ email })`
2. `verifyOtp(email, token)` → `supabase.auth.verifyOtp({ email, token, type: 'email' })`
3. `@supabase/ssr` sets the session cookie automatically

---

## Server Actions Pattern (Phase 2+)

All mutations go through Server Actions in `src/actions/`. No `app/api/` route handlers unless receiving a third-party webhook.

```ts
// src/actions/quotes.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { assertAuth } from '@/lib/auth-guard'

export async function createQuote(input: QuoteInput) {
  const user = await assertAuth()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('quotes')
    .insert({ ...input, customer_id: user.id, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}
```

---

## Shipment Utilities

Use helpers from `lib/shipment-utils.ts`:
- `getNextCutoff()` — returns the soonest open shipment and ms until cutoff (reads from DB in Phase 2)
- `formatCountdown(ms)` — formats as "4d 22h"

---

## Admin Panel

- Admin routes are under `/admin/...` (route group `(admin)`)
- `/admin/*` requires `role = admin` in `public.users` — enforced by `assertAdmin()` in every admin Server Action and by `src/proxy.ts` route guard
- Dark sidebar uses `#0e0e0c` (same as `--ink`) — not a separate dark token
- Admin is desktop-only in v1; show a banner on mobile: "Admin panel is optimised for desktop (768px+)"

---

## What NOT to Do

- Do not add promo/coupon code fields anywhere in v1
- Do not add a "Pay 30% deposit" button anywhere in v1
- Do not add the Traveler portal pages — only a "Coming soon" placeholder at `/traveler`
- Do not add Bangla content translation — keep string structure i18n-ready but render English
- Do not copy the internal JSX structure from the design prototype — recreate from visual output
- Do not use `--no-verify` to skip git hooks
- Do not commit `.env.local` or any file containing credentials or API keys
- Do not introduce Prisma, Drizzle, or any ORM — use the Supabase client directly
- Do not write mutations in `app/api/` route handlers — use Server Actions in `src/actions/`
- Do not edit `src/types/database.ts` manually — regenerate it with `supabase gen types typescript --linked`
- Do not apply migrations by hand in the Supabase dashboard — write a migration file and run `supabase db push`
- Do not bypass RLS by using the service role key in client-side code — service role key is server/action only
