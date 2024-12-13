import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationList } from './RecommendationList';
import { ProfileHeader } from './ProfileHeader';
import { SkillsSection } from './SkillsSection';
import { PortfolioSection } from './PortfolioSection';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

interface ProfileContentProps {
  user: {
    id: string;
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
    linkedin?: string;
    skills?: Array<{ name: string; type: 'soft' | 'hard' }>;
    portfolioItems?: Array<{ type: string; name: string; url: string }>;
  };
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('approved');
  const isOwner = currentUser?.id === user.id;

  const {
    recommendations: approvedRecommendations,
    loading: loadingApproved,
    error: errorApproved,
    hasMore: hasMoreApproved,
    loadMore: loadMoreApproved,
  } = useRecommendations({
    userId: user.id,
    status: 'approved'
  });

  const {
    recommendations: pendingRecommendations,
    loading: loadingPending,
    error: errorPending,
    hasMore: hasMorePending,
    loadMore: loadMorePending,
    updateRecommendationStatus
  } = useRecommendations({
    userId: user.id,
    status: 'pending'
  });

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateRecommendationStatus(id, status);
      toast.success(`Recommendation ${status === 'approved' ? 'approved' : 'declined'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} recommendation`);
    }
  };

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} isOwner={isOwner} />
      
      {user.skills && user.skills.length > 0 && (
        <SkillsSection skills={user.skills} />
      )}
      
      {user.portfolioItems && user.portfolioItems.length > 0 && (
        <PortfolioSection items={user.portfolioItems} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="approved">
                Approved ({approvedRecommendations.length})
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="pending">
                  Pending ({pendingRecommendations.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="approved">
              <RecommendationList
                recommendations={approvedRecommendations}
                loading={loadingApproved}
                error={errorApproved}
                hasMore={hasMoreApproved}
                onLoadMore={loadMoreApproved}
              />
            </TabsContent>

            {isOwner && (
              <TabsContent value="pending">
                <RecommendationList
                  recommendations={pendingRecommendations}
                  loading={loadingPending}
                  error={errorPending}
                  hasMore={hasMorePending}
                  onLoadMore={loadMorePending}
                  onStatusUpdate={handleStatusUpdate}
                  showActions
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}