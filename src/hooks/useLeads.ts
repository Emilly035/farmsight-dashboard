import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/types/property";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, property:properties(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        ...l,
        propertyName: l.property?.name ?? "—",
      })) as (Lead & { propertyName: string })[];
    },
  });
}
