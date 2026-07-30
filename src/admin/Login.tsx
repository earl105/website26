import { useState } from 'react';
import { login, ApiError } from './api';
import { Button, Field, TextInput, Banner } from './ui';

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setError('Invalid password.');
      }
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg)] px-4">
      <form onSubmit={submit} className="glass-surface rounded-lg p-6 w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-[color:var(--fg)]">Admin</h1>
          <p className="text-xs text-[color:var(--muted)]">Restricted — authorized access only.</p>
        </div>
        {error && <Banner kind="error">{error}</Banner>}
        <Field label="Password">
          <TextInput type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        </Field>
        <Button type="submit" variant="primary" disabled={busy || password.length === 0}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
