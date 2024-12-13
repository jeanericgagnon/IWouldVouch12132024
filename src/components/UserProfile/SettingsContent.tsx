import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Eye, EyeOff, Sun, Moon, Trash2 } from 'lucide-react';
import { User } from '../../types/user';
import { JobSearchSection } from './JobSearchSection';
import { SkillsSection } from './SkillsSection';
import { ResumePortfolioSection } from './ResumePortfolioSection';
import { useTheme } from '../../context/ThemeContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from 'react-hot-toast';

interface SettingsContentProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
}

const formatPhoneNumber = (value: string, countryCode: string) => {
  const phoneNumber = value.replace(/\D/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export function SettingsContent({ user, onUpdateUser, hasUnsavedChanges, onSave }: SettingsContentProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [countryCode, setCountryCode] = useState('1');
  const [phoneError, setPhoneError] = useState('');
  const { theme, setTheme } = useTheme();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value, countryCode);
    onUpdateUser({ phoneNumber: formattedNumber });
    
    if (e.target.value && !formattedNumber.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
      setPhoneError('Please enter a valid 10-digit phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    setShowDeleteConfirmation(false);
    toast.success('Account deleted successfully');
    // Redirect to home or sign out
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Button 
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
        >
          Save Changes
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={user.name}
              onChange={(e) => onUpdateUser({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={user.title || ''}
              onChange={(e) => onUpdateUser({ title: e.target.value })}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCompany">Current Company</Label>
            <Input
              id="currentCompany"
              value={user.currentCompany || ''}
              onChange={(e) => onUpdateUser({ currentCompany: e.target.value })}
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={user.bio || ''}
              onChange={(e) => onUpdateUser({ bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="min-h-[150px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage your contact details and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateUser({ showEmail: !user.showEmail })}
                className="text-muted-foreground"
              >
                {user.showEmail ? (
                  <><Eye className="h-4 w-4 mr-2" /> Public</>
                ) : (
                  <><EyeOff className="h-4 w-4 mr-2" /> Private</>
                )}
              </Button>
            </div>
            <Input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => onUpdateUser({ email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone">Phone Number</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateUser({ showPhone: !user.showPhone })}
                className="text-muted-foreground"
              >
                {user.showPhone ? (
                  <><Eye className="h-4 w-4 mr-2" /> Public</>
                ) : (
                  <><EyeOff className="h-4 w-4 mr-2" /> Private</>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center w-24">
                <span className="mr-1">+</span>
                <Input
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="1"
                  className="w-16"
                />
              </div>
              <Input
                id="phone"
                value={user.phoneNumber || ''}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
              />
            </div>
            {phoneError && (
              <p className="text-sm text-red-500">{phoneError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Search Status */}
      <JobSearchSection user={user} onUpdateUser={onUpdateUser} />

      {/* Skills */}
      <SkillsSection 
        skills={user.skills || []}
        onSkillsChange={(skills) => onUpdateUser({ skills })}
      />

      {/* Resume & Portfolio */}
      <ResumePortfolioSection
        resumeUrl={user.resumeUrl}
        portfolioItems={user.portfolioItems || []}
        onUpdateResume={(file) => {
          const url = URL.createObjectURL(file);
          onUpdateUser({ resumeUrl: url });
        }}
        onUpdatePortfolio={(items) => onUpdateUser({ portfolioItems: items })}
      />

      {/* Theme Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how IWouldVouch looks for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className={theme === 'light' ? 'bg-[#52789e] hover:bg-[#6b9cc3]' : ''}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? 'bg-[#52789e] hover:bg-[#6b9cc3]' : ''}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirmation(true)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}