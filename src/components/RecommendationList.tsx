import { RecommendationCard } from './RecommendationCard';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import type { FirestoreRecommendation } from '../lib/firebase/collections';

interface RecommendationListProps {
  recommendations: FirestoreRecommendation[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onStatusUpdate?: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  showActions?: boolean;
}

export function RecommendationList({
  recommendations,
  loading,
  error,
  hasMore,
  onLoadMore,
  onStatusUpdate,
  showActions = false
}: RecommendationListProps) {
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!loading && recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recommendations found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onStatusUpdate={onStatusUpdate}
          showActions={showActions}
        />
      ))}

      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 border rounded-lg space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center pt-4">
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}