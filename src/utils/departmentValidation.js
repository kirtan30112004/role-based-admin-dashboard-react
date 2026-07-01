/**
 * departmentValidation.js — pure validation rules for the department form.
 */

export function validateDepartment(fields, allDepartments = [], editingId = null) {
  const errors = {};

  // Name
  if (!fields.name?.trim()) {
    errors.name = 'Department name is required.';
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (fields.name.trim().length > 60) {
    errors.name = 'Name must be 60 characters or fewer.';
  } else {
    const duplicate = allDepartments.find(
      (d) => d.name.toLowerCase() === fields.name.trim().toLowerCase() && d.id !== editingId,
    );
    if (duplicate) errors.name = 'A department with this name already exists.';
  }

  // Manager (optional but if provided, validate length)
  if (fields.manager && fields.manager.trim().length > 80) {
    errors.manager = 'Manager name must be 80 characters or fewer.';
  }

  // Budget (optional — validate if provided)
  if (fields.budget !== '' && fields.budget !== undefined && fields.budget !== null) {
    const n = Number(fields.budget);
    if (isNaN(n) || n < 0) errors.budget = 'Budget must be a positive number.';
    if (n > 100_000_000)   errors.budget = 'Budget value seems unrealistically high.';
  }

  // Description (optional)
  if (fields.description && fields.description.trim().length > 200) {
    errors.description = 'Description must be 200 characters or fewer.';
  }

  // Location (optional)
  if (fields.location && fields.location.trim().length > 80) {
    errors.location = 'Location must be 80 characters or fewer.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateDeptField(field, value, allDepartments = [], editingId = null) {
  const obj = validateDepartment(
    { name: '', manager: '', budget: '', description: '', location: '', [field]: value },
    allDepartments,
    editingId,
  );
  return obj.errors[field] ?? '';
}
