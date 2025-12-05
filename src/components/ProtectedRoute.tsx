import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// This is a placeholder for authentication check
// Replace with your actual authentication logic
const isAuthenticated = () => {
  // TODO: Check if user is authenticated (e.g., check token in localStorage)
  // return !!localStorage.getItem('authToken');
  return false; // For now, always require sign in
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to sign in page, but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
