/**
 * LoadingScreen — full-viewport overlay shown while the auth session
 * is being hydrated from localStorage on the initial page load.
 *
 * Prevents the flash of the login page that would otherwise appear
 * for ~1 frame before ProtectedRoute confirms the session is valid.
 */
function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center
                 bg-surface-muted gap-5"
    >
      {/* Brand mark */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center
                        justify-center shadow-lg">
          <span className="text-white text-lg font-bold select-none">A</span>
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">AdminHub</span>
      </div>

      {/* Spinner */}
      <div className="relative h-10 w-10" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent
                        border-t-primary-600 animate-spin" />
      </div>

      {/* Message */}
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

export default LoadingScreen;
