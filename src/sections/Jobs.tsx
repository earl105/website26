import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import JobCard from '../components/JobCard';
import FullscreenJob from '../components/FullscreenJob';

export type Job = {
  company: string;
  position: string;
  dates: string;
  color: string;
  img: { src: string; alt: string };
  bullets: string[];
};

type JobRecord = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
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

const toJob = (record: JobRecord): Job => ({
  company: record.company,
  position: record.role,
  dates: `${record.start_date} - ${record.end_date}`,
  color: getAccentColor(record.company),
  img: { src: record.logo_url, alt: `${record.company} logo` },
  bullets: record.bullets,
});

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [records, setRecords] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const visible = isDesktop ? 3 : 2;
  const navbarHeightRef = useRef<number>(64); // adjust if your navbar height differs

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
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(('matches' in e ? e.matches : mq.matches));
    setIsDesktop(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler as EventListener);
    else mq.addListener(handler as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler as EventListener);
      else mq.removeListener(handler as any);
    };
  }, []);

  useEffect(() => {
    if (startIndex > Math.max(0, jobs.length - visible)) {
      setStartIndex(Math.max(0, jobs.length - visible));
    }
  }, [jobs.length, startIndex, visible]);

  if (loading) {
    return (
      <section id="jobs" className="flex flex-col px-6 py-12 pt-16" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="max-w-5xl mx-auto w-full">
          <div className="glass-surface-soft rounded-lg p-8 text-center text-[color:var(--muted)]">
            Loading jobs...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="jobs" className="flex flex-col px-6 py-12 pt-16" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
        <div className="max-w-5xl mx-auto w-full">
          <div className="glass-surface-soft rounded-lg p-8 text-center text-red-100" style={{ borderColor: 'rgba(248, 113, 113, 0.30)' }}>
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="jobs" className="flex flex-col px-6 py-12 pt-16" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      <div className="max-w-5xl mx-auto w-full">
        {/* <h2 className="text-3xl md:text-4xl font-semibold mb-8">Jobs</h2> */}

        <div>
          {isDesktop ? (
            <div className="relative flex items-start md:items-center">
              <div className="flex-1 md:pr-12 pr-0">
                <div className="space-y-4">
                  {jobs.slice(startIndex, startIndex + visible).map((job, i) => {
                    const idx = startIndex + i; // absolute index
                    return (
                      <JobCard
                        key={job.company + idx}
                        job={job}
                        isSelected={selectedIndex === idx}
                        isAnySelected={selectedIndex !== null}
                        onOpen={() => setSelectedIndex(idx)}
                        prefersReducedMotion={prefersReducedMotion ?? false}
                        isDesktop={isDesktop}
                        noLayout
                      />
                    );
                  })}

                  <AnimatePresence>
                    {selectedIndex !== null && (
                      <FullscreenJob
                        key={`fullscreen-${selectedIndex}`}
                        job={jobs[selectedIndex]}
                        index={selectedIndex}
                        length={jobs.length}
                        onClose={() => setSelectedIndex(null)}
                        navbarHeight={navbarHeightRef.current}
                        prefersReducedMotion={prefersReducedMotion ?? false}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Carousel controls (desktop) */}
              <div className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
                {
                  (() => {
                    const canUp = startIndex > 0;
                    const canDown = startIndex + visible < jobs.length;
                    return (
                      <>
                        <button
                          onClick={() => { if (canUp) setStartIndex(s => Math.max(0, s - 1)); }}
                          disabled={!canUp}
                          aria-label="Scroll up"
                          className={`w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${canUp ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M6 12l4-4 4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        <button
                          onClick={() => { if (canDown) setStartIndex(s => Math.min(jobs.length - visible, s + 1)); }}
                          disabled={!canDown}
                          aria-label="Scroll down"
                          className={`w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${canDown ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M6 12l4-4 4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </>
                    );
                  })()
                }
              </div>
            </div>
          ) : (
            /* Mobile: show up button, 2 cards, then down button */
            <div className="flex flex-col items-center">
              <div className="mb-3">
                <button
                  onClick={() => { if (startIndex > 0) setStartIndex(s => Math.max(0, s - visible)); }}
                  disabled={startIndex <= 0}
                  aria-label="Scroll up"
                  className={`w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${startIndex > 0 ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M6 12l4-4 4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="w-full">
                <div className="space-y-4">
                  {jobs.slice(startIndex, startIndex + visible).map((job, i) => {
                    const idx = startIndex + i;
                    return (
                      <JobCard
                        key={job.company + idx}
                        job={job}
                        isSelected={selectedIndex === idx}
                        isAnySelected={selectedIndex !== null}
                        onOpen={() => setSelectedIndex(idx)}
                        prefersReducedMotion={prefersReducedMotion ?? false}
                        isDesktop={isDesktop}
                        noLayout
                      />
                    );
                  })}

                  <AnimatePresence>
                    {selectedIndex !== null && (
                      <FullscreenJob
                        key={`fullscreen-${selectedIndex}`}
                        job={jobs[selectedIndex]}
                        index={selectedIndex}
                        length={jobs.length}
                        onClose={() => setSelectedIndex(null)}
                        navbarHeight={navbarHeightRef.current}
                        prefersReducedMotion={prefersReducedMotion ?? false}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-3">
                <button
                  onClick={() => { if (startIndex + visible < jobs.length) setStartIndex(s => Math.min(jobs.length - visible, s + visible)); }}
                  disabled={startIndex + visible >= jobs.length}
                  aria-label="Scroll down"
                  className={`w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${startIndex + visible < jobs.length ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M6 12l4-4 4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}