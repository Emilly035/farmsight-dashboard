
-- Properties table
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  location text NOT NULL,
  state text NOT NULL,
  total_area numeric NOT NULL,
  productive_area numeric NOT NULL DEFAULT 0,
  soil_type text,
  avg_rainfall numeric,
  infrastructure text[] DEFAULT '{}',
  suggested_crops text[] DEFAULT '{}',
  price numeric NOT NULL,
  price_per_hectare numeric,
  productivity_score integer DEFAULT 0,
  image text,
  images text[] DEFAULT '{}',
  lat numeric,
  lng numeric,
  description text,
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'vendido')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own properties
CREATE POLICY "Owners can manage own properties"
  ON public.properties FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Corretores and imobiliarias can view all active properties
CREATE POLICY "Corretores can view active properties"
  ON public.properties FOR SELECT TO authenticated
  USING (
    status = 'ativo' AND (
      public.has_role('corretor') OR public.has_role('imobiliaria')
    )
  );

-- Public can view active properties (for search page)
CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT TO anon
  USING (status = 'ativo');

-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contato', 'fechado')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Property owners can view and manage leads for their properties
CREATE POLICY "Owners can manage leads for own properties"
  ON public.leads FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = leads.property_id
      AND properties.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = leads.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Corretores/imobiliarias can view all leads
CREATE POLICY "Corretores can view all leads"
  ON public.leads FOR SELECT TO authenticated
  USING (
    public.has_role('corretor') OR public.has_role('imobiliaria')
  );

-- Anyone can create a lead (contact form)
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);
