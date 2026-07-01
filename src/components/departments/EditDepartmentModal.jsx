import { useEffect }        from 'react';
import Modal                from '../ui/Modal';
import Button               from '../ui/Button';
import DepartmentForm       from './DepartmentForm';
import useDepartmentForm    from '../../hooks/useDepartmentForm';
import { useDepartments }   from '../../context/DepartmentContext';
import { toast }            from '../ui/Toast';

function EditDepartmentModal({ department, isOpen, onClose }) {
  const { updateDepartment, departments } = useDepartments();
  const { fields, onChange, onBlur, validate, reset, fieldError, setField } =
    useDepartmentForm(department ?? {}, departments, department?.id ?? null);

  useEffect(() => {
    if (isOpen && department) reset(department);
  }, [isOpen, department?.id]); // eslint-disable-line

  const handleSave = () => {
    if (!validate()) return;
    updateDepartment(department.id, fields);
    toast.success(`"${fields.name}" updated.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit department"
      description={department ? `Editing "${department.name}"` : ''}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
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

export default EditDepartmentModal;
