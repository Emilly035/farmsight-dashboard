import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/AuthGuard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyNew from "./pages/PropertyNew";
import Simulator from "./pages/Simulator";
import Matching from "./pages/Matching";
import Leads from "./pages/Leads";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState<"vendedor" | "corretor" | "imobiliaria">("vendedor");

  const withLayout = (page: React.ReactNode) => (
    <AuthGuard>
      <DashboardLayout role={role} onRoleChange={setRole}>
        {page}
      </DashboardLayout>
    </AuthGuard>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={withLayout(<Dashboard role={role} />)} />
            <Route path="/search" element={withLayout(<SearchPage />)} />
            <Route path="/properties" element={withLayout(<SearchPage />)} />
            <Route path="/properties/new" element={withLayout(<PropertyNew />)} />
            <Route path="/property/:id" element={withLayout(<PropertyDetail />)} />
            <Route path="/simulator" element={withLayout(<Simulator />)} />
            <Route path="/matching" element={withLayout(<Matching />)} />
            <Route path="/leads" element={withLayout(<Leads />)} />
            <Route path="/plans" element={withLayout(<Plans />)} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
