import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BasicInfo } from './sections/BasicInfo';
import { Skills } from './sections/Skills';
import { References } from './sections/References';
import { ProfileEditForm } from './ProfileEditForm';
import { useAuth } from '../../hooks/useAuth';
import { mockStore } from '../../data/mockData';
import { toast } from 'react-hot-toast';
import type { FirestoreUser } from '../../lib/firebase/collections';

export function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userId) {
          throw new Error('User ID is required');
        }

        const userData = mockStore.getUser(userId);
        if (!userData) {
          throw new Error('User not found');
        }

        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const isOwner = currentUser?.id === user?.id;

  const handleSave = async (updates: Partial<FirestoreUser>) => {
    try {
      if (!user) return;
      
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
      };

      mockStore.updateUser(user.id, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.success('Changes discarded');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {error || 'Profile not found'}
        </h1>
      </div>
    );
  }

  if (isEditing && isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <ProfileEditForm 
            user={user}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <BasicInfo 
            user={user} 
            isOwner={isOwner} 
            onEditProfile={() => setIsEditing(true)} 
          />
          <Skills skills={user.skills} />
          <References 
            references={mockStore.getUserRecommendations(user.id, 'approved')}
            pendingReferences={mockStore.getUserRecommendations(user.id, 'pending')}
            isOwner={isOwner}
          />
        </div>
      </main>
    </div>
  );
}