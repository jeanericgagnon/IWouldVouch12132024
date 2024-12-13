import { useState } from 'react';
import { User } from '../../types/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sun, Moon, Globe, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PreferencesFormProps {
  user: User;
  setHasUnsavedChanges: (value: boolean) => void;
}

export function PreferencesForm({ user, setHasUnsavedChanges }: PreferencesFormProps) {
  const { theme, setTheme } = useTheme();
  const [privacy, setPrivacy] = useState('public');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={theme}
            onValueChange={(value: 'light' | 'dark') => {
              setTheme(value);
              setHasUnsavedChanges(true);
            }}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy">Privacy</Label>
          <Select
            value={privacy}
            onValueChange={(value) => {
              setPrivacy(value);
              setHasUnsavedChanges(true);
            }}
          >
            <SelectTrigger id="privacy">
              <SelectValue placeholder="Select privacy setting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Public
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Private
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}