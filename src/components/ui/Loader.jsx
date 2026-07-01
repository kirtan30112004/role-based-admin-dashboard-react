import clsx from 'clsx';

/**
 * Loader — flexible spinner with three usage modes:
 *
 *  1. Inline:   <Loader />  — a bare spinner in the flow
 *  2. Centred:  <Loader centred /> — centred in its parent (parent must be relative)
 *  3. Overlay:  <Loader overlay /> — fixed full-screen overlay with backdrop
 *
 * Props:
 *  size     'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *  color    'primary' | 'white' | 'slate'
 *  label    string — screen-reader text (default "Loading")
 *  centred  boolean
 *  overlay  boolean
 */

const SIZES = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-4',
};

const COLORS = {
  primary: 'border-primary-200 border-t-primary-600',
  white:   'border-white/30    border-t-white',
  slate:   'border-slate-200   border-t-slate-500',
};

function Spinner({ size = 'md', color = 'primary', label = 'Loading', className }) {
  return (
    <span role="status" aria-label={label} className={clsx('inline-block', className)}>
      <span
        className={clsx(
          'block rounded-full animate-spin',
          SIZES[size],
          COLORS[color],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function Loader({
  size = 'md',
  color = 'primary',
  label = 'Loading',
  centred = false,
  overlay = false,
  className,
}) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm">
        <Spinner size="xl" color={color} label={label} />
        <p className="text-sm font-medium text-slate-500 animate-pulse">{label}…</p>
      </div>
    );
  }

  if (centred) {
    return (
      <div className={clsx('flex items-center justify-center p-8', className)}>
        <Spinner size={size} color={color} label={label} />
      </div>
    );
  }

  return <Spinner size={size} color={color} label={label} className={className} />;
}

export { Spinner };
export default Loader;
