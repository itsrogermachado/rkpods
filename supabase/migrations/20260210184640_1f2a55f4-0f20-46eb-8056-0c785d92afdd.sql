
-- Add filtering columns to coupons
ALTER TABLE public.coupons
  ADD COLUMN product_ids uuid[] DEFAULT '{}',
  ADD COLUMN category_ids uuid[] DEFAULT '{}',
  ADD COLUMN zone_ids uuid[] DEFAULT '{}';
