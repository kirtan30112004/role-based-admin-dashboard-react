import clsx from 'clsx';
import { ROLE_LABELS } from '../../constants/roles';

const ROLE_STYLES = {
  admin:    'badge-admin',
  hr:       'badge-hr',
  employee: 'badge-employee',
};

function RoleBadge({ role, className }) {
  return (
    <span className={clsx(ROLE_STYLES[role] ?? 'badge bg-slate-100 text-slate-600', className)}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

export { RoleBadge };
