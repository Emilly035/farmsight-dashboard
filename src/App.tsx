import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import PropertyDetail from "./pages/PropertyDetail";
import Simulator from "./pages/Simulator";
import Matching from "./pages/Matching";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useState<"comprador" | "corretor" | "imobiliaria">("comprador");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <Dashboard role={role} />
                </DashboardLayout>
              }
            />
            <Route
              path="/search"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <SearchPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/property/:id"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <PropertyDetail />
                </DashboardLayout>
              }
            />
            <Route
              path="/simulator"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <Simulator />
                </DashboardLayout>
              }
            />
            <Route
              path="/matching"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <Matching />
                </DashboardLayout>
              }
            />
            <Route
              path="/leads"
              element={
                <DashboardLayout role={role} onRoleChange={setRole}>
                  <Leads />
                </DashboardLayout>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
