import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal            from '../ui/Modal';
import Button           from '../ui/Button';
import Avatar           from '../common/Avatar';
import { useEmployees } from '../../context/EmployeeContext';
import { toast }        from '../ui/Toast';

/**
 * DeleteEmployeeModal — confirmation dialog before deleting a record.
 *
 * Props:
 *  employee  Employee | null
 *  isOpen    boolean
 *  onClose   () => void
 */
function DeleteEmployeeModal({ employee, isOpen, onClose }) {
  const { deleteEmployee } = useEmployees();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate async
    deleteEmployee(employee.id);
    toast.error(`${employee.name} was removed.`);
    setDeleting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete employee"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Yes, delete
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">
            This action is <strong>permanent</strong> and cannot be undone.
            The employee record will be removed from localStorage immediately.
          </p>
        </div>

        {/* Employee preview */}
        {employee && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-surface-border">
            <Avatar user={employee} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{employee.name}</p>
              <p className="text-xs text-slate-500 truncate">{employee.email}</p>
              <p className="text-xs text-slate-400">{employee.department} · {employee.jobTitle}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default DeleteEmployeeModal;
