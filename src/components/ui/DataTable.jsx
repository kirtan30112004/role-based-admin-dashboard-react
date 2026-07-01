import clsx from 'clsx';
import Loader    from './Loader';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

/**
 * DataTable — reusable table with header, rows, empty state, and pagination.
 *
 * Props:
 *  columns     { label, className? }[]   — header columns
 *  data        any[]                     — ALREADY paginated slice
 *  renderRow   (item, index) => ReactNode — returns a <tr>
 *  keyExtractor (item) => string|number  — stable key for each row
 *  loading     boolean
 *  emptyIcon   ReactNode
 *  emptyTitle  string
 *  emptyMessage string
 *  emptyAction ReactNode
 *  pagination  object | null            — spread of usePagination() return value
 *  className   string
 */
function DataTable({
  columns = [],
  data = [],
  renderRow,
  keyExtractor = (item) => item.id,
  loading = false,
  emptyIcon,
  emptyTitle = 'No data',
  emptyMessage = '',
  emptyAction,
  pagination = null,
  className,
}) {
  return (
    <div className={clsx('card p-0 overflow-hidden', className)}>
      {loading ? (
        <Loader centred size="lg" className="py-16" />
      ) : data.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
          action={emptyAction}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-muted border-b border-surface-border">
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={clsx(
                        'px-5 py-3.5 text-left text-xs font-semibold text-slate-600',
                        'uppercase tracking-wide whitespace-nowrap',
                        col.className,
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {data.map((item, idx) => (
                  <tr key={keyExtractor(item)}>
                    {renderRow(item, idx)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="px-5 py-4 border-t border-surface-border bg-surface-muted">
              <Pagination {...pagination} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DataTable;
