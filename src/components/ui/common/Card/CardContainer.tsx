import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../card";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function CardContainer({
  title,
  description,
  className,
  headerClassName,
  contentClassName,
  children
}: CardContainerProps) {
  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader className={headerClassName}>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
}