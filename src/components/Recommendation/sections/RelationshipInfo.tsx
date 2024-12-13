import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface RelationshipInfoProps {
  relationship: string;
  company: string;
  duration: string;
  onRelationshipChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  targetUserName: string;
}

export function RelationshipInfo({
  relationship,
  company,
  duration,
  onRelationshipChange,
  onCompanyChange,
  onDurationChange,
  targetUserName
}: RelationshipInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{`Your relationship to ${targetUserName}`}</Label>
        <Select value={relationship} onValueChange={onRelationshipChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select relationship type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="colleague">Colleague</SelectItem>
            <SelectItem value="direct-report">Direct Report</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Company/Organization</Label>
        <Input
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          placeholder="Where did you work together?"
        />
      </div>

      <div className="space-y-2">
        <Label>Duration</Label>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="How long have you known them?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-1">Less than 1 year</SelectItem>
            <SelectItem value="1-2">1-2 years</SelectItem>
            <SelectItem value="2-5">2-5 years</SelectItem>
            <SelectItem value="5+">5+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}