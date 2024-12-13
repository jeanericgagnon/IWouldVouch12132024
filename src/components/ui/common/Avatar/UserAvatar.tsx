import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12"
};

export function UserAvatar({ src, name, size = "md", className }: UserAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}