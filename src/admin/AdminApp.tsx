import { useEffect, useState } from 'react';
import { getSession, logout } from './api';
import Login from './Login';
import Dashboard from './Dashboard';

type Status = 'loading' | 'auth' | 'anon';

export default function AdminApp() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    getSession().then((authed) => {
      if (!cancelled) setStatus(authed ? 'auth' : 'anon');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore — clear locally regardless */
    }
    setStatus('anon');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg)] text-[color:var(--muted)]">
        Checking session…
      </div>
    );
  }
  if (status === 'anon') return <Login onSuccess={() => setStatus('auth')} />;
  return <Dashboard onLogout={handleLogout} onSessionExpired={() => setStatus('anon')} />;
}
