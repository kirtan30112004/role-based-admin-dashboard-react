import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

/* ─────────────────────────────────────────────────────────────────────
   Toast — lightweight notification system.

   Usage (imperative, no extra provider needed):
     import { toast } from './Toast';
     toast.success('Employee added!');
     toast.error('Something went wrong.');

   The component <ToastContainer /> must be rendered once (in App.jsx).
   ───────────────────────────────────────────────────────────────────── */

/* ── Internal event bus ─────────────────────────────────────────────── */
let _listeners = [];

function emit(toast) {
  _listeners.forEach((fn) => fn(toast));
}

/* ── Public API ─────────────────────────────────────────────────────── */
export const toast = {
  success: (message, duration = 3500) => emit({ type: 'success', message, duration }),
  error:   (message, duration = 4000) => emit({ type: 'error',   message, duration }),
  warning: (message, duration = 3500) => emit({ type: 'warning', message, duration }),
  info:    (message, duration = 3000) => emit({ type: 'info',    message, duration }),
};

/* ── Icons + styles per type ────────────────────────────────────────── */
const TOAST_STYLES = {
  success: { icon: CheckCircle,  bg: 'bg-emerald-50 border-emerald-200', iconClass: 'text-emerald-500', text: 'text-emerald-800' },
  error:   { icon: XCircle,      bg: 'bg-red-50 border-red-200',         iconClass: 'text-red-500',     text: 'text-red-800'     },
  warning: { icon: AlertCircle,  bg: 'bg-amber-50 border-amber-200',     iconClass: 'text-amber-500',   text: 'text-amber-800'   },
  info:    { icon: Info,         bg: 'bg-blue-50 border-blue-200',       iconClass: 'text-blue-500',    text: 'text-blue-800'    },
};

/* ── Single toast item ──────────────────────────────────────────────── */
function ToastItem({ id, type, message, onRemove }) {
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  const { icon: Icon, bg, iconClass, text } = TOAST_STYLES[type] ?? TOAST_STYLES.info;

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 250);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full',
        'transition-all duration-250',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        bg,
      )}
    >
      <Icon size={17} className={clsx('mt-0.5 flex-shrink-0', iconClass)} />
      <p className={clsx('flex-1 text-sm font-medium', text)}>{message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Container (render once in App.jsx) ─────────────────────────────── */
let _uid = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      const id = ++_uid;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => remove(id), t.duration ?? 3500);
    };

    _listeners.push(handler);
    return () => { _listeners = _listeners.filter((fn) => fn !== handler); };
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (!toasts.length) return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>,
    document.body,
  );
}

export default ToastContainer;
