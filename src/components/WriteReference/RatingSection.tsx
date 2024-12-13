import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RatingSectionProps {
  rating: number;
  onRatingChange: (value: number) => void;
}

export function RatingSection({ rating, onRatingChange }: RatingSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Rating</Label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="lg"
            className={cn(
              "p-0 w-12 h-12",
              value <= rating ? "text-yellow-400" : "text-gray-300"
            )}
            onClick={() => onRatingChange(value)}
          >
            <Star className="w-8 h-8 fill-current" />
          </Button>
        ))}
      </div>
    </div>
  );
}