import { User as UserIcon } from 'lucide-react';
import { Card, CardContent } from "../ui/card";
import type { User } from '../../types/user';

interface UserSearchResultProps {
  user: User;
  onClick: () => void;
}

export function UserSearchResult({ user, onClick }: UserSearchResultProps) {
  return (
    <Card 
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
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
              <UserIcon className="h-5 w-5 text-primary" />
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
  );
}