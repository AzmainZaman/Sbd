-- Upsert reference categories so production always has the full set.
-- Safe to re-run: ON CONFLICT DO NOTHING skips existing rows.

-- Allowed slugs defined by categories_slug_check: electronics, beauty, fashion, supplements, home, kids, other
insert into public.categories (slug, label, hero_gradient) values
  ('beauty',      'Beauty & Skincare',    'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e8bdd8 100%)'),
  ('electronics', 'Electronics',          'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #c5cae9 100%)'),
  ('fashion',     'Fashion & Apparel',    'linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe0b2 100%)'),
  ('supplements', 'Health & Supplements', 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #dcedc8 100%)'),
  ('home',        'Home & Living',        'linear-gradient(135deg, #fdf6ec 0%, #f5e6d3 50%, #ede0c8 100%)'),
  ('kids',        'Kids & Baby',          'linear-gradient(135deg, #e8f5e9 0%, #dcedc8 50%, #f0f4c3 100%)'),
  ('other',       'Other',                'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 50%, #e0e0e0 100%)')
on conflict (slug) do nothing;
