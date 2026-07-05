import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useAuth }          from '../../context/AuthContext';
import { ROLE_HOME }        from '../../constants/roles';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

/* ─── Demo credential quick-fills ────────────────────────────────────── */
const DEMO_USERS = [
  {
    label: 'Admin',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'Full access',
    pill: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    dot:  'bg-purple-400',
  },
  {
    label: 'HR',
    email: 'hr@company.com',
    password: 'Hr@12345',
    role: 'HR access',
    pill: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    dot:  'bg-blue-400',
  },
  {
    label: 'Employee',
    email: 'employee@company.com',
    password: 'Emp@1234',
    role: 'Self-service',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    dot:  'bg-emerald-400',
  },
];

function LoginPage() {
  useDocumentTitle('Sign In');

  const { login, isSubmitting, error, clearError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});

  // Redirect destination after login — honour ProtectedRoute's `from` state
  const from = location.state?.from?.pathname;

  // Clear server error when user edits either field
  useEffect(() => {
    if (error) clearError();
  }, [email, password]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Validation ────────────────────────────────────────────────── */
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setFieldErrs(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(email.trim(), password);
    if (result.success) {
      const destination = from ?? ROLE_HOME[result.user.role];
      navigate(destination, { replace: true });
    }
  };

  /* ── Quick-fill ─────────────────────────────────────────────────── */
  const fillDemo = (creds) => {
    setEmail(creds.email);
    setPassword(creds.password);
    setFieldErrs({});
    clearError();
  };

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br
                    from-slate-900 via-primary-900 to-slate-900
                    flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary-500 items-center
                          justify-center mb-4 shadow-xl ring-4 ring-primary-500/20">
            <span className="text-white text-2xl font-bold select-none">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome to AdminHub
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Role-Based Access Management
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

          {/* Demo role pills */}
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              Quick demo login
            </p>
            {/* Stacked on xs, row on sm+ */}
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.label}
                  type="button"
                  onClick={() => fillDemo(u)}
                  className={clsx(
                    'flex flex-col items-center justify-center gap-1 py-2 px-2',
                    'rounded-xl border text-center transition-all duration-150',
                    'focus-visible:outline-2 focus-visible:outline-primary-500',
                    u.pill,
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={clsx('h-2 w-2 rounded-full flex-shrink-0', u.dot)} />
                    <span className="text-xs font-bold leading-none">{u.label}</span>
                  </div>
                  <span className="text-[10px] opacity-70 leading-none hidden sm:block">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-surface-border mb-6" />

          {/* Server / credential error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 bg-red-50 border border-red-200
                         text-red-700 rounded-lg px-4 py-3 mb-5 text-sm"
            >
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">

              {/* Email */}
              <div>
                <label htmlFor="email" className="label">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={!!fieldErrs.email}
                    aria-describedby={fieldErrs.email ? 'email-err' : undefined}
                    className={clsx(
                      'input pl-9',
                      fieldErrs.email && 'border-red-400 focus:ring-red-400',
                    )}
                  />
                </div>
                {fieldErrs.email && (
                  <p id="email-err" role="alert" className="mt-1.5 text-xs text-red-600">
                    {fieldErrs.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={!!fieldErrs.password}
                    aria-describedby={fieldErrs.password ? 'pw-err' : undefined}
                    className={clsx(
                      'input pl-9 pr-10',
                      fieldErrs.password && 'border-red-400 focus:ring-red-400',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                               hover:text-slate-600 transition-colors p-0.5"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrs.password && (
                  <p id="pw-err" role="alert" className="mt-1.5 text-xs text-red-600">
                    {fieldErrs.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-11 text-sm mt-2"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} aria-hidden="true" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-500 mt-6">
           © {new Date().getFullYear()} AdminHub
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
