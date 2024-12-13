import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Switch } from "../../../ui/switch";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Badge } from "../../../ui/badge";
import { X } from 'lucide-react';

interface AvailabilitySectionProps {
  data: {
    availability: {
      status: string;
      isAvailable: boolean;
      positionsInterestedIn?: string[];
      workStyles?: string[];
    };
  };
  onChange: (field: string, value: any) => void;
}

export function AvailabilitySection({ data, onChange }: AvailabilitySectionProps) {
  const [newPosition, setNewPosition] = useState('');

  const handleAvailabilityChange = (updates: any) => {
    onChange('availability', { ...data.availability, ...updates });
  };

  const addPosition = () => {
    if (newPosition && (!data.availability.positionsInterestedIn || data.availability.positionsInterestedIn.length < 3)) {
      handleAvailabilityChange({
        positionsInterestedIn: [...(data.availability.positionsInterestedIn || []), newPosition]
      });
      setNewPosition('');
    }
  };

  const removePosition = (position: string) => {
    handleAvailabilityChange({
      positionsInterestedIn: data.availability.positionsInterestedIn?.filter(p => p !== position)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Search Status</CardTitle>
        <CardDescription>Let others know if you're open to opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Looking for Work?</Label>
            <p className="text-sm text-muted-foreground">Make your profile visible to recruiters</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={!data.availability.isAvailable ? 'text-muted-foreground font-medium' : ''}>No</span>
            <Switch
              checked={data.availability.isAvailable}
              onCheckedChange={(checked) => handleAvailabilityChange({ isAvailable: checked })}
            />
            <span className={data.availability.isAvailable ? 'text-muted-foreground font-medium' : ''}>Yes</span>
          </div>
        </div>

        {data.availability.isAvailable && (
          <>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={data.availability.status}
                onValueChange={(value) => handleAvailabilityChange({ status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actively-looking">Actively Looking</SelectItem>
                  <SelectItem value="open">Open to Opportunities</SelectItem>
                  <SelectItem value="casually-looking">Casually Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Style Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {['remote', 'hybrid', 'inPerson'].map((style) => (
                  <Button
                    key={style}
                    type="button"
                    variant={data.availability.workStyles?.includes(style) ? 'default' : 'outline'}
                    onClick={() => {
                      const currentStyles = data.availability.workStyles || [];
                      handleAvailabilityChange({
                        workStyles: currentStyles.includes(style)
                          ? currentStyles.filter(s => s !== style)
                          : [...currentStyles, style]
                      });
                    }}
                  >
                    {style === 'inPerson' ? 'In Person' : style.charAt(0).toUpperCase() + style.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Positions Interested In ({data.availability.positionsInterestedIn?.length || 0}/3)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.availability.positionsInterestedIn?.map((position) => (
                  <Badge key={position} variant="secondary">
                    {position}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePosition(position)}
                      className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              {(!data.availability.positionsInterestedIn || data.availability.positionsInterestedIn.length < 3) && (
                <div className="flex gap-2">
                  <Input
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    placeholder="Enter position (e.g., Software Engineer)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPosition();
                      }
                    }}
                  />
                  <Button onClick={addPosition} type="button">Add</Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}