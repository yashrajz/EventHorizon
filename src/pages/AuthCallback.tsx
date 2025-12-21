import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '@/lib/mongodb';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get token from URL search params (MongoDB email verification)
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (type === 'email-verification' && token) {
          // Handle email verification using MongoDB API
          const response = await apiClient.verifyEmail(token);

          if (!response.success) {
            console.error('Email verification error:', response.error);
            toast.error('Failed to verify email. The link may be invalid or expired.');
            navigate('/signin');
            return;
          }

          toast.success('Email verified successfully! You can now sign in.');
          navigate('/signin');
          return;
        }

        // If we get here, no valid callback parameters found
        console.log('No valid callback parameters found');
        toast.error('Invalid callback link.');
        navigate('/signin');

      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast.error('An error occurred during verification.');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Processing request...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we verify your request.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;