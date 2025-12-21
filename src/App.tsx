import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { initAnalytics } from "@/lib/analytics";

import RoleProtectedRoute from "@/components/RoleProtectedRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import SubmitEvent from "./pages/SubmitEvent";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminEventReview from "./pages/AdminEventReview";
import Profile from "./pages/Profile";

// Legal / Info
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Legal from "./pages/Legal";
import Blog from "./pages/Blog";
import Partners from "./pages/Partners";
import Community from "./pages/Community";

// Attendant
import AttendantLayout from "@/pages/attendant/AttendantLayout";
import AttendantDashboard from "@/pages/attendant/AttendantDashboard";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <SearchProvider>
              <Toaster />
              <Sonner />
              <SmoothScroll />
              <BrowserRouter>
                <SmoothCursor />

                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/blog" element={<Blog />} />

                  {/* Legal */}
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/community" element={<Community />} />

                  {/* Auth */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* User Dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <RoleProtectedRoute allowedRoles={["user", "attendant"]}>
                        <Dashboard />
                      </RoleProtectedRoute>
                    }
                  />
                  {/* Profile */}
                  <Route 
                    path="/profile"
                    element={
                      <RoleProtectedRoute allowedRoles={["user", "attendant", "admin", "superadmin"]}>
                        <Profile />
                      </RoleProtectedRoute>
                    }
                  />
                  {/* Admin Dashboard */}
                  <Route 
                    path="/admin" 
                    element={
                      <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                        <Admin />
                      </RoleProtectedRoute>
                    } 
                  />

                  {/* Admin Event Review */}
                  <Route 
                    path="/admin/events" 
                    element={
                      <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                        <AdminEventReview />
                      </RoleProtectedRoute>
                    } 
                  />

                  {/* Submit Event */}
                  <Route
                    path="/submit-event"
                    element={
                      <RoleProtectedRoute allowedRoles={["user", "attendant"]} redirectTo="/signin">
                        <SubmitEvent />
                      </RoleProtectedRoute>
                    }
                  />

                  {/* Attendant Routes */}
                  <Route
                    path="/attendant"
                    element={
                      <RoleProtectedRoute allowedRoles={["attendant"]}>
                        <AttendantLayout />
                      </RoleProtectedRoute>
                    }
                  >
                    <Route index element={<AttendantDashboard />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SearchProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
