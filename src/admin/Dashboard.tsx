import { useState } from 'react';
import { Button } from './ui';
import ProjectsEditor from './ProjectsEditor';
import JobsEditor from './JobsEditor';

type Tab = 'projects' | 'jobs';

export default function Dashboard({
  onLogout,
  onSessionExpired,
}: {
  onLogout: () => void;
  onSessionExpired: () => void;
}) {
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <header className="border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 bg-[color:var(--bg)]/90 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Admin</span>
          <nav className="flex gap-1">
            {(['projects', 'jobs'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                  tab === t ? 'bg-white/10 text-[color:var(--fg)]' : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--fg)]">
            View site ↗
          </a>
          <Button variant="ghost" onClick={onLogout}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {tab === 'projects' ? (
          <ProjectsEditor onSessionExpired={onSessionExpired} />
        ) : (
          <JobsEditor onSessionExpired={onSessionExpired} />
        )}
      </main>
    </div>
  );
}
