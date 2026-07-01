import { useState, useCallback } from 'react';
import { validateEmployee, validateField } from '../utils/employeeValidation';

/**
 * useEmployeeForm
 *
 * Manages form state, field-level validation on blur, and full-form
 * validation on submit.  Used by both Add and Edit employee modals.
 *
 * @param {Object} initialValues — pre-filled values for edit mode (or EMPTY_FORM for add)
 * @param {Array}  allEmployees  — full list (for duplicate email detection)
 * @param {string|null} editingId — the id being edited (excluded from duplicate check)
 */

export const EMPTY_FORM = {
  name:             '',
  email:            '',
  phone:            '',
  role:             'employee',
  department:       '',
  jobTitle:         '',
  employmentType:   'Full-time',
  status:           'Active',
  joinDate:         '',
  salary:           '',
  address:          '',
  emergencyContact: '',
};

function useEmployeeForm(initialValues = EMPTY_FORM, allEmployees = [], editingId = null) {
  const [fields, setFields]   = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  /* ── Set a single field value ──────────────────────────────────── */
  const setField = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));

    // Clear the error for this field as soon as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  /* ── onChange handler factory ──────────────────────────────────── */
  const onChange = useCallback((name) => (e) => {
    setField(name, e.target.value);
  }, [setField]);

  /* ── onBlur — validate single field ───────────────────────────── */
  const onBlur = useCallback((name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, fields[name], allEmployees, editingId);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [fields, allEmployees, editingId]);

  /* ── Submit — validate all fields ─────────────────────────────── */
  const validate = useCallback(() => {
    // Mark all fields touched
    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {},
    );
    setTouched(allTouched);

    const { isValid, errors: newErrors } = validateEmployee(fields, allEmployees, editingId);
    setErrors(newErrors);
    return isValid;
  }, [fields, allEmployees, editingId]);

  /* ── Reset form ────────────────────────────────────────────────── */
  const reset = useCallback((values = EMPTY_FORM) => {
    setFields({ ...EMPTY_FORM, ...values });
    setErrors({});
    setTouched({});
  }, []);

  /* ── Convenience: has this field been touched and has an error? ── */
  const fieldError = useCallback(
    (name) => (touched[name] ? errors[name] || '' : ''),
    [touched, errors],
  );

  return {
    fields,
    errors,
    touched,
    setField,
    onChange,
    onBlur,
    validate,
    reset,
    fieldError,
  };
}

export default useEmployeeForm;
