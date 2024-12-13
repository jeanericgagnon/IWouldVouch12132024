import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { AuthContainer } from './components/Auth/AuthContainer';
import { LinkedInCallback } from './components/LinkedInCallback';
import { LandingPage } from './components/LandingPage';
import { UserProfile } from './components/UserProfile/UserProfile';
import { UserSearch } from './components/WriteReference/UserSearch';
import { WriteReferenceForm } from './components/WriteReference/WriteReferenceForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthNavigationProvider } from './context/AuthNavigationContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <AuthNavigationProvider>
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" />
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<AuthContainer />} />
          <Route path="/signup" element={<AuthContainer />} />
          <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
          <Route path="/write-recommendation" element={<UserSearch />} />
          <Route 
            path="/write-recommendation/:userId" 
            element={
              <ProtectedRoute>
                <WriteReferenceForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthNavigationProvider>
  );
}