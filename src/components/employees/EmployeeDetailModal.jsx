import {
  Mail, Phone, Building2, Briefcase, Calendar,
IndianRupee, MapPin, AlertCircle, Clock, Pencil,
} from 'lucide-react';
import Modal        from '../ui/Modal';
import Button       from '../ui/Button';
import Avatar       from '../common/Avatar';
import { RoleBadge } from '../common/Badge';
import clsx from 'clsx';

/**
 * EmployeeDetailModal — read-only profile view for a single employee.
 *
 * Props:
 *  employee  Employee | null
 *  isOpen    boolean
 *  onClose   () => void
 *  onEdit    (employee) => void  — triggers EditEmployeeModal
 */
function EmployeeDetailModal({ employee, isOpen, onClose, onEdit }) {
  if (!employee) return null;

  const salary = employee.salary
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(employee.salary)
    : '—';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Profile"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button
            leftIcon={<Pencil size={14} />}
            onClick={() => { onClose(); onEdit(employee); }}
          >
            Edit record
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Profile header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4
                        p-4 bg-slate-50 rounded-xl border border-surface-border">
          <Avatar user={employee} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">{employee.name}</h3>
              <span
                className={clsx(
                  'badge',
                  employee.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                {employee.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{employee.jobTitle}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <RoleBadge role={employee.role} />
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {employee.employmentType}
              </span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {employee.department}
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column detail grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Section title="Contact">
            <DetailRow icon={Mail}     label="Email"  value={employee.email}  />
            <DetailRow icon={Phone}    label="Phone"  value={employee.phone}  />
            {employee.address && (
              <DetailRow icon={MapPin} label="Address" value={employee.address} />
            )}
          </Section>

          <Section title="Employment">
            <DetailRow icon={Briefcase}  label="Title"      value={employee.jobTitle}       />
            <DetailRow icon={Building2}  label="Department" value={employee.department}     />
            <DetailRow icon={Calendar}   label="Joined"     value={employee.joinDate}       />
            <DetailRow icon={IndianRupee} label="Salary"     value={salary}                 />
            <DetailRow icon={Clock}      label="Type"       value={employee.employmentType} />
          </Section>
        </div>

        {/* ── Emergency contact ────────────────────────────────────── */}
        {employee.emergencyContact && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">Emergency Contact</p>
              <p className="text-sm text-amber-800">{employee.emergencyContact}</p>
            </div>
          </div>
        )}

        {/* ── Meta ─────────────────────────────────────────────────── */}
        {(employee.createdAt || employee.updatedAt) && (
          <p className="text-[11px] text-slate-300 text-right">
            {employee.updatedAt
              ? `Last updated: ${new Date(employee.updatedAt).toLocaleString()}`
              : `Created: ${new Date(employee.createdAt).toLocaleString()}`}
          </p>
        )}
      </div>
    </Modal>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

export default EmployeeDetailModal;
