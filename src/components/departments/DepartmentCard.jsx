import { Pencil, Trash2, Users, MapPin, IndianRupee, UserCircle2 } from 'lucide-react';
import Button from '../ui/Button';

/**
 * DepartmentCard — card tile for a single department.
 *
 * Props:
 *  department  Department (with headcount from context)
 *  onEdit      (dept) => void
 *  onDelete    (dept) => void
 */
function DepartmentCard({ department, onEdit, onDelete }) {
  const {
    name, description, manager, budget, location, color, headcount,
  } = department;

  const budgetFormatted = budget
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1,
      }).format(budget)
    : '—';

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Colour blob */}
          <div
            className="h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${color}20` }}
          >
            <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 truncate">{name}</p>
            {description && (
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Headcount pill */}
        <span
          className="badge flex-shrink-0 text-white text-xs font-bold px-2.5 py-1"
          style={{ backgroundColor: color }}
        >
          {headcount} {headcount === 1 ? 'person' : 'people'}
        </span>
      </div>

      {/* ── Meta rows ───────────────────────────────────────────── */}
      <div className="space-y-1.5 text-xs text-slate-500">
        {manager  && <MetaRow icon={UserCircle2} text={manager}         />}
        {location && <MetaRow icon={MapPin}      text={location}        />}
        {budget   ? <MetaRow icon={IndianRupee}  text={`${budgetFormatted} budget`} />
                  : null}
        <MetaRow icon={Users} text={`${headcount} employee${headcount !== 1 ? 's' : ''}`} />
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-1 pt-2 border-t border-surface-border mt-auto">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Pencil size={13} />}
          onClick={() => onEdit(department)}
          aria-label={`Edit ${name}`}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Trash2 size={13} />}
          onClick={() => onDelete(department)}
          aria-label={`Delete ${name}`}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={12} className="text-slate-300 flex-shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

export default DepartmentCard;
