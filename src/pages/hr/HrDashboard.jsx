import { useState, useMemo } from 'react';
import { Users, UserCheck, Clock, TrendingDown } from 'lucide-react';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import useModal             from '../../hooks/useModal';
import { useEmployees }     from '../../context/EmployeeContext';

import StatCard    from '../../components/common/StatCard';
import ChartCard   from '../../components/common/ChartCard';
import PageHeader  from '../../components/common/PageHeader';
import Avatar      from '../../components/common/Avatar';

import Button      from '../../components/ui/Button';
import Modal       from '../../components/ui/Modal';
import Loader      from '../../components/ui/Loader';
import SectionCard from '../../components/ui/SectionCard';

import HeadcountChart      from '../../components/charts/HeadcountChart';
import LeaveChart          from '../../components/charts/LeaveChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import SalaryBandChart     from '../../components/charts/SalaryBandChart';

const PENDING_LEAVES = [
  { id: 'pl1', name: 'Rahul Verma',   type: 'Annual',   dates: 'Jul 10–14', days: 5 },
  { id: 'pl2', name: 'Neha Kapoor',   type: 'Sick',     dates: 'Jul 17',    days: 1 },
  { id: 'pl3', name: 'Ananya Iyer', type: 'Personal', dates: 'Jul 21–22', days: 2 },
];

/* ── Leave review modal ──────────────────────────────────────────────── */
function LeaveDetailModal({ leave, isOpen, onClose }) {
  const [loading, setLoading]  = useState(false);
  const [status, setStatus]    = useState(null);

  const act = async (action) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setStatus(action);
    setLoading(false);
    setTimeout(onClose, 900);
  };

  if (!leave) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review leave request"
      size="sm"
      footer={
        status ? (
          <span className={`text-sm font-bold ${status === 'approved' ? 'text-emerald-600' : 'text-red-500'}`}>
            {status === 'approved' ? '✓ Approved' : '✗ Rejected'}
          </span>
        ) : (
          <>
            <Button variant="ghost"  onClick={onClose}               disabled={loading}>Close</Button>
            <Button variant="danger" onClick={() => act('rejected')}  loading={loading}>Reject</Button>
            <Button                  onClick={() => act('approved')}  loading={loading}>Approve</Button>
          </>
        )
      }
    >
      <div className="space-y-2.5 text-sm">
        {[
          ['Employee',  leave.name],
          ['Type',      leave.type],
          ['Dates',     leave.dates],
          ['Duration',  `${leave.days} day${leave.days > 1 ? 's' : ''}`],
          ['Status',    'Pending approval'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-slate-400">{label}</span>
            <span className="font-medium text-slate-700">{value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function HrDashboard() {
  useDocumentTitle('HR Dashboard');
  const { stats: empStats, isLoading } = useEmployees();

  const leaveModal  = useModal();
  const [selected, setSelected] = useState(null);

  const kpis = useMemo(() => [
    { label: 'Total Headcount',  value: empStats.total,    unit: '',  delta: +4,   deltaLabel: 'this month',   color: 'primary', icon: Users        },
    { label: 'Active Employees', value: empStats.active,   unit: '',  delta: 0,    deltaLabel: 'right now',    color: 'emerald', icon: UserCheck    },
    { label: 'Pending Leaves',   value: PENDING_LEAVES.length, unit: '', delta: +2, deltaLabel: 'vs last week', color: 'amber', icon: Clock        },
    { label: 'Attrition Rate',   value: '2.1',             unit: '%', delta: -0.4, deltaLabel: 'vs last month',color: 'blue',    icon: TrendingDown },
  ], [empStats]);

  const openLeave = (leave) => { setSelected(leave); leaveModal.open(); };

  if (isLoading) return <Loader overlay />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Dashboard"
        subtitle="People operations overview"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Headcount Trend" subtitle="12-month growth with hires & exits">
          <HeadcountChart height={220} />
        </ChartCard>
        <ChartCard title="Leave Requests" subtitle="Approved · Pending · Rejected">
          <LeaveChart height={220} />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Attendance Rate Trend" subtitle="Monthly % — 90% target">
          <AttendanceTrendChart height={200} />
        </ChartCard>
        <ChartCard title="Salary Distribution" subtitle="Employees per pay band">
          <SalaryBandChart height={200} />
        </ChartCard>
      </div>

      {/* Pending leaves */}
      <SectionCard
        title="Pending Leave Requests"
        subtitle={`${PENDING_LEAVES.length} requests awaiting review`}
      >
        <div className="space-y-2">
          {PENDING_LEAVES.map((leave) => (
            <div
              key={leave.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50
                         border border-surface-border hover:border-primary-200 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{leave.name}</p>
                  <p className="text-xs text-slate-400">
                    {leave.type} · {leave.dates} · {leave.days}d
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openLeave(leave)}>
                Review
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <LeaveDetailModal
        leave={selected}
        isOpen={leaveModal.isOpen}
        onClose={leaveModal.close}
      />
    </div>
  );
}

export default HrDashboard;
