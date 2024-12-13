import { cn } from "@/lib/utils";

interface ListContainerProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
}

export function ListContainer({
  items,
  renderItem,
  keyExtractor = (_, index) => index.toString(),
  emptyMessage = "No items to display",
  className,
  itemClassName
}: ListContainerProps) {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}