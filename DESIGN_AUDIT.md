# Design-to-Development Audit — SBD Global Shopping

Source: Claude Design handoff bundle `sbd-20` (9 component files + chat transcript).  
Audit date: 2026-05-25.  
Decisions applied: see `PROJECT_BRIEF.md` for all v1 scope decisions.

---

## Design Token Reference

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#c8472b` | Pre-order CTAs, quote actions, active chips |
| `--accent-soft` | `#fbeae4` | Quote card backgrounds, form highlights |
| `--ink` | `#0e0e0c` | Primary text, dark buttons |
| `--ink-2` | (slightly lighter near-black) | Secondary text |
| `--muted` | `#6b6a64` | Labels, captions, helper text |
| `--bg` | `#faf8f4` | Page background |
| `--paper` | `#ffffff` | Card surfaces |
| `--line` | `#e8e4dc` | Borders, dividers |
| `--ok` | `#1f8a5b` | In-stock indicators, success states |
| `--warn` | `#b45309` | Age/urgency indicators |
| `--font-sans` | Geist (default) | All body/heading text |
| `--font-mono` | Geist Mono (default) | Order IDs, dates, tracking numbers |

---

## What Is Complete (Designed)

| # | Section | Artboards |
|---|---|---|
| 01 | Foundations | Brand mark, type scale, color tokens, buttons/chips/inputs |
| 02 | Storefront | Homepage desktop + mobile, Category desktop + mobile |
| 03 | Search / Pre-order | Variant A (auto-detect), B (tab), C (CTA), Quote form, Quote thread |
| 04 | Product page | Desktop A (in-stock), Desktop B (pre-order + ETA), Mobile |
| 05 | Checkout | Single-col, two-col, mobile, order confirmation |
| 06 | Customer dashboard | Overview A (sidebar), Overview B (timeline), Orders, Quotes, Tracking, Mobile |
| 07 | Traveler portal | Landing, dashboard, mobile — **deferred to Phase 2** |
| 08 | Admin panel | Quote inbox + compose pane, Shipments + calendar, Orders, Catalog |
| 09 | Content | Shipment schedule, Blog index, Blog article |

---

## What Is Missing (Requires Design or v2 Decision)

### Pages with no designs (nav/footer links orphaned)
- Login / OTP verification (Phase 2 — required before checkout)
- Registration flow
- Cart page (using drawer in v1 instead)
- Search results page
- Order detail page (dashboard orders list → "View" button)
- Quote detail page
- Account settings (profile, password, phone, notifications)
- Address management
- Payment methods management
- Saved items page
- Traveler sign-up / onboarding (Phase 2)
- Traveler profile page (Phase 2)
- Traveler earnings page (Phase 2)
- Admin: Dashboard overview (nav item only)
- Admin: Customers (deferred)
- Admin: Travelers (deferred)
- Admin: Blog editor (deferred)
- Admin: Settings (deferred)
- Terms & Conditions page
- Pre-order Policy page
- Refund / Returns policy page
- FAQ page
- About SBD page
- Contact page
- Pricing & duties page
- 404 / Error page

### States not designed
**Loading:** Skeleton screens for product grid, quote calculation, payment processing, search.  
**Empty:** Empty cart drawer, zero orders (new user), zero quotes, no search results, admin zero-queue.  
**Error:** Invalid/unsupported URL, payment declined, form validation, network errors.  
**Success (beyond order confirmation):** Quote submitted, newsletter subscribed, address saved.

---

## Inconsistencies to Resolve in Implementation

### 1. Checkout T&C text — RESOLVED
Use this canonical text across all layouts:  
*"I agree to the Terms & Conditions, the Pre-order Policy (custom quotes are non-refundable once shipping begins), and the Refund Policy."*

### 2. Checkout section numbering — RESOLVED
Use two-column layout as canonical desktop checkout. Single-column for mobile.  
Sections: 1 · Contact & delivery · 2 · Shipping & ETA · 3 · Payment · 4 · Confirm

### 3. Duty display — RESOLVED
Duty and handling is always a **separate line item** in the order summary.  
Remove all copy from PDPs that says "duty included in price."

### 4. Deposit CTA — RESOLVED
Remove "Pay 30% deposit" secondary button from PDP B in v1. Only the full-price pre-order CTA is shown.

### 5. Dashboard layout — RESOLVED
Sidebar layout (Overview A) is canonical for desktop. Top-nav layout (Overview B) is not shipped.

### 6. Mobile bottom nav — RESOLVED
One canonical configuration: **Shop · Categories · Quote · Orders · Account** (5 items).

### 7. Promo code — RESOLVED
Remove all promo code display from v1 checkout until input field + backend logic exists.

### 8. Button color rule
- `btn-primary` (near-black): transactional actions — "Pay", "Add to cart", "Submit"
- `btn-accent` (vermillion): pre-order / quote actions — "Pre-order", "Request quote", "Accept quote"
- `btn-ghost`: secondary / destructive — "Cancel", "Decline", "Continue shopping"

### 9. ETA chip text — RESOLVED
Use consistent format: `Pre-order · ETA {date}` everywhere (product cards, PDP chip, dashboard).

### 10. Breadcrumb — RESOLVED
Use `Breadcrumb` component on all desktop product and category pages. Not shown on mobile.

### 11. Admin sidebar color
Standardize on `#0e0e0c` (same as `--ink`) across admin sidebar and footer.

### 12. Shipment data scope
Only USA (`#14`, `#15`) and UK (`#14-UK`, `#15-UK`) shipments are active in v1.  
EU/CN/AU/UAE appear in UI (country strip, traveler routes) but have no shipment records.

---

## Mobile Responsiveness Decisions

- **Breakpoints:** 390px mobile, 1280px desktop. No tablet breakpoint in v1 — graceful degradation acceptable.
- **Category filters:** Mobile "Filters · 2" button opens a **filter drawer** (bottom sheet). Drawer is not designed — needs to be created during implementation.
- **Dashboard:** Sidebar layout collapses to the mobile overview on <768px. Sub-pages (Orders, Quotes, Tracking) use a simple stacked card layout on mobile.
- **Admin:** Desktop-only in v1. Add a warning banner on small screens: "Admin panel is optimised for desktop."
- **Blog article:** Max-width 760px reflows naturally to mobile — no special treatment needed.
- **Shipment schedule cards:** 2-column grid stacks to 1-column below 640px.

---

## Assumptions Locked In for v1

1. Cart is a slide-in drawer. No `/cart` page unless technically forced.
2. Auth is required before quote submission and checkout (email OTP in Phase 2; phone/SMS OTP in Phase 3).
3. Guest checkout is not supported.
4. Search Variant A (auto-detect URL) is the only header pattern implemented.
5. Duty is always a checkout line item.
6. 30% deposit CTA is hidden.
7. Promo code field and display are hidden.
8. COD available for in-stock only.
9. Traveler portal is fully deferred to Phase 2.
10. Bangla toggle is wired up but shows English content only (strings i18n-ready).
11. Blog is read-only. No admin editor in v1.
12. WhatsApp support is a direct link to `+8801711000000` — no automation.
13. Multi-origin cart allowed; checkout ETA groups items by shipment.
14. Step 2 of quote request form = confirmation screen (review + submit) — to be designed during implementation.
