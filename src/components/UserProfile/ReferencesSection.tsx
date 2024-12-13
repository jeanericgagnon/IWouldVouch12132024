import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RecommendationPreview } from '../RecommendationPreview';
import { Reference } from '../../types/reference';
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ReferencesSectionProps {
  pendingReferences: Reference[];
  approvedReferences: Reference[];
  onAcceptReference: (id: string) => void;
  onDenyReference: (id: string) => void;
  loading: boolean;
  isOwner?: boolean;
}

export function ReferencesSection({
  pendingReferences,
  approvedReferences,
  onAcceptReference,
  onDenyReference,
  loading,
  isOwner = false
}: ReferencesSectionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!isOwner && approvedReferences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No references yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>References</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approved">
          <TabsList className="w-full">
            <TabsTrigger value="approved" className="flex-1">
              Approved ({approvedReferences.length})
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="pending" className="flex-1">
                Pending ({pendingReferences.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="approved" className="space-y-4 mt-4">
            {approvedReferences.length > 0 ? (
              approvedReferences.map((reference) => (
                <RecommendationPreview
                  key={reference.id}
                  recommendation={reference}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No approved references yet
              </p>
            )}
          </TabsContent>

          {isOwner && (
            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingReferences.length > 0 ? (
                pendingReferences.map((reference) => (
                  <RecommendationPreview
                    key={reference.id}
                    recommendation={reference}
                    onApprove={() => onAcceptReference(reference.id)}
                    onDecline={() => onDenyReference(reference.id)}
                    isPending
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No pending references
                </p>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}