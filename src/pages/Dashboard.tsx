import { TrendingUp, Eye, MessageSquare, Home, CreditCard, Users, FileBarChart, Building2, Plus } from "lucide-react";
import { properties, leads, formatCurrency } from "@/data/mockData";
import { PropertyCard } from "@/components/PropertyCard";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

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

function SellerDashboard() {
  const myProperties = properties.filter(p => p.ownerId === "user1");
  const activeCount = myProperties.filter(p => p.status === "ativo").length;
  const myLeads = leads.filter(l => myProperties.some(p => p.id === l.propertyId));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Meu painel</h1>
          <p className="text-muted-foreground">Gerencie seus imóveis e acompanhe contatos</p>
        </div>
        <Link
          to="/properties/new"
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Publicar imóvel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Home} label="Imóveis ativos" value={String(activeCount)} />
        <StatCard icon={MessageSquare} label="Leads recebidos" value={String(myLeads.length)} trend="+2 esta semana" />
        <StatCard icon={Eye} label="Visualizações" value="342" trend="+12% mensal" />
        <StatCard icon={CreditCard} label="Plano atual" value="Profissional" />
      </div>

      {/* Plan usage */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-card-foreground">Uso do plano</h3>
          <Link to="/plans" className="text-sm text-accent hover:underline">Fazer upgrade →</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: "20%" }} />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">3 de 15 imóveis</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Meus imóveis</h2>
          <Link to="/properties" className="text-sm text-primary hover:underline">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrokerDashboard() {
  const newLeads = leads.filter((l) => l.status === "novo").length;
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Painel do Corretor</h1>
          <p className="text-muted-foreground">Gerencie seu portfólio e contatos</p>
        </div>
        <Link
          to="/properties/new"
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Publicar imóvel
        </Link>
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
                      lead.status === "novo" ? "bg-accent/20 text-accent" :
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
        <StatCard icon={FileBarChart} label="Faturamento" value="R$ 156M" />
      </div>

      {/* Plan */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-accent font-medium">Plano Imobiliária</p>
            <p className="text-xs text-muted-foreground mt-1">R$ 150/mês · Imóveis ilimitados · 8 usuários ativos</p>
          </div>
          <Link to="/plans" className="px-4 py-2 rounded-lg border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors">
            Gerenciar plano
          </Link>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Imóveis em destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useUserRole();
  if (role === "corretor") return <BrokerDashboard />;
  if (role === "imobiliaria") return <AgencyDashboard />;
  return <SellerDashboard />;
}
