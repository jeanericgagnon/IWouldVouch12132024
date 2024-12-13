import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    // Store the attempted URL in sessionStorage
    sessionStorage.setItem('postAuthRedirect', location.pathname);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}