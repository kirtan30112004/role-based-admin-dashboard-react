import { useState }      from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal  from './Modal';
import Button from './Button';

/**
 * ConfirmModal — generic confirmation dialog.
 *
 * Props:
 *  isOpen        boolean
 *  onClose       () => void
 *  onConfirm     () => void | Promise<void>
 *  title         string   (default "Are you sure?")
 *  description   string
 *  confirmLabel  string   (default "Confirm")
 *  danger        boolean  — uses red confirm button (default true)
 *  children      ReactNode — optional preview content
 */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  danger      = true,
  children,
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <AlertTriangle size={17} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{description}</p>
        </div>
        {children}
      </div>
    </Modal>
  );
}

export default ConfirmModal;
