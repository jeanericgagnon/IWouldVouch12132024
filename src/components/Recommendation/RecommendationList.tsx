import { RecommendationPreview } from './RecommendationPreview';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Recommendation } from '../../types/recommendation';

interface RecommendationListProps {
  pendingRecommendations: Recommendation[];
  approvedRecommendations: Recommendation[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  loading?: boolean;
}

export function RecommendationList({
  pendingRecommendations,
  approvedRecommendations,
  onApprove,
  onDecline,
  loading = false
}: RecommendationListProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingRecommendations.length === 0 && approvedRecommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No recommendations yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="approved">
      <TabsList>
        <TabsTrigger value="approved">
          Approved ({approvedRecommendations.length})
        </TabsTrigger>
        {pendingRecommendations.length > 0 && (
          <TabsTrigger value="pending">
            Pending ({pendingRecommendations.length})
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="approved">
        <div className="space-y-4">
          {approvedRecommendations.map((recommendation) => (
            <RecommendationPreview
              key={recommendation.id}
              recommendation={recommendation}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pending">
        <div className="space-y-4">
          {pendingRecommendations.map((recommendation) => (
            <RecommendationPreview
              key={recommendation.id}
              recommendation={recommendation}
              onApprove={() => onApprove(recommendation.id)}
              onDecline={() => onDecline(recommendation.id)}
              isPending
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}