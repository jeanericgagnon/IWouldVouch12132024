import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface AvailabilitySectionProps {
  availability: {
    status: string;
    workStyles?: string[];
    positionsInterestedIn?: string[];
  };
}

export function AvailabilitySection({ availability }: AvailabilitySectionProps) {
  if (!availability || availability.status === 'not-looking') return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          {availability.workStyles && availability.workStyles.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Preferred Work Style:</span>
              <div className="flex space-x-1">
                {availability.workStyles.map((style, index) => (
                  <Badge key={index} variant="outline" className="bg-white/50">
                    {style === 'inPerson' ? 'In Person' :
                     style === 'hybrid' ? 'Hybrid' : 'Remote'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {availability.positionsInterestedIn && availability.positionsInterestedIn.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Interested In:</span>
              <div className="flex flex-wrap gap-1">
                {availability.positionsInterestedIn.map((position, index) => (
                  <Badge key={index} variant="outline" className="bg-white/50">
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}