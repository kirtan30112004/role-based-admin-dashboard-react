import { Users, UserCheck, UserX, Building2 } from 'lucide-react';

/**
 * EmployeeStatsBar — summary KPI strip at the top of the Employee Management page.
 *
 * Reads from EmployeeContext stats (derived, memoised).
 *
 * Props:
 *  stats  { total, active, inactive, departments, byDept }
 */
function EmployeeStatsBar({ stats }) {
  const cards = [
    {
      label: 'Total Employees',
      value: stats.total,
      icon:  Users,
      bg:    'bg-primary-50',
      text:  'text-primary-600',
    },
    {
      label: 'Active',
      value: stats.active,
      icon:  UserCheck,
      bg:    'bg-emerald-50',
      text:  'text-emerald-600',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon:  UserX,
      bg:    'bg-slate-100',
      text:  'text-slate-500',
    },
    {
      label: 'Departments',
      value: stats.departments,
      icon:  Building2,
      bg:    'bg-blue-50',
      text:  'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(({ label, value, icon: Icon, bg, text }) => (
        <div
          key={label}
          className="card flex items-center gap-3 py-4 hover:shadow-card-hover transition-shadow"
        >
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${bg}`}>
            <Icon size={18} className={text} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800 tabular-nums leading-tight">
              {value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmployeeStatsBar;
