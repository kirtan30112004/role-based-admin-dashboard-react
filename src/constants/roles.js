/**
 * roles.js — single source of truth for every enumeration the app uses.
 * Import from here everywhere; never duplicate these values.
 */

/* ── User roles ──────────────────────────────────────────────────────── */
export const ROLES = Object.freeze({
  ADMIN:    'admin',
  HR:       'hr',
  EMPLOYEE: 'employee',
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.ADMIN]:    'Administrator',
  [ROLES.HR]:       'HR Manager',
  [ROLES.EMPLOYEE]: 'Employee',
});

/* ── Route paths ─────────────────────────────────────────────────────── */
export const ROUTES = Object.freeze({
  LOGIN: '/login',
  ROOT:  '/',

  // Admin
  ADMIN_DASHBOARD:   '/admin/dashboard',
  ADMIN_EMPLOYEES:   '/admin/employees',
  ADMIN_DEPARTMENTS: '/admin/departments',   // ← Phase 4
  ADMIN_USERS:       '/admin/users',
  ADMIN_SETTINGS:    '/admin/settings',

  // HR
  HR_DASHBOARD: '/hr/dashboard',
  HR_EMPLOYEES: '/hr/employees',
  HR_LEAVES:    '/hr/leaves',

  // Employee
  EMP_DASHBOARD: '/employee/dashboard',
  EMP_PROFILE:   '/employee/profile',
  EMP_LEAVES:    '/employee/leaves',

  // Shared
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND:    '*',
});

export const ROLE_HOME = Object.freeze({
  [ROLES.ADMIN]:    ROUTES.ADMIN_DASHBOARD,
  [ROLES.HR]:       ROUTES.HR_DASHBOARD,
  [ROLES.EMPLOYEE]: ROUTES.EMP_DASHBOARD,
});

/* ── Departments ─────────────────────────────────────────────────────── */
/**
 * DEPARTMENT_COLORS — consistent colour token per department name.
 * Used by DepartmentChart, department badges, and the Departments page.
 */
export const DEPARTMENT_COLORS = {
  'Engineering':     '#6366f1',
  'Design':          '#8b5cf6',
  'Marketing':       '#06b6d4',
  'Finance':         '#10b981',
  'Human Resources': '#f59e0b',
  'Operations':      '#f43f5e',
  'Legal':           '#64748b',
  'Product':         '#0ea5e9',
};

/** Ordered list used by dropdowns and seed data */
export const DEPARTMENTS = Object.keys(DEPARTMENT_COLORS);

/* ── Employment types ────────────────────────────────────────────────── */
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'];
