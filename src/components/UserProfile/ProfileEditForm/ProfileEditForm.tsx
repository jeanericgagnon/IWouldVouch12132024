import { useState } from 'react';
import { Button } from "../../ui/button";
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ContactSection } from './sections/ContactSection';
import { AvailabilitySection } from './sections/AvailabilitySection';
import { SkillsSection } from './sections/SkillsSection';
import { AdditionalSectionsSection } from './sections/AdditionalSectionsSection';
import { toast } from 'react-hot-toast';
import type { User } from '../../../types/user';

interface ProfileEditFormProps {
  user: User;
  onSave: (updates: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    title: user.title || '',
    bio: user.bio || '',
    location: user.location || '',
    linkedin: user.linkedin || '',
    currentCompany: user.currentCompany || '',
    showEmail: user.showEmail || false,
    showLocation: user.showLocation || false,
    showPhone: user.showPhone || false,
    phoneNumber: user.phoneNumber || '',
    availability: user.availability || {
      status: 'not-looking',
      isAvailable: false
    },
    skills: user.skills || [],
    additionalSections: user.additionalSections || []
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <BasicInfoSection
          data={formData}
          onChange={handleChange}
        />

        <ContactSection
          data={formData}
          onChange={handleChange}
        />

        <AvailabilitySection
          data={formData}
          onChange={handleChange}
        />

        <SkillsSection
          skills={formData.skills}
          onChange={(skills) => handleChange('skills', skills)}
        />

        <AdditionalSectionsSection
          sections={formData.additionalSections}
          onChange={(sections) => handleChange('additionalSections', sections)}
        />

        {/* Sticky button container */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-4 py-4 flex justify-end space-x-2">
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-[#52789e] hover:bg-[#6b9cc3] text-white min-w-[100px]"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}