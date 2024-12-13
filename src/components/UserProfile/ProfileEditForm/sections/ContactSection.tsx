import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Eye, EyeOff } from 'lucide-react';

interface ContactSectionProps {
  data: {
    email?: string;
    phoneNumber: string;
    location: string;
    linkedin: string;
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export function ContactSection({ data, onChange }: ContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Manage your contact details and visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.email && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange('showEmail', !data.showEmail)}
                className="text-muted-foreground"
              >
                {data.showEmail ? (
                  <><Eye className="h-4 w-4 mr-2" /> Public</>
                ) : (
                  <><EyeOff className="h-4 w-4 mr-2" /> Private</>
                )}
              </Button>
            </div>
            <Input
              id="email"
              type="email"
              value={data.email}
              disabled
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone">Phone Number</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('showPhone', !data.showPhone)}
              className="text-muted-foreground"
            >
              {data.showPhone ? (
                <><Eye className="h-4 w-4 mr-2" /> Public</>
              ) : (
                <><EyeOff className="h-4 w-4 mr-2" /> Private</>
              )}
            </Button>
          </div>
          <Input
            id="phone"
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="location">Location</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('showLocation', !data.showLocation)}
              className="text-muted-foreground"
            >
              {data.showLocation ? (
                <><Eye className="h-4 w-4 mr-2" /> Public</>
              ) : (
                <><EyeOff className="h-4 w-4 mr-2" /> Private</>
              )}
            </Button>
          </div>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            type="url"
            value={data.linkedin}
            onChange={(e) => onChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </CardContent>
    </Card>
  );
}