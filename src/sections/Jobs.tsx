import { useEffect, useRef, useState } from 'react';
import lowesLogo from '../assets/jobIcons/lowesLogo.png';
import gojoLogo from '../assets/jobIcons/gojoLogo.png';
import dicksLogo from '../assets/jobIcons/dicksLogo.png';
import cmmLogo from '../assets/jobIcons/cmmLogo.png';
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

const jobs: Job[] = [
    {
    company: 'CoverMyMeds',
    position: 'Technology Intern',
    dates: 'June 2026 - August 2026',
    color: '#e8106a',
    img: { src: cmmLogo, alt: 'CMM Logo' },
    bullets: [
  'Supporting analysis, design, documentation, and engineering of solutions across software, platform, and data teams.',
  'Collaborating with cross-functional engineers to automate workflows, solve technical challenges, and more.',
  'Contributing to team projects using modern software stacks while quickly learning new tools and technologies.',
  'Engaging in mentorship and training programs to strengthen technical communication and problem-solving skills.',
],
  },{
    company: "Lowe's Home Improvement",
    position: 'Summer Cashier and Customer Service',
    dates: 'May 2025 - July 2025',
    color: '#283061',
    img: { src: lowesLogo, alt: 'Lowes Logo' },
    bullets: [
      'Operated registers and processed high-volume transactions accurately while delivering friendly customer service.',
      'Assisted customers with product inquiries, returns, and locating merchandise across multiple departments.',
      'Supported Lawn & Garden and Lumber departments by managing inventory, outdoor sales, and seasonal product.',
      'Fulfilled and organized online orders, ensuring timely pick-up and delivery accuracy for customers.',
    ],
  },
  {
    company: 'GOJO Industries Inc.',
    position: 'Summer Warehouse Associate',
    dates: 'May 2024 - July 2024',
    color: '#027cb7',
    img: { src: gojoLogo, alt: 'GOJO Logo' },
    bullets: [
      'Performed tasks in two-stage blow molding, including box preparation, filling, labeling, and palletizing.',
      'Collaborated in a 6-person assembly line to efficiently process and package Purell soap and sanitizer bottles.',
      'Assisted in 4 departments: single-stage blow molding, sanitization, logistics, and automation.',
      'Over 6 million bottles were produced and packed under the blow molding operations team in 3 months.',
    ],
  },
  {
    company: 'Dicks Sporting Goods',
    position: 'Footwear/Apparrel Sales Associate and Cashier',
    dates: 'August 2021 - August 2023',
    color: '#006753',
    img: { src: dicksLogo, alt: 'DSG Logo' },
    bullets: [
      'Cross-trained across 4 departments (footwear, outerwear, apparel, and cashier) to provide adaptable service.',
      'Managed and updated inventory for a department with over 250+ UPCs weekly.',
      'Efficiently processed and organized stock, handling up to 300 items per truck delivery.',
      "Cultivated strong customer relationships, driving store metrics to rank among the nation's top locations.",
    ],
  }
];

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
  const visible = isDesktop ? 3 : 2;
  const navbarHeightRef = useRef<number>(64); // adjust if your navbar height differs

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