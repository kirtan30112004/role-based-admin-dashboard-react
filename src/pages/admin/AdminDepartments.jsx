import { useState, useMemo, useCallback } from 'react';
import { Building2, Plus, RotateCcw, Download } from 'lucide-react';

import { useDocumentTitle }  from '../../hooks/useDocumentTitle';
import useModal              from '../../hooks/useModal';
import useDebounce           from '../../hooks/useDebounce';
import usePagination         from '../../hooks/usePagination';

import { useDepartments }    from '../../context/DepartmentContext';

import DepartmentCard        from '../../components/departments/DepartmentCard';
import AddDepartmentModal    from '../../components/departments/AddDepartmentModal';
import EditDepartmentModal   from '../../components/departments/EditDepartmentModal';
import ConfirmModal          from '../../components/ui/ConfirmModal';
import PageHeader            from '../../components/common/PageHeader';
import Avatar                from '../../components/common/Avatar';

import Button     from '../../components/ui/Button';
import SearchBar  from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Loader     from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { toast }  from '../../components/ui/Toast';

/* ── Totals bar ──────────────────────────────────────────────────────── */
function TotalsBar({ departments }) {
  const totalPeople = departments.reduce((s, d) => s + (d.headcount ?? 0), 0);
  const totalBudget = departments.reduce((s, d) => s + (Number(d.budget) || 0), 0);
  const budgetFmt   = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
  }).format(totalBudget);

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Departments',    value: departments.length },
        { label: 'Total Employees',value: totalPeople },
        { label: 'Total Budget',   value: totalBudget ? budgetFmt : '—' },
      ].map(({ label, value }) => (
        <div key={label} className="card py-4 text-center">
          <p className="text-xl font-bold text-slate-800 tabular-nums">{value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
function AdminDepartments() {
  useDocumentTitle('Departments');

  const { departments, isLoading, deleteDepartment, resetToSeed } = useDepartments();

  const [rawSearch, setRawSearch]     = useState('');
  const [selected, setSelected]       = useState(null);

  const addModal    = useModal();
  const editModal   = useModal();
  const deleteModal = useModal();

  const search   = useDebounce(rawSearch, 200);

  const filtered = useMemo(
    () => departments.filter(
      (d) =>
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.manager?.toLowerCase().includes(search.toLowerCase()) ||
        d.location?.toLowerCase().includes(search.toLowerCase()),
    ),
    [departments, search],
  );

  const pagination = usePagination(filtered, 8);

  const openEdit   = useCallback((d) => { setSelected(d); editModal.open();   }, [editModal]);
  const openDelete = useCallback((d) => { setSelected(d); deleteModal.open(); }, [deleteModal]);

  const handleDelete = useCallback(async () => {
    deleteDepartment(selected.id);
    toast.error(`"${selected.name}" was removed.`);
  }, [deleteDepartment, selected]);

  const handleExport = () => {
    const headers = ['Name','Description','Manager','Budget','Location','Headcount'];
    const rows    = filtered.map((d) => [
      d.name, d.description, d.manager, d.budget, d.location, d.headcount,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const a     = document.createElement('a');
    a.href      = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    a.download  = `departments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success(`Exported ${filtered.length} departments.`);
  };

  if (isLoading) return <Loader overlay label="Loading departments" />;

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────────────── */}
      <PageHeader
        title="Department Management"
        subtitle="Create, edit and track all company departments. Data persists in localStorage."
        actions={
          <>
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
              onClick={() => { resetToSeed(); toast.info('Departments reset to seed.'); }}
              className="text-slate-400 hover:text-slate-600"
            >
              Reset
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={addModal.open}
            >
              Add department
            </Button>
          </>
        }
      />

      {/* ── Summary bar ───────────────────────────────────────────── */}
      <TotalsBar departments={departments} />

      {/* ── Search ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <SearchBar
          value={rawSearch}
          onChange={setRawSearch}
          placeholder="Search departments, managers, locations…"
          className="flex-1 max-w-md"
          debounceMs={0}
        />
        <span className="text-xs text-slate-400 flex-shrink-0">
          {filtered.length} of {departments.length}
        </span>
      </div>

      {/* ── Grid / empty ──────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Building2}
            title="No departments found"
            message={rawSearch ? 'Try a different search term.' : 'Add your first department to get started.'}
            action={
              <Button leftIcon={<Plus size={14} />} onClick={addModal.open}>
                Add department
              </Button>
            }
          />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {pagination.paginatedItems.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
          <Pagination {...pagination} />
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────── */}
      <AddDepartmentModal isOpen={addModal.isOpen} onClose={addModal.close} />

      <EditDepartmentModal
        department={selected}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Delete department"
        description={`"${selected?.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete department"
      >
        {selected && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-surface-border">
            <div
              className="h-9 w-9 rounded-xl flex-shrink-0"
              style={{ backgroundColor: `${selected.color}30` }}
            >
              <div className="h-full w-full rounded-xl flex items-center justify-center">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selected.color }} />
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{selected.name}</p>
              <p className="text-xs text-slate-400">{selected.headcount} employees · {selected.manager}</p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

export default AdminDepartments;
