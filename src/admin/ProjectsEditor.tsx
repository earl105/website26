import { useState } from 'react';
import type { Project } from './types';
import { getProjects, saveProjects } from './api';
import { useResource } from './useResource';
import { Button, Field, TextInput, TextArea, Toggle, Banner } from './ui';

function nextId(items: { id: number }[]): number {
  return items.reduce((m, it) => Math.max(m, it.id), 0) + 1;
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const addTag = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10">
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="text-[color:var(--muted)] hover:text-red-300">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput value={draft} onChange={setDraft} placeholder="Add tag" />
        <Button onClick={addTag}>Add</Button>
      </div>
    </div>
  );
}

export default function ProjectsEditor({ onSessionExpired }: { onSessionExpired: () => void }) {
  const r = useResource<Project>({ load: getProjects, save: saveProjects, onSessionExpired });

  if (r.loading) return <div className="text-[color:var(--muted)]">Loading projects…</div>;

  const addProject = () =>
    r.add({
      id: nextId(r.items),
      title: '',
      description: '',
      tags: [],
      github_url: '',
      demo_url: '',
      screenshot_url: '',
      clickable: true,
      clickable_override: false,
      sort_order: r.items.length,
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Projects ({r.items.length})</h2>
        <div className="flex gap-2">
          <Button onClick={addProject}>+ Add project</Button>
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
        {r.items.map((p, i) => (
          <div key={p.id} className="glass-surface rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--muted-2)] font-mono">#{i + 1} · id {p.id}</span>
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => r.move(i, -1)} disabled={i === 0}>↑</Button>
                <Button variant="ghost" onClick={() => r.move(i, 1)} disabled={i === r.items.length - 1}>↓</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Delete "${p.title || 'untitled'}"?`)) r.remove(i);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            <Field label="Title">
              <TextInput value={p.title} onChange={(v) => r.update(i, { title: v })} />
            </Field>
            <Field label="Description">
              <TextArea value={p.description} onChange={(v) => r.update(i, { description: v })} />
            </Field>
            <Field label="Tags">
              <TagEditor tags={p.tags} onChange={(t) => r.update(i, { tags: t })} />
            </Field>
            <div className="grid md:grid-cols-3 gap-3">
              <Field label="GitHub URL">
                <TextInput value={p.github_url ?? ''} onChange={(v) => r.update(i, { github_url: v })} placeholder="https://…" />
              </Field>
              <Field label="Demo URL">
                <TextInput value={p.demo_url ?? ''} onChange={(v) => r.update(i, { demo_url: v })} placeholder="https://…" />
              </Field>
              <Field label="Screenshot URL">
                <TextInput value={p.screenshot_url ?? ''} onChange={(v) => r.update(i, { screenshot_url: v })} placeholder="/screenshots/… or https://…" />
              </Field>
            </div>
            <div className="flex flex-wrap gap-6 pt-1">
              <Toggle checked={p.clickable} onChange={(v) => r.update(i, { clickable: v })} label="Clickable" />
              <Toggle
                checked={p.clickable_override}
                onChange={(v) => r.update(i, { clickable_override: v })}
                label="Override (force-disable link)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
