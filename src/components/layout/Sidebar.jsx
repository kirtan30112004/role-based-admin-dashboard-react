import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard, Users, Settings, UserCheck,
  Calendar, UserCircle, LogOut, X, ChevronRight,
  UsersRound, Building2,
} from 'lucide-react';
import { useAuth }   from '../../context/AuthContext';
import { ROLES, ROUTES } from '../../constants/roles';
import Avatar        from '../common/Avatar';
import { RoleBadge } from '../common/Badge';

/* ─── Nav definition per role ─────────────────────────────────────────── */
const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard',           path: ROUTES.ADMIN_DASHBOARD,   icon: LayoutDashboard },
    { label: 'Employee Management', path: ROUTES.ADMIN_EMPLOYEES,   icon: UsersRound      },
    { label: 'Departments',         path: ROUTES.ADMIN_DEPARTMENTS, icon: Building2       },
    { label: 'User Accounts',       path: ROUTES.ADMIN_USERS,       icon: Users           },
    { label: 'Settings',            path: ROUTES.ADMIN_SETTINGS,    icon: Settings        },
  ],
  [ROLES.HR]: [
    { label: 'Dashboard',      path: ROUTES.HR_DASHBOARD, icon: LayoutDashboard },
    { label: 'Employees',      path: ROUTES.HR_EMPLOYEES, icon: UserCheck       },
    { label: 'Leave Requests', path: ROUTES.HR_LEAVES,    icon: Calendar        },
  ],
  [ROLES.EMPLOYEE]: [
    { label: 'Dashboard', path: ROUTES.EMP_DASHBOARD, icon: LayoutDashboard },
    { label: 'My Profile',path: ROUTES.EMP_PROFILE,   icon: UserCircle      },
    { label: 'My Leaves', path: ROUTES.EMP_LEAVES,    icon: Calendar        },
  ],
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_ITEMS[user?.role] ?? [];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-surface-border',
          'flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold select-none">A</span>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">AdminHub</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600
                       hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Nav ───────────────────────────────────────────────────── */}
        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Menu
          </p>
          <ul className="space-y-0.5" role="list">
            {navItems.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => onClose?.()}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      'transition-colors duration-150 group',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={clsx(
                          'flex-shrink-0 transition-colors',
                          isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600',
                        )}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {isActive && <ChevronRight size={13} className="text-primary-400 flex-shrink-0" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── User footer ───────────────────────────────────────────── */}
        <div className="border-t border-surface-border p-4 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar user={user} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <RoleBadge role={user?.role} className="mt-0.5" />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost w-full justify-start text-sm text-red-600 hover:bg-red-50
                       hover:text-red-700 gap-2"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
