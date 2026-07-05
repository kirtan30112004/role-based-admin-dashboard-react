import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, IndianRupee, MapPin, AlertCircle, Save } from 'lucide-react';

import { useAuth }          from '../../context/AuthContext';
import { useEmployees }     from '../../context/EmployeeContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { toast }            from '../../components/ui/Toast';

import Avatar       from '../../components/common/Avatar';
import { RoleBadge } from '../../components/common/Badge';
import Button        from '../../components/ui/Button';
import Input         from '../../components/ui/Input';

/* ── Detail row helper ───────────────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-slate-400" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700 break-all">{value}</p>
      </div>
    </div>
  );
}

function EmployeeProfile() {
  useDocumentTitle('My Profile');
  const { user }              = useAuth();
  const { employees, updateEmployee } = useEmployees();

  // Find the logged-in user's full record from EmployeeContext
  const record = employees.find((e) => e.email === user?.email) ?? null;

  const salary = record?.salary
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
      }).format(record.salary)
    : '—';

  // Password change form (UI only — no real auth)
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving]   = useState(false);

  const setPw = (f) => (e) => setPwForm((p) => ({ ...p, [f]: e.target.value }));

  const handlePasswordChange = async () => {
    if (!pwForm.current) { toast.error('Enter your current password.'); return; }
    if (pwForm.next.length < 6) { toast.error('New password must be ≥ 6 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error('Passwords do not match.'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setPwForm({ current: '', next: '', confirm: '' });
    toast.success('Password updated.');
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* ── Identity card ──────────────────────────────────────── */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Avatar user={user} size="xl" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {record?.jobTitle ?? 'Employee'} · {record?.department ?? user?.department}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <RoleBadge role={user?.role} />
            {record?.employmentType && (
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {record.employmentType}
              </span>
            )}
            {record?.status && (
              <span className={`badge ${record.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {record.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Personal information ────────────────────────────────── */}
      <div className="card">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow icon={Mail}       label="Email"       value={user?.email}         />
          <DetailRow icon={Phone}      label="Phone"       value={record?.phone}       />
          <DetailRow icon={Building2}  label="Department"  value={record?.department}  />
          <DetailRow icon={Calendar}   label="Joined"      value={record?.joinDate}    />
          <DetailRow icon={IndianRupee} label="Salary"      value={salary}              />
          {record?.address && (
            <DetailRow icon={MapPin}   label="Address"     value={record.address}      />
          )}
        </div>

        {record?.emergencyContact && (
          <div className="mt-5 flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <AlertCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">Emergency Contact</p>
              <p className="text-sm text-amber-800">{record.emergencyContact}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Change password ─────────────────────────────────────── */}
      <div className="card">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
          Change Password
        </h3>
        <div className="space-y-4 max-w-sm">
          <Input
            label="Current password"
            type="password"
            placeholder="••••••••"
            value={pwForm.current}
            onChange={setPw('current')}
          />
          <Input
            label="New password"
            type="password"
            placeholder="Min. 6 characters"
            value={pwForm.next}
            onChange={setPw('next')}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="••••••••"
            value={pwForm.confirm}
            onChange={setPw('confirm')}
          />
          <Button
            leftIcon={<Save size={14} />}
            onClick={handlePasswordChange}
            loading={saving}
          >
            Update password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
