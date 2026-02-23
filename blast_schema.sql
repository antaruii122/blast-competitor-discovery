-- Create blast_products table to avoid conflicts with existing tables
CREATE TABLE public.blast_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT UNIQUE NOT NULL,
    specifications_text TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blast_competitor_matches table
CREATE TABLE public.blast_competitor_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    my_product_id UUID REFERENCES public.blast_products(id) ON DELETE CASCADE,
    competitor_brand TEXT NOT NULL,
    competitor_model TEXT NOT NULL,
    technical_parity_score NUMERIC,
    tier TEXT,
    spec_diffs JSONB,
    match_meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- For quick development, we can disable Row Level Security or allow anon access.
-- The easiest way to prevent issues with reads/writes from the client is configuring policies:

ALTER TABLE public.blast_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blast_competitor_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for all users" ON public.blast_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON public.blast_competitor_matches FOR ALL USING (true) WITH CHECK (true);
