import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Building2, MapPin } from 'lucide-react';
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { mockUsers } from '../../data/mockData';
import { useDebounce } from '../../hooks/common/useDebounce';

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockUsers);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery) {
      const filtered = mockUsers.filter(user => 
        user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.currentCompany?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.location?.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockUsers);
    }
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Recommendation</CardTitle>
          <CardDescription>Search for someone you'd like to recommend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Card 
                  key={user.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/write-recommendation/${user.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-lg">{user.name}</div>
                        {user.title && (
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            {user.title}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          {user.currentCompany && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {user.currentCompany}
                            </div>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching "{searchQuery}"
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}