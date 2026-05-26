-- ============================================================
-- SBD Global Shopping — Development seed data
-- Sourced from src/data/*.ts (Phase 1 mock data)
-- Run via: supabase db reset  OR  supabase db seed
-- DEV ONLY — never run against production
-- ============================================================

-- ── Seed users via auth.users ─────────────────────────────────────────────────
-- handle_new_user() trigger automatically creates public.users rows.
-- UUIDs are fixed so FK references in later inserts are stable.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'nuzhat@example.com',
    '',
    '2026-01-01 00:00:00+00',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Nuzhat Ahmed"}',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated',
    'admin@sbd.com.bd',
    '',
    '2026-01-01 00:00:00+00',
    '{"provider":"email","providers":["email"]}',
    '{"name":"SBD Admin"}',
    '2026-01-01 00:00:00+00',
    '2026-01-01 00:00:00+00',
    '', '', '', ''
  );

-- Enrich the rows the trigger created
update public.users set
  member_tier = 'gold',
  points      = 2400,
  joined_at   = '2025-06-01 00:00:00+00'
where id = '00000000-0000-0000-0000-000000000001';

update public.users set
  role      = 'admin',
  joined_at = '2025-01-01 00:00:00+00'
where id = '00000000-0000-0000-0000-000000000002';

-- ── Addresses ────────────────────────────────────────────────────────────────
insert into public.addresses (id, user_id, label, street_address, apt, area, city, postal_code, landmark) values
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Home',
    '48 Gulshan Avenue',
    'Apt 7B',
    'Gulshan-2',
    'Dhaka',
    '1212',
    'Opposite BRAC Bank'
  );

update public.users set
  default_address_id = '00000000-0000-0000-0000-000000000011'
where id = '00000000-0000-0000-0000-000000000001';

-- ── Categories ───────────────────────────────────────────────────────────────
insert into public.categories (slug, label, hero_gradient) values
  ('beauty',      'Beauty & Skincare',    'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e8bdd8 100%)'),
  ('electronics', 'Electronics',          'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #c5cae9 100%)'),
  ('fashion',     'Fashion & Apparel',    'linear-gradient(135deg, #faf0e6 0%, #f5e6d3 50%, #ede0d4 100%)'),
  ('supplements', 'Health & Supplements', 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #b2dfdb 100%)'),
  ('home',        'Home & Living',        'linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe0b2 100%)'),
  ('kids',        'Kids & Baby',          'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #bbdefb 100%)');

-- ── Shipments ────────────────────────────────────────────────────────────────
insert into public.shipments (id, number, route, origin_country, cutoff_date, liftoff_date, landing_date, status, item_count, total_value_bdt, customer_note) values
  ('13',    13, 'USA → DAC', 'US', '2026-04-15 23:59:00+00', '2026-04-25', '2026-05-10', 'delivered', 142, 6820000, 'All packages delivered. Thank you for your patience!'),
  ('14',    14, 'USA → DAC', 'US', '2026-06-02 23:59:00+00', '2026-06-12', '2026-06-28', 'accepting',  87, 4350000, 'Cutoff June 2 — order before then to join this shipment.'),
  ('15',    15, 'USA → DAC', 'US', '2026-06-16 23:59:00+00', '2026-06-26', '2026-07-12', 'accepting',   0,       0, null),
  ('13-uk', 13, 'UK → DAC',  'UK', '2026-04-20 23:59:00+00', '2026-04-28', '2026-05-14', 'delivered',  96, 4800000, 'All packages delivered successfully.'),
  ('14-uk', 14, 'UK → DAC',  'UK', '2026-05-31 23:59:00+00', '2026-06-08', '2026-07-05', 'accepting',  54, 2700000, 'Cutoff May 31 — book your pre-orders now.'),
  ('15-uk', 15, 'UK → DAC',  'UK', '2026-06-14 23:59:00+00', '2026-06-22', '2026-07-20', 'accepting',   0,       0, null);

-- ── Shipment milestones ───────────────────────────────────────────────────────
-- Shipment #13 USA (delivered)
insert into public.shipment_milestones (shipment_id, label, completed_at, position) values
  ('13', 'Cutoff',            '2026-04-15 23:59:00+00', 0),
  ('13', 'Sourcing complete', '2026-04-22 18:00:00+00', 1),
  ('13', 'Left USA',          '2026-04-25 08:00:00+00', 2),
  ('13', 'In transit',        '2026-04-26 14:00:00+00', 3),
  ('13', 'Dhaka customs',     '2026-05-08 09:00:00+00', 4),
  ('13', 'Out for delivery',  '2026-05-09 10:00:00+00', 5),
  ('13', 'Delivered',         '2026-05-10 16:00:00+00', 6);

-- Shipment #14 USA (accepting — no completions yet)
insert into public.shipment_milestones (shipment_id, label, position) values
  ('14', 'Cutoff',           0),
  ('14', 'Sourcing complete',1),
  ('14', 'Left USA',         2),
  ('14', 'In transit',       3),
  ('14', 'Dhaka customs',    4),
  ('14', 'Out for delivery', 5),
  ('14', 'Delivered',        6);

-- Shipment #15 USA
insert into public.shipment_milestones (shipment_id, label, position) values
  ('15', 'Cutoff',           0),
  ('15', 'Sourcing complete',1),
  ('15', 'Left USA',         2),
  ('15', 'In transit',       3),
  ('15', 'Dhaka customs',    4),
  ('15', 'Out for delivery', 5),
  ('15', 'Delivered',        6);

-- Shipment #13 UK (delivered)
insert into public.shipment_milestones (shipment_id, label, completed_at, position) values
  ('13-uk', 'Cutoff',            '2026-04-20 23:59:00+00', 0),
  ('13-uk', 'Sourcing complete', '2026-04-26 16:00:00+00', 1),
  ('13-uk', 'Left UK',           '2026-04-28 10:00:00+00', 2),
  ('13-uk', 'In transit',        '2026-04-29 14:00:00+00', 3),
  ('13-uk', 'Dhaka customs',     '2026-05-12 11:00:00+00', 4),
  ('13-uk', 'Out for delivery',  '2026-05-13 09:00:00+00', 5),
  ('13-uk', 'Delivered',         '2026-05-14 15:00:00+00', 6);

-- Shipment #14 UK (accepting)
insert into public.shipment_milestones (shipment_id, label, position) values
  ('14-uk', 'Cutoff',           0),
  ('14-uk', 'Sourcing complete',1),
  ('14-uk', 'Left UK',          2),
  ('14-uk', 'In transit',       3),
  ('14-uk', 'Dhaka customs',    4),
  ('14-uk', 'Out for delivery', 5),
  ('14-uk', 'Delivered',        6);

-- Shipment #15 UK
insert into public.shipment_milestones (shipment_id, label, position) values
  ('15-uk', 'Cutoff',           0),
  ('15-uk', 'Sourcing complete',1),
  ('15-uk', 'Left UK',          2),
  ('15-uk', 'In transit',       3),
  ('15-uk', 'Dhaka customs',    4),
  ('15-uk', 'Out for delivery', 5),
  ('15-uk', 'Delivered',        6);

-- ── Shipment breakdowns ──────────────────────────────────────────────────────
insert into public.shipment_breakdowns (shipment_id, category, item_count, value_bdt) values
  ('13',    'Beauty',      58, 2940000),
  ('13',    'Electronics', 34, 2100000),
  ('13',    'Fashion',     30, 1180000),
  ('13',    'Supplements', 20,  600000),
  ('14',    'Beauty',      42, 2100000),
  ('14',    'Electronics', 20, 1400000),
  ('14',    'Fashion',     15,  600000),
  ('14',    'Supplements', 10,  250000),
  ('13-uk', 'Beauty',      40, 2000000),
  ('13-uk', 'Fashion',     35, 1800000),
  ('13-uk', 'Home',        21, 1000000),
  ('14-uk', 'Beauty',      28, 1400000),
  ('14-uk', 'Fashion',     16,  900000),
  ('14-uk', 'Home',        10,  400000);

-- ── Products ─────────────────────────────────────────────────────────────────
-- images = '{}' for all seed products; hero gradient used as fallback until Phase 2C
insert into public.products (id, slug, name, brand, category, origin_country, source_retailer, price_bdt, price_usd, images, description, status, stock, hero, rating, review_count, tags, is_active) values
  (
    'sbd-prd-001', 'dyson-airwrap-complete',
    'Dyson Airwrap Complete Styler', 'Dyson', 'beauty', 'US', 'Dyson USA',
    45000, 599.99, '{}',
    'The Dyson Airwrap styler uses air, not extreme heat, to curl, wave, smooth and dry. For multiple hair types and styles. Includes Coanda smoothing dryer, firm smoothing brush, soft smoothing brush, 30mm and 40mm barrels, and a travel pouch.',
    'in-stock', 8,
    'linear-gradient(135deg, #f5e6d3 0%, #e8d5c0 40%, #d4b896 100%)',
    4.8, 312,
    array['bestseller','hair','styling','dyson'],
    true
  ),
  (
    'sbd-prd-002', 'skii-facial-treatment-essence',
    'SK-II Facial Treatment Essence', 'SK-II', 'beauty', 'US', 'Sephora USA',
    18500, 245.00, '{}',
    '75ml. The iconic essence formulated with over 90% Pitera™, a bio-ingredient rich in vitamins, amino acids, minerals and organic acids. Visibly improves all 5 signs of beautiful skin: texture, radiance, firmness, wrinkles and spots.',
    'in-stock', 15,
    'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ffd7e9 100%)',
    4.7, 198,
    array['essence','skincare','pitera','sk-ii'],
    true
  ),
  (
    'sbd-prd-003', 'apple-airpods-pro-2',
    'Apple AirPods Pro (2nd Gen) with MagSafe Case', 'Apple', 'electronics', 'US', 'Apple USA',
    28000, 249.00, '{}',
    'AirPods Pro feature up to 2× more active noise cancellation than the previous generation, with Adaptive Audio that seamlessly blends noise cancellation and Transparency mode. H2 chip, up to 30 hours total listening time with MagSafe Charging Case, USB-C connector.',
    'in-stock', 22,
    'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)',
    4.9, 541,
    array['apple','earbuds','noise-cancelling','bluetooth'],
    true
  ),
  (
    'sbd-prd-004', 'elemis-pro-collagen-marine-cream',
    'Elemis Pro-Collagen Marine Cream', 'Elemis', 'beauty', 'UK', 'John Lewis UK',
    12000, 130.00, '{}',
    'The UK''s No.1 anti-ageing moisturiser. Intensively moisturises and smoothes the appearance of lines and wrinkles. Padina pavonica — a critically endangered seaweed — combined with chlorella, mimosa, and rose hip dramatically reduces the depth of lines and wrinkles.',
    'in-stock', 11,
    'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e1f5fe 100%)',
    4.6, 87,
    array['anti-aging','moisturiser','elemis','uk'],
    true
  ),
  (
    'sbd-prd-005', 'shark-flexstyle-air-styler',
    'Shark FlexStyle Air Styling & Drying System', 'Shark Beauty', 'beauty', 'US', 'Target USA',
    32000, 279.99, '{}',
    'The only styling tool that auto-wraps your hair with no extreme heat. 1 tool, 6 attachments — dries, curls, waves, smooths, and volumizes. Powered by Shark''s HyperAIR Technology for fast, lightweight drying with smooth, frizz-free results.',
    'pre-order', null,
    'linear-gradient(135deg, #4a4a4a 0%, #2c2c2c 50%, #1a1a1a 100%)',
    4.5, 0,
    array['hair-styling','shark','pre-order','airwrap-alternative'],
    true
  ),
  (
    'sbd-prd-006', 'nike-air-max-270',
    'Nike Air Max 270', 'Nike', 'fashion', 'US', 'Nike USA',
    15500, 150.00, '{}',
    'The Nike Air Max 270 is inspired by two icons of big Air: the Air Max 180 and Air Max 93. It features Nike''s biggest heel Air unit yet, providing all-day cushioning and support. The bootie upper construction delivers a snug, sock-like fit.',
    'pre-order', null,
    'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffcd3c 100%)',
    4.4, 0,
    array['nike','sneakers','air-max','running'],
    true
  ),
  (
    'sbd-prd-007', 'garden-of-life-sport-protein',
    'Garden of Life Sport Certified Grass Fed Whey Protein', 'Garden of Life', 'supplements', 'US', 'iHerb USA',
    8500, 59.99, '{}',
    '24g of certified grass-fed whey protein per serving. NSF Certified for Sport®. Made with ingredients from pasture-raised cows. No soy, gluten free, non-GMO. Contains 1.5B CFU probiotics and enzymes for easy digestion.',
    'pre-order', null,
    'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)',
    4.6, 0,
    array['protein','supplements','whey','grass-fed','sport'],
    true
  ),
  (
    'sbd-prd-008', 'laneige-lip-sleeping-mask',
    'Laneige Lip Sleeping Mask EX', 'Laneige', 'beauty', 'UK', 'Boots UK',
    4500, 28.00, '{}',
    '20g. A bestselling overnight lip mask that works while you sleep to transform chapped, dry lips. The Moisture Wrap Technology seals in moisture and repairs overnight. Infused with Murumuru, Shea Butters, Vitamin C and antioxidant-rich Hyaluronic Acid Berry Complex.',
    'pre-order', null,
    'linear-gradient(135deg, #fce4ec 0%, #f48fb1 50%, #f06292 100%)',
    4.8, 0,
    array['lip-care','sleeping-mask','laneige','korean-beauty'],
    true
  );

-- Link pre-order products to their shipments and ETAs
update public.products set shipment_id = '14',    eta = '2026-06-28' where id in ('sbd-prd-005','sbd-prd-006','sbd-prd-007');
update public.products set shipment_id = '14-uk', eta = '2026-07-05' where id = 'sbd-prd-008';

-- ── Product variants ─────────────────────────────────────────────────────────
insert into public.product_variants (product_id, name, price_delta, available) values
  -- Dyson Airwrap
  ('sbd-prd-001', 'Copper/Nickel',       null,  true),
  ('sbd-prd-001', 'Vinca Blue/Rosé',     null,  true),
  ('sbd-prd-001', 'Black/Gold',          null,  false),
  -- Elemis
  ('sbd-prd-004', '30ml',                null,  true),
  ('sbd-prd-004', '50ml',                3500,  true),
  ('sbd-prd-004', '100ml',               8000,  false),
  -- Shark FlexStyle
  ('sbd-prd-005', 'Stone/Brass (Straight & Wavy)', null, true),
  ('sbd-prd-005', 'Black/Gold (Curly & Coily)',     null, true),
  -- Nike Air Max 270
  ('sbd-prd-006', 'US 7',  null, true),
  ('sbd-prd-006', 'US 8',  null, true),
  ('sbd-prd-006', 'US 9',  null, true),
  ('sbd-prd-006', 'US 10', null, true),
  -- Garden of Life
  ('sbd-prd-007', 'Vanilla',    null, true),
  ('sbd-prd-007', 'Chocolate',  null, true),
  ('sbd-prd-007', 'Unflavoured',null, true),
  -- Laneige
  ('sbd-prd-008', 'Berry',       null, true),
  ('sbd-prd-008', 'Vanilla',     null, true),
  ('sbd-prd-008', 'Gummy Bear',  null, true),
  ('sbd-prd-008', 'Sweet Candy', null, false);

-- ── Quotes ───────────────────────────────────────────────────────────────────
insert into public.quotes (
  id, customer_id, customer_name, customer_phone, requested_at,
  source_url, source_retailer, origin_country, product_name, product_variant, quantity,
  notes, preferred_shipment_id, budget_ceiling_bdt,
  status, expires_at,
  item_price_bdt, duty_bdt, inbound_shipping_bdt, handling_bdt, total_bdt,
  shipment_id, eta, admin_note, margin_pct
) values
  -- quote-sent (customer has a price, can accept/decline)
  (
    'QR-2026-09201',
    '00000000-0000-0000-0000-000000000001',
    'Nuzhat Ahmed', '+8801712345678',
    '2026-05-21 10:15:00+00',
    'https://www.sephora.com/product/la-mer-the-moisturizing-cream',
    'Sephora USA', 'US',
    'La Mer The Moisturizing Cream 60ml', null, 1,
    'Please confirm authentic. Happy with Shipment #14.',
    '14', null,
    'quote-sent', '2026-05-28 23:59:00+00',
    38000, 5700, 1200, 500, 45400,
    '14', '2026-06-28',
    'Authentic product sourced from official Sephora store.', 12
  ),
  -- pending (awaiting admin response)
  (
    'QR-2026-09312',
    '00000000-0000-0000-0000-000000000001',
    'Nuzhat Ahmed', '+8801712345678',
    '2026-05-23 15:44:00+00',
    'https://www.amazon.com/dp/B09L7BLMFC',
    'Amazon USA', 'US',
    'Theragun Prime Handheld Percussion Massage Gun', null, 1,
    'Want the grey colour if available.',
    '14', 50000,
    'pending', null,
    null, null, null, null, null,
    null, null, null, null
  ),
  -- accepted (customer accepted; order placed)
  (
    'QR-2026-08412',
    '00000000-0000-0000-0000-000000000001',
    'Nuzhat Ahmed', '+8801712345678',
    '2026-05-10 09:30:00+00',
    'https://www.iherb.com/pr/garden-of-life-sport-whey-protein',
    'iHerb USA', 'US',
    'Garden of Life Sport Whey Protein — Vanilla', 'Vanilla', 2,
    null, '13', null,
    'accepted', null,
    8500, 1020, 600, 500, 19180,
    '13', '2026-05-10',
    null, 10
  ),
  -- declined (customer declined)
  (
    'QR-2026-07890',
    '00000000-0000-0000-0000-000000000001',
    'Nuzhat Ahmed', '+8801712345678',
    '2026-04-15 14:20:00+00',
    'https://www.nordstrom.com/s/balenciaga-speed-trainer',
    'Nordstrom USA', 'US',
    'Balenciaga Speed Trainer Sneakers', 'EU 40', 1,
    null, null, null,
    'declined', null,
    85000, 17000, 2000, 500, 104500,
    '13', '2026-05-10',
    'Price confirmed authentic. High demand item.', 8
  );

-- ── Orders ───────────────────────────────────────────────────────────────────
insert into public.orders (
  id, customer_id, placed_at, status, type,
  delivery_address_id, delivery_method,
  shipping_bdt, duty_bdt, handling_bdt, local_delivery_bdt,
  subtotal_bdt, total_bdt,
  payment_method, payment_status,
  in_stock_eta, pre_order_eta, shipment_id
) values
  (
    'SBD-2026-04812',
    '00000000-0000-0000-0000-000000000001',
    '2026-05-20 14:32:00+00',
    'in-transit', 'mixed',
    '00000000-0000-0000-0000-000000000011', 'split',
    1200, 4800, 500, 60, 60000, 66560,
    'bkash', 'paid',
    '2026-05-28', '2026-06-28', '14'
  ),
  (
    'SBD-2026-04756',
    '00000000-0000-0000-0000-000000000001',
    '2026-05-14 11:15:00+00',
    'out-for-delivery', 'in-stock',
    '00000000-0000-0000-0000-000000000011', 'together',
    800, 2150, 500, 0, 42500, 45950,
    'card', 'paid',
    '2026-05-26', null, null
  ),
  (
    'SBD-2026-04601',
    '00000000-0000-0000-0000-000000000001',
    '2026-04-28 09:42:00+00',
    'delivered', 'in-stock',
    '00000000-0000-0000-0000-000000000011', 'together',
    1200, 6750, 500, 0, 45000, 53450,
    'bkash', 'paid',
    '2026-05-10', null, null
  ),
  (
    'SBD-2026-04523',
    '00000000-0000-0000-0000-000000000001',
    '2026-04-10 16:20:00+00',
    'delivered', 'pre-order',
    '00000000-0000-0000-0000-000000000011', 'together',
    600, 1020, 500, 60, 17000, 19180,
    'nagad', 'paid',
    null, '2026-05-10', '13'
  ),
  (
    'SBD-2026-04389',
    '00000000-0000-0000-0000-000000000001',
    '2026-03-15 10:05:00+00',
    'delivered', 'in-stock',
    '00000000-0000-0000-0000-000000000011', 'together',
    800, 1700, 500, 0, 17000, 20000,
    'bkash', 'paid',
    '2026-03-28', null, null
  ),
  (
    'SBD-2026-03901',
    '00000000-0000-0000-0000-000000000001',
    '2026-02-02 13:44:00+00',
    'delivered', 'in-stock',
    '00000000-0000-0000-0000-000000000011', 'together',
    600, 1240, 500, 0, 15500, 17840,
    'card', 'paid',
    '2026-02-20', null, null
  ),
  (
    'SBD-2025-15230',
    '00000000-0000-0000-0000-000000000001',
    '2025-11-18 09:12:00+00',
    'delivered', 'in-stock',
    '00000000-0000-0000-0000-000000000011', 'together',
    1200, 6300, 500, 0, 42000, 50000,
    'bkash', 'paid',
    '2025-12-05', null, null
  );

-- ── Order lines ───────────────────────────────────────────────────────────────
insert into public.order_lines (order_id, product_id, product_name, variant, quantity, unit_price_bdt, total_bdt, type, quote_id) values
  -- SBD-2026-04812 (mixed: in-stock AirPods + pre-order Shark)
  ('SBD-2026-04812', 'sbd-prd-003', 'Apple AirPods Pro (2nd Gen)', null, 1, 28000, 28000, 'in-stock', null),
  ('SBD-2026-04812', 'sbd-prd-005', 'Shark FlexStyle Air Styling & Drying System', 'Stone/Brass', 1, 32000, 32000, 'pre-order', null),
  -- SBD-2026-04756 (in-stock: SK-II + Elemis x2)
  ('SBD-2026-04756', 'sbd-prd-002', 'SK-II Facial Treatment Essence 75ml', null, 1, 18500, 18500, 'in-stock', null),
  ('SBD-2026-04756', 'sbd-prd-004', 'Elemis Pro-Collagen Marine Cream 30ml', '30ml', 2, 12000, 24000, 'in-stock', null),
  -- SBD-2026-04601 (in-stock: Dyson Airwrap)
  ('SBD-2026-04601', 'sbd-prd-001', 'Dyson Airwrap Complete Styler', 'Copper/Nickel', 1, 45000, 45000, 'in-stock', null),
  -- SBD-2026-04523 (pre-order: Garden of Life via quote QR-2026-08412)
  ('SBD-2026-04523', 'sbd-prd-007', 'Garden of Life Sport Whey Protein — Vanilla', 'Vanilla', 2, 8500, 17000, 'pre-order', 'QR-2026-08412'),
  -- SBD-2026-04389 (in-stock: SK-II)
  ('SBD-2026-04389', 'sbd-prd-002', 'SK-II Facial Treatment Essence 75ml', null, 1, 17000, 17000, 'in-stock', null),
  -- SBD-2026-03901 (in-stock: Elemis 50ml)
  ('SBD-2026-03901', 'sbd-prd-004', 'Elemis Pro-Collagen Marine Cream 50ml', '50ml', 1, 15500, 15500, 'in-stock', null),
  -- SBD-2025-15230 (in-stock: Dyson Airwrap)
  ('SBD-2025-15230', 'sbd-prd-001', 'Dyson Airwrap Complete Styler', 'Vinca Blue/Rosé', 1, 42000, 42000, 'in-stock', null);

-- ── Tracking steps ────────────────────────────────────────────────────────────
insert into public.tracking_steps (order_id, label, description, occurred_at, status, position) values
  -- SBD-2026-04812 (in-transit)
  ('SBD-2026-04812', 'Order placed',    'Your order has been confirmed and payment received.', '2026-05-20 14:32:00+00', 'done',    0),
  ('SBD-2026-04812', 'Sourcing',        'Items are being sourced from US retailers.',           '2026-05-21 10:00:00+00', 'done',    1),
  ('SBD-2026-04812', 'In transit',      'Your in-stock items are on their way to Bangladesh.',  '2026-05-23 08:00:00+00', 'current', 2),
  ('SBD-2026-04812', 'Dhaka customs',   'Package is clearing customs at Dhaka.',                null,                     'pending', 3),
  ('SBD-2026-04812', 'Out for delivery','Your courier will deliver within 24 hours.',           null,                     'pending', 4),
  ('SBD-2026-04812', 'Delivered',       'Package delivered to your address.',                   null,                     'pending', 5),
  -- SBD-2026-04756 (out-for-delivery)
  ('SBD-2026-04756', 'Order placed',    'Order confirmed.',          '2026-05-14 11:15:00+00', 'done',    0),
  ('SBD-2026-04756', 'Sourcing',        'Items sourced and packed.', '2026-05-15 14:00:00+00', 'done',    1),
  ('SBD-2026-04756', 'In transit',      'Shipped from USA.',         '2026-05-18 09:00:00+00', 'done',    2),
  ('SBD-2026-04756', 'Dhaka customs',   'Cleared customs.',          '2026-05-23 11:00:00+00', 'done',    3),
  ('SBD-2026-04756', 'Out for delivery','With courier. Expected today.','2026-05-25 08:30:00+00','current',4),
  ('SBD-2026-04756', 'Delivered',       'Package delivered.',        null,                      'pending', 5),
  -- SBD-2026-04601 (delivered)
  ('SBD-2026-04601', 'Order placed',    'Order confirmed.',    '2026-04-28 09:42:00+00', 'done', 0),
  ('SBD-2026-04601', 'Sourcing',        'Items sourced and packed.', '2026-04-30 16:00:00+00', 'done', 1),
  ('SBD-2026-04601', 'In transit',      'Shipped from USA.',  '2026-05-03 08:00:00+00', 'done', 2),
  ('SBD-2026-04601', 'Dhaka customs',   'Cleared customs.',   '2026-05-08 10:00:00+00', 'done', 3),
  ('SBD-2026-04601', 'Out for delivery','With courier.',       '2026-05-09 09:00:00+00', 'done', 4),
  ('SBD-2026-04601', 'Delivered',       'Delivered on 10 May.','2026-05-10 14:22:00+00','done', 5),
  -- SBD-2026-04523 (delivered)
  ('SBD-2026-04523', 'Order placed',    'Pre-order confirmed.',      '2026-04-10 16:20:00+00', 'done', 0),
  ('SBD-2026-04523', 'Sourcing',        'Sourced on Shipment #13.',  '2026-04-22 18:00:00+00', 'done', 1),
  ('SBD-2026-04523', 'In transit',      'Left USA.',                 '2026-04-25 08:00:00+00', 'done', 2),
  ('SBD-2026-04523', 'Dhaka customs',   'Cleared.',                  '2026-05-08 09:00:00+00', 'done', 3),
  ('SBD-2026-04523', 'Out for delivery','With courier.',              '2026-05-09 10:00:00+00', 'done', 4),
  ('SBD-2026-04523', 'Delivered',       'Delivered on 10 May.',      '2026-05-10 16:00:00+00', 'done', 5),
  -- SBD-2026-04389 (delivered)
  ('SBD-2026-04389', 'Order placed',    'Order confirmed.',  '2026-03-15 10:05:00+00', 'done', 0),
  ('SBD-2026-04389', 'Sourcing',        'Done.',             '2026-03-17 14:00:00+00', 'done', 1),
  ('SBD-2026-04389', 'In transit',      'Shipped.',          '2026-03-20 08:00:00+00', 'done', 2),
  ('SBD-2026-04389', 'Dhaka customs',   'Cleared.',          '2026-03-26 09:00:00+00', 'done', 3),
  ('SBD-2026-04389', 'Out for delivery','With courier.',      '2026-03-27 08:00:00+00', 'done', 4),
  ('SBD-2026-04389', 'Delivered',       'Delivered.',        '2026-03-28 15:30:00+00', 'done', 5),
  -- SBD-2026-03901 (delivered)
  ('SBD-2026-03901', 'Order placed',    'Order confirmed.',    '2026-02-02 13:44:00+00', 'done', 0),
  ('SBD-2026-03901', 'Sourcing',        'Done.',               '2026-02-05 11:00:00+00', 'done', 1),
  ('SBD-2026-03901', 'In transit',      'Shipped from UK.',    '2026-02-08 08:00:00+00', 'done', 2),
  ('SBD-2026-03901', 'Dhaka customs',   'Cleared.',            '2026-02-17 10:00:00+00', 'done', 3),
  ('SBD-2026-03901', 'Out for delivery','With courier.',        '2026-02-19 09:00:00+00', 'done', 4),
  ('SBD-2026-03901', 'Delivered',       'Delivered.',          '2026-02-20 14:00:00+00', 'done', 5),
  -- SBD-2025-15230 (delivered)
  ('SBD-2025-15230', 'Order placed',    'Order confirmed.',    '2025-11-18 09:12:00+00', 'done', 0),
  ('SBD-2025-15230', 'Sourcing',        'Done.',               '2025-11-20 14:00:00+00', 'done', 1),
  ('SBD-2025-15230', 'In transit',      'Shipped.',            '2025-11-24 08:00:00+00', 'done', 2),
  ('SBD-2025-15230', 'Dhaka customs',   'Cleared.',            '2025-12-02 10:00:00+00', 'done', 3),
  ('SBD-2025-15230', 'Out for delivery','With courier.',        '2025-12-04 09:00:00+00', 'done', 4),
  ('SBD-2025-15230', 'Delivered',       'Delivered.',          '2025-12-05 16:00:00+00', 'done', 5);
