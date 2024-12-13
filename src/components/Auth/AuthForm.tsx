import { Button } from "../ui/button";
import { Linkedin } from 'lucide-react';
import { CardContainer } from "../ui/common/Card";

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onModeSwitch: () => void;
  onLinkedInAuth: () => void;
  error?: string;
}

export function AuthForm({ mode, onModeSwitch, onLinkedInAuth, error }: AuthFormProps) {
  return (
    <CardContainer
      className="w-full max-w-md mx-auto"
      contentClassName="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === 'signin' 
            ? "Sign in with LinkedIn" 
            : "Create an account using LinkedIn"}
        </p>
        <Button
          variant="link"
          onClick={onModeSwitch}
          className="mt-2"
        >
          {mode === 'signin' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={onLinkedInAuth}
        className="w-full bg-[#0A66C2] hover:bg-[#004182]"
      >
        <Linkedin className="w-5 h-5 mr-2" />
        {mode === 'signin' ? 'Sign in with LinkedIn' : 'Continue with LinkedIn'}
      </Button>
    </CardContainer>
  );
}