import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../tabs";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsContainerProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

export function TabsContainer({
  tabs,
  value,
  onChange,
  className,
  listClassName,
  contentClassName
}: TabsContainerProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn("w-full", listClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="flex-1"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={contentClassName}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}