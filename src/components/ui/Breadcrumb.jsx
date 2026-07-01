import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

/**
 * Breadcrumb — generates trail automatically from the current URL path.
 *
 * Optionally accepts a `crumbs` prop to override auto-generation:
 *   crumbs = [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Users' }]
 *
 * The last crumb is always rendered as plain text (current page).
 */

// Human-readable segment labels
const SEGMENT_LABELS = {
  admin:     'Admin',
  hr:        'HR',
  employee:  'Employee',
  dashboard: 'Dashboard',
  users:     'Users',
  settings:  'Settings',
  employees: 'Employees',
  leaves:    'Leaves',
  profile:   'Profile',
};

function buildCrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Home', to: '/' }];

  segments.forEach((seg, idx) => {
    const to    = '/' + segments.slice(0, idx + 1).join('/');
    const label = SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, to });
  });

  return crumbs;
}

function Breadcrumb({ crumbs: overrideCrumbs, className }) {
  const { pathname } = useLocation();
  const crumbs = overrideCrumbs ?? buildCrumbs(pathname);

  if (crumbs.length <= 1) return null; // nothing to show on root

  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {crumbs.map((crumb, idx) => {
          const isLast  = idx === crumbs.length - 1;
          const isFirst = idx === 0;

          return (
            <li key={crumb.to ?? crumb.label} className="flex items-center gap-1">
              {/* Separator (not before first item) */}
              {!isFirst && (
                <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
              )}

              {isLast ? (
                // Current page — not a link
                <span
                  aria-current="page"
                  className="font-medium text-slate-700 truncate max-w-[180px]"
                >
                  {crumb.label}
                </span>
              ) : isFirst ? (
                <Link
                  to={crumb.to}
                  className="text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-1"
                  aria-label="Home"
                >
                  <Home size={13} />
                </Link>
              ) : (
                <Link
                  to={crumb.to}
                  className="text-slate-400 hover:text-primary-600 transition-colors truncate max-w-[140px]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
