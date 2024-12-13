import { useState } from 'react';

interface UseProfileTabsOptions {
  onTabChange?: (tab: string) => void;
}

export function useProfileTabs(defaultTab: string = 'profile', options: UseProfileTabsOptions = {}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);

  const handleTabChange = (tab: string, hasUnsavedChanges: boolean) => {
    if (hasUnsavedChanges) {
      setPendingTabChange(tab);
      setShowUnsavedChangesDialog(true);
    } else {
      setActiveTab(tab);
      options.onTabChange?.(tab);
    }
  };

  const confirmTabChange = () => {
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      options.onTabChange?.(pendingTabChange);
      setPendingTabChange(null);
    }
    setShowUnsavedChangesDialog(false);
  };

  const cancelTabChange = () => {
    setPendingTabChange(null);
    setShowUnsavedChangesDialog(false);
  };

  return {
    activeTab,
    pendingTabChange,
    showUnsavedChangesDialog,
    handleTabChange,
    confirmTabChange,
    cancelTabChange
  };
}