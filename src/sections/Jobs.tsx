import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import JobIcon, { type JobIconKey } from '../data/jobIcons';
import JobsSkeleton from '../components/JobsSkeleton';
import HintTooltip from '../components/HintTooltip';
import { devLoadDelay } from '../utils/devLoadDelay';

// Session flag so the "click to switch roles" nudge shows at most once per
// browsing session (matches the file-explorer discovery hint, CARD-018).
const HINT_KEY = 'jobs-file-hint-seen';

export type Job = {
  company: string;
  position: string;
  dates: string;
  color: string;
  summary: string;
  icon: JobIconKey;
  file: string;
  category: string;
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
  category?: string;
  bullets: string[];
  logo_url: string;
  sort_order: number;
};

// Folder groups shown in the explorer, in display order. Any job whose
// category doesn't match falls back to "experience".
const CATEGORY_ORDER = ['professional', 'experience'] as const;
const CATEGORY_LABEL: Record<string, string> = {
  professional: 'career',
  experience: 'general',
};
const normalizeCategory = (category: string) =>
  (CATEGORY_ORDER as readonly string[]).includes(category) ? category : 'experience';

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

// Raise a color's lightness (in HSL) to a floor so darker brand colors stay
// legible as small icons on the dark UI. Hue/saturation are preserved.
const liftColor = (hex: string, minL = 0.62): string => {
  const m = hex.replace('#', '');
  if (m.length !== 6) return hex;
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (l >= minL) return hex;

  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let R: number;
  let G: number;
  let B: number;
  if (s === 0) {
    R = G = B = minL;
  } else {
    const q = minL < 0.5 ? minL * (1 + s) : minL + s - minL * s;
    const p = 2 * minL - q;
    R = hue2rgb(p, q, h + 1 / 3);
    G = hue2rgb(p, q, h);
    B = hue2rgb(p, q, h - 1 / 3);
  }
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${to(R)}${to(G)}${to(B)}`;
};

const toJob = (record: JobRecord): Job => ({
  company: record.company,
  position: record.role,
  dates: `${record.start_date} - ${record.end_date}`,
  color: record.color ?? getAccentColor(record.company),
  summary: record.summary,
  icon: record.icon,
  file: record.file ?? toFileName(record.company, record.icon),
  category: normalizeCategory(record.category ?? 'experience'),
  img: { src: record.logo_url, alt: `${record.company} logo` },
  bullets: record.bullets,
});

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [records, setRecords] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // File-switch discovery hint (CARD-018): a low-key nudge that the sidebar /
  // tab strip is interactive. Shown once per session, after the section
  // scrolls into view; stays until the user switches jobs (or Esc / ×). On
  // desktop it sits to the left of the editor window, its arrow aligned to the
  // next (not-yet-selected) job's row so it reads as "click here next".
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintTop, setHintTop] = useState<number | null>(null);
  const showTimerRef = useRef<number | null>(null);

  const dismissHint = useCallback(() => {
    setHintOpen(false);
    if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
    showTimerRef.current = null;
  }, []);

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

  // The job the hint points at: the next one after the current selection.
  const hintTargetIndex = jobs.length > 1 ? (selectedIndex + 1) % jobs.length : selectedIndex;

  // Vertically align the hint with the target file's sidebar row, measured
  // relative to the outer wrapper (the hint lives outside the editor window).
  const positionHint = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const row = wrapper.querySelector<HTMLElement>(`[data-file-index="${hintTargetIndex}"]`);
    if (!row) {
      setHintTop(16);
      return;
    }
    const wrapRect = wrapper.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    // Anchor the pill's top so its arrow (at the pill's vertical center, ~15px
    // down for the single-line pill) lines up with the target row's center.
    const HALF_PILL = 15;
    setHintTop(rowRect.top - wrapRect.top + rowRect.height / 2 - HALF_PILL);
  }, [hintTargetIndex]);

  // Group jobs into explorer folders, preserving each job's index in the flat
  // (sort_order) array so selection still works across folders.
  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        label: CATEGORY_LABEL[cat],
        items: jobs
          .map((job, index) => ({ job, index }))
          .filter(({ job }) => job.category === cat),
      })).filter((group) => group.items.length > 0),
    [jobs]
  );

  const toggleFolder = (cat: string) =>
    setCollapsedFolders((prev) => ({ ...prev, [cat]: !prev[cat] }));

  useEffect(() => {
    if (selectedIndex > jobs.length - 1) setSelectedIndex(0);
  }, [jobs.length, selectedIndex]);

  // Mobile tab strip: scroll state + overflow arrows so the strip stays usable
  // as the number of jobs grows (tabs shrink to a min width, then scroll).
  const tabScrollRef = useRef<HTMLDivElement | null>(null);
  const [tabOverflow, setTabOverflow] = useState({ left: false, right: false });

  const updateTabOverflow = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setTabOverflow({
      left: scrollLeft > 2,
      right: scrollLeft + clientWidth < scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    updateTabOverflow();
    const el = tabScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateTabOverflow, { passive: true });
    window.addEventListener('resize', updateTabOverflow);
    return () => {
      el.removeEventListener('scroll', updateTabOverflow);
      window.removeEventListener('resize', updateTabOverflow);
    };
  }, [updateTabOverflow, jobs.length]);

  // Keep the active tab centered as selection changes.
  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLElement>(`[data-tab="${selectedIndex}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedIndex]);

  // Selecting a file/tab is also the primary hint-dismiss trigger.
  const selectJob = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      dismissHint();
    },
    [dismissHint]
  );

  // Fire the hint once the section enters the viewport (not on mount — Jobs is
  // below the fold and may render before it's ever seen). Skipped entirely if
  // already shown this session. Stays open until the user switches jobs.
  useEffect(() => {
    if (loading || error || jobs.length === 0) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(HINT_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode / disabled) — just skip persistence.
    }
    if (alreadySeen) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        showTimerRef.current = window.setTimeout(() => {
          positionHint();
          setHintOpen(true);
          try {
            sessionStorage.setItem(HINT_KEY, '1');
          } catch {
            // ignore persistence failures
          }
        }, 600);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
    };
  }, [loading, error, jobs.length, positionHint]);

  // Keep the desktop hint aligned to its target row across viewport resizes.
  useEffect(() => {
    if (!hintOpen) return;
    const onResize = () => positionHint();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [hintOpen, positionHint]);

  // Fade the strip's overflowing edge(s) to transparent as a passive "more this
  // way" hint. A CSS mask does this independent of the background color.
  const FADE = 28;
  const tabMask = `linear-gradient(to right, transparent, #000 ${tabOverflow.left ? `${FADE}px` : '0px'}, #000 ${tabOverflow.right ? `calc(100% - ${FADE}px)` : '100%'}, transparent)`;

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
    <section ref={sectionRef} id="jobs" className={sectionClass} style={sectionStyle}>
      <div ref={wrapperRef} className="relative w-full max-w-5xl mx-auto">
        {/* Desktop file-switch hint: sits in the margin to the left of the
            editor window, arrow pointing right at the next job's row. */}
        <HintTooltip
          open={hintOpen}
          onDismiss={dismissHint}
          arrow="right"
          className="hidden md:block right-full mr-3"
          style={{ top: hintTop ?? 16 }}
        >
          Click to switch roles
        </HintTooltip>

        {/* Mobile file-switch hint: sits above the editor window, no pointer. */}
        <HintTooltip
          open={hintOpen}
          onDismiss={dismissHint}
          arrow="none"
          className="md:hidden bottom-full mb-2 left-0 right-0 mx-auto w-max"
        >
          Tap icons to switch roles
        </HintTooltip>

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
              {active ? CATEGORY_LABEL[active.category] : 'experience'} /{' '}
              <span className="text-[color:var(--muted)]">{active?.file}</span>
            </div>
          </div>

          {/* Body: sidebar + detail pane */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">

            {/* Mobile: Chrome pinned-tab strip — icon-only tabs. Tabs spread to
                fill when few, shrink to a tappable min width and scroll (with
                arrows) as more jobs are added. */}
            <div className="md:hidden shrink-0 border-b border-white/10">
              <nav
                ref={tabScrollRef}
                className="flex items-stretch overflow-x-auto no-scrollbar"
                style={{ maskImage: tabMask, WebkitMaskImage: tabMask }}
                aria-label="Experience tabs"
              >
                {jobs.map((job, i) => {
                  const isActive = i === selectedIndex;
                  return (
                    <button
                      key={job.company}
                      data-tab={i}
                      onClick={() => selectJob(i)}
                      aria-current={isActive}
                      aria-label={job.company}
                      className="relative flex-1 min-w-[3.25rem] flex items-center justify-center py-2.5 transition-colors"
                      style={{ backgroundColor: isActive ? 'var(--card-muted)' : 'transparent' }}
                    >
                      <span
                        className="absolute inset-x-0 bottom-0 h-0.5"
                        style={{ backgroundColor: isActive ? job.color : 'transparent' }}
                      />
                      {/* Subtle ambient backing so icons sit on the dark bg
                          without looking self-lit */}
                      <span className="relative flex items-center justify-center w-10 h-10">
                        <span
                          aria-hidden
                          className="absolute w-11 h-11 rounded-full transition-opacity"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 78%)',
                            opacity: isActive ? 1 : 0.6,
                          }}
                        />
                        <JobIcon
                          name={job.icon}
                          className="relative w-5 h-5 transition-opacity"
                          style={{ color: liftColor(job.color), opacity: isActive ? 1 : 0.82 }}
                        />
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* File explorer sidebar: collapsible IDE-style folder tree (desktop) */}
            <aside className="hidden md:block md:w-64 shrink-0 md:border-r border-white/10 py-2 overflow-y-auto md:max-h-none">
              <div className="px-4 pb-1 text-[10px] tracking-widest uppercase text-[color:var(--muted-2)] font-semibold">
                Explorer
              </div>

              {groups.map((group) => {
                const collapsed = collapsedFolders[group.cat] ?? false;
                return (
                  <div key={group.cat}>
                    <button
                      onClick={() => toggleFolder(group.cat)}
                      aria-expanded={!collapsed}
                      className="w-full flex items-center gap-1.5 px-3 py-1.5 text-left text-sm font-mono text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
                    >
                      <svg
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                      <svg className="w-4 h-4 shrink-0 text-[color:var(--muted-2)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                      </svg>
                      <span className="truncate">{group.label}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.ul
                          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          {group.items.map(({ job, index }) => {
                            const isActive = index === selectedIndex;
                            return (
                              <li key={job.company}>
                                <button
                                  data-file-index={index}
                                  onClick={() => selectJob(index)}
                                  aria-current={isActive}
                                  className={`relative w-full flex items-center gap-2 pl-9 pr-3 py-1.5 text-left text-sm font-mono whitespace-nowrap transition-colors ${
                                    isActive ? 'text-[color:var(--fg)]' : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                                  }`}
                                  style={{ backgroundColor: isActive ? 'var(--card-muted)' : 'transparent' }}
                                >
                                  <span
                                    className="absolute inset-y-0 left-0 w-0.5"
                                    style={{ backgroundColor: isActive ? job.color : 'transparent' }}
                                  />
                                  <span className="relative flex items-center justify-center shrink-0">
                                    <span
                                      aria-hidden
                                      className="absolute w-7 h-7 rounded-full transition-opacity"
                                      style={{
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 78%)',
                                        opacity: isActive ? 1 : 0.6,
                                      }}
                                    />
                                    <JobIcon
                                      name={job.icon}
                                      className="relative w-4 h-4"
                                      style={{ color: liftColor(job.color), opacity: isActive ? 1 : 0.82 }}
                                    />
                                  </span>
                                  <span className="truncate">{job.file}</span>
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
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
                        <img src={active.img.src} alt={active.img.alt} className="w-11/12 h-11/12 object-contain rounded" />
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
