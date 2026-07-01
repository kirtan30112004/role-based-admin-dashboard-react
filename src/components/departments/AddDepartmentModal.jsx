import { useEffect }        from 'react';
import Modal                from '../ui/Modal';
import Button               from '../ui/Button';
import DepartmentForm       from './DepartmentForm';
import useDepartmentForm, { EMPTY_DEPT_FORM } from '../../hooks/useDepartmentForm';
import { useDepartments }   from '../../context/DepartmentContext';
import { toast }            from '../ui/Toast';

function AddDepartmentModal({ isOpen, onClose }) {
  const { addDepartment, departments } = useDepartments();
  const { fields, onChange, onBlur, validate, reset, fieldError, setField } =
    useDepartmentForm(EMPTY_DEPT_FORM, departments, null);

  useEffect(() => { if (isOpen) reset(EMPTY_DEPT_FORM); }, [isOpen]); // eslint-disable-line

  const handleSubmit = () => {
    if (!validate()) return;
    addDepartment(fields);
    toast.success(`"${fields.name}" department created.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add department"
      description="Create a new department. Only name is required."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create department</Button>
        </>
      }
    >
      <DepartmentForm
        fields={fields}
        fieldError={fieldError}
        onChange={onChange}
        onBlur={onBlur}
        setField={setField}
      />
    </Modal>
  );
}

export default AddDepartmentModal;
