import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { FormField } from "./FormField";

interface FormSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export function FormSelect({
  label,
  error,
  required,
  className,
  value,
  onChange,
  placeholder,
  disabled,
  options
}: FormSelectProps) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      className={className}
    >
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}