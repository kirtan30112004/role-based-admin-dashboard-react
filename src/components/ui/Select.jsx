import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Select — styled <select> with the same visual API as Input.
 *
 * Props:
 *  label   string
 *  error   string
 *  hint    string
 *  options Array<{ value, label }> | string[]
 *  ...rest any native <select> prop
 */
const Select = forwardRef(function Select(
  { label, error, hint, options = [], className, id, fullWidth = true, ...rest },
  ref,
) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const normalised = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );

  return (
    <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-err` : hint ? `${selectId}-hint` : undefined}
        className={clsx(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-800',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-slate-50 disabled:cursor-not-allowed',
          error ? 'border-red-400 focus:ring-red-400' : 'border-surface-border',
          className,
        )}
        {...rest}
      >
        <option value="">— select —</option>
        {normalised.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {error && <p id={`${selectId}-err`}  className="text-xs text-red-600">{error}</p>}
      {!error && hint && <p id={`${selectId}-hint`} className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

export default Select;
