import {
  createContext, useCallback, useContext,
  useEffect, useMemo, useReducer,
} from 'react';
import { storage }                                    from '../utils/storage';
import { DEPARTMENT_SEED, DEPARTMENTS_STORAGE_KEY }  from '../constants/departmentSeed';
import { useEmployees }                               from './EmployeeContext';

/* ─────────────────────────────────────────────────────────────────────
   State
   ───────────────────────────────────────────────────────────────────── */
const initialState = { departments: [], isLoading: true, error: null };

const A = {
  HYDRATE:   'HYDRATE',
  ADD:       'ADD',
  UPDATE:    'UPDATE',
  REMOVE:    'REMOVE',
  SET_ERROR: 'SET_ERROR',
};

function reducer(state, action) {
  switch (action.type) {
    case A.HYDRATE:
      return { ...state, departments: action.payload, isLoading: false, error: null };
    case A.ADD:
      return { ...state, departments: [action.payload, ...state.departments] };
    case A.UPDATE:
      return {
        ...state,
        departments: state.departments.map((d) =>
          d.id === action.payload.id ? { ...d, ...action.payload } : d,
        ),
      };
    case A.REMOVE:
      return {
        ...state,
        departments: state.departments.filter((d) => d.id !== action.payload),
      };
    case A.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

function persist(departments) {
  storage.set(DEPARTMENTS_STORAGE_KEY, departments);
}

function generateId() {
  return `dept_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/* ─────────────────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────────────────── */
const DepartmentContext = createContext(null);

/* ─────────────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────────────── */
export function DepartmentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Pull employee counts from EmployeeContext so the department list
  // always shows up-to-date headcount without duplicating data.
  const { employees } = useEmployees();

  /* ── 1. Hydrate from localStorage ───────────────────────────────── */
  useEffect(() => {
    try {
      const stored = storage.get(DEPARTMENTS_STORAGE_KEY);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        dispatch({ type: A.HYDRATE, payload: stored });
      } else {
        persist(DEPARTMENT_SEED);
        dispatch({ type: A.HYDRATE, payload: DEPARTMENT_SEED });
      }
    } catch {
      dispatch({ type: A.SET_ERROR, payload: 'Failed to load department data.' });
    }
  }, []);

  /* ── 2. Persist on every mutation ───────────────────────────────── */
  useEffect(() => {
    if (!state.isLoading) persist(state.departments);
  }, [state.departments, state.isLoading]);

  /* ── 3. CRUD actions ────────────────────────────────────────────── */
  const addDepartment = useCallback((data) => {
    const dept = {
      ...data,
      id:        generateId(),
      name:      data.name.trim(),
      budget:    Number(data.budget) || 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: A.ADD, payload: dept });
    return dept;
  }, []);

  const updateDepartment = useCallback((id, data) => {
    dispatch({
      type:    A.UPDATE,
      payload: {
        ...data,
        id,
        budget:    Number(data.budget) || 0,
        updatedAt: new Date().toISOString(),
      },
    });
  }, []);

  const deleteDepartment = useCallback((id) => {
    dispatch({ type: A.REMOVE, payload: id });
  }, []);

  const getDepartment = useCallback(
    (id) => state.departments.find((d) => d.id === id),
    [state.departments],
  );

  const resetToSeed = useCallback(() => {
    persist(DEPARTMENT_SEED);
    dispatch({ type: A.HYDRATE, payload: DEPARTMENT_SEED });
  }, []);

  /* ── 4. Derived stats — headcount per dept from EmployeeContext ── */
  const departmentsWithStats = useMemo(() => {
    const countMap = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] ?? 0) + 1;
      return acc;
    }, {});

    return state.departments.map((d) => ({
      ...d,
      headcount: countMap[d.name] ?? 0,
    }));
  }, [state.departments, employees]);

  /* ── 5. Context value ────────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      departments:    departmentsWithStats,
      rawDepartments: state.departments,
      isLoading:      state.isLoading,
      error:          state.error,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      getDepartment,
      resetToSeed,
    }),
    [
      departmentsWithStats, state.departments, state.isLoading, state.error,
      addDepartment, updateDepartment, deleteDepartment, getDepartment, resetToSeed,
    ],
  );

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Hook
   ───────────────────────────────────────────────────────────────────── */
export function useDepartments() {
  const ctx = useContext(DepartmentContext);
  if (!ctx) throw new Error('useDepartments must be used within <DepartmentProvider>');
  return ctx;
}

export default DepartmentContext;
