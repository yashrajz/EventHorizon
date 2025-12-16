import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
  roles?: ("admin" | "superadmin")[];
}

const AdminRoute = ({ children, roles = ["admin", "superadmin"] }: AdminRouteProps) => {
  const { user, hasRole } = useAdminAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  if (!hasRole(roles)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;

