import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { linkedInAuth } from '../lib/linkedin';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const authenticatedUser = await authService.signInWithEmail(email, password);
      setUser(authenticatedUser);
      
      const returnPath = sessionStorage.getItem('returnPath');
      if (returnPath) {
        sessionStorage.removeItem('returnPath');
        navigate(returnPath);
      } else {
        navigate(`/profile/${authenticatedUser.id}`);
      }
      
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Email auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
      throw error;
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    navigate('/');
    toast.success('Signed out successfully');
  };

  return {
    user,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithLinkedIn: linkedInAuth.initiateAuth,
    signOut,
    navigate
  };
}