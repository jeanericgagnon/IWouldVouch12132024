import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthNavigation } from '../../context/AuthNavigationContext';
import { useAuth } from '../../hooks/useAuth';
import { Auth } from './Auth';
import { toast } from 'react-hot-toast';

export function AuthContainer() {
  const location = useLocation();
  const { mode, returnPath, clearReturnPath, navigateWithAuth } = useAuthNavigation();
  const { isAuthenticated, navigate } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const path = returnPath || '/profile';
      navigate(path);
      clearReturnPath();
      toast.success('Successfully signed in!');
    }
  }, [isAuthenticated, navigate, returnPath, clearReturnPath]);

  useEffect(() => {
    // Set initial mode based on URL
    const currentMode = location.pathname === '/signup' ? 'sign-up' : 'sign-in';
    if (mode !== currentMode) {
      const currentReturnPath = sessionStorage.getItem('returnPath');
      if (currentReturnPath) {
        navigateWithAuth(currentMode, currentReturnPath);
      } else {
        navigateWithAuth(currentMode);
      }
    }
  }, [location.pathname, mode, navigateWithAuth]);

  return (
    <Auth 
      defaultMode={mode === 'sign-up' ? 'signup' : 'signin'} 
      onModeSwitch={(newMode) => {
        navigateWithAuth(
          newMode === 'signup' ? 'sign-up' : 'sign-in',
          returnPath || undefined
        );
      }}
    />
  );
}