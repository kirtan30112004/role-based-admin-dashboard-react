import clsx from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Pagination — controls for usePagination hook.
 *
 * Props: all fields returned by usePagination(), plus optional className.
 */
function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  goTo,
  next,
  prev,
  startIndex,
  endIndex,
  totalItems,
  pageSize,
  setPageSize,
  className,
}) {
  // Generate page number windows (always show first, last, and neighbours of current)
  const pageNumbers = useMemo(page, totalPages);

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-3', className)}>
      {/* Summary */}
      <p className="text-xs text-slate-500 flex-shrink-0 order-2 sm:order-1">
        {totalItems === 0
          ? 'No results'
          : `Showing ${startIndex}–${endIndex} of ${totalItems}`}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* First */}
        <PageBtn onClick={() => goTo(1)} disabled={!hasPrev} aria-label="First page">
          <ChevronsLeft size={14} />
        </PageBtn>

        {/* Prev */}
        <PageBtn onClick={prev} disabled={!hasPrev} aria-label="Previous page">
          <ChevronLeft size={14} />
        </PageBtn>

        {/* Number pills */}
        {pageNumbers.map((n, i) =>
          n === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-slate-300 text-xs select-none">
              …
            </span>
          ) : (
            <PageBtn
              key={n}
              onClick={() => goTo(n)}
              active={n === page}
              aria-label={`Page ${n}`}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </PageBtn>
          ),
        )}

        {/* Next */}
        <PageBtn onClick={next} disabled={!hasNext} aria-label="Next page">
          <ChevronRight size={14} />
        </PageBtn>

        {/* Last */}
        <PageBtn onClick={() => goTo(totalPages)} disabled={!hasNext} aria-label="Last page">
          <ChevronsRight size={14} />
        </PageBtn>
      </div>

      {/* Rows per page */}
      {setPageSize && (
        <div className="flex items-center gap-2 text-xs text-slate-500 order-3 flex-shrink-0">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-surface-border rounded-md px-1.5 py-1 text-xs
                       text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {[5, 8, 10, 15, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

/* ── Page button ────────────────────────────────────────────────────── */
function PageBtn({ children, active, disabled, className, ...rest }) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        'h-7 min-w-[28px] px-1.5 rounded-md text-xs font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 bg-white border border-surface-border',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Page number builder ────────────────────────────────────────────── */
function useMemo(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = [];
  if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, '…', totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, '…', page - 1, page, page + 1, '…', totalPages);
  }
  return pages;
}

export default Pagination;
