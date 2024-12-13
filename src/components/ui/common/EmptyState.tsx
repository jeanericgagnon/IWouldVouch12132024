interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div className={`text-center text-muted-foreground py-8 ${className}`}>
      <p>{message}</p>
    </div>
  );
}