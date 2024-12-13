import { Textarea } from "../../textarea";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
}

export function FormTextarea({
  label,
  error,
  required,
  className,
  value,
  onChange,
  placeholder,
  disabled,
  minRows = 3
}: FormTextareaProps) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      className={className}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error && "border-red-500",
          `min-h-[${minRows * 24}px]`
        )}
      />
    </FormField>
  );
}