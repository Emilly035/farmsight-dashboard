-- Fix 1: Restrict storage upload to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Users can upload own property images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix 2: Scope corretor/imobiliaria lead access to their own properties' leads
DROP POLICY IF EXISTS "Corretores can view all leads" ON public.leads;
CREATE POLICY "Corretores see own property leads"
ON public.leads FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = leads.property_id
      AND properties.owner_id = auth.uid()
  )
  AND (has_role('corretor'::app_role) OR has_role('imobiliaria'::app_role))
);