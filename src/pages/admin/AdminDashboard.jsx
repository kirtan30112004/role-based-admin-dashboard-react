import { useState, useMemo } from 'react';
import {
  Users, Building2, CalendarCheck, ClipboardList,
  UserPlus, RefreshCw, TrendingUp, TrendingDown,
} from 'lucide-react';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import useModal             from '../../hooks/useModal';
import { useEmployees }     from '../../context/EmployeeContext';
import { useDepartments }   from '../../context/DepartmentContext';

import StatCard    from '../../components/common/StatCard';
import ChartCard   from '../../components/common/ChartCard';
import PageHeader  from '../../components/common/PageHeader';
import Avatar      from '../../components/common/Avatar';
import { RoleBadge } from '../../components/common/Badge';

import Button     from '../../components/ui/Button';
import Modal      from '../../components/ui/Modal';
import Input      from '../../components/ui/Input';
import Select     from '../../components/ui/Select';
import SearchBar  from '../../components/ui/SearchBar';
import Loader     from '../../components/ui/Loader';
import SectionCard from '../../components/ui/SectionCard';

import HeadcountChart      from '../../components/charts/HeadcountChart';
import AttendanceChart     from '../../components/charts/AttendanceChart';
import DepartmentChart     from '../../components/charts/DepartmentChart';
import LeaveChart          from '../../components/charts/LeaveChart';
import AttendanceTrendChart from '../../components/charts/AttendanceTrendChart';
import SalaryBandChart     from '../../components/charts/SalaryBandChart';

import { ACTIVITY_FEED, LEAVE_TREND } from '../../constants/dashboardData';
import { toast } from '../../components/ui/Toast';

/* ─── Activity badge styles ──────────────────────────────────────────── */
const ACTIVITY_COLORS = {
  leave_approved:  'bg-emerald-100 text-emerald-700',
  leave_requested: 'bg-amber-100  text-amber-700',
  user_created:    'bg-blue-100   text-blue-700',
  role_changed:    'bg-purple-100 text-purple-700',
  login:           'bg-slate-100  text-slate-500',
};
const ACTIVITY_LABELS = {
  leave_approved:  'Leave',
  leave_requested: 'Request',
  user_created:    'New User',
  role_changed:    'Role',
  login:           'Login',
};

/* ─── Add-user mini modal ────────────────────────────────────────────── */
function AddUserModal({ isOpen, onClose }) {
  const [form, setForm]     = useState({ name: '', email: '', role: 'employee', department: '' });
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success(`${form.name} added as ${form.role}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new user"
      description="Fill in the details below to create an account."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSubmit} loading={saving}>Add user</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Full name *"  placeholder="Alex Johnson"        value={form.name}       onChange={set('name')}       />
        <Input label="Email *"      placeholder="alex@company.com"    value={form.email}      onChange={set('email')}      type="email" />
        <Input label="Department"   placeholder="Engineering"         value={form.department} onChange={set('department')} />
        <Select
          label="Role"
          value={form.role}
          onChange={set('role')}
          options={[
            { value: 'admin',    label: 'Administrator' },
            { value: 'hr',       label: 'HR Manager'    },
            { value: 'employee', label: 'Employee'      },
          ]}
        />
      </div>
    </Modal>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
function AdminDashboard() {
  useDocumentTitle('Admin Dashboard');

  /* ── Live context data ───────────────────────────────────────────── */
  const { employees, stats: empStats, isLoading: empLoading } = useEmployees();
  const { departments, isLoading: deptLoading }               = useDepartments();

  const addModal    = useModal();
  const [search, setSearch]       = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /* ── Build live KPIs from context ───────────────────────────────── */
  const kpis = useMemo(() => [
    {
      id:         'employees',
      label:      'Total Employees',
      value:      empStats.total,
      unit:       '',
      delta:      empStats.active - empStats.inactive,
      deltaLabel: `${empStats.active} active`,
      color:      'primary',
      icon:       Users,
    },
    {
      id:         'departments',
      label:      'Departments',
      value:      departments.length,
      unit:       '',
      delta:      0,
      deltaLabel: 'all teams',
      color:      'blue',
      icon:       Building2,
    },
    {
      id:         'attendance',
      label:      'Avg Attendance',
      value:      '94.2',
      unit:       '%',
      delta:      +1.3,
      deltaLabel: 'vs last week',
      color:      'emerald',
      icon:       CalendarCheck,
    },
    {
      id:         'leaves',
      label:      'Leave Requests',
      value:      7,
      unit:       '',
      delta:      -3,
      deltaLabel: 'vs last week',
      color:      'amber',
      icon:       ClipboardList,
    },
  ], [empStats, departments]);

  /* ── Live department chart data from context ────────────────────── */
  const deptChartData = useMemo(
    () =>
      departments
        .filter((d) => d.headcount > 0)
        .map((d) => ({
          name:   d.name,
          count:  d.headcount,
          color:  d.color,
          budget: d.budget,
        })),
    [departments],
  );

  /* ── Filtered activity feed ─────────────────────────────────────── */
  const filteredActivity = useMemo(
    () =>
      ACTIVITY_FEED.filter(
        (a) =>
          !search ||
          a.actor.toLowerCase().includes(search.toLowerCase()) ||
          a.detail.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

  if (empLoading || deptLoading) return <Loader overlay label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              leftIcon={<UserPlus size={14} />}
              onClick={addModal.open}
            >
              Add user
            </Button>
          </>
        }
      />

      {/* ── KPI row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            delta={kpi.delta}
            deltaLabel={kpi.deltaLabel}
            color={kpi.color}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* ── Charts row 1: Headcount (wide) + Department donut ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard
          title="Headcount Trend"
          subtitle="12-month growth with hires & exits"
          className="lg:col-span-3"
        >
          <HeadcountChart height={230} />
        </ChartCard>
        <ChartCard
          title="By Department"
          subtitle="Live headcount distribution"
          className="lg:col-span-2"
        >
          <DepartmentChart data={deptChartData} height={230} />
        </ChartCard>
      </div>

      {/* ── Charts row 2: Weekly attendance + Leave trend ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Weekly Attendance" subtitle="Present vs absent with daily rate labels">
          <AttendanceChart height={220} />
        </ChartCard>
        <ChartCard title="Leave Requests" subtitle="Monthly approved / pending / rejected">
          <LeaveChart height={220} />
        </ChartCard>
      </div>

      {/* ── Charts row 3: Attendance % trend + Salary bands ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Attendance Rate Trend" subtitle="Monthly % — target line at 90%">
          <AttendanceTrendChart height={200} />
        </ChartCard>
        <ChartCard title="Salary Distribution" subtitle="Employee count per pay band">
          <SalaryBandChart height={200} />
        </ChartCard>
      </div>

      {/* ── Bottom row: Activity + Live dept table ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity feed */}
        <SectionCard
          title="Recent Activity"
          subtitle="Live event feed"
          className="lg:col-span-3"
          action={
            <div className="flex items-center gap-2">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Filter…"
                size="sm"
                className="w-40"
                debounceMs={200}
              />
            </div>
          }
        >
          {refreshing ? (
            <Loader centred size="md" />
          ) : (
            <ul className="divide-y divide-surface-border -mx-6 px-6">
              {filteredActivity.length === 0 ? (
                <li className="py-8 text-center text-sm text-slate-400">No matching activity.</li>
              ) : filteredActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-3 group">
                  <Avatar
                    user={{ name: item.actor, role: item.avatar_role }}
                    size="sm"
                    className="mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">{item.actor}</span>
                      <span className={`badge text-[10px] ${ACTIVITY_COLORS[item.type]}`}>
                        {ACTIVITY_LABELS[item.type]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0 pt-0.5">{item.time}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Live department table */}
        <SectionCard
          title="Departments"
          subtitle="Live headcount & budget"
          className="lg:col-span-2"
        >
          <ul className="space-y-3 -mt-1">
            {departments.slice(0, 8).map((dept) => {
              const total = departments.reduce((s, d) => s + (d.headcount || 0), 0) || 1;
              const pct   = Math.round(((dept.headcount || 0) / total) * 100);
              return (
                <li key={dept.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dept.color ?? '#6366f1' }}
                      />
                      <span className="font-medium text-slate-700 truncate max-w-[110px]">{dept.name}</span>
                    </div>
                    <span className="text-slate-400 tabular-nums flex-shrink-0">
                      {dept.headcount ?? 0}
                      <span className="text-slate-300 ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: dept.color ?? '#6366f1' }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pt-3 mt-3 border-t border-surface-border grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800 tabular-nums">{empStats.total}</p>
              <p className="text-xs text-slate-400">Total staff</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800">{departments.length}</p>
              <p className="text-xs text-slate-400">Departments</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <AddUserModal isOpen={addModal.isOpen} onClose={addModal.close} />
    </div>
  );
}

export default AdminDashboard;
