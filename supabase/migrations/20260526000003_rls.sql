-- ============================================================
-- SBD Global Shopping — Phase 2A
-- Migration 3: Row Level Security
-- Depends on: migration 1 (tables) + migration 2 (is_admin function)
-- ============================================================
-- Policy matrix from DATA_MODEL.md:
--   products/variants/shipments/milestones/breakdowns/categories:
--     anon read ✅  |  auth read ✅  |  auth write ❌  |  admin all ✅
--   users/addresses:
--     anon ❌  |  own read/write ✅  |  admin all ✅
--   orders/order_lines:
--     anon ❌  |  own read ✅  |  own insert ✅  |  admin all ✅
--   tracking_steps:
--     anon ❌  |  own read ✅  |  auth write ❌  |  admin all ✅
--   quotes:
--     anon ❌  |  own read ✅  |  own insert ✅  |  admin all ✅
-- ============================================================

-- ── Enable RLS on all tables ──────────────────────────────────────────────────
alter table public.categories          enable row level security;
alter table public.users               enable row level security;
alter table public.addresses           enable row level security;
alter table public.shipments           enable row level security;
alter table public.shipment_milestones enable row level security;
alter table public.shipment_breakdowns enable row level security;
alter table public.products            enable row level security;
alter table public.product_variants    enable row level security;
alter table public.quotes              enable row level security;
alter table public.orders              enable row level security;
alter table public.order_lines         enable row level security;
alter table public.tracking_steps      enable row level security;

-- ── categories ───────────────────────────────────────────────────────────────
create policy "categories_select_public"
  on public.categories for select
  using (true);

create policy "categories_all_admin"
  on public.categories for all
  using (public.is_admin());

-- ── shipments ────────────────────────────────────────────────────────────────
create policy "shipments_select_public"
  on public.shipments for select
  using (true);

create policy "shipments_all_admin"
  on public.shipments for all
  using (public.is_admin());

-- ── shipment_milestones ──────────────────────────────────────────────────────
create policy "shipment_milestones_select_public"
  on public.shipment_milestones for select
  using (true);

create policy "shipment_milestones_all_admin"
  on public.shipment_milestones for all
  using (public.is_admin());

-- ── shipment_breakdowns ──────────────────────────────────────────────────────
create policy "shipment_breakdowns_select_public"
  on public.shipment_breakdowns for select
  using (true);

create policy "shipment_breakdowns_all_admin"
  on public.shipment_breakdowns for all
  using (public.is_admin());

-- ── products ─────────────────────────────────────────────────────────────────
-- Anon and authenticated users see active products only.
-- Admin sees all (including is_active = false) via the "all_admin" policy.
create policy "products_select_active"
  on public.products for select
  using (is_active = true);

create policy "products_all_admin"
  on public.products for all
  using (public.is_admin());

-- ── product_variants ─────────────────────────────────────────────────────────
-- Visible only when parent product is active (avoids leaking soft-deleted variants).
create policy "product_variants_select_public"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products
      where id = product_variants.product_id and is_active = true
    )
  );

create policy "product_variants_all_admin"
  on public.product_variants for all
  using (public.is_admin());

-- ── users ────────────────────────────────────────────────────────────────────
-- Customers read/update their own row only.
-- handle_new_user() trigger runs as postgres superuser → bypasses RLS → can insert.
create policy "users_select_own"
  on public.users for select
  using (id = auth.uid() or public.is_admin());

create policy "users_update_own"
  on public.users for update
  using (id = auth.uid() or public.is_admin());

-- Permits direct insert by the row owner (fallback); trigger path bypasses RLS.
create policy "users_insert_own"
  on public.users for insert
  with check (id = auth.uid() or public.is_admin());

create policy "users_delete_admin"
  on public.users for delete
  using (public.is_admin());

-- ── addresses ────────────────────────────────────────────────────────────────
create policy "addresses_select_own"
  on public.addresses for select
  using (user_id = auth.uid() or public.is_admin());

create policy "addresses_insert_own"
  on public.addresses for insert
  with check (user_id = auth.uid() or public.is_admin());

create policy "addresses_update_own"
  on public.addresses for update
  using (user_id = auth.uid() or public.is_admin());

create policy "addresses_delete_own"
  on public.addresses for delete
  using (user_id = auth.uid() or public.is_admin());

-- ── orders ───────────────────────────────────────────────────────────────────
create policy "orders_select_own"
  on public.orders for select
  using (customer_id = auth.uid() or public.is_admin());

-- Customers may only insert orders for themselves.
create policy "orders_insert_own"
  on public.orders for insert
  with check (customer_id = auth.uid());

-- Only admin may update/delete orders (status changes, cancellations).
create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin());

create policy "orders_delete_admin"
  on public.orders for delete
  using (public.is_admin());

-- ── order_lines ──────────────────────────────────────────────────────────────
create policy "order_lines_select_own"
  on public.order_lines for select
  using (
    exists (
      select 1 from public.orders
      where id = order_lines.order_id
        and (customer_id = auth.uid() or public.is_admin())
    )
  );

-- Customer may insert lines for their own order (within createOrder() Server Action).
create policy "order_lines_insert_own"
  on public.order_lines for insert
  with check (
    exists (
      select 1 from public.orders
      where id = order_lines.order_id and customer_id = auth.uid()
    )
  );

create policy "order_lines_update_admin"
  on public.order_lines for update
  using (public.is_admin());

create policy "order_lines_delete_admin"
  on public.order_lines for delete
  using (public.is_admin());

-- ── tracking_steps ───────────────────────────────────────────────────────────
-- Customers read their own tracking steps; no customer write (admin + service role only).
-- createOrder() uses the service role key in the Server Action → bypasses RLS.
create policy "tracking_steps_select_own"
  on public.tracking_steps for select
  using (
    exists (
      select 1 from public.orders
      where id = tracking_steps.order_id
        and (customer_id = auth.uid() or public.is_admin())
    )
  );

create policy "tracking_steps_all_admin"
  on public.tracking_steps for all
  using (public.is_admin());

-- ── quotes ───────────────────────────────────────────────────────────────────
create policy "quotes_select_own"
  on public.quotes for select
  using (customer_id = auth.uid() or public.is_admin());

-- Customers submit quotes for themselves only.
create policy "quotes_insert_own"
  on public.quotes for insert
  with check (customer_id = auth.uid());

-- Only admin updates quotes (pricing, status changes).
create policy "quotes_update_admin"
  on public.quotes for update
  using (public.is_admin());

create policy "quotes_delete_admin"
  on public.quotes for delete
  using (public.is_admin());
