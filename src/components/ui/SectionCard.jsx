import clsx from 'clsx';

/**
 * SectionCard — titled card section used across dashboard pages.
 *
 * Props:
 *  title       string
 *  subtitle    string
 *  action      ReactNode  — top-right slot (button / badge)
 *  padding     boolean    — apply default p-6 (default true)
 *  className   string
 *  children    ReactNode
 */
function SectionCard({ title, subtitle, action, padding = true, className, children }) {
  return (
    <div className={clsx('card', !padding && 'p-0 overflow-hidden', className)}>
      {(title || action) && (
        <div className={clsx(
          'flex items-start justify-between gap-3',
          padding ? 'mb-4' : 'px-5 py-4 border-b border-surface-border',
        )}>
          <div>
            {title && <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default SectionCard;
