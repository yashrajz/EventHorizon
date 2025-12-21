import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmailToken();
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Store the JWT token if provided
        if (data.data?.token) {
          localStorage.setItem('authToken', data.data.token);
        }

        toast.success('Email verified successfully!');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  const resendVerificationEmail = async () => {
    const email = prompt('Please enter your email address to resend verification:');
    if (!email) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('An error occurred while sending verification email');
    }
  };

  return (
    <>
      <SEO 
        title="Verify Email - EventHorizon"
        description="Verify your email address to complete your EventHorizon registration."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center pt-32 pb-20">
          <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8 text-center"
            >
              {status === 'loading' && (
                <>
                  <Loader2 className="h-16 w-16 text-accent mx-auto mb-4 animate-spin" />
                  <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
                  <p className="text-muted-foreground">
                    Please wait while we verify your email address...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h1>
                  <p className="text-muted-foreground mb-6">
                    {message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to login page in 3 seconds...
                  </p>
                  <Button 
                    onClick={() => navigate('/signin')}
                    className="mt-4 w-full"
                  >
                    Go to Login
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h1>
                  <p className="text-muted-foreground mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={resendVerificationEmail}
                      variant="outline" 
                      className="w-full gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Resend Verification Email
                    </Button>
                    <Button 
                      onClick={() => navigate('/signin')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VerifyEmail;