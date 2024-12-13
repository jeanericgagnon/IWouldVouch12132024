import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface AuthorInfoProps {
  name: string;
  linkedin?: string;
}

export function AuthorInfo({ name, linkedin }: AuthorInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Your Name</Label>
        <Input value={name} disabled />
      </div>
      {linkedin && (
        <div className="space-y-2">
          <Label>Your LinkedIn</Label>
          <Input value={linkedin} disabled />
        </div>
      )}
    </div>
  );
}