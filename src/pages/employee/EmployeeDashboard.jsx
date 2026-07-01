import { useState, useMemo } from 'react';
import { CalendarDays, CheckCircle, Clock, Activity, Plus } from 'lucide-react';

import { useAuth }          from '../../context/AuthContext';
import { useEmployees }     from '../../context/EmployeeContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import useModal             from '../../hooks/useModal';

import StatCard    from '../../components/common/StatCard';
import ChartCard   from '../../components/common/ChartCard';
import PageHeader  from '../../components/common/PageHeader';
import SectionCard from '../../components/ui/SectionCard';
import Button      from '../../components/ui/Button';
import Modal       from '../../components/ui/Modal';
import Input       from '../../components/ui/Input';
import Select      from '../../components/ui/Select';
import Loader      from '../../components/ui/Loader';
import { toast }   from '../../components/ui/Toast';

import AttendanceChart from '../../components/charts/AttendanceChart';
import LeaveChart      from '../../components/charts/LeaveChart';

const UPCOMING = [
  { date: 'Jul 15',  event: 'Quarterly performance review',  type: 'review'   },
  { date: 'Jul 22',  event: 'Team offsite — downtown venue', type: 'event'    },
  { date: 'Aug 1',   event: 'Leave starts (pending)',        type: 'leave'    },
  { date: 'Aug 15',  event: 'Project milestone deadline',    type: 'deadline' },
];

const TYPE_COLORS = {
  review:   'bg-blue-100 text-blue-600',
  event:    'bg-emerald-100 text-emerald-600',
  leave:    'bg-amber-100 text-amber-600',
  deadline: 'bg-rose-100 text-rose-600',
};

/* ── Leave request modal ─────────────────────────────────────────────── */
function RequestLeaveModal({ isOpen, onClose }) {
  const [form, setForm]     = useState({ type: 'Annual', from: '', to: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.from || !form.to) { toast.error('Please select from and to dates.'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Leave request submitted for HR review.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request leave"
      description="Submit a leave request for HR review."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} loading={saving}>Submit request</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Leave type"
          value={form.type}
          onChange={set('type')}
          options={['Annual', 'Sick', 'Personal', 'Maternity / Paternity']}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="From" type="date" value={form.from} onChange={set('from')} />
          <Input label="To"   type="date" value={form.to}   onChange={set('to')}   />
        </div>
        <div>
          <label className="label">Reason (optional)</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Brief description…"
            value={form.reason}
            onChange={set('reason')}
          />
        </div>
      </div>
    </Modal>
  );
}

function EmployeeDashboard() {
  useDocumentTitle('My Dashboard');
  const { user }          = useAuth();
  const { employees, isLoading } = useEmployees();
  const leaveModal        = useModal();

  // Find own record for personalised data
  const myRecord = useMemo(
    () => employees.find((e) => e.email === user?.email) ?? null,
    [employees, user?.email],
  );

  const kpis = [
    { label: 'Leave Balance',    value: 14, unit: 'days', delta: 0, deltaLabel: 'annual', color: 'primary', icon: CalendarDays },
    { label: 'Leaves Used',      value: 6,  unit: 'days', delta: 0, deltaLabel: 'this year', color: 'emerald', icon: CheckCircle  },
    { label: 'Pending Requests', value: 1,  unit: '',     delta: 0, deltaLabel: 'awaiting', color: 'amber', icon: Clock        },
    { label: 'Attendance Rate',  value: '97.5', unit: '%', delta: +0.5, deltaLabel: 'this month', color: 'blue', icon: Activity   },
  ];

  if (isLoading) return <Loader overlay />;

  return (
    <div className="space-y-6">
      {/* ── Hero card ────────────────────────────────────────────────── */}
      <div className="card bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800
                      text-white border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-primary-300 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </p>
            <h2 className="text-2xl font-bold mt-1">
              Good day, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-primary-300 text-sm mt-1">
              {myRecord?.jobTitle ?? 'Employee'} · {myRecord?.department ?? user?.department}
            </p>
          </div>
          <Button
            variant="outline"
            leftIcon={<Plus size={15} />}
            onClick={leaveModal.open}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0"
          >
            Request leave
          </Button>
        </div>
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* ── Charts ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Team Attendance" subtitle="This week — present vs absent with rate">
          <AttendanceChart height={210} />
        </ChartCard>
        <ChartCard title="Leave History" subtitle="Team leave approvals over last 6 months">
          <LeaveChart height={210} />
        </ChartCard>
      </div>

      {/* ── Upcoming events ──────────────────────────────────────────── */}
      <SectionCard title="Upcoming Events" subtitle="Your schedule for the coming weeks">
        <ul className="space-y-2">
          {UPCOMING.map((ev, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-surface-border
                         hover:border-primary-200 transition-colors"
            >
              <div className={`h-9 w-16 rounded-lg flex items-center justify-center
                               text-[11px] font-bold flex-shrink-0 ${TYPE_COLORS[ev.type]}`}>
                {ev.date}
              </div>
              <p className="text-sm text-slate-700">{ev.event}</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <RequestLeaveModal isOpen={leaveModal.isOpen} onClose={leaveModal.close} />
    </div>
  );
}

export default EmployeeDashboard;
