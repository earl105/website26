import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Job } from '../sections/Jobs';

type Props = {
  job: Job;
  index: number;
  length: number;
  onClose: () => void;
  navbarHeight: number;
  prefersReducedMotion: boolean;
};

export default function FullscreenJob({ job, index, length, onClose, navbarHeight, prefersReducedMotion }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [onClose]);

  const containerStyle: React.CSSProperties = {
    top: `${navbarHeight}px`,
    height: `calc(100vh - ${navbarHeight}px)`,
  };

  // small directional pre-offset
  const initialY = index === 0 ? 12 : index === length - 1 ? -12 : 0;

  const layoutId = `job-${job.company.replace(/\s+/g, '-')}`;

  return (
    <motion.div className="fixed left-0 right-0 z-50" style={containerStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <motion.div
        layoutId={layoutId}
        initial={{ y: initialY }}
        animate={{ y: 0 }}
        transition={{ type: prefersReducedMotion ? false : 'spring', stiffness: 300, damping: 30 }}
        className="relative max-w-3xl mx-auto h-full bg-[color:var(--card)] rounded-t-lg md:rounded-lg overflow-hidden shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${job.company} details`}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="font-semibold text-lg">{job.company}</div>
            <div className="text-sm text-[color:var(--muted)]">{job.dates}</div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close job details"
            className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Close
          </button>
        </header>

        <div className="p-4 overflow-auto h-full">
          <h3 className="text-xl font-medium mb-3">{job.position}</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-[color:var(--fg)]">
            {job.bullets.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>

          {/* Mobile-only centered logo below bullets for focused mode */}
          <div className="md:hidden flex justify-center mt-6">
            <div className="w-32 h-32 rounded-md overflow-hidden flex items-center justify-center" style={{ backgroundColor: job.color }}>
              <img src={job.img.src} alt={job.img.alt} className="w-11/12 h-11/12 object-contain" />
            </div>
          </div>

          <div className="mt-6 text-sm text-[color:var(--muted)]">
            {/* Additional content can go here to demonstrate scroll behavior. */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
