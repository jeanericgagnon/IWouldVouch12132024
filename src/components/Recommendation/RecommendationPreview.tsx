import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Star, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

interface RecommendationPreviewProps {
  recommendation: {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    author: {
      name: string;
      avatar: string;
      title: string;
    };
    relationship: {
      type: string;
      company: string;
      duration: string;
    };
    endorsement: string;
    rating: number;
    skills: Array<{ name: string; type: 'soft' | 'hard' }>;
  };
  onApprove?: () => void;
  onDecline?: () => void;
  isPending?: boolean;
}

export function RecommendationPreview({
  recommendation,
  onApprove,
  onDecline,
  isPending = false
}: RecommendationPreviewProps) {
  const navigate = useNavigate();

  const formatRelationship = (relationship: { type: string; company: string; duration: string }) => {
    const duration = relationship.duration === 'less-than-1' ? 'Less than 1 year' :
                    relationship.duration === '1-2' ? '1-2 years' :
                    relationship.duration === '2-5' ? '2-5 years' :
                    relationship.duration === '5+' ? '5+ years' : relationship.duration;
                    
    return `${relationship.type} at ${relationship.company} for ${duration}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/recommendation/${recommendation.id}`);
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        isPending && "border-[#52789e]/20 bg-[#52789e]/5 dark:border-[#6b9cc3]/20 dark:bg-[#6b9cc3]/5"
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={recommendation.author.avatar} alt={recommendation.author.name} />
            <AvatarFallback>{recommendation.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{recommendation.author.name}</h3>
            <p className="text-sm text-muted-foreground">{recommendation.author.title}</p>
            <p className="text-sm text-muted-foreground">
              {formatRelationship(recommendation.relationship)}
            </p>
          </div>
        </div>
        {isPending && (
          <Badge 
            variant="outline" 
            className="bg-[#52789e]/10 text-[#52789e] border-[#52789e]/20 
                     dark:bg-[#6b9cc3]/10 dark:text-[#6b9cc3] dark:border-[#6b9cc3]/20"
          >
            Pending Approval
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= recommendation.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            "{recommendation.endorsement}"
          </p>

          {recommendation.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recommendation.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    skill.type === 'soft'
                      ? 'bg-[#52789e]/10 text-[#52789e] dark:bg-[#6b9cc3]/10 dark:text-[#6b9cc3]'
                      : 'bg-[#52789e]/20 text-[#52789e] dark:bg-[#6b9cc3]/20 dark:text-[#6b9cc3]'
                  )}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}

          {isPending ? (
            <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
              <Button
                variant="outline"
                onClick={onDecline}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Decline
              </Button>
              <Button
                onClick={onApprove}
                className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
              >
                Approve
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-end text-sm text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}