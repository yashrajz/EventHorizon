import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Simple authentication-only route protection
 * Redirects to /signin if user is not authenticated
 *
 * @deprecated Use RoleProtectedRoute for role-based access control
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-bright"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
