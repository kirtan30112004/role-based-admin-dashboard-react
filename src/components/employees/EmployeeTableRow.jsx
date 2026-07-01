import clsx from 'clsx';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Avatar        from '../common/Avatar';
import { RoleBadge } from '../common/Badge';
import Button        from '../ui/Button';

/**
 * EmployeeTableRow — a single <tr> for the employees table.
 *
 * Props:
 *  employee  Employee
 *  onView    (employee) => void  — opens detail modal
 *  onEdit    (employee) => void
 *  onDelete  (employee) => void
 */
function EmployeeTableRow({ employee, onView, onEdit, onDelete }) {
  const {
    name, email, department, jobTitle,
    employmentType, status, role, joinDate, salary,
  } = employee;

  const salaryFormatted = salary
    ? new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0,
      }).format(salary)
    : '—';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* User — clickable to open detail */}
      <td className="px-5 py-3.5">
        <button
          onClick={() => onView?.(employee)}
          className="flex items-center gap-3 text-left w-full group/name"
        >
          <Avatar user={employee} size="sm" />
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate max-w-[160px]
                          group-hover/name:text-primary-600 transition-colors">
              {name}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[160px]">{email}</p>
          </div>
        </button>
      </td>

      {/* Role */}
      <td className="px-5 py-3.5 hidden md:table-cell">
        <RoleBadge role={role} />
      </td>

      {/* Job / dept */}
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <p className="text-sm text-slate-700 truncate max-w-[140px]">{jobTitle}</p>
        <p className="text-xs text-slate-400">{department}</p>
      </td>

      {/* Employment type */}
      <td className="px-5 py-3.5 hidden xl:table-cell">
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {employmentType}
        </span>
      </td>

      {/* Salary */}
      <td className="px-5 py-3.5 hidden xl:table-cell text-sm text-slate-600 tabular-nums">
        {salaryFormatted}
      </td>

      {/* Join date */}
      <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-slate-400 tabular-nums">
        {joinDate}
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <span
          className={clsx(
            'badge',
            status === 'Active'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500',
          )}
        >
          {status}
        </span>
      </td>

      {/* Actions — visible on row hover */}
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => onView?.(employee)}
            aria-label={`View ${name}`}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={13} />}
            onClick={() => onEdit(employee)}
            aria-label={`Edit ${name}`}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={13} />}
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${name}`}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default EmployeeTableRow;
