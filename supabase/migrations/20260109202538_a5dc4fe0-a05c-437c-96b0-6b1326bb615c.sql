-- Criar tabela de zonas
CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque por zona
CREATE TABLE public.zone_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(zone_id, product_id)
);

-- Adicionar colunas de zona na tabela orders
ALTER TABLE public.orders ADD COLUMN zone_id UUID REFERENCES public.zones(id);
ALTER TABLE public.orders ADD COLUMN zone_name TEXT;

-- Enable RLS
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_stock ENABLE ROW LEVEL SECURITY;

-- Policies para zones (leitura pública, escrita admin)
CREATE POLICY "Zones are publicly readable" ON public.zones
FOR SELECT USING (true);

CREATE POLICY "Admins can insert zones" ON public.zones
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update zones" ON public.zones
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete zones" ON public.zones
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Policies para zone_stock (leitura pública, escrita admin)
CREATE POLICY "Zone stock is publicly readable" ON public.zone_stock
FOR SELECT USING (true);

CREATE POLICY "Admins can insert zone stock" ON public.zone_stock
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update zone stock" ON public.zone_stock
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete zone stock" ON public.zone_stock
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Inserir zonas iniciais
INSERT INTO public.zones (name, slug, whatsapp_number) VALUES 
('Baixada Fluminense', 'baixada-fluminense', '5521979265042'),
('Zona Oeste', 'zona-oeste', '5521995384648');