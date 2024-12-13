import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CreatePasswordForm } from './CreatePasswordForm';
import queryString from 'query-string';
import { toast } from 'react-hot-toast';

export function LinkedInCallback() {
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLinkedInCallback, createPasswordAfterLinkedIn } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, error: oauthError, state } = queryString.parse(location.search);

        // Verify state to prevent CSRF attacks
        const storedState = sessionStorage.getItem('linkedinState');
        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }
        sessionStorage.removeItem('linkedinState');

        if (oauthError) {
          console.error('OAuth error:', oauthError);
          throw new Error(oauthError as string);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        console.log('Processing LinkedIn callback with code');
        const result = await handleLinkedInCallback(code as string);
        console.log('LinkedIn callback result:', result);
        
        if (result.requiresPassword) {
          setEmail(result.email);
          setShowPasswordForm(true);
        } else {
          // Redirect to intended destination or profile
          const redirectUrl = sessionStorage.getItem('postAuthRedirect');
          if (redirectUrl) {
            sessionStorage.removeItem('postAuthRedirect');
            navigate(redirectUrl);
          } else {
            navigate('/profile');
          }
          toast.success('Successfully signed in with LinkedIn!');
        }
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, handleLinkedInCallback]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Failed</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm mt-2">Redirecting to sign in page...</p>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Your Password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please create a password to complete your account setup
            </p>
          </div>
          <CreatePasswordForm 
            email={email}
            onSubmit={async (password) => {
              try {
                await createPasswordAfterLinkedIn(email, password);
                toast.success('Account setup completed!');
                navigate('/profile');
              } catch (err) {
                console.error('Error creating password:', err);
                toast.error('Failed to complete account setup');
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing Sign In</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}