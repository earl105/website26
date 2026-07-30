// Small shared form primitives for the admin GUI. Dark, glass-consistent.
import type { ReactNode } from 'react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
}) {
  const base =
    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    default: 'border border-white/10 hover:bg-white/5 text-[color:var(--fg)]',
    primary: 'bg-[color:var(--accent-600)] hover:bg-[color:var(--accent)] text-white',
    danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10',
    ghost: 'text-[color:var(--muted)] hover:text-[color:var(--fg)]',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-[color:var(--muted-2)] mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 text-sm text-[color:var(--fg)] focus:outline-none focus:border-[color:var(--accent)]';

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className={inputClass} />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[color:var(--fg)] cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[color:var(--accent)]" />
      {label}
    </label>
  );
}

export function Banner({ kind, children }: { kind: 'error' | 'success' | 'info'; children: ReactNode }) {
  const styles: Record<string, string> = {
    error: 'border-red-500/40 text-red-200 bg-red-500/10',
    success: 'border-emerald-500/40 text-emerald-200 bg-emerald-500/10',
    info: 'border-white/10 text-[color:var(--muted)] bg-white/5',
  };
  return <div className={`rounded-md border px-3 py-2 text-sm ${styles[kind]}`}>{children}</div>;
}
