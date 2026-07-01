import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until after `delay` ms have passed.
 *
 * @param {any}    value  — the value to debounce
 * @param {number} delay  — milliseconds to wait (default 300)
 * @returns the debounced value
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 300);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
