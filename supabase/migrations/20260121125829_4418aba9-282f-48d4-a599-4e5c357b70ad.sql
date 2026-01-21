-- Add second image URL column for products
ALTER TABLE public.products ADD COLUMN image_url_2 text;

-- Add status column to track product availability manually
ALTER TABLE public.products ADD COLUMN status text NOT NULL DEFAULT 'em-estoque' CHECK (status IN ('em-estoque', 'sob-encomenda', 'esgotado'));