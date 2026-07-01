import { useRef, useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * SearchBar — controlled search input with clear button and optional debounce.
 *
 * Props:
 *  value         string
 *  onChange      (value: string) => void
 *  placeholder   string
 *  debounceMs    number  — if > 0, onChange fires after this delay (default 0 = immediate)
 *  size          'sm' | 'md' | 'lg'
 *  className     string
 *  autoFocus     boolean
 */

const SIZES = {
  sm: 'h-8  text-xs pl-8   pr-7',
  md: 'h-9  text-sm pl-9   pr-8',
  lg: 'h-11 text-sm pl-10  pr-9',
};

const ICON_SIZE = { sm: 14, md: 16, lg: 18 };

function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  debounceMs = 0,
  size = 'md',
  className,
  autoFocus = false,
}) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Keep local state in sync if parent drives value prop
  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const fireChange = useCallback(
    (val) => {
      if (debounceMs <= 0) {
        onChange?.(val);
        return;
      }
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange?.(val), debounceMs);
    },
    [onChange, debounceMs],
  );

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    fireChange(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    clearTimeout(timerRef.current);
    onChange?.('');
    inputRef.current?.focus();
  };

  const iconSz = ICON_SIZE[size];

  return (
    <div className={clsx('relative flex items-center', className)}>
      {/* Magnifier */}
      <Search
        size={iconSz}
        className="pointer-events-none absolute left-3 text-slate-400"
      />

      <input
        ref={inputRef}
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-lg border border-surface-border bg-white text-slate-800',
          'placeholder:text-slate-400 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          // Hide native clear button (Chrome)
          '[&::-webkit-search-cancel-button]:hidden',
          SIZES[size],
        )}
      />

      {/* Custom clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 flex items-center justify-center rounded-md
                     p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100
                     transition-colors"
        >
          <X size={iconSz - 2} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
