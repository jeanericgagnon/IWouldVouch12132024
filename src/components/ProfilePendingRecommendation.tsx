import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { RecommendationPreview } from './RecommendationPreview';
import { toast } from 'react-hot-toast';

interface PendingRecommendation {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  relationship: string;
  company: string;
  endorsement: string;
  rating: number;
  skills: Array<{ name: string; type: 'soft' | 'hard' }>;
}

interface ProfilePendingRecommendationProps {
  recommendations: PendingRecommendation[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

export function ProfilePendingRecommendation({
  recommendations,
  onApprove,
  onDecline
}: ProfilePendingRecommendationProps) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  const handleApprove = async (id: string) => {
    try {
      await onApprove(id);
      toast.success('Recommendation approved successfully!');
    } catch (error) {
      console.error('Error approving recommendation:', error);
      toast.error('Failed to approve recommendation');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await onDecline(id);
      setShowDeclineDialog(false);
      setSelectedRecommendation(null);
      toast.success('Recommendation declined');
    } catch (error) {
      console.error('Error declining recommendation:', error);
      toast.error('Failed to decline recommendation');
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Recommendations ({recommendations.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((recommendation) => (
            <RecommendationPreview
              key={recommendation.id}
              recommendation={{ ...recommendation, status: 'pending' }}
              onApprove={() => handleApprove(recommendation.id)}
              onDecline={() => {
                setSelectedRecommendation(recommendation.id);
                setShowDeclineDialog(true);
              }}
              isPending
            />
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Recommendation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this recommendation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeclineDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRecommendation && handleDecline(selectedRecommendation)}
              className="bg-red-600 hover:bg-red-700"
            >
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}