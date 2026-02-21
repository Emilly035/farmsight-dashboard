import {
  LayoutDashboard,
  Search,
  Calculator,
  Heart,
  Sparkles,
  Building2,
  Users,
  FileBarChart,
  MessageSquare,
  Eye,
  Home,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  role: "comprador" | "corretor" | "imobiliaria";
  onRoleChange: (role: "comprador" | "corretor" | "imobiliaria") => void;
  collapsed: boolean;
  onToggle: () => void;
}

const menusByRole = {
  comprador: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Buscar fazendas", url: "/search", icon: Search },
    { title: "Simular lucro", url: "/simulator", icon: Calculator },
    { title: "Recomendações", url: "/matching", icon: Sparkles },
    { title: "Favoritos", url: "/favorites", icon: Heart },
  ],
  corretor: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Propriedades", url: "/search", icon: Home },
    { title: "Leads", url: "/leads", icon: MessageSquare },
    { title: "Visualizações", url: "/analytics", icon: Eye },
  ],
  imobiliaria: [
    { title: "Painel", url: "/dashboard", icon: LayoutDashboard },
    { title: "Anúncios", url: "/search", icon: Building2 },
    { title: "Usuários", url: "/users", icon: Users },
    { title: "Relatórios", url: "/reports", icon: FileBarChart },
  ],
};

const roleLabels = {
  comprador: "Comprador",
  corretor: "Corretor",
  imobiliaria: "Imobiliária",
};

export function AppSidebar({ role, onRoleChange, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = menusByRole[role];

  return (
    <aside
      className={`bg-gradient-earth flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-accent-foreground text-sm">AV</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-lg font-bold text-sidebar-foreground leading-tight">
              AgroVista<span className="text-accent">360</span>
            </h1>
          </div>
        )}
      </div>

      {/* Role Selector */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <select
            value={role}
            onChange={(e) => {
              onRoleChange(e.target.value as typeof role);
              navigate("/dashboard");
            }}
            className="w-full px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-foreground text-sm border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="comprador">👤 Comprador</option>
            <option value="corretor">🤝 Corretor</option>
            <option value="imobiliaria">🏢 Imobiliária</option>
          </select>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {!collapsed && (
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/50 px-3 mb-2">
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
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
