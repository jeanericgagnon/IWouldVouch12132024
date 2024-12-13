import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { mockUsers } from '../../data/mockData';
import { toast } from 'react-hot-toast';

export function SearchUser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockUsers);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = query 
      ? mockUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.title?.toLowerCase().includes(query.toLowerCase())
        )
      : mockUsers;
    setSearchResults(filtered);
  };

  const handleUserSelect = (userId: string) => {
    navigate(`/write-reference/${userId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or title..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Card 
                  key={user.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleUserSelect(user.id)}
                >
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
        </CardContent>
      </Card>
    </div>
  );
}