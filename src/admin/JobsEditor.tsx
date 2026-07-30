import type { JobRecord, JobIconKey } from './types';
import { JOB_ICONS } from './types';
import { getJobs, saveJobs } from './api';
import { useResource } from './useResource';
import { Button, Field, TextInput, Banner } from './ui';

function nextId(items: { id: number }[]): number {
  return items.reduce((m, it) => Math.max(m, it.id), 0) + 1;
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  return (
    <div className="space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-2">
          <TextInput value={b} onChange={(v) => onChange(bullets.map((x, k) => (k === i ? v : x)))} />
          <Button variant="ghost" onClick={() => onChange(bullets.filter((_, k) => k !== i))}>×</Button>
        </div>
      ))}
      <Button onClick={() => onChange([...bullets, ''])}>+ Add bullet</Button>
    </div>
  );
}

export default function JobsEditor({ onSessionExpired }: { onSessionExpired: () => void }) {
  const r = useResource<JobRecord>({ load: getJobs, save: saveJobs, onSessionExpired });

  if (r.loading) return <div className="text-[color:var(--muted)]">Loading jobs…</div>;

  const addJob = () =>
    r.add({
      id: nextId(r.items),
      company: '',
      role: '',
      start_date: '',
      end_date: '',
      summary: '',
      icon: 'code',
      color: '#4b5563',
      file: 'new-job.md',
      bullets: [],
      logo_url: '',
      sort_order: r.items.length,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Jobs ({r.items.length})</h2>
        <div className="flex gap-2">
          <Button onClick={addJob}>+ Add job</Button>
          <Button variant="primary" onClick={r.persist} disabled={r.saving}>
            {r.saving ? 'Saving…' : 'Save all'}
          </Button>
        </div>
      </div>

      {r.error && (
        <Banner kind="error">
          {r.error}
          {r.details && r.details.length > 0 && (
            <ul className="mt-1 list-disc list-inside text-xs opacity-90">
              {r.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </Banner>
      )}
      {r.message && <Banner kind="success">{r.message}</Banner>}

      <div className="space-y-4">
        {r.items.map((j, i) => (
          <div key={j.id} className="glass-surface rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--muted-2)] font-mono">#{i + 1} · id {j.id}</span>
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => r.move(i, -1)} disabled={i === 0}>↑</Button>
                <Button variant="ghost" onClick={() => r.move(i, 1)} disabled={i === r.items.length - 1}>↓</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Delete "${j.company || 'untitled'}"?`)) r.remove(i);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Company">
                <TextInput value={j.company} onChange={(v) => r.update(i, { company: v })} />
              </Field>
              <Field label="Role">
                <TextInput value={j.role} onChange={(v) => r.update(i, { role: v })} />
              </Field>
              <Field label="Start date">
                <TextInput value={j.start_date} onChange={(v) => r.update(i, { start_date: v })} placeholder="June 2026" />
              </Field>
              <Field label="End date">
                <TextInput value={j.end_date} onChange={(v) => r.update(i, { end_date: v })} placeholder="August 2026" />
              </Field>
            </div>

            <Field label="Summary (one-line)">
              <TextInput value={j.summary} onChange={(v) => r.update(i, { summary: v })} />
            </Field>

            <div className="grid md:grid-cols-3 gap-3 items-end">
              <Field label="Icon">
                <select
                  value={j.icon}
                  onChange={(e) => r.update(i, { icon: e.target.value as JobIconKey })}
                  className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 text-sm text-[color:var(--fg)] focus:outline-none focus:border-[color:var(--accent)]"
                >
                  {JOB_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Accent color">
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(j.color) ? j.color : '#4b5563'}
                    onChange={(e) => r.update(i, { color: e.target.value })}
                    className="h-9 w-12 rounded border border-white/10 bg-transparent"
                  />
                  <TextInput value={j.color} onChange={(v) => r.update(i, { color: v })} placeholder="#rrggbb" />
                </div>
              </Field>
              <Field label="File name">
                <TextInput value={j.file} onChange={(v) => r.update(i, { file: v })} placeholder="company.md" />
              </Field>
            </div>

            <Field label="Logo URL">
              <TextInput value={j.logo_url ?? ''} onChange={(v) => r.update(i, { logo_url: v })} placeholder="/logos/company.png" />
            </Field>

            <Field label="Bullets">
              <BulletEditor bullets={j.bullets} onChange={(b) => r.update(i, { bullets: b })} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  );
}
