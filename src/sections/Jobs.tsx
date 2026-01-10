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
    company: 'Lowes',
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
    company: 'GOJO Industries',
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
  },
];

export default function Jobs() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
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

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {jobs.map((job, idx) => (
              <JobCard
                key={job.company + idx}
                job={job}
                index={idx}
                isSelected={selectedIndex === idx}
                isAnySelected={selectedIndex !== null}
                onOpen={() => setSelectedIndex(idx)}
                prefersReducedMotion={prefersReducedMotion ?? false}
                isDesktop={isDesktop}
              />
            ))}
          </AnimatePresence>

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
    </section>
  );
}