import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface EndorsementSectionProps {
  endorsement: string;
  characterCount: number;
  onEndorsementChange: (value: string) => void;
}

export function EndorsementSection({
  endorsement,
  characterCount,
  onEndorsementChange
}: EndorsementSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Endorsement</Label>
      <Textarea
        value={endorsement}
        onChange={(e) => onEndorsementChange(e.target.value)}
        placeholder="Write your endorsement here... (minimum 750 characters)"
        className="min-h-[200px]"
      />
      <p className="text-sm text-muted-foreground">
        {characterCount < 750 
          ? `${750 - characterCount} more characters needed` 
          : `${characterCount} characters (minimum met)`}
      </p>
    </div>
  );
}