import { useState, useEffect } from 'react';
import { showToast } from '@/components/ui/common/Notification';

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  deps?: any[];
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) {
  const { onSuccess, onError, enabled = true, deps = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        onError?.(error);
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enabled, ...deps]);

  return { data, loading, error };
}