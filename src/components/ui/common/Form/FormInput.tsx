import { Input } from "../../input";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  error,
  required,
  className,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled
}: FormInputProps) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      className={className}
    >
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
    </FormField>
  );
}