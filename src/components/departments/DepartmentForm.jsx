import Input  from '../ui/Input';

/**
 * DepartmentForm — shared form body for Add and Edit department modals.
 *
 * Props:
 *  fields     Object
 *  fieldError fn(name) → string
 *  onChange   fn(name) → event handler
 *  onBlur     fn(name) → blur handler
 *  setField   fn(name, value) — for non-input controls (colour picker)
 */

/* Built-in colour swatches that admins can choose from */
const SWATCHES = [
  '#6366f1','#8b5cf6','#06b6d4','#10b981',
  '#f59e0b','#f43f5e','#64748b','#0ea5e9',
  '#e11d48','#16a34a','#d97706','#7c3aed',
];

function DepartmentForm({ fields, fieldError, onChange, onBlur, setField }) {
  return (
    <div className="space-y-5">
      {/* ── Identity ──────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Basic Information
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Department name *"
              placeholder="Engineering"
              value={fields.name}
              onChange={onChange('name')}
              onBlur={onBlur('name')}
              error={fieldError('name')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of this department's purpose…"
              value={fields.description}
              onChange={onChange('description')}
              onBlur={onBlur('description')}
              className="input resize-none"
            />
            {fieldError('description') && (
              <p className="mt-1 text-xs text-red-600">{fieldError('description')}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Details ───────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Manager name"
            placeholder="Aarav Sharma"
            value={fields.manager}
            onChange={onChange('manager')}
            onBlur={onBlur('manager')}
            error={fieldError('manager')}
          />
          <Input
            label="Annual budget (₹)"
            placeholder="50000000"
            type="number"
            min="0"
            step="100000"
            value={fields.budget}
            onChange={onChange('budget')}
            onBlur={onBlur('budget')}
            error={fieldError('budget')}
          />
          <Input
            label="Location / Office"
            placeholder="Bengaluru, Karnataka"
            value={fields.location}
            onChange={onChange('location')}
            onBlur={onBlur('location')}
            error={fieldError('location')}
          />
        </div>
      </fieldset>

      {/* ── Colour ────────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Colour
        </legend>
        <div className="flex flex-wrap gap-2 items-center">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setField('color', c)}
              style={{ backgroundColor: c }}
              aria-label={`Select colour ${c}`}
              className={`h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500
                ${fields.color === c ? 'ring-2 ring-offset-2 ring-slate-700 scale-110' : ''}`}
            />
          ))}
          {/* Custom hex input */}
          <div className="flex items-center gap-2 ml-1">
            <div
              className="h-7 w-7 rounded-full border border-surface-border"
              style={{ backgroundColor: fields.color }}
            />
            <input
              type="text"
              maxLength={7}
              value={fields.color}
              onChange={(e) => setField('color', e.target.value)}
              placeholder="#6366f1"
              className="input w-28 !py-1 text-xs font-mono"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default DepartmentForm;
