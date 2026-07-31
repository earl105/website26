import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Once the visitor scrolls away this session, the cue stays gone — including
// when they scroll back up to the top (CARD-019).
const SEEN_KEY = 'hero-scroll-cue-seen';

/**
 * Low-key ambient "there's more below" cue: a small, muted, shaft-less
 * down-chevron that gently bounces at the bottom of the hero. Fades in a beat
 * after load, fades out for good on the first scroll. Decorative only —
 * aria-hidden and click-through.
 */
export default function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === '1') return;
    } catch {
      // sessionStorage unavailable — fall through and show it normally.
    }

    // Appear a beat after load so it doesn't compete with the hero entrance.
    const showTimer = window.setTimeout(() => setVisible(true), 1400);

    const dismiss = () => {
      setVisible(false);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // ignore persistence failures
      }
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > 8) dismiss();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-24 md:bottom-6 z-20 flex justify-center text-[color:var(--muted)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.55 : 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.svg
        width="45"
        height="24"
        viewBox="0 0 30 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Arrow head only — no vertical shaft. */}
        <path d="M4 4l11 8 11-8" />
      </motion.svg>
    </motion.div>
  );
}
