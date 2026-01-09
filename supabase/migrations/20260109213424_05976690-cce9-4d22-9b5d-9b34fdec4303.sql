-- Create function to get best selling products based on orders
CREATE OR REPLACE FUNCTION public.get_best_selling_products(limit_count int DEFAULT 12)
RETURNS TABLE (
  product_id uuid,
  total_sold bigint
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    (item->>'product_id')::uuid as product_id,
    SUM((item->>'quantity')::int) as total_sold
  FROM orders, jsonb_array_elements(items) as item
  GROUP BY item->>'product_id'
  ORDER BY total_sold DESC
  LIMIT limit_count;
$$;

-- Create bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: anyone can view product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

-- Policy: admins can upload product images
CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: admins can update product images
CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: admins can delete product images
CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);