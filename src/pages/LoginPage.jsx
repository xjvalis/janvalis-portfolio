import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ověření, jestli má uživatel token
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Přesměrování na admin panel
      const from = location.state?.from?.pathname || '/admin';
      navigate(from);
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setPassword('');
        navigate('/admin');
      } else {
        setError(data.error || 'Přihlášení se nezdařilo');
      }
    } catch (err) {
      setError('Chyba připojení k serveru');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-lunar flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="mb-10">
          <p className="text-white text-2xl font-semibold mb-2">Jan Vališ</p>
          <p className="font-interface text-sm text-lunar/30 tracking-widest">ADMIN PŘÍSTUP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-interface text-xs text-lunar/40 tracking-widest mb-3">
              HESLO
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-lunar/5 border border-lunar/20 rounded text-lunar font-interface text-sm focus:outline-none focus:border-lunar/40 transition-colors disabled:opacity-50"
              placeholder="Zadejte heslo"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-400 font-interface text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-lunar/10 border border-lunar/30 rounded text-lunar font-interface text-xs tracking-widest hover:bg-lunar/20 transition-colors disabled:opacity-50"
          >
            {loading ? 'NAČÍTÁNÍ...' : 'PŘIHLÁSIT SE'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-lunar/10">
          <button
            onClick={() => navigate('/')}
            className="text-lunar/30 hover:text-lunar font-interface text-xs tracking-widest transition-colors"
          >
            ← ZPĚT NA STRÁNKU
          </button>
        </div>
      </div>
    </div>
  );
}
