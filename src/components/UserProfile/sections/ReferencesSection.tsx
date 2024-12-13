import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { RecommendationPreview } from '../../RecommendationPreview';
import { EmptyState } from '../../ui/common';
import { useReferences } from '../../../hooks/useReferences';
import type { Reference } from '../../../types/reference';

interface ReferencesSectionProps {
  userId: string;
  isOwner: boolean;
}

export function ReferencesSection({ userId, isOwner }: ReferencesSectionProps) {
  const {
    references,
    activeTab,
    setActiveTab,
    handleAcceptReference,
    handleDenyReference
  } = useReferences(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>References</CardTitle>
      </CardHeader>
      <CardContent>
        {references.length === 0 ? (
          <EmptyState message="No references yet" />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="approved">
                Approved ({references.filter(ref => ref.status === 'approved').length})
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="pending">
                  Pending ({references.filter(ref => ref.status === 'pending').length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="approved">
              <div className="space-y-4">
                {references
                  .filter(ref => ref.status === 'approved')
                  .map((reference) => (
                    <RecommendationPreview
                      key={reference.id}
                      recommendation={reference}
                    />
                  ))}
              </div>
            </TabsContent>

            {isOwner && (
              <TabsContent value="pending">
                <div className="space-y-4">
                  {references
                    .filter(ref => ref.status === 'pending')
                    .map((reference) => (
                      <RecommendationPreview
                        key={reference.id}
                        recommendation={reference}
                        onApprove={() => handleAcceptReference(reference.id)}
                        onDecline={() => handleDenyReference(reference.id)}
                        isPending
                      />
                    ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}