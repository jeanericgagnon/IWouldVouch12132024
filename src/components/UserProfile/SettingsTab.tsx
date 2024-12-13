import { useState, useCallback } from 'react';
import { User } from '../../types/user';
import { Button } from '../ui/button';
import { BasicInfoSection } from './BasicInfoSection';
import { ResumeSection } from './ResumeSection';
import { SkillsSection } from './SkillsSection';
import { PortfolioSection } from './PortfolioSection';
import { toast } from 'react-hot-toast';

interface SettingsTabProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  setHasUnsavedChanges: (value: boolean) => void;
}

export function SettingsTab({ user, onUpdate, setHasUnsavedChanges }: SettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User>(user);

  console.log('SettingsTab rendering with user:', updatedUser);

  const handleFieldUpdate = (field: keyof User, value: any) => {
    console.log(`Updating ${field}:`, value);
    setUpdatedUser(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleResumeChange = (file: File) => {
    const resumeUrl = URL.createObjectURL(file);
    handleFieldUpdate('resumeUrl', resumeUrl);
  };

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      await onUpdate(updatedUser);
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [updatedUser, onUpdate, setHasUnsavedChanges]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <BasicInfoSection 
        user={updatedUser}
        onUpdate={handleFieldUpdate}
      />

      <ResumeSection
        currentResumeUrl={updatedUser.resumeUrl}
        onResumeChange={handleResumeChange}
      />

      <SkillsSection 
        skills={updatedUser.skills || []}
        onSkillsChange={(skills) => handleFieldUpdate('skills', skills)}
      />

      <PortfolioSection
        items={updatedUser.portfolioItems || []}
        onItemsChange={(items) => handleFieldUpdate('portfolioItems', items)}
      />
    </div>
  );
}