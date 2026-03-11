import { useNavigate } from "react-router-dom";
import { useUserRole, type AppRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !allowedRoles.includes(role)) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, role, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
