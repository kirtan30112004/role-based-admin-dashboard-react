import {
  createContext, useCallback, useContext,
  useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import { authenticateUser } from '../constants/mockUsers';
import { storage, SESSION_KEY } from '../utils/storage';

/* ─────────────────────────────────────────────────────────────────────
   State shape
   ───────────────────────────────────────────────────────────────────── */
const initialState = {
  user:          null,
  isLoading:     true,   // true while hydrating from localStorage on mount
  isSubmitting:  false,
  error:         null,
  sessionExpiry: null,   // epoch ms — when the session expires
};

const A = Object.freeze({
  HYDRATE_START:   'HYDRATE_START',
  HYDRATE_SUCCESS: 'HYDRATE_SUCCESS',
  HYDRATE_FAILURE: 'HYDRATE_FAILURE',
  LOGIN_START:     'LOGIN_START',
  LOGIN_SUCCESS:   'LOGIN_SUCCESS',
  LOGIN_FAILURE:   'LOGIN_FAILURE',
  LOGOUT:          'LOGOUT',
  CLEAR_ERROR:     'CLEAR_ERROR',
  EXTEND_SESSION:  'EXTEND_SESSION',
});

function authReducer(state, action) {
  switch (action.type) {
    case A.HYDRATE_START:
      return { ...state, isLoading: true };
    case A.HYDRATE_SUCCESS:
      return {
        ...state,
        isLoading:     false,
        user:          action.payload.user,
        sessionExpiry: action.payload.expiresAt,
      };
    case A.HYDRATE_FAILURE:
      return { ...state, isLoading: false, user: null, sessionExpiry: null };
    case A.LOGIN_START:
      return { ...state, isSubmitting: true, error: null };
    case A.LOGIN_SUCCESS:
      return {
        ...state,
        isSubmitting:  false,
        user:          action.payload.user,
        sessionExpiry: action.payload.expiresAt,
        error:         null,
      };
    case A.LOGIN_FAILURE:
      return { ...state, isSubmitting: false, error: action.payload };
    case A.LOGOUT:
      return { ...initialState, isLoading: false };
    case A.CLEAR_ERROR:
      return { ...state, error: null };
    case A.EXTEND_SESSION:
      return { ...state, sessionExpiry: action.payload };
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────────────────────────────── */
const SESSION_DURATION_MS  = 8 * 60 * 60 * 1000;  // 8 hours
const SESSION_WARN_BEFORE  = 15 * 60 * 1000;       // warn 15 min before expiry
const TICK_INTERVAL_MS     = 60 * 1000;            // recompute minutesLeft every 60 s
const ACTIVITY_THROTTLE_MS = 5 * 60 * 1000;        // extend at most once per 5 min on activity

/* ─────────────────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────────────────── */
const AuthContext = createContext(null);

/* ─────────────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [state, dispatch]    = useReducer(authReducer, initialState);
  const expiryTimerRef       = useRef(null);   // auto-logout setTimeout
  const tickIntervalRef      = useRef(null);   // 1-min countdown tick
  const lastActivityRef      = useRef(0);      // epoch ms of last throttled extension
  const [tick, setTick]      = useState(0);    // bumped every minute so derived values recompute

  /* ── Timer helpers ─────────────────────────────────────────────── */
  const clearTimers = useCallback(() => {
    if (expiryTimerRef.current)  clearTimeout(expiryTimerRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
  }, []);

  /**
   * scheduleExpiry
   * Sets a self-cleaning auto-logout timer + a 1-minute tick interval.
   * The tick interval re-evaluates sessionMinutesLeft so the warning
   * banner stays accurate in real time without needing user interaction.
   */
  const scheduleExpiry = useCallback((expiresAt) => {
    clearTimers();

    const msLeft = expiresAt - Date.now();
    if (msLeft <= 0) return;

    // Auto-logout when timer fires
    expiryTimerRef.current = setTimeout(() => {
      storage.remove(SESSION_KEY);
      dispatch({ type: A.LOGOUT });
    }, msLeft);

    // Tick every 60 s — forces re-render so countdown stays live
    tickIntervalRef.current = setInterval(() => {
      // If the tab was sleeping and woke after expiry, clean up now
      if (Date.now() >= expiresAt) {
        clearTimers();
        storage.remove(SESSION_KEY);
        dispatch({ type: A.LOGOUT });
      } else {
        setTick((n) => n + 1);
      }
    }, TICK_INTERVAL_MS);
  }, [clearTimers]);

  /* ── 1. Hydrate session from localStorage on mount ─────────────── */
  useEffect(() => {
    dispatch({ type: A.HYDRATE_START });

    try {
      const session = storage.get(SESSION_KEY);

      if (session?.user && session?.expiresAt && Date.now() < session.expiresAt) {
        // Valid unexpired session found — restore it
        dispatch({ type: A.HYDRATE_SUCCESS, payload: session });
        scheduleExpiry(session.expiresAt);
      } else {
        // No session, or it's expired / malformed — clean up
        if (session) storage.remove(SESSION_KEY);
        dispatch({ type: A.HYDRATE_FAILURE });
      }
    } catch {
      // Safari private-mode throws a SecurityError on any localStorage access
      dispatch({ type: A.HYDRATE_FAILURE });
    }

    return clearTimers;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 2. Tab visibility change — re-validate session on wake ───── */
  useEffect(() => {
    if (!state.user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      // Tab became visible — check if session expired while sleeping
      const session = storage.get(SESSION_KEY);
      if (!session || Date.now() >= session.expiresAt) {
        clearTimers();
        storage.remove(SESSION_KEY);
        dispatch({ type: A.LOGOUT });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.user, clearTimers]);

  /* ── 3. Login ──────────────────────────────────────────────────── */
  const login = useCallback(async (email, password) => {
    dispatch({ type: A.LOGIN_START });
    try {
      const user = await authenticateUser(email, password);

      if (!user) {
        dispatch({
          type:    A.LOGIN_FAILURE,
          payload: 'Invalid email or password. Please try again.',
        });
        return { success: false };
      }

      const expiresAt = Date.now() + SESSION_DURATION_MS;
      storage.set(SESSION_KEY, { user, expiresAt });
      dispatch({ type: A.LOGIN_SUCCESS, payload: { user, expiresAt } });
      scheduleExpiry(expiresAt);
      return { success: true, user };
    } catch {
      dispatch({
        type:    A.LOGIN_FAILURE,
        payload: 'An unexpected error occurred. Please try again.',
      });
      return { success: false };
    }
  }, [scheduleExpiry]);

  /* ── 4. Extend session (one-click renewal + activity-based) ────── */
  const extendSession = useCallback(() => {
    if (!state.user) return;

    const session = storage.get(SESSION_KEY);
    if (!session) return;

    const expiresAt = Date.now() + SESSION_DURATION_MS;
    storage.set(SESSION_KEY, { ...session, expiresAt });
    dispatch({ type: A.EXTEND_SESSION, payload: expiresAt });
    scheduleExpiry(expiresAt);
  }, [state.user, scheduleExpiry]);

  /**
   * extendOnActivity — throttled version called by DashboardLayout on
   * user interaction (mouse/keyboard). Only extends if the session is
   * within the warning window and enough time has passed since the last
   * extension to avoid hammering localStorage.
   */
  const extendOnActivity = useCallback(() => {
    if (!state.user || !state.sessionExpiry) return;

    const now = Date.now();
    const msLeft = state.sessionExpiry - now;

    // Only auto-extend if we're in the warning window AND throttle allows it
    if (
      msLeft <= SESSION_WARN_BEFORE &&
      now - lastActivityRef.current > ACTIVITY_THROTTLE_MS
    ) {
      lastActivityRef.current = now;
      extendSession();
    }
  }, [state.user, state.sessionExpiry, extendSession]);

  /* ── 5. Logout ─────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    clearTimers();
    storage.remove(SESSION_KEY);
    dispatch({ type: A.LOGOUT });
  }, [clearTimers]);

  /* ── 6. Clear form error ───────────────────────────────────────── */
  const clearError = useCallback(() => dispatch({ type: A.CLEAR_ERROR }), []);

  /* ── 7. Role check helper ──────────────────────────────────────── */
  const hasRole = useCallback(
    (roles) => {
      if (!state.user) return false;
      const allowed = Array.isArray(roles) ? roles : [roles];
      return allowed.includes(state.user.role);
    },
    [state.user],
  );

  /* ── 8. Derived: minutes left (recomputed every tick + on expiry change) */
  const sessionMinutesLeft = useMemo(() => {
    void tick; // subscribe to the per-minute tick
    if (!state.sessionExpiry) return null;
    return Math.max(0, Math.round((state.sessionExpiry - Date.now()) / 60_000));
  }, [state.sessionExpiry, tick]);

  const isSessionExpiringSoon = useMemo(
    () =>
      sessionMinutesLeft !== null &&
      sessionMinutesLeft <= Math.round(SESSION_WARN_BEFORE / 60_000) &&
      state.user !== null,
    [sessionMinutesLeft, state.user],
  );

  /* ── 9. Context value ──────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      user:                 state.user,
      isLoading:            state.isLoading,
      isSubmitting:         state.isSubmitting,
      error:                state.error,
      isAuthenticated:      !!state.user,
      sessionExpiry:        state.sessionExpiry,
      sessionMinutesLeft,
      isSessionExpiringSoon,
      login,
      logout,
      extendSession,
      extendOnActivity,
      clearError,
      hasRole,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state, sessionMinutesLeft, isSessionExpiringSoon,
      login, logout, extendSession, extendOnActivity, clearError, hasRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─────────────────────────────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
