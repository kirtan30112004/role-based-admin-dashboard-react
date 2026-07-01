import { useState } from 'react';
import { Plus } from 'lucide-react';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import useModal             from '../../hooks/useModal';
import usePagination        from '../../hooks/usePagination';

import PageHeader  from '../../components/common/PageHeader';
import SectionCard from '../../components/ui/SectionCard';
import DataTable   from '../../components/ui/DataTable';
import Button      from '../../components/ui/Button';
import Input       from '../../components/ui/Input';
import Select      from '../../components/ui/Select';
import Modal       from '../../components/ui/Modal';
import { toast }   from '../../components/ui/Toast';

const INITIAL = [
  { id: 'l1', type: 'Annual',   from: '2026-07-10', to: '2026-07-14', days: 5, reason: 'Family vacation', status: 'Pending'  },
  { id: 'l2', type: 'Sick',     from: '2026-05-03', to: '2026-05-03', days: 1, reason: 'Unwell',          status: 'Approved' },
  { id: 'l3', type: 'Personal', from: '2026-03-15', to: '2026-03-15', days: 1, reason: 'Appointment',     status: 'Approved' },
];

const STATUS_STYLE = {
  Pending:  'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-600',
};

const COLS = [
  { label: 'Type'    },
  { label: 'From',    className: 'hidden sm:table-cell' },
  { label: 'To',      className: 'hidden sm:table-cell' },
  { label: 'Days',    className: 'hidden md:table-cell' },
  { label: 'Reason',  className: 'hidden lg:table-cell' },
  { label: 'Status'  },
];

/* ── New request modal ───────────────────────────────────────────────── */
function NewLeaveModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm]     = useState({ type: 'Annual', from: '', to: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.from || !form.to) { toast.error('Select from and to dates.'); return; }
    if (new Date(form.to) < new Date(form.from)) { toast.error('End date must be after start date.'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    const days = Math.max(1, Math.round((new Date(form.to) - new Date(form.from)) / 86400000) + 1);
    onSubmit({ ...form, days, status: 'Pending', id: `l${Date.now()}` });
    toast.success('Leave request submitted.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request leave"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} loading={saving}>Submit</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Leave type"
          value={form.type}
          onChange={set('type')}
          options={['Annual','Sick','Personal','Maternity / Paternity']}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="From" type="date" value={form.from} onChange={set('from')} />
          <Input label="To"   type="date" value={form.to}   onChange={set('to')}   />
        </div>
        <div>
          <label className="label">Reason (optional)</label>
          <textarea
            rows={2}
            className="input resize-none"
            placeholder="Brief description…"
            value={form.reason}
            onChange={set('reason')}
          />
        </div>
      </div>
    </Modal>
  );
}

function EmployeeLeaves() {
  useDocumentTitle('My Leaves');
  const modal            = useModal();
  const [leaves, setLeaves] = useState(INITIAL);
  const pagination       = usePagination(leaves, 8);

  const balance = 14 - leaves.filter((l) => l.status === 'Approved').reduce((s, l) => s + l.days, 0);

  const handleSubmit = (newLeave) => setLeaves((prev) => [newLeave, ...prev]);

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader
        title="My Leaves"
        subtitle={`${balance} day${balance !== 1 ? 's' : ''} remaining from annual allowance`}
        actions={
          <Button size="sm" leftIcon={<Plus size={14} />} onClick={modal.open}>
            Request leave
          </Button>
        }
      />

      {/* Balance pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Balance',  value: balance, color: 'text-primary-600 bg-primary-50' },
          { label: 'Used',     value: leaves.filter((l) => l.status === 'Approved').reduce((s,l)=>s+l.days,0), color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pending',  value: leaves.filter((l) => l.status === 'Pending').length, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={`text-xl font-bold tabular-nums ${color.split(' ')[0]}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <DataTable
        columns={COLS}
        data={pagination.paginatedItems}
        keyExtractor={(l) => l.id}
        emptyTitle="No leave requests yet"
        emptyMessage="Submit your first request using the button above."
        pagination={pagination}
        renderRow={(l) => (
          <>
            <td className="px-5 py-3.5 font-medium text-slate-700">{l.type}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs tabular-nums hidden sm:table-cell">{l.from}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs tabular-nums hidden sm:table-cell">{l.to}</td>
            <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{l.days}d</td>
            <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell truncate max-w-[140px]">{l.reason}</td>
            <td className="px-5 py-3.5">
              <span className={`badge ${STATUS_STYLE[l.status]}`}>{l.status}</span>
            </td>
          </>
        )}
      />

      <NewLeaveModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EmployeeLeaves;
