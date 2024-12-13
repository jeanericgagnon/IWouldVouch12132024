import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Upload } from 'lucide-react';
import { User } from '../../types/user';

interface BasicInfoSectionProps {
  user: User;
  onUpdate: (field: keyof User, value: string) => void;
}

export function BasicInfoSection({ user, onUpdate }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your basic profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Button className="bg-[#52789e] hover:bg-[#6b9cc3] text-white">
            <Upload className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={user.name}
            onChange={(e) => onUpdate('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={user.title || ''}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => onUpdate('email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={user.location || ''}
            onChange={(e) => onUpdate('location', e.target.value)}
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={user.bio || ''}
            onChange={(e) => onUpdate('bio', e.target.value)}
            className="min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
        </div>
      </CardContent>
    </Card>
  );
}