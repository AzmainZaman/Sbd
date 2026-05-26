-- ============================================================
-- SBD Global Shopping — Phase 2A
-- Migration 2: SQL functions and triggers
-- (must run before RLS policies in migration 3)
-- ============================================================

-- ── is_admin() ───────────────────────────────────────────────────────────────
-- Used in every RLS policy that gates admin access.
-- SECURITY DEFINER so it can read public.users regardless of caller RLS context.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── handle_new_user() ────────────────────────────────────────────────────────
-- Fires after every new auth.users insert (email OTP signup).
-- Creates the matching public.users row so the app always has a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'Customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── set_updated_at() ─────────────────────────────────────────────────────────
-- Generic trigger function to keep updated_at current on any table.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_shipments_updated_at
  before update on public.shipments
  for each row execute procedure public.set_updated_at();

create trigger trg_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create trigger trg_quotes_updated_at
  before update on public.quotes
  for each row execute procedure public.set_updated_at();
