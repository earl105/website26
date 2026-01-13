//import React from 'react';
import { motion } from 'framer-motion';
import type { Job } from '../sections/Jobs';

type Props = {
  job: Job;
  isSelected: boolean;
  isAnySelected: boolean;
  onOpen: () => void;
  prefersReducedMotion: boolean;
  isDesktop: boolean;
  noLayout?: boolean;
};

export default function JobCard({ job, isSelected, isAnySelected, onOpen, prefersReducedMotion, isDesktop, noLayout = false }: Props) {
  // directional bias for pre-morph animation
  //const bias = index === 0 ? 12 : index === length - 1 ? -12 : index % 2 === 0 ? -6 : 6;

  const layoutId = `job-${job.company.replace(/\s+/g, '-')}`;

  return (
    <motion.div
      {...(noLayout ? { layout: false } : { layoutId, layout: true })}
      initial={false}
      animate={{
        opacity: isAnySelected ? (isSelected ? 1 : 0.12) : 1,
        scale: isSelected ? 1.01 : 1,
      }}
      whileHover={isDesktop && !isSelected ? { scale: 1.03 } : undefined}
      transition={{ type: prefersReducedMotion ? false : 'spring', stiffness: 300, damping: 30 }}
      onClick={() => { if (!isDesktop) onOpen(); }}
      role={isDesktop ? undefined : 'button'}
      tabIndex={isDesktop ? undefined as any : 0}
      onKeyDown={(e) => { if (!isDesktop && (e.key === 'Enter' || e.key === ' ')) onOpen(); }}
      aria-expanded={isSelected}
      className="w-full h-44 md:h-auto flex items-stretch gap-0 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-[color:var(--card)] overflow-hidden"
    >
      {/* left accent stripe (mobile only) */}
      <div className="w-2 rounded-l-lg md:hidden" style={{ backgroundColor: job.color }} />

      <div className="flex-1 p-6 flex flex-row items-stretch gap-6">
        <div className="hidden md:flex items-center md:w-40">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-md flex items-center justify-center mr-4 overflow-hidden" style={{ backgroundColor: job.color }}>
            <img src={job.img.src} alt={job.img.alt} className="w-11/12 h-11/12 object-contain" />
          </div>
        </div>

        <div className="mt-0 flex-1 flex flex-col justify-center md:justify-between">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-base leading-tight break-words">{job.company}</div>
            <div className="flex items-center gap-2">
              <div className="text-sm" style={{ color: 'var(--muted)' }}>{job.dates}</div>
              {/* mobile-only chevron to indicate expandability */}
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 md:hidden ${isSelected ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
        </div>

        <div className="mt-2">
          <h3 className="text-xl font-medium">{job.position}</h3>
          {/* subtle mobile hint */}
          <div className="text-[10px] mt-1 md:hidden text-[color:var(--muted)] opacity-60">Tap to expand</div>
        </div>

        {/* Desktop bullets (md+) */}
        <div className="mt-3 text-sm text-[color:var(--fg)] hidden md:block">
          <ul className="list-disc list-inside space-y-2">
            {job.bullets.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>
        </div>

        {/* Mobile: show bullets + centered image only when card is focused/selected */}
        <div className={`mt-3 text-sm text-[color:var(--fg)] md:hidden ${isSelected ? 'block' : 'hidden'}`}>
          <ul className="list-disc list-inside space-y-2">
            {job.bullets.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>

          <div className="flex justify-center mt-4">
            <div className="w-28 h-28 rounded-md overflow-hidden flex items-center justify-center" style={{ backgroundColor: job.color }}>
              <img src={job.img.src} alt={job.img.alt} className="w-11/12 h-11/12 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}
