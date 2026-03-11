import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "vendedor" | "corretor" | "imobiliaria";

export function useUserRole() {
  const [role, setRole] = useState<AppRole>("vendedor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data, error } = await supabase.rpc("get_user_role");

      if (data && !error) {
        setRole(data as AppRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
}
