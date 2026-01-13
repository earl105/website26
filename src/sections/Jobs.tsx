import { useEffect, useRef, useState } from 'react';
import lowesLogo from '../assets/lowesLogo.png';
import gojoLogo from '../assets/gojoLogo.png';
import dicksLogo from '../assets/dicksLogo.png';
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
    company: "Lowe's Home Improvement",
    position: 'Cashier and Customer Service',
    dates: 'May 2025 - July 2025',
    color: '#283061',
    img: { src: lowesLogo, alt: 'Lowes Logo' },
    bullets: [
      'Operated registers and processed high-volume transactions accurately while delivering friendly customer service.',
      'Assisted customers with product inquiries, returns, and locating merchandise across multiple departments.',
      'Supported Lawn & Garden and Lumber departments by managing heavy inventory, outdoor sales, and seasonal product flow.',
      'Fulfilled and organized online orders, ensuring timely pick-up and delivery accuracy for customers.',
    ],
  },
  {
    company: 'GOJO Industries Inc.',
    position: 'Warehouse Associate',
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
  },{
    company: 'test',
    position: 'test',
    dates: 'August 20XX - August 20XX',
    color: '#006753',
    img: { src: dicksLogo, alt: 'DSG Logo' },
    bullets: [
      'lorem ipsum dolor sit amet',
      'lorem 2',
      'lorem 3',
      "lorem 4.",
    ],
  }
];

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const VISIBLE = 3;
  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();
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
    <section id="jobs" className="min-h-screen flex flex-col px-6 py-12 pt-16">
      <div className="max-w-5xl mx-auto w-full">
        {/* <h2 className="text-3xl md:text-4xl font-semibold mb-8">Jobs</h2> */}

        <div className="flex items-start md:items-center">
          <div className="flex-1">
            <div className="space-y-4">
              {jobs.slice(startIndex, startIndex + VISIBLE).map((job, i) => {
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

          {/* Carousel controls */}
          <div className="ml-4 flex flex-col items-center gap-3">
            {
              (() => {
                const canUp = startIndex > 0;
                const canDown = startIndex + VISIBLE < jobs.length;
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
                      onClick={() => { if (canDown) setStartIndex(s => Math.min(jobs.length - VISIBLE, s + 1)); }}
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
      </div>
    </section>
  );
}