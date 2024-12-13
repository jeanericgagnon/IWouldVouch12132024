import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

export function useSearch<T extends Record<string, any>>({
  data,
  searchFields,
  debounceMs = 300
}: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<T[]>(data);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const search = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setResults(data);
        return;
      }

      const searchRegex = new RegExp(term.trim(), 'i');
      const filtered = data.filter((item) =>
        searchFields.some((field) => searchRegex.test(String(item[field])))
      );
      
      setResults(filtered);
    },
    [data, searchFields]
  );

  useEffect(() => {
    search(debouncedSearchTerm);
  }, [debouncedSearchTerm, search]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isSearching: searchTerm !== debouncedSearchTerm
  };
}