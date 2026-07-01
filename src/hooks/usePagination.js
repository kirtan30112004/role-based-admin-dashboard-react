import { useState, useMemo, useCallback } from 'react';

/**
 * usePagination — generic pagination logic.
 *
 * @param {any[]}  items        — full dataset to paginate
 * @param {number} pageSize     — rows per page (default 8)
 *
 * Returns:
 *  page          number          — current page (1-based)
 *  totalPages    number
 *  paginatedItems any[]          — the slice for the current page
 *  goTo(n)       fn
 *  next()        fn
 *  prev()        fn
 *  setPageSize   fn
 *  pageSize      number
 *  startIndex    number          — 1-based index of first item on page
 *  endIndex      number          — 1-based index of last item on page
 *  totalItems    number
 *  hasPrev       boolean
 *  hasNext       boolean
 */
function usePagination(items, initialPageSize = 8) {
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp page when items shrink (e.g. after a delete or filter change)
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const goTo = useCallback((n) => {
    setPage(Math.max(1, Math.min(n, totalPages)));
  }, [totalPages]);

  const next = useCallback(() => goTo(safePage + 1), [goTo, safePage]);
  const prev = useCallback(() => goTo(safePage - 1), [goTo, safePage]);

  const setPageSize = useCallback((size) => {
    setPageSizeState(size);
    setPage(1); // reset to first page when size changes
  }, []);

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex   = Math.min(safePage * pageSize, totalItems);

  return {
    page:           safePage,
    totalPages,
    paginatedItems,
    goTo,
    next,
    prev,
    pageSize,
    setPageSize,
    startIndex,
    endIndex,
    totalItems,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export default usePagination;
