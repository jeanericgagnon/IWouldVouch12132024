import { useState, useEffect } from 'react';
import { User } from '../../types/user';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Eye, EyeOff } from 'lucide-react';

interface ProfileSettingsFormProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  setHasUnsavedChanges: (value: boolean) => void;
}

export function ProfileSettingsForm({ user, onUpdate, setHasUnsavedChanges }: ProfileSettingsFormProps) {
  const handleUpdate = (updates: Partial<User>) => {
    onUpdate(updates);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={user.title || ''}
              onChange={(e) => handleUpdate({ title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCompany">Current Company</Label>
            <div className="relative">
              <Input
                id="currentCompany"
                value={user.currentCompany || ''}
                onChange={(e) => handleUpdate({ currentCompany: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleUpdate({ showCompany: !user.showCompany })}
              >
                {user.showCompany ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={user.bio || ''}
              onChange={(e) => handleUpdate({ bio: e.target.value })}
              className="min-h-[150px] resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage your contact details and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => handleUpdate({ email: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleUpdate({ showEmail: !user.showEmail })}
              >
                {user.showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                value={user.phoneNumber || ''}
                onChange={(e) => handleUpdate({ phoneNumber: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleUpdate({ showPhone: !user.showPhone })}
              >
                {user.showPhone ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                value={user.location || ''}
                onChange={(e) => handleUpdate({ location: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => handleUpdate({ showLocation: !user.showLocation })}
              >
                {user.showLocation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}