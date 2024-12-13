interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={`text-center text-red-500 ${className}`}>
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
}