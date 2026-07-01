/**
 * storage.js — prefixed localStorage helpers.
 *
 * All operations are wrapped in try/catch to handle:
 *  - JSON parse errors from corrupted data
 *  - Safari private-mode SecurityError (localStorage throws on write)
 *  - QuotaExceededError on disk-full devices
 *
 * All keys are automatically prefixed with "rbac_" to avoid collisions
 * with other scripts on the same origin.
 */

const PREFIX = 'rbac_';

export const storage = {
  /**
   * get — read and JSON-parse a value.
   * Returns null if the key doesn't exist or parsing fails.
   */
  get(key) {
    try {
      const raw = localStorage.getItem(`${PREFIX}${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * set — JSON-stringify and write a value.
   * Returns true on success, false if localStorage is unavailable.
   */
  set(key, value) {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * remove — delete a single key.
   */
  remove(key) {
    try {
      localStorage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * clear — remove every key that starts with the app prefix.
   * Does NOT touch keys written by other scripts.
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * isAvailable — quick check that localStorage is accessible.
   * Useful for showing a "private browsing" warning.
   */
  isAvailable() {
    try {
      const probe = `${PREFIX}_probe`;
      localStorage.setItem(probe, '1');
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  },
};

/** Storage key for the auth session object */
export const SESSION_KEY = 'session';
