import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  targetUserName: string;
}

export function RatingInput({ rating, onRatingChange, targetUserName }: RatingInputProps) {
  return (
    <div className="space-y-2">
      <Label>
        {`Your friend is hiring for a job that ${targetUserName} has all prequalifications for. How likely are you to recommend ${targetUserName} for this position?`}
      </Label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size="lg"
            className={cn(
              "p-0 w-12 h-12",
              value <= rating ? "text-yellow-400" : "text-gray-300"
            )}
            onClick={() => onRatingChange(value)}
          >
            <Star className="w-10 h-10 fill-current" />
          </Button>
        ))}
      </div>
    </div>
  );
}