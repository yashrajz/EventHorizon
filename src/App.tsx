import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SearchProvider } from "@/contexts/SearchContext";
import { initAnalytics } from "@/lib/analytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SubmitEvent from "./pages/SubmitEvent";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Careers from "./pages/Careers";
import HelpCenter from "./pages/HelpCenter";
import Legal from "./pages/Legal";
import Blog from "./pages/Blog";
import Partners from "./pages/Partners";
import Community from "./pages/Community";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminEventForm from "@/pages/admin/AdminEventForm";
import AdminEventView from "@/pages/admin/AdminEventView";
import AdminRegistrations from "@/pages/admin/AdminRegistrations";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
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
          <SearchProvider>
            <Toaster />
            <Sonner />
            <SmoothScroll />
            <BrowserRouter>
              <AuthProvider>
                <AdminAuthProvider>
                  <AdminDataProvider>
                    <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/event/:id" element={<EventDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/community" element={<Community />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* User Protected Routes */}
                    <Route 
                      path="/submit-event" 
                      element={
                        <RoleProtectedRoute allowedRoles={["user", "admin", "superadmin", "attendant"]}>
                          <SubmitEvent />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                          <AdminLayout />
                        </RoleProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="events" element={<AdminEvents />} />
                      <Route path="events/new" element={<AdminEventForm />} />
                      <Route path="events/:id" element={<AdminEventForm />} />
                      <Route path="events/:id/view" element={<AdminEventView />} />
                      <Route path="registrations" element={<AdminRegistrations />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                    
                    {/* Conference Attendant Routes */}
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
                    
                    {/* 404 - Must be last */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminDataProvider>
                </AdminAuthProvider>
              </AuthProvider>
            </BrowserRouter>
          </SearchProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
