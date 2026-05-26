-- Demo shipments + pre-order products.
-- Shipments #14 (USA) and #14-UK are still accepting as of launch.

-- ── Shipments ────────────────────────────────────────────────────────────────

insert into public.shipments (id, number, route, origin_country, cutoff_date, liftoff_date, landing_date, status, item_count, total_value_bdt, customer_note) values
  ('13',    13, 'USA → DAC', 'US', '2026-04-15 23:59:00+00', '2026-04-25', '2026-05-10', 'delivered', 142, 6820000, 'All packages delivered. Thank you for your patience!'),
  ('14',    14, 'USA → DAC', 'US', '2026-06-02 23:59:00+00', '2026-06-12', '2026-06-28', 'accepting',  87, 4350000, 'Cutoff June 2 — order before then to join this shipment.'),
  ('15',    15, 'USA → DAC', 'US', '2026-06-16 23:59:00+00', '2026-06-26', '2026-07-12', 'accepting',   0,       0, null),
  ('13-uk', 13, 'UK → DAC',  'UK', '2026-04-20 23:59:00+00', '2026-04-28', '2026-05-14', 'delivered',  96, 4800000, 'All packages delivered successfully.'),
  ('14-uk', 14, 'UK → DAC',  'UK', '2026-05-31 23:59:00+00', '2026-06-08', '2026-07-05', 'accepting',  54, 2700000, 'Cutoff May 31 — book your pre-orders now.'),
  ('15-uk', 15, 'UK → DAC',  'UK', '2026-06-14 23:59:00+00', '2026-06-22', '2026-07-20', 'accepting',   0,       0, null);

-- Shipment milestones — #13 USA (delivered)
insert into public.shipment_milestones (shipment_id, label, completed_at, position) values
  ('13', 'Cutoff',            '2026-04-15 23:59:00+00', 0),
  ('13', 'Sourcing complete', '2026-04-22 18:00:00+00', 1),
  ('13', 'Left USA',          '2026-04-25 08:00:00+00', 2),
  ('13', 'In transit',        '2026-04-26 14:00:00+00', 3),
  ('13', 'Dhaka customs',     '2026-05-08 09:00:00+00', 4),
  ('13', 'Out for delivery',  '2026-05-09 10:00:00+00', 5),
  ('13', 'Delivered',         '2026-05-10 16:00:00+00', 6);

-- Shipment milestones — #14 USA (accepting)
insert into public.shipment_milestones (shipment_id, label, position) values
  ('14', 'Cutoff',            0),
  ('14', 'Sourcing complete', 1),
  ('14', 'Left USA',          2),
  ('14', 'In transit',        3),
  ('14', 'Dhaka customs',     4),
  ('14', 'Out for delivery',  5),
  ('14', 'Delivered',         6);

-- Shipment milestones — #14-UK (accepting)
insert into public.shipment_milestones (shipment_id, label, position) values
  ('14-uk', 'Cutoff',            0),
  ('14-uk', 'Sourcing complete', 1),
  ('14-uk', 'Left UK',           2),
  ('14-uk', 'In transit',        3),
  ('14-uk', 'Dhaka customs',     4),
  ('14-uk', 'Out for delivery',  5),
  ('14-uk', 'Delivered',         6);

-- Shipment milestones — #13-UK (delivered)
insert into public.shipment_milestones (shipment_id, label, completed_at, position) values
  ('13-uk', 'Cutoff',            '2026-04-20 23:59:00+00', 0),
  ('13-uk', 'Sourcing complete', '2026-04-26 12:00:00+00', 1),
  ('13-uk', 'Left UK',           '2026-04-28 09:00:00+00', 2),
  ('13-uk', 'In transit',        '2026-04-29 18:00:00+00', 3),
  ('13-uk', 'Dhaka customs',     '2026-05-12 10:00:00+00', 4),
  ('13-uk', 'Out for delivery',  '2026-05-13 09:00:00+00', 5),
  ('13-uk', 'Delivered',         '2026-05-14 17:00:00+00', 6);

-- ── Pre-order products ────────────────────────────────────────────────────────
-- All linked to Shipment #14 (USA, landing 28 Jun) or #14-UK (landing 5 Jul).

insert into public.products (id, slug, name, brand, category, origin_country, source_retailer, price_bdt, price_usd, images, description, status, stock, hero, rating, review_count, tags, is_active, shipment_id, eta) values

-- Electronics — Shipment #14 USA
(
  'sbd-prd-015', 'apple-iphone-16-pro-256gb',
  'Apple iPhone 16 Pro (256 GB)', 'Apple', 'electronics', 'US',
  'Apple USA', 145000, 999.00, '{}',
  'iPhone 16 Pro features the A18 Pro chip, a 48MP Fusion camera system with 5× optical zoom, Camera Control button, and Action Button. The 6.3" Super Retina XDR ProMotion display goes up to 2,000 nits peak brightness. Titanium design. USB-C with USB 3 speeds. 4K 120fps video recording.',
  'pre-order', null,
  'linear-gradient(135deg, #e8e0d5 0%, #d4c5b0 50%, #c4b49a 100%)',
  4.9, 0,
  ARRAY['apple','iphone','smartphone','5g','titanium'],
  true, '14', '2026-06-28'
),
(
  'sbd-prd-016', 'sony-playstation-5-slim',
  'Sony PlayStation 5 Slim (Disc Edition)', 'Sony', 'electronics', 'US',
  'Best Buy USA', 55000, 449.99, '{}',
  'The slimmer, lighter PS5 with a detachable disc drive. Powered by a custom AMD Zen 2 CPU and RDNA 2 GPU delivering 4K gaming at up to 120fps. Ultra-high-speed SSD, Tempest 3D AudioTech, haptic feedback and adaptive triggers on DualSense controller. 1TB storage.',
  'pre-order', null,
  'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 50%, #9fa8da 100%)',
  4.8, 0,
  ARRAY['sony','playstation','gaming','console','ps5'],
  true, '14', '2026-06-28'
),

-- Beauty — Shipment #14 USA
(
  'sbd-prd-017', 'shark-flexstyle-air-styler',
  'Shark FlexStyle Air Styling & Drying System', 'Shark Beauty', 'beauty', 'US',
  'Target USA', 32000, 279.99, '{}',
  'The only styling tool that auto-wraps hair with no extreme heat. 1 tool, 6 attachments — dries, curls, waves, smooths and volumizes. Powered by Shark HyperAIR Technology for fast, lightweight drying with smooth, frizz-free results. Folds flat for travel.',
  'pre-order', null,
  'linear-gradient(135deg, #4a4a4a 0%, #2c2c2c 50%, #1a1a1a 100%)',
  4.5, 0,
  ARRAY['shark','hair-styling','air-styler','airwrap-alternative'],
  true, '14', '2026-06-28'
),

-- Beauty — Shipment #14-UK
(
  'sbd-prd-018', 'charlotte-tilbury-pillow-talk-palette',
  'Charlotte Tilbury Pillow Talk Eye & Cheek Palette', 'Charlotte Tilbury', 'beauty', 'UK',
  'Charlotte Tilbury UK', 9800, 75.00, '{}',
  'The iconic Pillow Talk collection in one gorgeous palette. 8 eyeshadows in universally flattering nude-pink tones, plus a blush and highlighter. Buildable from subtle daytime looks to dramatic evening glamour. Includes Charlotte''s step-by-step application guide.',
  'pre-order', null,
  'linear-gradient(135deg, #f9e4e8 0%, #f2c4ce 50%, #e8a0b0 100%)',
  4.8, 0,
  ARRAY['charlotte-tilbury','makeup','eyeshadow','blush','pillow-talk'],
  true, '14-uk', '2026-07-05'
),

-- Fashion — Shipment #14 USA
(
  'sbd-prd-019', 'new-balance-990v6-made-in-usa',
  'New Balance 990v6 (Made in USA)', 'New Balance', 'fashion', 'US',
  'New Balance USA', 28500, 184.99, '{}',
  'The 990v6 upholds New Balance''s 45-year legacy of craftsmanship. Made in the USA with premium pigskin and mesh upper, ENCAP midsole technology for superior support and durability, and Vibram outsole for exceptional traction. The sneaker that defined dad shoes before they were cool.',
  'pre-order', null,
  'linear-gradient(135deg, #9e9e9e 0%, #757575 50%, #616161 100%)',
  4.8, 0,
  ARRAY['new-balance','sneakers','made-in-usa','990v6','running'],
  true, '14', '2026-06-28'
),

-- Supplements — Shipment #14 USA
(
  'sbd-prd-020', 'athletic-greens-ag1-travel-packs',
  'AG1 by Athletic Greens (30 Travel Packs)', 'Athletic Greens', 'supplements', 'US',
  'Athletic Greens USA', 12500, 79.00, '{}',
  '75 high-quality vitamins, minerals, whole-food sourced superfoods, probiotics and adaptogens in one daily scoop. NSF Certified for Sport. No artificial colours, flavours or sweeteners. Gluten, dairy and egg free. Mixes instantly with water. Supports energy, immunity and gut health.',
  'pre-order', null,
  'linear-gradient(135deg, #33691e 0%, #558b2f 50%, #7cb342 100%)',
  4.6, 0,
  ARRAY['ag1','greens','supplements','superfoods','athletic-greens'],
  true, '14', '2026-06-28'
),

-- Home — Shipment #14-UK
(
  'sbd-prd-021', 'le-creuset-signature-dutch-oven-5qt',
  'Le Creuset Signature Round Dutch Oven (5.3 Qt)', 'Le Creuset', 'home', 'UK',
  'Le Creuset UK', 38000, 299.95, '{}',
  'The world''s finest enamelled cast iron cookware. Superior heat distribution and retention for exceptional cooking results. The tight-fitting lid traps heat and moisture. Suitable for all hob types including induction. Oven safe to 260°C. Available in the iconic Flame and Marseille colourways.',
  'pre-order', null,
  'linear-gradient(135deg, #e65100 0%, #ef6c00 50%, #f57c00 100%)',
  4.9, 0,
  ARRAY['le-creuset','dutch-oven','cast-iron','cookware','kitchen'],
  true, '14-uk', '2026-07-05'
),

-- Kids — Shipment #14 USA
(
  'sbd-prd-022', 'nintendo-switch-2',
  'Nintendo Switch 2', 'Nintendo', 'kids', 'US',
  'Nintendo USA', 42000, 449.99, '{}',
  'The next generation Nintendo Switch. Larger 7.9" LCD screen, magnetic Joy-Con controllers with a new C button for GameChat. Backwards compatible with Nintendo Switch game cards. Includes Nintendo Switch 2 Welcome Tour. Tabletop, handheld and TV modes.',
  'pre-order', null,
  'linear-gradient(135deg, #e53935 0%, #c62828 50%, #b71c1c 100%)',
  4.9, 0,
  ARRAY['nintendo','switch','gaming','console','kids'],
  true, '14', '2026-06-28'
);

-- Variants for pre-order fashion
insert into public.product_variants (product_id, name, price_delta, available) values
  ('sbd-prd-019', 'US 7 / EU 40',  null, true),
  ('sbd-prd-019', 'US 8 / EU 41',  null, true),
  ('sbd-prd-019', 'US 9 / EU 42',  null, true),
  ('sbd-prd-019', 'US 10 / EU 43', null, true),
  ('sbd-prd-019', 'US 11 / EU 44', null, true);
