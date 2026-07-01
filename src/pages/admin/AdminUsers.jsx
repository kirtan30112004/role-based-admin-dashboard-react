import { useState, useMemo, useCallback } from 'react';
import { UserPlus, Pencil, Trash2, SlidersHorizontal, Eye } from 'lucide-react';
import clsx from 'clsx';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import useModal             from '../../hooks/useModal';
import useDebounce          from '../../hooks/useDebounce';
import usePagination        from '../../hooks/usePagination';

import { RoleBadge }  from '../../components/common/Badge';
import Avatar         from '../../components/common/Avatar';
import PageHeader     from '../../components/common/PageHeader';
import Button         from '../../components/ui/Button';
import SearchBar      from '../../components/ui/SearchBar';
import Modal          from '../../components/ui/Modal';
import Input          from '../../components/ui/Input';
import Select         from '../../components/ui/Select';
import DataTable      from '../../components/ui/DataTable';
import ConfirmModal   from '../../components/ui/ConfirmModal';
import { toast }      from '../../components/ui/Toast';

import { EMPLOYEES_TABLE } from '../../constants/dashboardData';

const TABLE_COLS = [
  { label: 'User'       },
  { label: 'Role',        className: 'hidden md:table-cell' },
  { label: 'Department',  className: 'hidden lg:table-cell' },
  { label: 'Joined',      className: 'hidden xl:table-cell' },
  { label: 'Status'      },
  { label: '',            className: 'text-right'           },
];

/* ── User edit modal ─────────────────────────────────────────────────── */
function UserModal({ user, isOpen, onClose, onSave, isAdd = false }) {
  const [form, setForm]     = useState(user ?? {});
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      toast.error('Name and email are required.'); return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onSave(form);
    toast.success(isAdd ? `${form.name} created.` : `${form.name} updated.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAdd ? 'Add user account' : 'Edit user account'}
      description={isAdd ? 'Create a new login account.' : `Editing ${user?.name ?? ''}`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{isAdd ? 'Create' : 'Save'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Full name *"   value={form.name  ?? ''} onChange={set('name')}  />
        <Input label="Email *"       value={form.email ?? ''} onChange={set('email')} type="email" />
        <Input label="Department"    value={form.dept  ?? ''} onChange={set('dept')}  />
        <Select
          label="Role"
          value={form.role ?? 'employee'}
          onChange={set('role')}
          options={[
            { value: 'admin',    label: 'Administrator' },
            { value: 'hr',       label: 'HR Manager'    },
            { value: 'employee', label: 'Employee'      },
          ]}
        />
        <Select
          label="Status"
          value={form.status ?? 'Active'}
          onChange={set('status')}
          options={['Active', 'Inactive']}
        />
      </div>
    </Modal>
  );
}

function AdminUsers() {
  useDocumentTitle('User Accounts');

  const addModal    = useModal();
  const editModal   = useModal();
  const deleteModal = useModal();

  const [rawSearch, setRawSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers]           = useState(EMPLOYEES_TABLE);
  const [selected, setSelected]     = useState(null);

  const search   = useDebounce(rawSearch, 250);

  const filtered = useMemo(() =>
    users.filter((u) => {
      const matchQ = !search || [u.name, u.email, u.dept]
        .some((f) => f?.toLowerCase().includes(search.toLowerCase()));
      const matchR = roleFilter === 'all' || u.role === roleFilter;
      return matchQ && matchR;
    }),
    [users, search, roleFilter],
  );

  const pagination = usePagination(filtered, 8);

  const openEdit   = useCallback((u) => { setSelected(u); editModal.open();   }, [editModal]);
  const openDelete = useCallback((u) => { setSelected(u); deleteModal.open(); }, [deleteModal]);

  const handleDelete = useCallback(async () => {
    setUsers((prev) => prev.filter((u) => u.id !== selected?.id));
    toast.error(`${selected?.name} removed.`);
  }, [selected]);

  const handleSave = useCallback((updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
  }, []);

  const handleAdd = useCallback((newUser) => {
    setUsers((prev) => [{ ...newUser, id: `usr_${Date.now()}` }, ...prev]);
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Accounts"
        subtitle="Manage login accounts and role assignments."
        actions={
          <Button size="sm" leftIcon={<UserPlus size={14} />} onClick={addModal.open}>
            Add user
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={rawSearch}
          onChange={setRawSearch}
          placeholder="Search name, email, department…"
          className="flex-1"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {filtered.length} of {users.length} accounts
      </p>

      {/* Table via DataTable */}
      <DataTable
        columns={TABLE_COLS}
        data={pagination.paginatedItems}
        keyExtractor={(u) => u.id}
        emptyTitle="No users found"
        emptyMessage="Try clearing your filters."
        emptyAction={
          <Button variant="ghost" size="sm" onClick={() => { setRawSearch(''); setRoleFilter('all'); }}>
            Clear filters
          </Button>
        }
        pagination={pagination}
        renderRow={(u) => (
          <>
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar user={u} size="sm" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 truncate max-w-[150px]">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[150px]">{u.email}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-3.5 hidden md:table-cell"><RoleBadge role={u.role} /></td>
            <td className="px-5 py-3.5 text-sm text-slate-500 hidden lg:table-cell">{u.dept}</td>
            <td className="px-5 py-3.5 text-xs text-slate-400 hidden xl:table-cell tabular-nums">{u.joinDate}</td>
            <td className="px-5 py-3.5">
              <span className={clsx('badge', u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                {u.status}
              </span>
            </td>
            <td className="px-5 py-3.5">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" leftIcon={<Pencil size={13} />} onClick={() => openEdit(u)}>Edit</Button>
                <Button variant="ghost" size="sm" leftIcon={<Trash2 size={13} />} onClick={() => openDelete(u)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600">Remove</Button>
              </div>
            </td>
          </>
        )}
      />

      {/* Modals */}
      <UserModal
        user={{ id: `usr_${Date.now()}`, name: '', email: '', dept: '', role: 'employee', status: 'Active' }}
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onSave={handleAdd}
        isAdd
      />
      <UserModal
        user={selected}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        onSave={handleSave}
      />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        title="Remove user account"
        description={`${selected?.name ?? 'This user'}'s account will be permanently removed.`}
        confirmLabel="Remove"
      >
        {selected && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-surface-border">
            <Avatar user={selected} size="md" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{selected.name}</p>
              <p className="text-xs text-slate-500">{selected.email}</p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}

export default AdminUsers;
