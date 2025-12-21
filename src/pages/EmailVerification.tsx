import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { apiClient } from "@/lib/mongodb";
import { toast } from "sonner";

const EmailVerification = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await apiClient.verifyEmail(token);
        
        if (response.success) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified! You can now sign in to your account.');
          toast.success('Email verified successfully!');
        } else {
          setVerificationStatus('error');
          setMessage(response.message || 'Failed to verify email. The link may have expired.');
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setMessage(error.message || 'An error occurred while verifying your email.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleContinueToSignIn = () => {
    navigate('/signin', { 
      state: { 
        message: 'Your email has been verified! You can now sign in to your account.' 
      } 
    });
  };

  return (
    <>
      <SEO 
        title="Email Verification - EventHorizon"
        description="Verify your email address to complete your EventHorizon account setup."
      />
      <Header />
      
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 pb-12">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Loading State */}
            {verificationStatus === 'loading' && (
              <>
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Verifying Your Email
                  </h1>
                  <p className="text-muted-foreground">
                    Please wait while we verify your email address...
                  </p>
                </div>
              </>
            )}

            {/* Success State */}
            {verificationStatus === 'success' && (
              <>
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Email Verified Successfully!
                  </h1>
                  <p className="text-muted-foreground">
                    {message}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleContinueToSignIn}
                    className="w-full"
                  >
                    Continue to Sign In
                  </Button>
                  
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Go to Homepage
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Error State */}
            {verificationStatus === 'error' && (
              <>
                <div className="mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Verification Failed
                  </h1>
                  <p className="text-muted-foreground">
                    {message}
                  </p>
                </div>

                <div className="space-y-4">
                  <Link to="/signin">
                    <Button variant="outline" className="w-full">
                      Go to Sign In
                    </Button>
                  </Link>
                  
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Create New Account
                    </Button>
                  </Link>
                  
                  <Link to="/">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link to="/contact" className="text-accent hover:text-accent/80">
                  Contact support
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default EmailVerification;