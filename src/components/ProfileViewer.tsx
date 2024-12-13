import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types/user';
import { Reference } from '../types/reference';
import { ProfileHeader } from './ProfileHeader';
import { ReferenceList } from './ReferenceList';
import { PortfolioSection } from './PortfolioSection';
import { ProfileSettings } from './ProfileSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { userApi, referenceApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function ProfileViewer() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        
        setLoading(true);
        setError(null);

        const [userData, referencesData] = await Promise.all([
          userApi.getUserById(userId),
          referenceApi.getReferences()
        ]);
        
        setUser(userData);
        setReferences(referencesData.filter(ref => ref.toUser.id === userId));
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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

  const isOwner = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-8">
              <ProfileHeader 
                user={user} 
                isOwner={isOwner}
                onEditProfile={() => setActiveTab('settings')}
              />

              <ReferenceList
                references={references}
                title="References"
                emptyMessage={
                  isOwner 
                    ? "You haven't received any references yet. Share your profile to get started!"
                    : "No references yet."
                }
              />

              <PortfolioSection 
                items={user.portfolioItems || []} 
                isOwner={isOwner}
                onEdit={() => setActiveTab('settings')}
              />
            </div>
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings">
              <ProfileSettings 
                user={user}
                onUpdate={(updatedUser) => setUser(updatedUser)}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}