import { Users } from 'lucide-react';

/**
 * EmptyState — zero-result placeholder.
 *
 * Props:
 *  icon      ReactNode (Lucide component, defaults to Users)
 *  title     string
 *  message   string
 *  action    ReactNode — optional CTA button/link
 */
function EmptyState({
  icon: Icon = Users,
  title = 'Nothing here yet',
  message = '',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
      {message && <p className="text-xs text-slate-400 max-w-xs">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
