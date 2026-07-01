import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function NotFoundPage() {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-8xl font-bold text-primary-200 mb-4 select-none">404</p>
        <div className="inline-flex h-16 w-16 rounded-full bg-slate-100 items-center justify-center mb-5">
          <FileQuestion size={32} className="text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate(-1)} className="btn-primary gap-2">
          <ArrowLeft size={16} />
          Go back
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
