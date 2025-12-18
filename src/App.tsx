import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { initAnalytics } from "@/lib/analytics";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SmoothScroll } from "@/components/SmoothScroll";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SubmitEvent from "./pages/SubmitEvent";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { useEffect } from "react";

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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/submit-event" 
                    element={
                      <ProtectedRoute>
                        <SubmitEvent />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/event/:id" element={<EventDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
