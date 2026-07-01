import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Input — controlled text input with optional leading/trailing adornments.
 *
 * Props:
 *  label        string   — visible label above the field
 *  error        string   — red error text below the field
 *  hint         string   — grey helper text below the field (ignored when error present)
 *  leftAdornment  ReactNode — icon or text on the left inside the input
 *  rightAdornment ReactNode — icon or text on the right inside the input
 *  size         'sm' | 'md' | 'lg'
 *  fullWidth    boolean
 *  ...rest      any native <input> prop
 */

const SIZES = {
  sm: 'h-8  text-xs  px-2.5',
  md: 'h-9  text-sm  px-3',
  lg: 'h-11 text-sm  px-4',
};

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftAdornment,
    rightAdornment,
    size = 'md',
    fullWidth = true,
    className,
    id,
    ...rest
  },
  ref,
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left adornment */}
        {leftAdornment && (
          <span className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            {leftAdornment}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={clsx(
            'w-full rounded-lg border bg-white text-slate-800 placeholder:text-slate-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-surface-border',
            SIZES[size],
            leftAdornment  && 'pl-9',
            rightAdornment && 'pr-9',
            className,
          )}
          {...rest}
        />

        {/* Right adornment */}
        {rightAdornment && (
          <span className="absolute right-3 flex items-center text-slate-400">
            {rightAdornment}
          </span>
        )}
      </div>

      {/* Error / hint text */}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
