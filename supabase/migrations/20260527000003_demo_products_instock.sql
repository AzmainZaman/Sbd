-- Demo in-stock products across all 7 categories.
-- images = '{}'; hero gradient used as fallback until real images are uploaded via admin.

insert into public.products (id, slug, name, brand, category, origin_country, source_retailer, price_bdt, price_usd, images, description, status, stock, hero, rating, review_count, tags, is_active) values

-- ── Electronics ──────────────────────────────────────────────────────────────
(
  'sbd-prd-001', 'apple-airpods-pro-2',
  'Apple AirPods Pro (2nd Generation)', 'Apple', 'electronics', 'US',
  'Apple USA', 28000, 249.00, '{}',
  'AirPods Pro feature up to 2× more Active Noise Cancellation than the previous generation, with Adaptive Audio that seamlessly blends noise cancellation and Transparency mode. The H2 chip delivers incredible sound and up to 30 hours total listening time with the MagSafe Charging Case. USB-C connector.',
  'in-stock', 18,
  'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)',
  4.9, 541,
  ARRAY['apple','earbuds','noise-cancelling','bluetooth','wireless'],
  true
),
(
  'sbd-prd-002', 'samsung-65-qled-4k-tv',
  'Samsung 65" QLED 4K Smart TV (QN65Q80D)', 'Samsung', 'electronics', 'US',
  'Best Buy USA', 135000, 1199.99, '{}',
  'Quantum Dot technology produces a billion shades of colour for stunning 4K visuals. Neo Quantum Processor 4K uses AI to upscale all content. Real Game Enhancer+ with 144Hz refresh rate. Motion Xcelerator Turbo+ for smooth action. Built-in Alexa and Google Assistant. Slim bezel design.',
  'in-stock', 6,
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  4.7, 283,
  ARRAY['samsung','tv','qled','4k','smart-tv'],
  true
),

-- ── Beauty ───────────────────────────────────────────────────────────────────
(
  'sbd-prd-003', 'dyson-airwrap-complete',
  'Dyson Airwrap Complete Styler', 'Dyson', 'beauty', 'US',
  'Dyson USA', 45000, 599.99, '{}',
  'The Dyson Airwrap styler uses air, not extreme heat, to curl, wave, smooth and dry — for multiple hair types and styles. The Coanda effect attracts and wraps hair around the barrel automatically. Includes 6 Coanda styling attachments, a Coanda smoothing dryer, and a travel pouch.',
  'in-stock', 8,
  'linear-gradient(135deg, #f5e6d3 0%, #e8d5c0 40%, #d4b896 100%)',
  4.8, 312,
  ARRAY['dyson','hair','styling','bestseller'],
  true
),
(
  'sbd-prd-004', 'skii-facial-treatment-essence',
  'SK-II Facial Treatment Essence 75ml', 'SK-II', 'beauty', 'US',
  'Sephora USA', 18500, 245.00, '{}',
  'The iconic essence formulated with over 90% Pitera™ — a bio-ingredient rich in vitamins, amino acids, minerals and organic acids. Clinically proven to visibly improve all 5 signs of beautiful skin: texture, radiance, firmness, wrinkles and spots. Apply morning and evening after cleansing.',
  'in-stock', 15,
  'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #ffd7e9 100%)',
  4.7, 198,
  ARRAY['skii','essence','skincare','pitera','anti-ageing'],
  true
),

-- ── Fashion ──────────────────────────────────────────────────────────────────
(
  'sbd-prd-005', 'levis-501-original-fit-jeans',
  'Levi''s 501 Original Fit Jeans', 'Levi''s', 'fashion', 'US',
  'Levi''s USA', 8900, 79.50, '{}',
  'The original blue jean since 1873. The 501 features Levi''s signature button fly and straight leg with a regular fit through the seat and thigh. Made from 100% cotton denim, preshrunk and built to last. Available in classic indigo, stonewash, and black finishes.',
  'in-stock', 24,
  'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)',
  4.6, 1247,
  ARRAY['levis','jeans','denim','fashion','classic'],
  true
),
(
  'sbd-prd-006', 'north-face-thermoball-eco-jacket',
  'The North Face ThermoBall Eco Jacket', 'The North Face', 'fashion', 'US',
  'REI USA', 22000, 199.00, '{}',
  'Stay warm in a packable, lightweight jacket insulated with 100% recycled ThermoBall Eco synthetic insulation — the eco-conscious alternative to down. Packable into its own chest pocket. Wind- and water-resistant DWR finish. PrimaLoft ThermoBall clusters retain warmth even when wet.',
  'in-stock', 12,
  'linear-gradient(135deg, #263238 0%, #37474f 50%, #546e7a 100%)',
  4.7, 389,
  ARRAY['north-face','jacket','outdoor','thermoball','winter'],
  true
),

-- ── Supplements ──────────────────────────────────────────────────────────────
(
  'sbd-prd-007', 'optimum-nutrition-gold-standard-whey',
  'Optimum Nutrition Gold Standard 100% Whey (5lb)', 'Optimum Nutrition', 'supplements', 'US',
  'iHerb USA', 7800, 54.99, '{}',
  '24g of blended protein per serving — whey protein isolates, concentrate and peptides. 5.5g of naturally occurring BCAAs to help repair and rebuild muscle. Instantised to mix easily with a spoon. No artificial colours. Gluten free. Available in Double Rich Chocolate, Vanilla Ice Cream and Strawberry.',
  'in-stock', 32,
  'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 50%, #66bb6a 100%)',
  4.8, 2341,
  ARRAY['whey-protein','supplements','gym','bcaa','optimum-nutrition'],
  true
),
(
  'sbd-prd-008', 'garden-of-life-vitamin-code-men',
  'Garden of Life Vitamin Code Men''s Multivitamin (120 Capsules)', 'Garden of Life', 'supplements', 'US',
  'iHerb USA', 5500, 39.99, '{}',
  'Raw whole food multivitamin for men formulated with RAW Food-Created Nutrients. Includes vitamin D3, zinc, and probiotics for digestive and immune support. No binders, fillers or artificially derived synthetic vitamins. NSF Certified, Non-GMO, Gluten Free, Kosher and Vegan.',
  'in-stock', 28,
  'linear-gradient(135deg, #f1f8e9 0%, #c5e1a5 50%, #8bc34a 100%)',
  4.6, 876,
  ARRAY['multivitamin','supplements','mens-health','organic','non-gmo'],
  true
),

-- ── Home ─────────────────────────────────────────────────────────────────────
(
  'sbd-prd-009', 'instant-pot-duo-7-in-1-8qt',
  'Instant Pot Duo 7-in-1 Electric Pressure Cooker (8 Qt)', 'Instant Pot', 'home', 'US',
  'Amazon USA', 11200, 99.95, '{}',
  'The world''s best-selling multi-cooker. 7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer. 14 smart one-touch programs. Cooks up to 70% faster than traditional methods. Dishwasher-safe lid and inner pot. UL certified.',
  'in-stock', 20,
  'linear-gradient(135deg, #eceff1 0%, #cfd8dc 50%, #90a4ae 100%)',
  4.8, 1893,
  ARRAY['instant-pot','kitchen','pressure-cooker','slow-cooker','home-appliance'],
  true
),
(
  'sbd-prd-010', 'dyson-v15-detect-vacuum',
  'Dyson V15 Detect Cordless Vacuum Cleaner', 'Dyson', 'home', 'US',
  'Dyson USA', 65000, 749.99, '{}',
  'Dyson''s most powerful cordless vacuum with laser dust detection. An integrated LCD screen scientifically proves what has been picked up and automatically adapts suction to the floor type. HEPA filtration captures 99.97% of particles as small as 0.3 microns. Up to 60 minutes of run time.',
  'in-stock', 7,
  'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffb74d 100%)',
  4.8, 742,
  ARRAY['dyson','vacuum','cordless','hepa','home-cleaning'],
  true
),

-- ── Kids ─────────────────────────────────────────────────────────────────────
(
  'sbd-prd-011', 'lego-technic-nasa-mars-rover',
  'LEGO Technic NASA Mars Rover Perseverance (42158)', 'LEGO', 'kids', 'EU',
  'LEGO EU', 21000, 189.99, '{}',
  '1132 pieces. A faithful replica of NASA''s Perseverance Mars Rover with articulated suspension, rotating cameras, and a belly compartment housing the Ingenuity helicopter. Includes an AR app experience. Ages 10+. An inspiring STEM build for young space enthusiasts.',
  'in-stock', 11,
  'linear-gradient(135deg, #b71c1c 0%, #e53935 50%, #ff7043 100%)',
  4.9, 634,
  ARRAY['lego','technic','nasa','mars','stem','kids','ages-10-plus'],
  true
),
(
  'sbd-prd-012', 'melissa-doug-wooden-blocks',
  'Melissa & Doug Deluxe Wooden Building Blocks (100 Pieces)', 'Melissa & Doug', 'kids', 'US',
  'Amazon USA', 7200, 49.99, '{}',
  '100 solid wood blocks in 4 colours and 9 shapes that encourage open-ended creative play and help develop fine motor skills, spatial reasoning and problem solving. Made from sustainably sourced wood with non-toxic paint. Includes a sturdy wooden storage crate. Ages 2 and up.',
  'in-stock', 19,
  'linear-gradient(135deg, #f9a825 0%, #fbc02d 50%, #fdd835 100%)',
  4.7, 412,
  ARRAY['melissa-doug','wooden-toys','building-blocks','toddler','educational'],
  true
),

-- ── Other ────────────────────────────────────────────────────────────────────
(
  'sbd-prd-013', 'kindle-paperwhite-16gb-2023',
  'Amazon Kindle Paperwhite (16 GB) — 2023', 'Amazon', 'other', 'US',
  'Amazon USA', 15500, 139.99, '{}',
  '6.8" glare-free 300 ppi display with adjustable warm light. Up to 12 weeks of battery life. IPX8 waterproof — reads in the bath or by the pool. Wifi and Bluetooth with Audible audiobook support. 16 GB stores thousands of books. No ads. Now with USB-C charging.',
  'in-stock', 25,
  'linear-gradient(135deg, #212121 0%, #424242 50%, #616161 100%)',
  4.8, 1567,
  ARRAY['kindle','ereader','amazon','books','reading','waterproof'],
  true
),
(
  'sbd-prd-014', 'moleskine-classic-hardcover-notebook',
  'Moleskine Classic Hardcover Notebook — Large, Ruled', 'Moleskine', 'other', 'EU',
  'Moleskine EU', 3200, 26.99, '{}',
  'The legendary notebook. Large format (13×21 cm), 240 acid-free ruled pages with cream-coloured paper. Features rounded corners, an expandable inner pocket, elastic closure and a ribbon bookmark. Hardcover binding. The notebook of Hemingway, Picasso and Chatwin.',
  'in-stock', 40,
  'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)',
  4.7, 923,
  ARRAY['moleskine','notebook','stationery','journal','writing'],
  true
);

-- ── Product variants ──────────────────────────────────────────────────────────

-- Levi's 501 — sizes
insert into public.product_variants (product_id, name, price_delta, available) values
  ('sbd-prd-005', '30×30', null, true),
  ('sbd-prd-005', '32×32', null, true),
  ('sbd-prd-005', '34×32', null, true),
  ('sbd-prd-005', '34×34', null, true),
  ('sbd-prd-005', '36×32', null, true);

-- North Face ThermoBall — sizes
insert into public.product_variants (product_id, name, price_delta, available) values
  ('sbd-prd-006', 'Small',    null, true),
  ('sbd-prd-006', 'Medium',   null, true),
  ('sbd-prd-006', 'Large',    null, true),
  ('sbd-prd-006', 'X-Large',  null, true);

-- Optimum Nutrition Whey — flavours
insert into public.product_variants (product_id, name, price_delta, available) values
  ('sbd-prd-007', 'Double Rich Chocolate', null, true),
  ('sbd-prd-007', 'Vanilla Ice Cream',     null, true),
  ('sbd-prd-007', 'Strawberry',            null, true);
