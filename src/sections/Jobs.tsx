import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import JobIcon, { type JobIconKey } from '../data/jobIcons';
import JobsSkeleton from '../components/JobsSkeleton';
import { devLoadDelay } from '../utils/devLoadDelay';

export type Job = {
  company: string;
  position: string;
  dates: string;
  color: string;
  summary: string;
  icon: JobIconKey;
  file: string;
  img: { src: string; alt: string };
  bullets: string[];
};

type JobRecord = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  summary: string;
  icon: JobIconKey;
  color?: string;
  file?: string;
  bullets: string[];
  logo_url: string;
  sort_order: number;
};

const accentColors: Record<string, string> = {
  'CoverMyMeds': '#e8106a',
  "Lowe's Home Improvement": '#283061',
  'GOJO Industries Inc.': '#027cb7',
  'Dicks Sporting Goods': '#006753',
};

const getAccentColor = (company: string) => accentColors[company] ?? '#4b5563';

// First word of the company, lowercased and stripped, as the "filename".
// Tech roles read as .tsx, everything else as .md for a bit of flavor.
const toFileName = (company: string, icon: JobIconKey) => {
  const slug = company.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext = icon === 'code' ? 'tsx' : 'md';
  return `${slug}.${ext}`;
};

const toJob = (record: JobRecord): Job => ({
  company: record.company,
  position: record.role,
  dates: `${record.start_date} - ${record.end_date}`,
  color: record.color ?? getAccentColor(record.company),
  summary: record.summary,
  icon: record.icon,
  file: record.file ?? toFileName(record.company, record.icon),
  img: { src: record.logo_url, alt: `${record.company} logo` },
  bullets: record.bullets,
});

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [records, setRecords] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/data/jobs.json');
        if (!response.ok) {
          throw new Error(`Failed to load jobs (${response.status})`);
        }

        await devLoadDelay();

        const data = (await response.json()) as JobRecord[];
        if (!cancelled) {
          setRecords([...data].sort((a, b) => a.sort_order - b.sort_order));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load jobs');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const jobs = useMemo(() => records.map(toJob), [records]);

  useEffect(() => {
    if (selectedIndex > jobs.length - 1) setSelectedIndex(0);
  }, [jobs.length, selectedIndex]);

  const sectionClass = 'flex flex-col items-center justify-center px-4 py-12 pt-16';
  const sectionStyle = { minHeight: 'calc(var(--vh, 1vh) * 100)' } as const;

  if (loading) {
    return (
      <section id="jobs" className={sectionClass} style={sectionStyle}>
        <div className="w-full max-w-5xl mx-auto">
          <JobsSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="jobs" className={sectionClass} style={sectionStyle}>
        <div className="max-w-5xl mx-auto w-full">
          <div
            className="glass-surface-soft rounded-lg p-8 text-center text-red-100"
            style={{ borderColor: 'rgba(248, 113, 113, 0.30)' }}
          >
            {error}
          </div>
        </div>
      </section>
    );
  }

  const active = jobs[selectedIndex];

  return (
    <section id="jobs" className={sectionClass} style={sectionStyle}>
      <div className="w-full max-w-5xl mx-auto">
        {/* Editor window */}
        <div
          className="glass-surface rounded-lg overflow-hidden flex flex-col h-[calc(var(--vh,1vh)*86)] md:h-[calc(var(--vh,1vh)*76)]"
          style={{ maxHeight: '620px' }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="text-xs text-[color:var(--muted-2)] font-mono truncate">
              experience / <span className="text-[color:var(--muted)]">{active?.file}</span>
            </div>
          </div>

          {/* Body: sidebar + detail pane */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* File explorer sidebar (vertical tree on desktop, tab strip on mobile) */}
            <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10 md:py-2">
              <div className="hidden md:block px-4 pb-1 text-[10px] tracking-widest uppercase text-[color:var(--muted-2)] font-semibold">
                Explorer
              </div>
              <div className="hidden md:flex px-3 py-1 items-center gap-1 text-sm text-[color:var(--muted)] font-mono">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 8l4 4 4-4" />
                </svg>
                experience
              </div>

              <ul className="flex md:block overflow-x-auto">
                {jobs.map((job, i) => {
                  const isActive = i === selectedIndex;
                  return (
                    <li key={job.company} className="shrink-0 md:shrink">
                      <button
                        onClick={() => setSelectedIndex(i)}
                        aria-current={isActive}
                        className={`relative w-full flex items-center gap-2 px-3 py-2.5 md:pl-7 md:pr-3 md:py-1.5 text-left text-sm font-mono whitespace-nowrap transition-colors ${
                          isActive ? 'text-[color:var(--fg)]' : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                        }`}
                        style={{ backgroundColor: isActive ? 'var(--card-muted)' : 'transparent' }}
                      >
                        {/* active indicator: underline on mobile, left stripe on desktop */}
                        <span
                          className="absolute inset-x-0 bottom-0 h-0.5 md:inset-x-auto md:inset-y-0 md:left-0 md:right-auto md:w-0.5 md:h-auto"
                          style={{ backgroundColor: isActive ? job.color : 'transparent' }}
                        />
                        <JobIcon name={job.icon} className="w-4 h-4 shrink-0" style={{ color: job.color }} />
                        <span className="truncate">{job.file}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Detail pane */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.company}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div
                        className="w-12 h-12 md:w-16 md:h-16 rounded-md flex items-center justify-center overflow-hidden shrink-0"
                        style={{ backgroundColor: active.color }}
                      >
                        <img src={active.img.src} alt={active.img.alt} className="w-11/12 h-11/12 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-xl font-semibold leading-tight break-words">{active.company}</h3>
                        <div className="text-sm text-[color:var(--fg)]">{active.position}</div>
                        <div className="text-xs text-[color:var(--muted)] font-mono mt-0.5">{active.dates}</div>
                      </div>
                    </div>

                    {/* One-line summary as a code comment */}
                    <p className="mt-3 md:mt-4 font-mono text-sm" style={{ color: '#6A9955' }}>
                      {'// '}{active.summary}
                    </p>

                    <ul className="mt-3 md:mt-4 space-y-2 md:space-y-2.5 text-sm text-[color:var(--fg)]">
                      {active.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="select-none shrink-0" style={{ color: active.color }}>▹</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
