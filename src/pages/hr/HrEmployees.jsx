import { useState, useMemo, useCallback } from 'react';
import { UserPlus } from 'lucide-react';

import { useDocumentTitle }  from '../../hooks/useDocumentTitle';
import useModal              from '../../hooks/useModal';
import useDebounce           from '../../hooks/useDebounce';
import usePagination         from '../../hooks/usePagination';
import { useEmployees }      from '../../context/EmployeeContext';

import EmployeeStatsBar    from '../../components/employees/EmployeeStatsBar';
import EmployeeFilters     from '../../components/employees/EmployeeFilters';
import EmployeeCard        from '../../components/employees/EmployeeCard';
import EmployeeDetailModal from '../../components/employees/EmployeeDetailModal';
import EditEmployeeModal   from '../../components/employees/EditEmployeeModal';

import Button     from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Loader     from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';

const INITIAL_FILTERS = { search: '', department: '', status: '', employmentType: '' };

/**
 * HrEmployees — read-only employee directory for HR role.
 * HR can view and edit employee records but cannot delete.
 */
function HrEmployees() {
  useDocumentTitle('Employees');

  const { employees, isLoading, stats } = useEmployees();

  const [filters, setFilters]   = useState(INITIAL_FILTERS);
  const [selected, setSelected] = useState(null);

  const detailModal = useModal();
  const editModal   = useModal();

  const debouncedSearch = useDebounce(filters.search, 250);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return employees.filter((emp) => {
      const matchSearch = !q || [emp.name, emp.email, emp.jobTitle, emp.department]
        .some((f) => f?.toLowerCase().includes(q));
      const matchDept   = !filters.department     || emp.department     === filters.department;
      const matchStatus = !filters.status         || emp.status         === filters.status;
      const matchType   = !filters.employmentType || emp.employmentType === filters.employmentType;
      return matchSearch && matchDept && matchStatus && matchType;
    });
  }, [employees, debouncedSearch, filters]);

  const pagination = usePagination(filtered, 9);

  const openDetail = useCallback((emp) => { setSelected(emp); detailModal.open(); }, [detailModal]);
  const openEdit   = useCallback((emp) => { setSelected(emp); editModal.open();   }, [editModal]);

  const handleFilterChange = useCallback((key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }, []);

  if (isLoading) return <Loader overlay />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Employee Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Browse and edit employee records.</p>
        </div>
      </div>

      {/* Stats */}
      <EmployeeStatsBar stats={stats} />

      {/* Filters */}
      <EmployeeFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(INITIAL_FILTERS)}
        resultCount={filtered.length}
        totalCount={employees.length}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No employees found"
            message="Try adjusting your filters."
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pagination.paginatedItems.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onView={openDetail}
                onEdit={openEdit}
                onDelete={null}   /* HR cannot delete */
              />
            ))}
          </div>
          <Pagination {...pagination} />
        </div>
      )}

      {/* Modals */}
      <EmployeeDetailModal
        employee={selected}
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        onEdit={openEdit}
      />
      <EditEmployeeModal
        employee={selected}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
      />
    </div>
  );
}

export default HrEmployees;
