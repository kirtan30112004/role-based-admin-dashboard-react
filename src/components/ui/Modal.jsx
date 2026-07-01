import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Modal — accessible dialog rendered via React Portal.
 *
 * Props:
 *  isOpen      boolean
 *  onClose     () => void
 *  title       string
 *  description string      — optional subtitle / description
 *  size        'sm' | 'md' | 'lg' | 'xl' | 'full'
 *  hideClose   boolean     — hide the × button
 *  footer      ReactNode   — rendered below the body
 *  children    ReactNode
 *
 * Accessibility:
 *  - role="dialog" aria-modal="true" aria-labelledby aria-describedby
 *  - Escape key closes
 *  - Focus locked inside while open
 *  - Body scroll locked while open
 */

const WIDTHS = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw]',
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  hideClose = false,
  footer,
  children,
}) {
  const dialogRef   = useRef(null);
  const previousFocusRef = useRef(null);

  // Lock scroll + remember trigger element
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const raf = requestAnimationFrame(() => {
      const el = dialogRef.current?.querySelector(FOCUSABLE);
      el?.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus trap
  const trapFocus = useCallback((e) => {
    if (!dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
    if (!nodes.length) return;
    const first = nodes[0];
    const last  = nodes[nodes.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', trapFocus);
    return ()  => document.removeEventListener('keydown', trapFocus);
  }, [isOpen, trapFocus]);

  if (!isOpen) return null;

  const titleId = 'modal-title';
  const descId  = 'modal-desc';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={clsx(
          'relative z-10 w-full bg-white rounded-2xl shadow-2xl',
          'flex flex-col max-h-[90vh]',
          'animate-in fade-in zoom-in-95 duration-200',
          WIDTHS[size],
        )}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-surface-border flex-shrink-0">
            <div>
              {title && (
                <h2 id={titleId} className="text-base font-semibold text-slate-800">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-sm text-slate-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600
                           hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-border flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
