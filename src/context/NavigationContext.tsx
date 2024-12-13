import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type NavigationMode = 'write-recommendation' | 'sign-in' | 'sign-up' | null;

interface NavigationContextType {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  navigateWithMode: (mode: NavigationMode, returnPath?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavigationMode>(null);
  const navigate = useNavigate();

  const navigateWithMode = (newMode: NavigationMode, returnPath?: string) => {
    if (returnPath) {
      sessionStorage.setItem('returnPath', returnPath);
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
      default:
        if (returnPath) {
          navigate(returnPath);
        }
    }
    setMode(newMode);
  };

  return (
    <NavigationContext.Provider value={{ mode, setMode, navigateWithMode }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}