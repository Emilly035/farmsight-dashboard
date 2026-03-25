
-- Replace the overly permissive INSERT policy with one that ensures required fields
DROP POLICY "Anyone can create leads" ON public.leads;

CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND email IS NOT NULL AND property_id IS NOT NULL
  );
