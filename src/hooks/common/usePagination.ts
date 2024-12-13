import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(total / pageSize);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      onPageChange?.(newPage);
    }
  }, [page, totalPages, onPageChange]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange?.(newPage);
    }
  }, [page, onPageChange]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange?.(newPage);
    }
  }, [totalPages, onPageChange]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    onPageSizeChange?.(newPageSize);
    onPageChange?.(1);
  }, [onPageChange, onPageSizeChange]);

  return {
    page,
    pageSize,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    changePageSize
  };
}