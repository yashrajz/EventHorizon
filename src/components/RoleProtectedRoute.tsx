import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * RoleProtectedRoute Component
 * 
 * Protects routes based on user authentication and role
 * 
 * @param children - The component to render if authorized
 * @param allowedRoles - Array of roles that can access this route
 * @param redirectTo - Optional custom redirect path (defaults to /login)
 * 
 * Flow:
 * 1. Check if user is authenticated
 * 2. If not authenticated → redirect to /login with return URL
 * 3. If authenticated but wrong role → redirect to user's appropriate dashboard
 * 4. If authenticated with correct role → render children
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = "/login" 
}: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasRole, getRedirectPath } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Authenticated but wrong role → redirect to their appropriate dashboard
  if (!hasRole(allowedRoles)) {
    const userDashboard = getRedirectPath();
    return <Navigate to={userDashboard} replace />;
  }

  // Authenticated with correct role → render protected content
  return <>{children}</>;
};

export default RoleProtectedRoute;
