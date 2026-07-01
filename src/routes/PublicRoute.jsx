import { Navigate } from 'react-router-dom';
import { useAuth }    from '../context/AuthContext';
import { ROLE_HOME }  from '../constants/roles';
import LoadingScreen  from '../components/common/LoadingScreen';

/**
 * PublicRoute — wraps pages that must NOT be accessible once logged in.
 *
 * If the session is still being hydrated, shows the loading screen so
 * there's never a flash of the login page for an authenticated user who
 * just refreshed the browser.
 *
 * Once hydration completes:
 *   authenticated → redirect to role home (e.g. /admin/dashboard)
 *   not authenticated → render children (the login page)
 */
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Wait for hydration before deciding — prevents brief flash of login page
  if (isLoading) {
    return <LoadingScreen message="Loading…" />;
  }

  // Already logged in → go straight to the right home page
  if (isAuthenticated && user) {
    const home = ROLE_HOME[user.role];
    return <Navigate to={home} replace />;
  }

  // Not authenticated → show the public page (login form)
  return children;
}

export default PublicRoute;
