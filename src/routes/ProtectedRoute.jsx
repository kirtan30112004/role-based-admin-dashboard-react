import { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';
import { ROUTES }    from '../constants/roles';
import LoadingScreen from '../components/common/LoadingScreen';

/**
 * ProtectedRoute — guards a route subtree by auth state + optional role list.
 *
 * Decision matrix:
 * ┌──────────────────────┬──────────────────────────────────────────────────┐
 * │ State                │ Outcome                                          │
 * ├──────────────────────┼──────────────────────────────────────────────────┤
 * │ isLoading === true   │ Full-screen LoadingScreen (prevents flash)       │
 * ├──────────────────────┼──────────────────────────────────────────────────┤
 * │ Not authenticated    │ → /login  with `from` state preserved            │
 * │                      │   LoginPage reads `from` and redirects back      │
 * ├──────────────────────┼──────────────────────────────────────────────────┤
 * │ Wrong role           │ → /unauthorized                                  │
 * ├──────────────────────┼──────────────────────────────────────────────────┤
 * │ All checks pass      │ Render children                                  │
 * └──────────────────────┴──────────────────────────────────────────────────┘
 *
 * When allowedRoles is omitted, any authenticated user passes.
 */
function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isLoading, hasRole, extendOnActivity } = useAuth();
  const location = useLocation();

  /* ── Activity-based session extension ──────────────────────────────
     Attach throttled pointer + keyboard listeners to the document.
     This only runs when the user is actually on a protected page,
     and is cleaned up when they navigate away or log out.
  ──────────────────────────────────────────────────────────────────── */
  const extendRef = useRef(extendOnActivity);
  extendRef.current = extendOnActivity; // always current without re-subscribing

  useEffect(() => {
    if (!isAuthenticated) return;

    const handler = () => extendRef.current();

    // Passive listeners — never block the event loop
    const opts = { passive: true };
    document.addEventListener('pointerdown', handler, opts);
    document.addEventListener('keydown',     handler, opts);

    return () => {
      document.removeEventListener('pointerdown', handler, opts);
      document.removeEventListener('keydown',     handler, opts);
    };
  }, [isAuthenticated]);

  // 1. Still hydrating — show spinner, not a redirect
  if (isLoading) {
    return <LoadingScreen message="Restoring session…" />;
  }

  // 2. No valid session
  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  // 3. Authenticated but wrong role for this route
  if (allowedRoles?.length && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  // 4. All clear
  return children;
}

export default ProtectedRoute;
