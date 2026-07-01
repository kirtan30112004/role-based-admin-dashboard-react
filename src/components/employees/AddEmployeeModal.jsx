import { useEffect } from 'react';
import Modal         from '../ui/Modal';
import Button        from '../ui/Button';
import EmployeeForm  from './EmployeeForm';
import useEmployeeForm, { EMPTY_FORM } from '../../hooks/useEmployeeForm';
import { useEmployees }                from '../../context/EmployeeContext';
import { toast }                       from '../ui/Toast';

/**
 * AddEmployeeModal — wraps EmployeeForm for creating a new employee.
 *
 * Props:
 *  isOpen  boolean
 *  onClose () => void
 */
function AddEmployeeModal({ isOpen, onClose }) {
  const { addEmployee, employees } = useEmployees();

  const { fields, onChange, onBlur, validate, reset, fieldError } =
    useEmployeeForm(EMPTY_FORM, employees, null);

  // Reset form every time the modal opens
  useEffect(() => {
    if (isOpen) reset(EMPTY_FORM);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (!validate()) return; // shows all field errors
    addEmployee(fields);
    toast.success(`${fields.name} was added successfully.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new employee"
      description="Fill in all required fields (*) to create the employee record."
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} leftIcon={null}>Add employee</Button>
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

export default AddEmployeeModal;
