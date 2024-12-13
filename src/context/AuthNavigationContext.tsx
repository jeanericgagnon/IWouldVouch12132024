import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'sign-in' | 'sign-up' | 'write-recommendation';

interface AuthNavigationContextType {
  mode: AuthMode | null;
  returnPath: string | null;
  navigateToAuth: (mode: AuthMode, returnPath?: string) => void;
  clearReturnPath: () => void;
}

const AuthNavigationContext = createContext<AuthNavigationContextType | undefined>(undefined);

export function AuthNavigationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const navigate = useNavigate();

  const navigateToAuth = (newMode: AuthMode, path?: string) => {
    setMode(newMode);
    
    if (path) {
      setReturnPath(path);
      sessionStorage.setItem('returnPath', path);
    }

    switch (newMode) {
      case 'sign-in':
        navigate('/signin');
        break;
      case 'sign-up':
        navigate('/signup');
        break;
      case 'write-recommendation':
        navigate('/write-recommendation');
        break;
    }
  };

  const clearReturnPath = () => {
    setReturnPath(null);
    sessionStorage.removeItem('returnPath');
  };

  return (
    <AuthNavigationContext.Provider 
      value={{ 
        mode, 
        returnPath, 
        navigateToAuth, 
        clearReturnPath 
      }}
    >
      {children}
    </AuthNavigationContext.Provider>
  );
}

export function useAuthNavigation() {
  const context = useContext(AuthNavigationContext);
  if (!context) {
    throw new Error('useAuthNavigation must be used within an AuthNavigationProvider');
  }
  return context;
}