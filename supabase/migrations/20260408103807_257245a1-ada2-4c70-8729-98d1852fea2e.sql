-- Fix 1: Block INSERT/UPDATE/DELETE on user_roles for regular users
CREATE POLICY "No one can insert roles directly"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "No one can update roles directly"
ON public.user_roles FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "No one can delete roles directly"
ON public.user_roles FOR DELETE TO authenticated
USING (false);

-- Fix 2: Replace overly permissive ALL policy on leads with scoped policies
DROP POLICY IF EXISTS "Owners can manage leads for own properties" ON public.leads;

CREATE POLICY "Owners can view leads for own properties"
ON public.leads FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = leads.property_id
      AND properties.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete leads for own properties"
ON public.leads FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = leads.property_id
      AND properties.owner_id = auth.uid()
  )
);