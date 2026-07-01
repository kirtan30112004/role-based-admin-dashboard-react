import {
  createContext, useCallback, useContext,
  useEffect, useMemo, useReducer,
} from 'react';
import { storage }                     from '../utils/storage';
import { EMPLOYEE_SEED, EMPLOYEES_STORAGE_KEY } from '../constants/employeeSeed';

/* ─────────────────────────────────────────────────────────────────────
   State shape
   ───────────────────────────────────────────────────────────────────── */
/**
 * @typedef {Object} Employee
 * @property {string}  id
 * @property {string}  name
 * @property {string}  email
 * @property {string}  phone
 * @property {string}  role
 * @property {string}  department
 * @property {string}  jobTitle
 * @property {string}  employmentType
 * @property {string}  status          'Active' | 'Inactive'
 * @property {string}  joinDate        ISO date string
 * @property {number}  salary
 * @property {string}  [address]
 * @property {string}  [emergencyContact]
 */

/** @typedef {{ employees: Employee[], isLoading: boolean, error: string|null }} EmployeeState */

const initialState = {
  employees: [],
  isLoading: true,
  error:     null,
};

/* ─────────────────────────────────────────────────────────────────────
   Actions
   ───────────────────────────────────────────────────────────────────── */
const A = {
  HYDRATE:  'HYDRATE',
  ADD:      'ADD',
  UPDATE:   'UPDATE',
  REMOVE:   'REMOVE',
  SET_ERROR:'SET_ERROR',
};

/* ─────────────────────────────────────────────────────────────────────
   Reducer — pure, predictable state transitions
   ───────────────────────────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {
    case A.HYDRATE:
      return { ...state, employees: action.payload, isLoading: false, error: null };

    case A.ADD:
      return { ...state, employees: [action.payload, ...state.employees] };

    case A.UPDATE:
      return {
        ...state,
        employees: state.employees.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e,
        ),
      };

    case A.REMOVE:
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.payload),
      };

    case A.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────────────────
   localStorage sync helper
   Writes the full employees array after every mutation.
   ───────────────────────────────────────────────────────────────────── */
function persist(employees) {
  storage.set(EMPLOYEES_STORAGE_KEY, employees);
}

/* ─────────────────────────────────────────────────────────────────────
   ID generator — collision-proof within a browser session
   ───────────────────────────────────────────────────────────────────── */
function generateId() {
  return `emp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ─────────────────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────────────────── */
const EmployeeContext = createContext(null);

/* ─────────────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────────────── */
export function EmployeeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ── 1. Hydrate from localStorage on mount ──────────────────────── */
  useEffect(() => {
    try {
      const stored = storage.get(EMPLOYEES_STORAGE_KEY);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        // Existing data → use it
        dispatch({ type: A.HYDRATE, payload: stored });
      } else {
        // First run → seed from constant and persist
        persist(EMPLOYEE_SEED);
        dispatch({ type: A.HYDRATE, payload: EMPLOYEE_SEED });
      }
    } catch (err) {
      dispatch({ type: A.SET_ERROR, payload: 'Failed to load employee data.' });
    }
  }, []);

  /* ── 2. Sync to localStorage whenever employees array changes ────── */
  //  We skip the initial empty state (isLoading: true) to avoid
  //  wiping storage before hydration completes.
  useEffect(() => {
    if (!state.isLoading) {
      persist(state.employees);
    }
  }, [state.employees, state.isLoading]);

  /* ── 3. CRUD actions ─────────────────────────────────────────────── */

  /**
   * addEmployee — creates a new employee with a generated ID.
   * @param {Omit<Employee, 'id'>} data
   * @returns {Employee} the created record
   */
  const addEmployee = useCallback((data) => {
    const newEmployee = {
      ...data,
      id:        generateId(),
      name:      data.name.trim(),
      email:     data.email.trim().toLowerCase(),
      salary:    Number(data.salary),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: A.ADD, payload: newEmployee });
    return newEmployee;
  }, []);

  /**
   * updateEmployee — merges partial data into an existing record.
   * @param {string}  id
   * @param {Partial<Employee>} data
   */
  const updateEmployee = useCallback((id, data) => {
    dispatch({
      type:    A.UPDATE,
      payload: {
        ...data,
        id,
        salary:    Number(data.salary),
        email:     data.email?.trim().toLowerCase(),
        updatedAt: new Date().toISOString(),
      },
    });
  }, []);

  /**
   * deleteEmployee — removes a record by ID.
   * @param {string} id
   */
  const deleteEmployee = useCallback((id) => {
    dispatch({ type: A.REMOVE, payload: id });
  }, []);

  /**
   * getEmployee — returns a single record or undefined.
   * @param {string} id
   */
  const getEmployee = useCallback(
    (id) => state.employees.find((e) => e.id === id),
    [state.employees],
  );

  /**
   * resetToSeed — wipes localStorage and reloads seed data.
   * Useful for demo / testing.
   */
  const resetToSeed = useCallback(() => {
    persist(EMPLOYEE_SEED);
    dispatch({ type: A.HYDRATE, payload: EMPLOYEE_SEED });
  }, []);

  /* ── 4. Derived stats ────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const employees = state.employees;
    const active    = employees.filter((e) => e.status === 'Active').length;
    const deptCount = new Set(employees.map((e) => e.department)).size;
    const byDept    = employees.reduce((acc, e) => {
      acc[e.department] = (acc[e.department] ?? 0) + 1;
      return acc;
    }, {});

    return {
      total:      employees.length,
      active,
      inactive:   employees.length - active,
      departments: deptCount,
      byDept,
    };
  }, [state.employees]);

  /* ── 5. Context value ────────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      employees:      state.employees,
      isLoading:      state.isLoading,
      error:          state.error,
      stats,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployee,
      resetToSeed,
    }),
    [state, stats, addEmployee, updateEmployee, deleteEmployee, getEmployee, resetToSeed],
  );

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────────────────────────────── */
export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within <EmployeeProvider>');
  return ctx;
}

export default EmployeeContext;
