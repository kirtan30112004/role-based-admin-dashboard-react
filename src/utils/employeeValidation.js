/**
 * Employee form validation.
 *
 * validate(fields, allEmployees, editingId?)
 *   → { isValid: boolean, errors: Record<string, string> }
 *
 * Each field validator returns a string error message or ''.
 * All rules are pure functions — no side-effects.
 */

/* ── Individual field rules ─────────────────────────────────────────── */

const rules = {
  name(value) {
    if (!value?.trim())                   return 'Full name is required.';
    if (value.trim().length < 2)          return 'Name must be at least 2 characters.';
    if (value.trim().length > 80)         return 'Name must be 80 characters or fewer.';
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim()))
                                          return 'Name may only contain letters, spaces, hyphens and apostrophes.';
    return '';
  },

  email(value, allEmployees = [], editingId = null) {
    if (!value?.trim())                   return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
                                          return 'Enter a valid email address.';
    const duplicate = allEmployees.find(
      (e) => e.email.toLowerCase() === value.trim().toLowerCase() && e.id !== editingId,
    );
    if (duplicate)                        return 'This email is already registered.';
    return '';
  },

  phone(value) {
    if (!value?.trim())                   return 'Phone number is required.';
    // Accepts formats: +1 (555) 000-0000 | 555-000-0000 | 5550000000 etc.
    if (!/^[+\d\s().-]{7,20}$/.test(value.trim()))
                                          return 'Enter a valid phone number.';
    return '';
  },

  department(value) {
    if (!value?.trim())                   return 'Department is required.';
    return '';
  },

  jobTitle(value) {
    if (!value?.trim())                   return 'Job title is required.';
    if (value.trim().length < 2)          return 'Job title must be at least 2 characters.';
    if (value.trim().length > 60)         return 'Job title must be 60 characters or fewer.';
    return '';
  },

  employmentType(value) {
    if (!value?.trim())                   return 'Employment type is required.';
    return '';
  },

  status(value) {
    if (!value?.trim())                   return 'Status is required.';
    return '';
  },

  joinDate(value) {
    if (!value?.trim())                   return 'Join date is required.';
    const d = new Date(value);
    if (isNaN(d.getTime()))               return 'Enter a valid date.';
    if (d > new Date())                   return 'Join date cannot be in the future.';
    return '';
  },

  salary(value) {
    if (value === '' || value === undefined || value === null) return 'Salary is required.';
    const n = Number(value);
    if (isNaN(n) || n < 0)               return 'Salary must be a positive number.';
    if (n > 10_000_000)                  return 'Salary seems unrealistically high.';
    return '';
  },

  role(value) {
    if (!value?.trim())                   return 'Role is required.';
    return '';
  },

  // Optional fields — validate format only if a value is provided
  address(value) {
    if (value && value.trim().length > 150) return 'Address must be 150 characters or fewer.';
    return '';
  },

  emergencyContact(value) {
    if (value && value.trim().length > 100) return 'Emergency contact must be 100 characters or fewer.';
    return '';
  },
};

/* ── Required field list ──────────────────────────────────────────────
   Fields not in this list are validated only when a value is present. */
const REQUIRED_FIELDS = [
  'name', 'email', 'phone', 'department',
  'jobTitle', 'employmentType', 'status', 'joinDate', 'salary', 'role',
];

/* ── Main validator ───────────────────────────────────────────────────*/
/**
 * @param {Object} fields       — form values keyed by field name
 * @param {Array}  allEmployees — existing employees (for duplicate email check)
 * @param {string|null} editingId — id of record being edited (excluded from duplicate check)
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateEmployee(fields, allEmployees = [], editingId = null) {
  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = fields[field];

    // Skip optional fields when empty
    if (!REQUIRED_FIELDS.includes(field) && !value) continue;

    const error = field === 'email'
      ? rule(value, allEmployees, editingId)
      : rule(value);

    if (error) errors[field] = error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate a single field on blur (for real-time inline feedback).
 *
 * @param {string} field
 * @param {any}    value
 * @param {Array}  allEmployees
 * @param {string|null} editingId
 * @returns {string}  error message or ''
 */
export function validateField(field, value, allEmployees = [], editingId = null) {
  const rule = rules[field];
  if (!rule) return '';
  return field === 'email'
    ? rule(value, allEmployees, editingId)
    : rule(value);
}

export { rules };
