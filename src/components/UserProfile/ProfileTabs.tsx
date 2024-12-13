import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export function ProfileTabs({ activeTab, onTabChange, children }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <TabsTrigger value="profile" className="min-w-[100px]">Profile</TabsTrigger>
        <TabsTrigger value="settings" className="min-w-[100px]">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        {children}
      </TabsContent>

      <TabsContent value="settings">
        {children}
      </TabsContent>
    </Tabs>
  );
}