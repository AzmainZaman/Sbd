-- ============================================================
-- SBD Global Shopping — Phase 2A
-- Migration 1: Table definitions
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Categories ───────────────────────────────────────────────────────────────
create table public.categories (
  slug          text primary key check (slug in ('electronics','beauty','fashion','supplements','home','kids','other')),
  label         text not null,
  hero_gradient text not null default ''
);

-- ── Users ────────────────────────────────────────────────────────────────────
-- id mirrors auth.users.id; created by handle_new_user() trigger on signup
create table public.users (
  id                 uuid primary key references auth.users(id) on delete cascade,
  name               text not null default 'Customer',
  email              text not null unique,
  phone              text,
  default_address_id uuid,               -- FK to addresses added below
  member_tier        text not null default 'standard'
                       check (member_tier in ('standard','silver','gold')),
  points             integer not null default 0,
  joined_at          timestamptz not null default now(),
  role               text not null default 'customer'
                       check (role in ('customer','admin'))
);

-- ── Addresses ────────────────────────────────────────────────────────────────
create table public.addresses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  label          text,
  street_address text not null,
  apt            text,
  area           text not null,
  city           text not null,
  postal_code    text not null,
  landmark       text
);

-- Wire the self-referential FK now that addresses exists
alter table public.users
  add constraint fk_users_default_address
    foreign key (default_address_id)
    references public.addresses(id)
    on delete set null;

-- ── Shipments ────────────────────────────────────────────────────────────────
create table public.shipments (
  id              text primary key,          -- e.g. "14", "14-uk"
  number          integer not null,
  route           text not null,             -- "USA → DAC"
  origin_country  text not null
                    check (origin_country in ('US','UK','EU','CN','AU','AE','BD')),
  cutoff_date     timestamptz not null,
  liftoff_date    date not null,
  landing_date    date not null,
  status          text not null
                    check (status in ('accepting','cutoff','outbound','in-transit','customs','delivery','delivered')),
  item_count      integer not null default 0,
  total_value_bdt bigint not null default 0,
  customer_note   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.shipment_milestones (
  id           uuid primary key default gen_random_uuid(),
  shipment_id  text not null references public.shipments(id) on delete cascade,
  label        text not null,
  completed_at timestamptz,
  position     integer not null default 0   -- display order
);

create table public.shipment_breakdowns (
  id          uuid primary key default gen_random_uuid(),
  shipment_id text not null references public.shipments(id) on delete cascade,
  category    text not null,
  item_count  integer not null,
  value_bdt   bigint not null
);

-- ── Products ─────────────────────────────────────────────────────────────────
create table public.products (
  id              text primary key,           -- e.g. "sbd-prd-001"
  slug            text not null unique,
  name            text not null,
  brand           text not null,
  category        text not null references public.categories(slug),
  origin_country  text not null
                    check (origin_country in ('US','UK','EU','CN','AU','AE','BD')),
  source_url      text,
  source_retailer text,
  price_bdt       integer not null,
  price_usd       numeric(10,2),
  images          text[] not null default '{}',  -- Supabase Storage URLs (empty until Phase 2C)
  description     text not null,
  ingredients     text,
  status          text not null
                    check (status in ('in-stock','pre-order','out-of-stock')),
  stock           integer,                    -- null for pre-order
  shipment_id     text references public.shipments(id) on delete set null,
  eta             date,
  hero            text not null default '',   -- CSS gradient fallback
  rating          numeric(3,2) not null default 0,
  review_count    integer not null default 0,
  tags            text[] not null default '{}',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  name        text not null,
  price_delta integer,                        -- BDT difference from base price
  available   boolean not null default true
);

-- ── Quotes ───────────────────────────────────────────────────────────────────
create table public.quotes (
  id                    text primary key,     -- e.g. "QR-2026-08412"
  customer_id           uuid not null references public.users(id) on delete restrict,
  customer_name         text not null,
  customer_phone        text,
  requested_at          timestamptz not null default now(),
  source_url            text not null,
  source_retailer       text not null,
  origin_country        text not null
                          check (origin_country in ('US','UK','EU','CN','AU','AE','BD')),
  product_name          text not null,
  product_variant       text,
  quantity              integer not null default 1,
  notes                 text,
  preferred_shipment_id text references public.shipments(id) on delete set null,
  budget_ceiling_bdt    integer,
  status                text not null
                          check (status in ('pending','quote-sent','customer-replied','accepted','declined','expired')),
  expires_at            timestamptz,
  -- Pricing (populated by admin when sending quote)
  item_price_bdt        integer,
  duty_bdt              integer,
  inbound_shipping_bdt  integer,
  handling_bdt          integer,
  total_bdt             integer,
  shipment_id           text references public.shipments(id) on delete set null,
  eta                   date,
  admin_note            text,
  margin_pct            numeric(5,2),         -- internal; never exposed to customer
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ── Orders ───────────────────────────────────────────────────────────────────
create table public.orders (
  id                  text primary key,       -- e.g. "SBD-2026-04812"
  customer_id         uuid not null references public.users(id) on delete restrict,
  placed_at           timestamptz not null default now(),
  status              text not null
                        check (status in ('placed','sourcing','outbound','in-transit','customs','out-for-delivery','delivered','cancelled')),
  type                text not null
                        check (type in ('in-stock','pre-order','mixed')),
  -- Address snapshot: FK stored to query current details; ON DELETE SET NULL
  -- prevents deleting an address from breaking order history reads
  delivery_address_id uuid references public.addresses(id) on delete set null,
  delivery_method     text not null
                        check (delivery_method in ('split','together')),
  shipping_bdt        integer not null default 0,
  duty_bdt            integer not null default 0,
  handling_bdt        integer not null default 0,
  local_delivery_bdt  integer not null default 0,
  subtotal_bdt        integer not null,
  total_bdt           integer not null,
  payment_method      text not null
                        check (payment_method in ('bkash','nagad','card','cod')),
  payment_status      text not null
                        check (payment_status in ('pending','paid','failed','refunded')),
  payment_reference   text,
  in_stock_eta        date,
  pre_order_eta       date,
  shipment_id         text references public.shipments(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.order_lines (
  id             uuid primary key default gen_random_uuid(),
  order_id       text not null references public.orders(id) on delete cascade,
  product_id     text not null references public.products(id) on delete restrict,
  product_name   text not null,              -- denormalized snapshot at time of order
  variant        text,
  quantity       integer not null,
  unit_price_bdt integer not null,
  total_bdt      integer not null,
  type           text not null
                   check (type in ('in-stock','pre-order')),
  quote_id       text references public.quotes(id) on delete set null
);

create table public.tracking_steps (
  id          uuid primary key default gen_random_uuid(),
  order_id    text not null references public.orders(id) on delete cascade,
  label       text not null,
  description text not null default '',
  occurred_at timestamptz,                   -- null = not yet reached
  status      text not null
                check (status in ('done','current','pending')),
  position    integer not null default 0     -- display order
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
create index idx_products_category    on public.products(category);
create index idx_products_status      on public.products(status);
create index idx_products_is_active   on public.products(is_active);
create index idx_products_slug        on public.products(slug);
create index idx_product_variants_pid on public.product_variants(product_id);
create index idx_shipment_milestones_sid on public.shipment_milestones(shipment_id);
create index idx_shipment_breakdowns_sid on public.shipment_breakdowns(shipment_id);
create index idx_orders_customer_id   on public.orders(customer_id);
create index idx_orders_status        on public.orders(status);
create index idx_order_lines_order_id on public.order_lines(order_id);
create index idx_tracking_steps_order_id on public.tracking_steps(order_id, position);
create index idx_quotes_customer_id   on public.quotes(customer_id);
create index idx_quotes_status        on public.quotes(status);
create index idx_addresses_user_id    on public.addresses(user_id);
