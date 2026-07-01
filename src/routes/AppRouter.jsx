import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES, ROUTES } from '../constants/roles';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute    from './PublicRoute';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Shared
import UnauthorizedPage from '../pages/shared/UnauthorizedPage';
import NotFoundPage     from '../pages/shared/NotFoundPage';

// Admin
import AdminDashboard   from '../pages/admin/AdminDashboard';
import AdminEmployees   from '../pages/admin/AdminEmployees';
import AdminDepartments from '../pages/admin/AdminDepartments';   // ← Phase 4
import AdminUsers       from '../pages/admin/AdminUsers';
import AdminSettings    from '../pages/admin/AdminSettings';

// HR
import HrDashboard from '../pages/hr/HrDashboard';
import HrEmployees from '../pages/hr/HrEmployees';
import HrLeaves    from '../pages/hr/HrLeaves';

// Employee
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeProfile   from '../pages/employee/EmployeeProfile';
import EmployeeLeaves    from '../pages/employee/EmployeeLeaves';

function AppRouter() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────────────────── */}
      <Route
        path={ROUTES.LOGIN}
        element={<PublicRoute><LoginPage /></PublicRoute>}
      />

      {/* ── Shared error pages ────────────────────────────────────────── */}
      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

      {/* ── Authenticated layout shell ─────────────────────────────────
           All child routes inherit the DashboardLayout (Sidebar + Header + Footer).
           ProtectedRoute here guards the shell; individual routes add role guards.
      ──────────────────────────────────────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Root → sends unauthenticated visitors to login */}
        <Route index element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* ── Admin routes ──────────────────────────────────────────── */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.ADMIN_EMPLOYEES}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminEmployees /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.ADMIN_DEPARTMENTS}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDepartments /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminUsers /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.ADMIN_SETTINGS}
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminSettings /></ProtectedRoute>}
        />

        {/* ── HR routes ─────────────────────────────────────────────── */}
        <Route
          path={ROUTES.HR_DASHBOARD}
          element={<ProtectedRoute allowedRoles={[ROLES.HR]}><HrDashboard /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.HR_EMPLOYEES}
          element={<ProtectedRoute allowedRoles={[ROLES.HR]}><HrEmployees /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.HR_LEAVES}
          element={<ProtectedRoute allowedRoles={[ROLES.HR]}><HrLeaves /></ProtectedRoute>}
        />

        {/* ── Employee routes ────────────────────────────────────────── */}
        <Route
          path={ROUTES.EMP_DASHBOARD}
          element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><EmployeeDashboard /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.EMP_PROFILE}
          element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><EmployeeProfile /></ProtectedRoute>}
        />
        <Route
          path={ROUTES.EMP_LEAVES}
          element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}><EmployeeLeaves /></ProtectedRoute>}
        />
      </Route>

      {/* ── 404 ──────────────────────────────────────────────────────── */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
