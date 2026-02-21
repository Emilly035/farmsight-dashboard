import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "comprador" | "corretor" | "imobiliaria";
  onRoleChange: (role: "comprador" | "corretor" | "imobiliaria") => void;
}

export function DashboardLayout({ children, role, onRoleChange }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        role={role}
        onRoleChange={onRoleChange}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-card">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">JD</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
