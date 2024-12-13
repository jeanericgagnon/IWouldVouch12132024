import { useState } from 'react';
import { Button } from "./ui/button";
import { Linkedin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CreatePasswordForm } from './CreatePasswordForm';
import { toast } from 'react-hot-toast';

interface AuthProps {
  defaultMode: 'signin' | 'signup';
  onModeSwitch?: (mode: 'signin' | 'signup') => void;
}

export function Auth({ defaultMode = 'signin', onModeSwitch }: AuthProps) {
  const [mode] = useState<'signin' | 'signup'>(defaultMode);
  const [error, setError] = useState('');
  const { signInWithLinkedIn } = useAuth();

  const handleLinkedInAuth = async () => {
    try {
      console.log('Starting LinkedIn auth flow...');
      await signInWithLinkedIn();
    } catch (err) {
      console.error('LinkedIn auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'signin' 
              ? "Sign in with LinkedIn" 
              : "Create an account using LinkedIn"}
          </p>
          <div className="mt-2">
            <Button
              variant="link"
              onClick={() => onModeSwitch?.(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleLinkedInAuth}
            className="w-full bg-[#0A66C2] hover:bg-[#004182]"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            {mode === 'signin' ? 'Sign in with LinkedIn' : 'Continue with LinkedIn'}
          </Button>
        </div>
      </div>
    </div>
  );
}