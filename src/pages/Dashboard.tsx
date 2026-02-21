import { TrendingUp, Eye, MessageSquare, Heart, Sparkles, Calculator, Users, FileBarChart, Building2 } from "lucide-react";
import { properties, leads, formatCurrency } from "@/data/mockData";
import { PropertyCard } from "@/components/PropertyCard";
import { ScoreBadge } from "@/components/ScoreBadge";
import { Link } from "react-router-dom";

interface DashboardProps {
  role: "comprador" | "corretor" | "imobiliaria";
}

function StatCard({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold text-card-foreground mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {trend && <p className="text-xs text-success mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</p>}
    </div>
  );
}

function BuyerDashboard() {
  const recommended = properties.slice(0, 3);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Bom dia, João</h1>
        <p className="text-muted-foreground">Veja propriedades que combinam com seu perfil</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Sparkles} label="Recomendações" value="12" trend="+3 novas" />
        <StatCard icon={Heart} label="Favoritos" value="5" />
        <StatCard icon={Eye} label="Visualizados" value="28" trend="+8 esta semana" />
        <StatCard icon={Calculator} label="Simulações" value="6" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Recomendações para você</h2>
          <Link to="/matching" className="text-sm text-primary hover:underline">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Simulação rápida</h2>
          <Link to="/simulator" className="text-sm text-primary hover:underline">Abrir simulador →</Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Cultura</p>
              <p className="text-lg font-semibold text-card-foreground">Soja</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Área simulada</p>
              <p className="text-lg font-semibold text-card-foreground">500 ha</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI estimado</p>
              <p className="text-lg font-semibold text-success">102%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrokerDashboard() {
  const newLeads = leads.filter((l) => l.status === "novo").length;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Painel do Corretor</h1>
        <p className="text-muted-foreground">Gerencie suas propriedades e leads</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Propriedades" value={String(properties.length)} />
        <StatCard icon={MessageSquare} label="Leads novos" value={String(newLeads)} trend={`${newLeads} pendentes`} />
        <StatCard icon={Eye} label="Visualizações" value="1.247" trend="+18% mensal" />
        <StatCard icon={TrendingUp} label="Conversão" value="12%" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Leads recentes</h2>
          <Link to="/leads" className="text-sm text-primary hover:underline">Ver todos →</Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Propriedade</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm text-card-foreground font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{lead.propertyName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lead.status === "novo" ? "bg-accent/20 text-accent-foreground" :
                      lead.status === "contato" ? "bg-primary/10 text-primary" :
                      "bg-success/10 text-success"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AgencyDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Painel da Imobiliária</h1>
        <p className="text-muted-foreground">Visão geral do negócio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Anúncios ativos" value={String(properties.length)} trend="+2 este mês" />
        <StatCard icon={Users} label="Corretores" value="8" />
        <StatCard icon={MessageSquare} label="Total de leads" value={String(leads.length)} trend="+15% mensal" />
        <StatCard icon={FileBarChart} label="Valor em carteira" value="R$ 156M" />
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Propriedades em destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ role }: DashboardProps) {
  if (role === "corretor") return <BrokerDashboard />;
  if (role === "imobiliaria") return <AgencyDashboard />;
  return <BuyerDashboard />;
}
