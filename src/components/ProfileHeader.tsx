import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Linkedin } from 'lucide-react';
import { User } from '../types/user';

interface ProfileHeaderProps {
  user: User;
  isOwner?: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ user, isOwner, onEditProfile }: ProfileHeaderProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-xl sm:text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.title}</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
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
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>
          {user.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`${
                      skill.type === 'soft' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}