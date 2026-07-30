import { useEffect, useState } from 'react';
import { ApiError } from './api';

// Shared state machine for a list editor: load, edit-in-memory, reorder,
// delete, add, and save (which reassigns sort_order by display position).
export function useResource<T extends { sort_order: number }>(opts: {
  load: () => Promise<{ data: T[] }>;
  save: (data: T[]) => Promise<{ commit: string }>;
  onSessionExpired: () => void;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string[] | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);

  const handleErr = (e: unknown) => {
    if (e instanceof ApiError && e.status === 401) {
      opts.onSessionExpired();
      return;
    }
    if (e instanceof ApiError) {
      setError(e.message);
      setDetails(e.details);
      return;
    }
    setError('Unexpected error');
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await opts.load();
        if (!cancelled) setItems([...r.data].sort((a, b) => a.sort_order - b.sort_order));
      } catch (e) {
        if (!cancelled) handleErr(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Load once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = async () => {
    setSaving(true);
    setError(null);
    setDetails(undefined);
    setMessage(null);
    const ordered = items.map((it, i) => ({ ...it, sort_order: i }));
    try {
      await opts.save(ordered);
      setItems(ordered);
      setMessage('Committed. Vercel will redeploy the live site in ~30–60s.');
    } catch (e) {
      handleErr(e);
    } finally {
      setSaving(false);
    }
  };

  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = prev.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const remove = (i: number) => setItems((prev) => prev.filter((_, k) => k !== i));
  const update = (i: number, patch: Partial<T>) =>
    setItems((prev) => prev.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const add = (item: T) => setItems((prev) => [...prev, item]);

  return { items, loading, saving, error, details, message, persist, move, remove, update, add };
}
