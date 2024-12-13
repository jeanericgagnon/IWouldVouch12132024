import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

interface EndorsementInputProps {
  value: string;
  onChange: (value: string) => void;
  characterCount: number;
}

export function EndorsementInput({ value, onChange, characterCount }: EndorsementInputProps) {
  return (
    <div className="space-y-2">
      <Label>Endorsement</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
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