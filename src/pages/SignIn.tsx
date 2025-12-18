import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ClickSpark from "@/components/ClickSpark";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, getRedirectPath } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signIn(formData.email, formData.password);

      if (!success) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      navigate(from || getRedirectPath(), { replace: true });
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <ClickSpark sparkColor="#6b7280" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      <SEO
        title="Sign In"
        description="Sign in to EventHorizon to submit events, manage your profile, and access exclusive features."
        url={`${window.location.origin}/signin`}
      />

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
                Welcome <span className="text-accent">Back</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-11 bg-muted/50 border-glass-border"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-11 bg-muted/50 border-glass-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.remember}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, remember: checked as boolean }))
                    }
                  />
                  <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl py-6"
                >
                  {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="ml-2 h-5 w-5" /></>}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-accent font-semibold">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </ClickSpark>
  );
};

export default SignIn;
