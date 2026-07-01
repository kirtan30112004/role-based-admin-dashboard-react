import Input    from '../ui/Input';
import Select   from '../ui/Select';
import { DEPARTMENTS, EMPLOYMENT_TYPES, ROLES, ROLE_LABELS } from '../../constants/roles';

/**
 * EmployeeForm — shared form body used by both Add and Edit modals.
 *
 * Props:
 *  fields      Object   — form field values (from useEmployeeForm)
 *  fieldError  fn(name) — returns error string if field is touched + invalid
 *  onChange    fn(name) — returns event handler
 *  onBlur      fn(name) — returns blur handler
 *
 * Layout: two-column grid on sm+, single column on mobile.
 */
function EmployeeForm({ fields, fieldError, onChange, onBlur }) {
  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));
  const deptOptions = DEPARTMENTS;
  const typeOptions = EMPLOYMENT_TYPES;

  return (
    <div className="space-y-5">
      {/* ── Section: Personal ─────────────────────────────────────── */}
      <fieldset>
        <legend className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Personal Information
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full name *"
            placeholder="Alex Johnson"
            value={fields.name}
            onChange={onChange('name')}
            onBlur={onBlur('name')}
            error={fieldError('name')}
            autoComplete="name"
          />
          <Input
            label="Email address *"
            placeholder="alex@company.com"
            type="email"
            value={fields.email}
            onChange={onChange('email')}
            onBlur={onBlur('email')}
            error={fieldError('email')}
            autoComplete="email"
          />
          <Input
            label="Phone number *"
            placeholder="+1 (555) 000-0000"
            type="tel"
            value={fields.phone}
            onChange={onChange('phone')}
            onBlur={onBlur('phone')}
            error={fieldError('phone')}
          />
          <Input
            label="Home address"
            placeholder="123 Main St, City, State"
            value={fields.address}
            onChange={onChange('address')}
            onBlur={onBlur('address')}
            error={fieldError('address')}
          />
        </div>
      </fieldset>

      {/* ── Section: Employment ───────────────────────────────────── */}
      <fieldset>
        <legend className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Employment Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job title *"
            placeholder="Senior Engineer"
            value={fields.jobTitle}
            onChange={onChange('jobTitle')}
            onBlur={onBlur('jobTitle')}
            error={fieldError('jobTitle')}
          />
          <Select
            label="Department *"
            options={deptOptions}
            value={fields.department}
            onChange={onChange('department')}
            onBlur={onBlur('department')}
            error={fieldError('department')}
          />
          <Select
            label="Role *"
            options={roleOptions}
            value={fields.role}
            onChange={onChange('role')}
            onBlur={onBlur('role')}
            error={fieldError('role')}
          />
          <Select
            label="Employment type *"
            options={typeOptions}
            value={fields.employmentType}
            onChange={onChange('employmentType')}
            onBlur={onBlur('employmentType')}
            error={fieldError('employmentType')}
          />
          <Input
            label="Join date *"
            type="date"
            value={fields.joinDate}
            onChange={onChange('joinDate')}
            onBlur={onBlur('joinDate')}
            error={fieldError('joinDate')}
          />
          <Input
            label="Annual salary (USD) *"
            placeholder="75000"
            type="number"
            min="0"
            step="1000"
            value={fields.salary}
            onChange={onChange('salary')}
            onBlur={onBlur('salary')}
            error={fieldError('salary')}
          />
          <Select
            label="Status *"
            options={['Active', 'Inactive']}
            value={fields.status}
            onChange={onChange('status')}
            onBlur={onBlur('status')}
            error={fieldError('status')}
          />
          <Input
            label="Emergency contact"
            placeholder="Name · Phone number"
            value={fields.emergencyContact}
            onChange={onChange('emergencyContact')}
            onBlur={onBlur('emergencyContact')}
            error={fieldError('emergencyContact')}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default EmployeeForm;
