import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Button } from "../../../ui/button";
import { Upload } from 'lucide-react';

interface BasicInfoSectionProps {
  data: {
    name: string;
    title: string;
    bio: string;
    currentCompany: string;
    avatar?: string;
  };
  onChange: (field: string, value: any) => void;
}

export function BasicInfoSection({ data, onChange }: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your basic profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback>{data.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Button className="bg-[#52789e] hover:bg-[#6b9cc3] text-white">
            <Upload className="mr-2 h-4 w-4" />
            Change Photo
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCompany">Current Company</Label>
            <Input
              id="currentCompany"
              value={data.currentCompany}
              onChange={(e) => onChange('currentCompany', e.target.value)}
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => onChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}