import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { mockUsers } from '../../data/mockData';
import { UserSearchResult } from './UserSearchResult';
import { useDebounce } from '../../hooks/common/useDebounce';

export function UserSearchInput() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();

  const searchResults = mockUsers.filter(user => 
    user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    user.title?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {searchResults.map((user) => (
              <UserSearchResult
                key={user.id}
                user={user}
                onClick={() => navigate(`/write-recommendation/${user.id}`)}
              />
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}