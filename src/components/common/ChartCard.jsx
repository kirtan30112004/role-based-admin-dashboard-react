import clsx from 'clsx';

/**
 * ChartCard — titled card shell for any Recharts chart.
 *
 * Props:
 *  title      string         required
 *  subtitle   string
 *  action     ReactNode      top-right slot (period picker, refresh button, etc.)
 *  loading    boolean        shows a shimmer skeleton instead of chart
 *  noPad      boolean        removes side padding (useful for edge-to-edge charts)
 *  className  string
 *  children   ReactNode
 */
function ChartCard({ title, subtitle, action, loading = false, noPad = false, className, children }) {
  return (
    <div className={clsx('card flex flex-col gap-4', className)}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-shrink-0">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">{action}</div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      {loading ? (
        /* Shimmer skeleton — matches typical chart proportions */
        <div className="space-y-2 animate-pulse" aria-hidden="true">
          <div className="flex items-end gap-1.5 h-32">
            {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-slate-100 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex gap-3 justify-center pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-2.5 w-16 bg-slate-100 rounded-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className={clsx('w-full min-w-0', noPad && '-mx-6')}>
          {children}
        </div>
      )}
    </div>
  );
}

export default ChartCard;
