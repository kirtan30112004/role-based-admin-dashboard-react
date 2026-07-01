import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';
import Footer  from './Footer';

/**
 * DashboardLayout — authenticated page shell.
 *
 * Responsive behaviour:
 *  Mobile  (<lg)  Sidebar is off-canvas (hamburger toggle)
 *  Desktop (≥lg)  Sidebar is always visible in the flex row
 *
 * Uses `min-h-[100dvh]` (dynamic viewport height) so the layout fills
 * correctly on iOS Safari where the URL bar shrinks the viewport.
 *
 * Accessibility:
 *  - <main> has id="main-content" for a skip navigation link
 *  - tabIndex={-1} lets the skip link focus it without a visible ring
 */
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen min-h-[100dvh] overflow-hidden bg-surface-muted">

      {/* Skip navigation — first focusable element for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                   focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2
                   focus:bg-primary-600 focus:text-white focus:text-sm focus:font-medium
                   focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ── Right column (header + content + footer) ─────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Sticky top bar */}
        <Header onMenuClick={openSidebar} />

        {/* Scrollable page content
            px-4 py-4 on mobile; px-6 py-6 on md+
            pb-safe handles the iOS home-indicator safe area inset  */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto scrollbar-thin
                     px-3 py-4 sm:px-4 md:px-6 md:py-6
                     pb-safe focus:outline-none"
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
