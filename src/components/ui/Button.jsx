import clsx from 'clsx';

/**
 * Button — single reusable button primitive.
 *
 * Props:
 *  variant   'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 *  size      'sm' | 'md' | 'lg'
 *  loading   boolean   — shows spinner, disables interaction
 *  leftIcon  ReactNode
 *  rightIcon ReactNode
 *  fullWidth boolean
 *  ...rest   any native <button> prop
 */

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  outline:
    'bg-white border border-surface-border text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
};

const SIZES = {
  sm: 'h-8  px-3 text-xs  gap-1.5 rounded-lg',
  md: 'h-9  px-4 text-sm  gap-2   rounded-lg',
  lg: 'h-11 px-5 text-sm  gap-2   rounded-xl',
};

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
  );
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed select-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children && <span className="truncate">{children}</span>}
      {!loading && rightIcon}
    </button>
  );
}

export default Button;
