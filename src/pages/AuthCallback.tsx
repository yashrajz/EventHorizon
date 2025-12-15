import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (Supabase sends tokens in URL hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Also check search params (sometimes tokens are in query params)
        const tokenHash = searchParams.get('token_hash');
        const typeParam = searchParams.get('type');

        if (type === 'signup' || typeParam === 'signup') {
          // Handle email confirmation
          if (tokenHash) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'signup'
            });

            if (error) {
              console.error('Email confirmation error:', error);
              toast.error('Failed to confirm email. Please try again.');
              navigate('/signin');
              return;
            }

            toast.success('Email confirmed successfully! You can now sign in.');
            navigate('/signin');
            return;
          }
        }

        if (accessToken && refreshToken) {
          // Handle OAuth callback or other auth flows
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session error:', error);
            toast.error('Authentication failed. Please try signing in again.');
            navigate('/signin');
            return;
          }

          if (data.user) {
            toast.success('Successfully signed in!');
            navigate('/dashboard');
            return;
          }
        }

        // If we get here, something went wrong
        console.log('No valid auth tokens found');
        toast.error('Authentication link may be invalid or expired.');
        navigate('/signin');

      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('An error occurred during authentication.');
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
            Confirming your account...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;