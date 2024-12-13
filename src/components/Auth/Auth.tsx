import { useState } from 'react';
import { Button } from "../ui/button";
import { Linkedin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { EmailPasswordForm } from './EmailPasswordForm';
import { toast } from 'react-hot-toast';
import { CardContainer } from "../ui/common/Card";

interface AuthProps {
  defaultMode: 'signin' | 'signup';
  onModeSwitch: (mode: 'signin' | 'signup') => void;
}

export function Auth({ defaultMode, onModeSwitch }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const { signInWithLinkedIn, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailAuth = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (defaultMode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err) {
      console.error('Email auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    try {
      setLoading(true);
      await signInWithLinkedIn();
    } catch (err) {
      console.error('LinkedIn auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <CardContainer
        className="w-full max-w-md mx-auto"
        contentClassName="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {defaultMode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {defaultMode === 'signin' 
              ? "Sign in with LinkedIn or email" 
              : "Create an account using LinkedIn or email"}
          </p>
          <Button
            variant="link"
            onClick={() => onModeSwitch(defaultMode === 'signin' ? 'signup' : 'signin')}
            className="mt-2"
          >
            {defaultMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </Button>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleLinkedInAuth}
            disabled={loading}
            className="w-full bg-[#0A66C2] hover:bg-[#004182]"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            {defaultMode === 'signin' ? 'Sign in with LinkedIn' : 'Continue with LinkedIn'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <EmailPasswordForm
            mode={defaultMode}
            onSubmit={handleEmailAuth}
            loading={loading}
          />
        </div>
      </CardContainer>
    </div>
  );
}