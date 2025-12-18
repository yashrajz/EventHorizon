import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ClickSpark from "@/components/ClickSpark";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";

/**
 * Unified Login Page
 * 
 * Handles authentication for all user types:
 * - Admin/Superadmin → /admin
 * - Conference Attendant → /attendant
 * - Normal User → / (or requested page)
 * 
 * Demo Credentials:
 * - Admin: admin@eventhorizon.com / admin123
 * - Attendant: attendant@eventhorizon.com / attendant123
 * - User: user@example.com / user123
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, getRedirectPath } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the page user was trying to access (or default to role-based redirect)
  const from = (location.state as any)?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await signIn(formData.email, formData.password);

      if (success) {
        toast.success("Welcome back!");
        
        // Redirect to requested page or role-based dashboard
        const redirectPath = from || getRedirectPath();
        navigate(redirectPath, { replace: true });
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <SEO 
        title="Login"
        description="Sign in to EventHorizon to access your dashboard and manage your account."
        url={`${window.location.origin}/login`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to access your account
              </p>
            </motion.div>

            {/* Demo Credentials Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Demo Credentials:</strong>
                  <div className="mt-2 space-y-1 text-xs">
                    <div>Admin: admin@eventhorizon.com / admin123</div>
                    <div>Attendant: attendant@eventhorizon.com / attendant123</div>
                    <div>User: user@example.com / user123</div>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Sign In Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-2 text-muted-foreground">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </motion.p>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </ClickSpark>
  );
};

export default Login;
