import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "vendedor" | "corretor" | "imobiliaria";

export function useUserRole() {
  const [role, setRole] = useState<AppRole>("vendedor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (data && !error) {
        setRole(data.role as AppRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
