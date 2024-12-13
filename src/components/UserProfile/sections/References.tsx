import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { RecommendationPreview } from '../../Recommendation/RecommendationPreview';
import { mockStore } from '../../../data/mockData';
import { toast } from 'react-hot-toast';
import type { Reference } from '../../../types/reference';

interface ReferencesProps {
  references: Reference[];
  pendingReferences: Reference[];
  isOwner: boolean;
}

export function References({ references, pendingReferences, isOwner }: ReferencesProps) {
  const [showDenyDialog, setShowDenyDialog] = useState(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('approved');
  const [localReferences, setLocalReferences] = useState(references);
  const [localPendingReferences, setLocalPendingReferences] = useState(pendingReferences);

  const handleApprove = async (id: string) => {
    try {
      // Update the reference status in the mock store
      mockStore.updateRecommendationStatus(id, 'approved');
      
      // Move the reference from pending to approved in local state
      const approvedRef = localPendingReferences.find(ref => ref.id === id);
      if (approvedRef) {
        setLocalPendingReferences(prev => prev.filter(ref => ref.id !== id));
        setLocalReferences(prev => [...prev, { ...approvedRef, status: 'approved' }]);
      }
      
      toast.success('Reference approved successfully');
    } catch (error) {
      console.error('Error approving reference:', error);
      toast.error('Failed to approve reference');
    }
  };

  const handleDeny = async (id: string) => {
    setSelectedReferenceId(id);
    setShowDenyDialog(true);
  };

  const confirmDeny = async () => {
    if (!selectedReferenceId) return;
    
    try {
      // Update the reference status in the mock store
      mockStore.updateRecommendationStatus(selectedReferenceId, 'rejected');
      
      // Remove the reference from pending references in local state
      setLocalPendingReferences(prev => 
        prev.filter(ref => ref.id !== selectedReferenceId)
      );
      
      setShowDenyDialog(false);
      setSelectedReferenceId(null);
      toast.success('Reference denied successfully');
    } catch (error) {
      console.error('Error denying reference:', error);
      toast.error('Failed to deny reference');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="approved" className="flex-1">
                Approved ({localReferences.length})
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="pending" className="flex-1">
                  Pending ({localPendingReferences.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="approved" className="mt-4">
              <div className="space-y-4">
                {localReferences.length > 0 ? (
                  localReferences.map((reference) => (
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
              </div>
            </TabsContent>

            {isOwner && (
              <TabsContent value="pending" className="mt-4">
                <div className="space-y-4">
                  {localPendingReferences.length > 0 ? (
                    localPendingReferences.map((reference) => (
                      <RecommendationPreview
                        key={reference.id}
                        recommendation={reference}
                        onApprove={() => handleApprove(reference.id)}
                        onDecline={() => handleDeny(reference.id)}
                        isPending
                      />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No pending references
                    </p>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deny Reference</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deny this reference? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDenyDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeny}
              className="bg-red-600 hover:bg-red-700"
            >
              Deny Reference
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}