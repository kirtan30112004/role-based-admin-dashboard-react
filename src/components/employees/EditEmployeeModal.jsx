import { useEffect } from 'react';
import Modal         from '../ui/Modal';
import Button        from '../ui/Button';
import EmployeeForm  from './EmployeeForm';
import useEmployeeForm from '../../hooks/useEmployeeForm';
import { useEmployees } from '../../context/EmployeeContext';
import { toast }        from '../ui/Toast';

/**
 * EditEmployeeModal — wraps EmployeeForm in edit mode.
 *
 * Props:
 *  employee  Employee | null   — the record being edited
 *  isOpen    boolean
 *  onClose   () => void
 */
function EditEmployeeModal({ employee, isOpen, onClose }) {
  const { updateEmployee, employees } = useEmployees();

  const { fields, onChange, onBlur, validate, reset, fieldError } =
    useEmployeeForm(
      employee ?? {},
      employees,
      employee?.id ?? null,
    );

  // Re-populate form whenever a different employee is opened
  useEffect(() => {
    if (isOpen && employee) reset(employee);
  }, [isOpen, employee?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!validate()) return;
    updateEmployee(employee.id, fields);
    toast.success(`${fields.name} was updated.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit employee"
      description={employee ? `Editing record for ${employee.name}` : ''}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </>
      }
    >
      <EmployeeForm
        fields={fields}
        fieldError={fieldError}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Modal>
  );
}

export default EditEmployeeModal;
