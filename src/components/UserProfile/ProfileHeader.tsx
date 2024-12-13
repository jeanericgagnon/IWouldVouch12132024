import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Mail, Phone, Linkedin, Briefcase, MapPin } from 'lucide-react';
import { User } from '../../types/user';

interface ProfileHeaderProps {
  user: User;
  isOwner?: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ user, isOwner, onEditProfile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.availability?.isAvailable && (
                <Badge 
                  className="bg-green-500 text-white animate-pulse hover:bg-green-600 transition-colors"
                  title="Open to opportunities"
                >
                  {user.availability.status === 'actively-looking' ? '🔍 Actively Looking' :
                   user.availability.status === 'open' ? '👋 Open to Opportunities' :
                   '🤝 Casually Looking'}
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{user.title}</p>
            
            <div className="mt-4 flex flex-wrap gap-4">
              {user.currentCompany && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{user.currentCompany}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.showEmail && user.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.showPhone && user.phoneNumber && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {user.linkedin && (
              <Button
                className="bg-[#0077b5] hover:bg-[#0077b5]/90"
                onClick={() => window.open(user.linkedin, '_blank')}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            )}
            {isOwner && (
              <Button variant="outline" onClick={onEditProfile}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.bio && (
          <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
        )}
      </CardContent>
    </Card>
  );
}