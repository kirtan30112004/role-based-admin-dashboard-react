import clsx from 'clsx';
import { Pencil, Trash2, Eye, Phone, Building2, Briefcase } from 'lucide-react';
import Avatar        from '../common/Avatar';
import { RoleBadge } from '../common/Badge';
import Button        from '../ui/Button';

/**
 * EmployeeCard — card view for a single employee.
 *
 * Props:
 *  employee  Employee
 *  onView    (employee) => void  — opens detail modal
 *  onEdit    (employee) => void
 *  onDelete  (employee) => void
 */
function EmployeeCard({ employee, onView, onEdit, onDelete }) {
  const { name, email, phone, department, jobTitle, status, role } = employee;

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        {/* Clickable name/avatar → opens detail */}
        <button
          onClick={() => onView?.(employee)}
          className="flex items-center gap-3 min-w-0 text-left group/card"
        >
          <Avatar user={employee} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate
                          group-hover/card:text-primary-600 transition-colors">
              {name}
            </p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </button>

        <span
          className={clsx(
            'badge flex-shrink-0 mt-0.5',
            status === 'Active'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500',
          )}
        >
          {status}
        </span>
      </div>

      {/* ── Details ────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <Detail icon={Briefcase} text={jobTitle}   />
        <Detail icon={Building2} text={department} />
        <Detail icon={Phone}     text={phone}      />
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-border mt-auto">
        <RoleBadge role={role} />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => onView?.(employee)}
            aria-label={`View ${name}`}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={13} />}
            onClick={() => onEdit(employee)}
            aria-label={`Edit ${name}`}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={13} />}
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${name}`}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, text }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <Icon size={13} className="text-slate-300 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

export default EmployeeCard;
