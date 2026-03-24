-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (name, slug) VALUES 
('Laços Infantis', 'lacos-infantil'), 
('Laços Adulto', 'lacos-adulto'), 
('Tiaras Aramadas', 'tiaras'), 
('Pulseiras', 'pulseiras')
ON CONFLICT (slug) DO NOTHING;

-- 2. Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view collections" ON public.collections;
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
CREATE POLICY "Admins can manage collections" ON public.collections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed collections
INSERT INTO public.collections (name, slug) VALUES 
('Carnaval', 'carnaval'), 
('São João', 'sao-joao'), 
('Natal', 'natal'), 
('Ano Novo', 'ano-novo'), 
('Escolar', 'escolar'), 
('Especiais', 'especiais')
ON CONFLICT (slug) DO NOTHING;

-- 3. Drop constraints on products
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_collection_check;

-- 4. Add colors to products Table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}';
