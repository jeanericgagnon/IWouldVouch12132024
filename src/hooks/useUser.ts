import { useState } from 'react';
import { userApi } from '../services/api';
import { toast } from 'react-hot-toast';
import type { User } from '../types/user';

interface UseUserOptions {
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useUserProfile(initialUser: User, options: UseUserOptions = {}) {
  const [user, setUser] = useState<User>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      await userApi.updateUser(user.id, user);
      setHasUnsavedChanges(false);
      toast.success('Changes saved successfully!');
      options.onSaveSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save changes');
      setError(error.message);
      toast.error(error.message);
      options.onSaveError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const resetChanges = () => {
    setUser(initialUser);
    setHasUnsavedChanges(false);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    hasUnsavedChanges,
    updateUser,
    saveChanges,
    resetChanges
  };
}