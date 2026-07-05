import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, Bell, X, CheckCheck, Clock, ChevronRight, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth }         from '../../context/AuthContext';
import { ROLE_HOME, ROUTES } from '../../constants/roles';
import Avatar              from '../common/Avatar';
import Button              from '../ui/Button';

/* ─── Page meta: title + breadcrumb segments ─────────────────────────
   Keyed by ROUTES constant so any route rename auto-propagates.
──────────────────────────────────────────────────────────────────────── */
const PAGE_META = {
  [ROUTES.ADMIN_DASHBOARD]:   { title: 'Dashboard',           crumbs: [] },
  [ROUTES.ADMIN_EMPLOYEES]:   { title: 'Employee Management', crumbs: [{ label: 'People' }] },
  [ROUTES.ADMIN_DEPARTMENTS]: { title: 'Departments',         crumbs: [{ label: 'Organisation' }] },
  [ROUTES.ADMIN_USERS]:       { title: 'User Accounts',       crumbs: [{ label: 'Administration' }] },
  [ROUTES.ADMIN_SETTINGS]:    { title: 'Settings',            crumbs: [{ label: 'Administration' }] },
  [ROUTES.HR_DASHBOARD]:      { title: 'Dashboard',           crumbs: [] },
  [ROUTES.HR_EMPLOYEES]:      { title: 'Employees',           crumbs: [{ label: 'People' }] },
  [ROUTES.HR_LEAVES]:         { title: 'Leave Requests',      crumbs: [{ label: 'People' }] },
  [ROUTES.EMP_DASHBOARD]:     { title: 'Dashboard',           crumbs: [] },
  [ROUTES.EMP_PROFILE]:       { title: 'My Profile',          crumbs: [{ label: 'Account' }] },
  [ROUTES.EMP_LEAVES]:        { title: 'My Leaves',           crumbs: [{ label: 'Account' }] },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Leave approved',      body: 'Jul 10–14 leave was approved.',      time: '2m ago',    read: false },
  { id: 2, title: 'New user registered', body: 'rohan.patel@company.com joined.',    time: '1h ago',    read: false },
  { id: 3, title: 'System update',       body: 'Scheduled maintenance on Sunday.',   time: '3h ago',    read: true  },
  { id: 4, title: 'Leave request',       body: 'Rahul Verma requested 5 days off.',   time: 'Yesterday', read: true  },
];

/* ─── Notification panel ─────────────────────────────────────────────── */
function NotificationPanel({ onClose }) {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const panelRef          = useRef(null);

  const markAllRead = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const dismiss     = (id) => setItems((p) => p.filter((n) => n.id !== id));
  const unread      = items.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl
                 border border-surface-border z-50 overflow-hidden
                 max-h-[calc(100dvh-5rem)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
          {unread > 0 && (
            <span className="badge bg-primary-100 text-primary-700">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-primary-600 hover:text-primary-700
                       flex items-center gap-1 font-medium transition-colors"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* Scrollable list */}
      <ul className="overflow-y-auto divide-y divide-surface-border flex-1">
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-slate-400">
            All caught up!
          </li>
        ) : items.map((n) => (
          <li
            key={n.id}
            className={clsx(
              'flex items-start gap-3 px-4 py-3 group transition-colors',
              !n.read ? 'bg-primary-50/60' : 'hover:bg-slate-50',
            )}
          >
            <span
              className={clsx(
                'mt-1.5 h-2 w-2 rounded-full flex-shrink-0 transition-colors',
                !n.read ? 'bg-primary-500' : 'bg-transparent',
              )}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
              <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
            </div>
            <button
              onClick={() => dismiss(n.id)}
              aria-label={`Dismiss: ${n.title}`}
              className="opacity-0 group-hover:opacity-100 p-1 rounded
                         text-slate-300 hover:text-slate-500 transition-all flex-shrink-0 mt-0.5"
            >
              <X size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Session expiry warning banner ──────────────────────────────────── */
function SessionWarningBanner({ minutesLeft, onExtend }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-amber-50 border-b border-amber-200 px-4 md:px-6 py-2.5
                 flex flex-col sm:flex-row items-start sm:items-center
                 justify-between gap-2"
    >
      <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
        <Clock size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
        <span>
          Your session expires in{' '}
          <strong>{minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}</strong>.{' '}
          Save any unsaved work.
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onExtend}
        className="text-amber-700 border-amber-300 hover:bg-amber-100 flex-shrink-0 whitespace-nowrap"
      >
        Extend session
      </Button>
    </div>
  );
}

/* ─── Breadcrumb row ─────────────────────────────────────────────────── */
function Breadcrumb({ crumbs, title }) {
  if (!crumbs?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-400">
      <span>Home</span>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={11} aria-hidden="true" />
          <span>{c.label}</span>
        </span>
      ))}
      <span className="flex items-center gap-1">
        <ChevronRight size={11} aria-hidden="true" />
        <span className="text-slate-600 font-medium">{title}</span>
      </span>
    </nav>
  );
}

/* ─── Mobile search drawer ───────────────────────────────────────────── */
function MobileSearchDrawer({ onClose }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-40 bg-white border-b border-surface-border
                    px-4 h-16 flex items-center gap-3 shadow-md">
      <Search size={16} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        placeholder="Search anything…"
        className="flex-1 text-sm text-slate-800 placeholder:text-slate-400
                   bg-transparent border-none outline-none"
        aria-label="Search"
      />
      <button
        onClick={onClose}
        aria-label="Close search"
        className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

/* ─── Main Header ────────────────────────────────────────────────────── */
function Header({ onMenuClick }) {
  const { user, isSessionExpiringSoon, sessionMinutesLeft, extendSession } = useAuth();
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch]   = useState(false);

  const meta         = PAGE_META[pathname] ?? { title: 'Page', crumbs: [] };
  const unreadCount  = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  // Profile → employee's own profile, admin/hr → their home
  const profilePath = user?.role === 'employee'
    ? ROUTES.EMP_PROFILE
    : ROLE_HOME[user?.role] ?? ROUTES.LOGIN;

  const closeNotifications  = useCallback(() => setShowNotifications(false), []);
  const closeMobileSearch   = useCallback(() => setShowMobileSearch(false), []);

  return (
    <header className="bg-white border-b border-surface-border flex-shrink-0 relative">

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <MobileSearchDrawer onClose={closeMobileSearch} />
      )}

      {/* ── Session expiry warning ─────────────────────────────────── */}
      {isSessionExpiringSoon && !showMobileSearch && (
        <SessionWarningBanner
          minutesLeft={sessionMinutesLeft}
          onExtend={extendSession}
        />
      )}

      {/* ── Main toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 sm:px-4 md:px-6 h-16">

        {/* Hamburger — mobile & tablet */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100
                     hover:text-slate-700 transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Page title — hidden on xs, shown sm+ */}
        <div className="hidden sm:flex flex-col flex-shrink-0 min-w-0">
          <h1 className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[200px] md:max-w-none">
            {meta.title}
          </h1>
          {meta.crumbs.length > 0 ? (
            <Breadcrumb crumbs={meta.crumbs} title={meta.title} />
          ) : (
            <p className="text-xs text-slate-400 truncate">
              Welcome back, {user?.name?.split(' ')[0]}
            </p>
          )}
        </div>

        {/* Flexible spacer */}
        <div className="flex-1" />

        {/* Desktop search — hidden on mobile */}
        <div className="hidden sm:block w-36 md:w-52 lg:w-64 flex-shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search…"
              aria-label="Global search"
              className="input pl-8 py-1.5 text-xs h-8"
            />
          </div>
        </div>

        {/* Mobile search button — only on xs */}
        <button
          onClick={() => setShowMobileSearch(true)}
          aria-label="Open search"
          className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100
                     hover:text-slate-700 transition-colors flex-shrink-0"
        >
          <Search size={19} />
        </button>

        {/* Notifications */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
            aria-haspopup="dialog"
            aria-expanded={showNotifications}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100
                       hover:text-slate-700 transition-colors"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full
                           bg-primary-500 ring-2 ring-white"
              />
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={closeNotifications} />
          )}
        </div>

        {/* Avatar / profile */}
        <button
          onClick={() => navigate(profilePath)}
          aria-label="My profile"
          className="flex-shrink-0 rounded-full
                     focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-primary-500"
        >
          <Avatar user={user} size="sm" />
        </button>
      </div>
    </header>
  );
}

export default Header;
