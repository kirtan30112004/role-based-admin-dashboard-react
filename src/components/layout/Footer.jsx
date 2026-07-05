/**
 * Footer — persistent bottom bar inside DashboardLayout.
 * Stays within the main content column (not behind the sidebar).
 *
 * Responsive: collapses to a single line on mobile.
 */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="flex-shrink-0 border-t border-surface-border bg-white
                 px-4 md:px-6 py-2.5
                 flex flex-wrap items-center justify-between gap-x-4 gap-y-1
                 text-xs text-slate-400"
    >
      <p>
        © {year}{' '}
        <span className="font-semibold text-slate-500">AdminHub</span>
      </p>
      <p className="hidden sm:block">React · Vite · Tailwind CSS</p>
      <p>v1.0.0</p>
    </footer>
  );
}

export default Footer;
