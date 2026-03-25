import { useState } from "react";
import { MessageSquare, Phone, Mail, Calendar } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";

export default function Leads() {
  const { data: leads = [], isLoading } = useLeads();
  const [filter, setFilter] = useState<"all" | "novo" | "contato" | "fechado">("all");

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const statusColors: Record<string, string> = {
    novo: "bg-accent/20 text-accent-foreground",
    contato: "bg-primary/10 text-primary",
    fechado: "bg-success/10 text-success",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Carregando leads...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-primary" />
          Painel de Leads
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie seus contatos e oportunidades</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "novo", "contato", "fechado"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f === "all" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({leads.filter((l) => l.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lead cards */}
      <div className="space-y-3">
        {filtered.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-border bg-card p-5 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-card-foreground">{lead.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{lead.message}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>
                  {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>}
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(lead.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Propriedade</p>
                <p className="text-sm font-medium text-card-foreground">{lead.propertyName}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum lead encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
