import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthNavigation } from '../../context/AuthNavigationContext';
import { UserSearchInput } from './UserSearchInput';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { LogIn } from 'lucide-react';
import { Button } from '../ui/button';

export function RecommendationSearch() {
  const { isAuthenticated } = useAuth();
  const { navigateWithAuth } = useAuthNavigation();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Write a Recommendation</CardTitle>
            <CardDescription>Connect and share professional recommendations</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="max-w-sm mx-auto space-y-4">
              <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold">Sign in to write recommendation</h3>
              <Button 
                onClick={() => navigateWithAuth('sign-in', '/write-recommendation')}
                className="bg-[#52789e] hover:bg-[#6b9cc3] w-full"
              >
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <UserSearchInput />;
}