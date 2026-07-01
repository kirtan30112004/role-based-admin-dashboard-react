import { useState, useCallback } from 'react';
import { validateDepartment, validateDeptField } from '../utils/departmentValidation';

export const EMPTY_DEPT_FORM = {
  name:        '',
  description: '',
  manager:     '',
  budget:      '',
  location:    '',
  color:       '#6366f1',
};

function useDepartmentForm(initialValues = EMPTY_DEPT_FORM, allDepts = [], editingId = null) {
  const [fields, setFields]   = useState({ ...EMPTY_DEPT_FORM, ...initialValues });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const setField = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const onChange = useCallback(
    (name) => (e) => setField(name, e.target.value),
    [setField],
  );

  const onBlur = useCallback((name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateDeptField(name, fields[name], allDepts, editingId);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [fields, allDepts, editingId]);

  const validate = useCallback(() => {
    setTouched(Object.keys(EMPTY_DEPT_FORM).reduce((a, k) => ({ ...a, [k]: true }), {}));
    const { isValid, errors: errs } = validateDepartment(fields, allDepts, editingId);
    setErrors(errs);
    return isValid;
  }, [fields, allDepts, editingId]);

  const reset = useCallback((values = EMPTY_DEPT_FORM) => {
    setFields({ ...EMPTY_DEPT_FORM, ...values });
    setErrors({});
    setTouched({});
  }, []);

  const fieldError = useCallback(
    (name) => (touched[name] ? errors[name] || '' : ''),
    [touched, errors],
  );

  return { fields, errors, touched, setField, onChange, onBlur, validate, reset, fieldError };
}

export default useDepartmentForm;
