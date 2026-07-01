import { useState } from 'react';
import { Save, RotateCcw, Shield, Bell, Database, Globe } from 'lucide-react';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAuth }          from '../../context/AuthContext';
import { useEmployees }     from '../../context/EmployeeContext';
import { useDepartments }   from '../../context/DepartmentContext';
import { storage }          from '../../utils/storage';
import { toast }            from '../../components/ui/Toast';

import PageHeader  from '../../components/common/PageHeader';
import SectionCard from '../../components/ui/SectionCard';
import Button      from '../../components/ui/Button';
import Input       from '../../components/ui/Input';
import Select      from '../../components/ui/Select';

/* ── Settings section wrapper ─────────────────────────────────────────── */
function SettingsSection({ icon: Icon, title, children }) {
  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <Icon size={15} className="text-slate-400" />
          {title}
        </span>
      }
    >
      {children}
    </SectionCard>
  );
}

function AdminSettings() {
  useDocumentTitle('Settings');

  const { user, logout }                      = useAuth();
  const { resetToSeed: resetEmployees }       = useEmployees();
  const { resetToSeed: resetDepartments }     = useDepartments();

  const [org, setOrg] = useState({
    name:     'Acme Corp',
    email:    'support@acmecorp.com',
    timezone: 'UTC+0',
    session:  '8',
  });
  const [notifSettings, setNotifSettings] = useState({
    leaveApprovals: true,
    newUsers:       true,
    systemUpdates:  false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Settings saved.');
  };

  const handleResetAll = () => {
    resetEmployees();
    resetDepartments();
    toast.info('All demo data reset to seed values.');
  };

  const handleClearStorage = () => {
    storage.clear();
    toast.warning('LocalStorage cleared. Reload to re-seed.');
  };

  const setOrgField = (f) => (e) => setOrg((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader
        title="Settings"
        subtitle="Application configuration and data management"
      />

      {/* ── General ──────────────────────────────────────────────────── */}
      <SettingsSection icon={Globe} title="General">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Organisation name"
            value={org.name}
            onChange={setOrgField('name')}
          />
          <Input
            label="Support email"
            type="email"
            value={org.email}
            onChange={setOrgField('email')}
          />
          <Select
            label="Default timezone"
            value={org.timezone}
            onChange={setOrgField('timezone')}
            options={['UTC-8','UTC-5','UTC+0','UTC+1','UTC+5:30','UTC+8','UTC+9','UTC+10']}
          />
          <Select
            label="Session timeout"
            value={org.session}
            onChange={setOrgField('session')}
            options={[
              { value: '2',  label: '2 hours'  },
              { value: '4',  label: '4 hours'  },
              { value: '8',  label: '8 hours'  },
              { value: '24', label: '24 hours' },
            ]}
          />
        </div>
        <div className="mt-4">
          <Button leftIcon={<Save size={14} />} onClick={handleSave} loading={saving}>
            Save settings
          </Button>
        </div>
      </SettingsSection>

      {/* ── Session / security ────────────────────────────────────────── */}
      <SettingsSection icon={Shield} title="Security">
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2
                          p-3 bg-slate-50 rounded-lg border border-surface-border">
            <div>
              <p className="font-medium">Current user</p>
              <p className="text-xs text-slate-400">{user?.email} · {user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex-shrink-0 text-red-600 border-red-200 hover:bg-red-50">
              Sign out
            </Button>
          </div>
          <p className="text-xs text-slate-400">
            Sessions auto-expire after {org.session} hours of inactivity.
            A warning banner appears 15 minutes before expiry with a one-click renewal option.
          </p>
        </div>
      </SettingsSection>

      {/* ── Notifications ────────────────────────────────────────────── */}
      <SettingsSection icon={Bell} title="Notifications">
        <div className="space-y-3">
          {[
            { key: 'leaveApprovals', label: 'Leave approvals',  desc: 'Get notified when a leave request is approved or rejected.' },
            { key: 'newUsers',       label: 'New user accounts',desc: 'Get notified when a new account is created.' },
            { key: 'systemUpdates',  label: 'System updates',   desc: 'Get notified about scheduled maintenance and updates.' },
          ].map(({ key, label, desc }) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 p-3 rounded-lg
                         bg-slate-50 border border-surface-border cursor-pointer
                         hover:border-primary-200 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings[key]}
                onChange={(e) =>
                  setNotifSettings((p) => ({ ...p, [key]: e.target.checked }))
                }
                className="h-4 w-4 rounded text-primary-600 border-surface-border
                           focus:ring-2 focus:ring-primary-500 flex-shrink-0"
              />
            </label>
          ))}
        </div>
      </SettingsSection>

      {/* ── Data management ──────────────────────────────────────────── */}
      <SettingsSection icon={Database} title="Data Management">
        <p className="text-sm text-slate-500 mb-4">
          This is a localStorage-only demo. Use these controls to reset or wipe all persisted data.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            leftIcon={<RotateCcw size={14} />}
            onClick={handleResetAll}
          >
            Reset to seed data
          </Button>
          <Button
            variant="danger"
            onClick={handleClearStorage}
          >
            Clear all localStorage
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Clearing localStorage will wipe the session cookie — you will be logged out on next reload.
        </p>
      </SettingsSection>
    </div>
  );
}

export default AdminSettings;
