import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-obsidian">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-white/20">404</h1>
          <div className="h-px w-16 bg-white/10 mx-auto" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-white">Page Not Found</h2>
          <p className="text-white/40 leading-relaxed">
            The page <span className="text-white/60">"{pageName}"</span> does not exist.
          </p>
        </div>
        <div className="pt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-black bg-white hover:bg-white/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
