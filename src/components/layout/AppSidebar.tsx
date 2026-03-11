import {
  LayoutDashboard,
  Search,
  Home,
  Users,
  FileBarChart,
  MessageSquare,
  Eye,
  LogOut,
  CreditCard,
  Plus,
  Building2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/useUserRole";

interface SidebarProps {
  role: AppRole;
  collapsed: boolean;
  onToggle: () => void;
}

const menusByRole = {
  vendedor: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Meus imóveis", url: "/properties", icon: Home },
    { title: "Publicar imóvel", url: "/properties/new", icon: Plus },
    { title: "Meus leads", url: "/leads", icon: MessageSquare },
    { title: "Meu plano", url: "/plans", icon: CreditCard },
  ],
  corretor: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Imóveis", url: "/properties", icon: Home },
    { title: "Publicar imóvel", url: "/properties/new", icon: Plus },
    { title: "Leads", url: "/leads", icon: MessageSquare },
    { title: "Visualizações", url: "/analytics", icon: Eye },
    { title: "Planos", url: "/plans", icon: CreditCard },
  ],
  imobiliaria: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Anúncios", url: "/properties", icon: Building2 },
    { title: "Novo anúncio", url: "/properties/new", icon: Plus },
    { title: "Leads", url: "/leads", icon: MessageSquare },
    { title: "Usuários", url: "/users", icon: Users },
    { title: "Relatórios", url: "/reports", icon: FileBarChart },
    { title: "Planos", url: "/plans", icon: CreditCard },
  ],
};

const roleLabels = {
  vendedor: "Vendedor",
  corretor: "Corretor",
  imobiliaria: "Imobiliária",
};

export function AppSidebar({ role, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = menusByRole[role];

  return (
    <aside
      className={`bg-gradient-earth flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen border-r border-border`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-accent-foreground text-sm">AV</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-lg font-bold text-sidebar-foreground leading-tight">
              AgroVista<span className="text-gradient-gold">360</span>
            </h1>
          </div>
        )}
      </div>

      {/* Role display (read-only) */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className="px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-foreground text-sm border border-sidebar-border">
            {roleLabels[role]}
          </div>
        </div>
      )}

      {/* Plan indicator */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="px-3 py-2 rounded-md bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent font-medium">Plano Profissional</p>
            <p className="text-[10px] text-muted-foreground">3 de 15 imóveis</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {!collapsed && (
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">
            {roleLabels[role]}
          </p>
        )}
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-accent font-medium"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
              activeClassName=""
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1">
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
