import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_HOME } from '../../constants/roles';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function UnauthorizedPage() {
  useDocumentTitle('Access Denied');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user) navigate(ROLE_HOME[user.role], { replace: true });
    else navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="inline-flex h-20 w-20 rounded-full bg-red-100 items-center justify-center mb-6">
          <ShieldOff size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-8">
          You don't have permission to view this page. Contact your administrator if you
          believe this is a mistake.
        </p>
        <button onClick={handleBack} className="btn-primary gap-2">
          <ArrowLeft size={16} />
          Go back to safety
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
