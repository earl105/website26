import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export type HintArrowSide = 'top' | 'bottom' | 'left' | 'right';

type HintTooltipProps = {
  /** Whether the hint is currently shown. */
  open: boolean;
  /** Called on manual close (×), Escape, or click-through of the close button. */
  onDismiss: () => void;
  /** Which edge the pointer sits on — points toward the anchored element. */
  arrow: HintArrowSide;
  /** Absolute-positioning / layout classes for the wrapper (e.g. `right-full mr-3`). */
  className?: string;
  /** Inline positioning (e.g. a measured `top`) merged onto the wrapper. */
  style?: React.CSSProperties;
  children: ReactNode;
};

// Small solid pointer built from borders. Colored to read as a continuation of
// the glass pill against the dark section background rather than a literal
// (and doubled-up) translucent overlap.
const ARROW = 6;
const ARROW_COLOR = 'rgba(44,44,46,0.94)';

function Pointer({ side }: { side: HintArrowSide }) {
  const base = { position: 'absolute' as const, width: 0, height: 0 };
  const transparent = `${ARROW}px solid transparent`;
  const solid = `${ARROW}px solid ${ARROW_COLOR}`;
  const styleBySide: Record<HintArrowSide, React.CSSProperties> = {
    top: { ...base, top: -ARROW, left: '50%', transform: 'translateX(-50%)', borderLeft: transparent, borderRight: transparent, borderBottom: solid },
    bottom: { ...base, bottom: -ARROW, left: '50%', transform: 'translateX(-50%)', borderLeft: transparent, borderRight: transparent, borderTop: solid },
    left: { ...base, left: -ARROW, top: '50%', transform: 'translateY(-50%)', borderTop: transparent, borderBottom: transparent, borderRight: solid },
    right: { ...base, right: -ARROW, top: '50%', transform: 'translateY(-50%)', borderTop: transparent, borderBottom: transparent, borderLeft: solid },
  };
  return <span aria-hidden="true" style={styleBySide[side]} />;
}

// Directional entrance/exit offset (points away from the anchor). Kept off the
// wrapper's own transform so callers can still center via margins.
const enterOffset: Record<HintArrowSide, { x?: number; y?: number }> = {
  top: { y: -6 },
  bottom: { y: 6 },
  left: { x: -6 },
  right: { x: 6 },
};

/**
 * Low-key glass "hint" pill with a directional pointer and a close button.
 * Presentation only — trigger timing, persistence, and anchoring are the
 * caller's responsibility. Dismisses on Escape while open.
 */
export default function HintTooltip({ open, onDismiss, arrow, className, style, children }: HintTooltipProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onDismiss]);

  const offset = enterOffset[arrow];

  return (
    <AnimatePresence>
      {open && (
        // Wrapper is click-through so the hint never blocks the underlying
        // files/tabs; only the close button opts back into pointer events.
        <motion.div
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute z-20 ${className ?? ''}`}
          style={style}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <div className="relative glass-surface-strong rounded-full pl-3 pr-1.5 py-1.5 flex items-center gap-2 shadow-lg">
            <span className="text-xs font-medium text-[color:var(--fg)] whitespace-nowrap">{children}</span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss hint"
              className="pointer-events-auto shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors"
            >
              <svg viewBox="0 0 20 20" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
            <Pointer side={arrow} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
