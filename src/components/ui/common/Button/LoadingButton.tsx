import { Button } from "../../button";
import { LoadingSpinner } from "../LoadingSpinner";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  loading = false,
  loadingText = "Loading...",
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="absolute left-4" />
      )}
      <span className={cn(loading && "pl-6")}>
        {loading ? loadingText : children}
      </span>
    </Button>
  );
}