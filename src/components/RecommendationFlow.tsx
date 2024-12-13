import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockUsers } from '../data/mockData';
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";

interface RecommendationFlowProps {
  onClose: () => void;
}

export function RecommendationFlow({ onClose }: RecommendationFlowProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockUsers);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = query ? mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.title?.toLowerCase().includes(query.toLowerCase())
    ) : mockUsers;
    setSearchResults(filtered);
  };

  const handleUserSelect = (userId: string) => {
    if (!isAuthenticated) {
      setSelectedUserId(userId);
      setShowSignInPrompt(true);
      return;
    }

    onClose();
    navigate(`/write-recommendation/${userId}`);
  };

  const handleSignIn = () => {
    if (selectedUserId) {
      // Store both the target route and userId
      sessionStorage.setItem('postAuthRedirect', `/write-recommendation/${selectedUserId}`);
    }
    onClose();
    navigate('/signin');
  };

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Recommendation</DialogTitle>
          <DialogDescription>
            Search for someone you'd like to recommend
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Card key={user.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => handleUserSelect(user.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {user.title && (
                          <div className="text-sm text-muted-foreground">{user.title}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>

      <AlertDialog open={showSignInPrompt} onOpenChange={setShowSignInPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to sign in to write a recommendation. Would you like to sign in now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSignInPrompt(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignIn}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}