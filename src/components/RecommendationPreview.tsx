import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RecommendationPreviewProps {
  recommendation: {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
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
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isPending && "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/20"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={recommendation.author.avatar} alt={recommendation.author.name} />
            <AvatarFallback>{recommendation.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{recommendation.author.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{recommendation.author.title}</p>
            <p className="text-sm text-muted-foreground">
              {recommendation.relationship} at {recommendation.company}
            </p>
          </div>
        </div>
        {isPending && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
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
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  )}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}

          {isPending ? (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={onDecline}
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
            <Button
              variant="ghost"
              className="w-full mt-2 justify-between"
              onClick={() => window.location.href = `/recommendation/${recommendation.id}`}
            >
              View Full Reference
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}