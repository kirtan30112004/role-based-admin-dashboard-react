import { useState, useMemo, useCallback } from 'react';
import {
  UserPlus, LayoutGrid, List, RotateCcw, Download,
} from 'lucide-react';

import { useDocumentTitle }  from '../../hooks/useDocumentTitle';
import useModal              from '../../hooks/useModal';
import useDebounce           from '../../hooks/useDebounce';
import usePagination         from '../../hooks/usePagination';
import { useEmployees }      from '../../context/EmployeeContext';

// Employee-specific components
import EmployeeStatsBar      from '../../components/employees/EmployeeStatsBar';
import EmployeeFilters       from '../../components/employees/EmployeeFilters';
import EmployeeCard          from '../../components/employees/EmployeeCard';
import EmployeeTableRow      from '../../components/employees/EmployeeTableRow';
import AddEmployeeModal      from '../../components/employees/AddEmployeeModal';
import EditEmployeeModal     from '../../components/employees/EditEmployeeModal';
import DeleteEmployeeModal   from '../../components/employees/DeleteEmployeeModal';
import EmployeeDetailModal   from '../../components/employees/EmployeeDetailModal';

// Shared UI
import Button     from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Loader     from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { toast }  from '../../components/ui/Toast';

/* ─── Filter state shape ─────────────────────────────────────────────── */
const INITIAL_FILTERS = {
  search:         '',
  department:     '',
  status:         '',
  employmentType: '',
};

/* ─── Table column headers ───────────────────────────────────────────── */
const TABLE_COLS = [
  { label: 'Employee',       className: '' },
  { label: 'Role',           className: 'hidden md:table-cell' },
  { label: 'Job / Dept',     className: 'hidden lg:table-cell' },
  { label: 'Type',           className: 'hidden xl:table-cell' },
  { label: 'Salary',         className: 'hidden xl:table-cell' },
  { label: 'Joined',         className: 'hidden lg:table-cell' },
  { label: 'Status',         className: '' },
  { label: '',               className: 'text-right' },   // Actions
];

/* ─── Page component ─────────────────────────────────────────────────── */
function AdminEmployees() {
  useDocumentTitle('Employee Management');

  /* ── Context ────────────────────────────────────────────────────── */
  const { employees, isLoading, stats, resetToSeed } = useEmployees();

  /* ── Local UI state ─────────────────────────────────────────────── */
  const [filters, setFilters]         = useState(INITIAL_FILTERS);
  const [viewMode, setViewMode]       = useState('table'); // 'table' | 'grid'
  const [selectedEmployee, setSelected] = useState(null);

  /* ── Modals ─────────────────────────────────────────────────────── */
  const addModal    = useModal();
  const editModal   = useModal();
  const deleteModal = useModal();
  const detailModal = useModal();

  /* ── Debounced search ───────────────────────────────────────────── */
  const debouncedSearch = useDebounce(filters.search, 250);

  /* ── Filtered employees (memoised) ─────────────────────────────── */
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return employees.filter((emp) => {
      const matchSearch = !q || [
        emp.name, emp.email, emp.jobTitle,
        emp.department, emp.phone,
      ].some((f) => f?.toLowerCase().includes(q));

      const matchDept   = !filters.department     || emp.department     === filters.department;
      const matchStatus = !filters.status         || emp.status         === filters.status;
      const matchType   = !filters.employmentType || emp.employmentType === filters.employmentType;

      return matchSearch && matchDept && matchStatus && matchType;
    });
  }, [employees, debouncedSearch, filters.department, filters.status, filters.employmentType]);

  /* ── Pagination ─────────────────────────────────────────────────── */
  const pagination = usePagination(filtered, 8);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset to page 1 whenever filters change — pagination handles it via usePagination
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const openDetail = useCallback((emp) => {
    setSelected(emp);
    detailModal.open();
  }, [detailModal]);

  const openEdit = useCallback((emp) => {
    setSelected(emp);
    editModal.open();
  }, [editModal]);

  const openDelete = useCallback((emp) => {
    setSelected(emp);
    deleteModal.open();
  }, [deleteModal]);

  /* ── CSV export (client-side) ───────────────────────────────────── */
  const handleExport = () => {
    const headers = ['Name','Email','Phone','Department','Job Title',
                     'Employment Type','Status','Join Date','Salary'];
    const rows = filtered.map((e) => [
      e.name, e.email, e.phone, e.department, e.jobTitle,
      e.employmentType, e.status, e.joinDate, e.salary,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} employees to CSV.`);
  };

  /* ── Reset to seed ──────────────────────────────────────────────── */
  const handleReset = () => {
    resetToSeed();
    setFilters(INITIAL_FILTERS);
    toast.info('Employee data reset to seed.');
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  if (isLoading) return <Loader overlay label="Loading employees" />;

  return (
    <div className="space-y-5">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Employee Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, search and edit all employee records. Data persists in localStorage.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex border border-surface-border rounded-lg overflow-hidden">
            <ViewToggleBtn
              active={viewMode === 'table'}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <List size={15} />
            </ViewToggleBtn>
            <ViewToggleBtn
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </ViewToggleBtn>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-600"
          >
            Reset data
          </Button>
          <Button
            size="sm"
            leftIcon={<UserPlus size={14} />}
            onClick={addModal.open}
          >
            Add employee
          </Button>
        </div>
      </div>

      {/* ── KPI stats bar ────────────────────────────────────────── */}
      <EmployeeStatsBar stats={stats} />

      {/* ── Filters ──────────────────────────────────────────────── */}
      <EmployeeFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        resultCount={filtered.length}
        totalCount={employees.length}
      />

      {/* ── Content area ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No employees found"
            message={
              Object.values(filters).some(Boolean)
                ? 'Try adjusting or clearing your filters.'
                : 'Add your first employee to get started.'
            }
            action={
              <Button leftIcon={<UserPlus size={14} />} onClick={addModal.open}>
                Add employee
              </Button>
            }
          />
        </div>
      ) : viewMode === 'table' ? (
        /* ── Table view ─────────────────────────────────────────── */
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-muted border-b border-surface-border">
                  {TABLE_COLS.map((col, i) => (
                    <th
                      key={i}
                      className={`px-5 py-3.5 text-left text-xs font-semibold text-slate-600
                                  uppercase tracking-wide ${col.className}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {pagination.paginatedItems.map((emp) => (
                  <EmployeeTableRow
                    key={emp.id}
                    employee={emp}
                    onView={openDetail}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination inside card */}
          <div className="px-5 py-4 border-t border-surface-border bg-surface-muted">
            <Pagination {...pagination} />
          </div>
        </div>
      ) : (
        /* ── Grid view ──────────────────────────────────────────── */
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pagination.paginatedItems.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
          <Pagination {...pagination} />
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────── */}
      <AddEmployeeModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
      />

      <EditEmployeeModal
        employee={selectedEmployee}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
      />

      <DeleteEmployeeModal
        employee={selectedEmployee}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
      />

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        onEdit={openEdit}
      />
    </div>
  );
}

/* ── View toggle button ─────────────────────────────────────────────── */
function ViewToggleBtn({ active, children, ...rest }) {
  return (
    <button
      className={`px-3 py-2 text-sm transition-colors focus-visible:outline-none
        ${active
          ? 'bg-primary-600 text-white'
          : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default AdminEmployees;
