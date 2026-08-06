import { useEffect } from 'react';

function isEditable(el: Element | null) {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

// how close to the pending target counts as "arrived"
const ARRIVAL_EPSILON_PX = 2;
// safety net in case a smooth scroll never reaches its target (interrupted, clamped, etc.)
const PENDING_TIMEOUT_MS = 1200;

export default function useKeyboardNavigation(): void {
  useEffect(() => {
    // absolute Y of the section we're currently animating toward, or null when settled.
    // Presses queue off this instead of live scrollY, so a second press mid-animation
    // advances a full section rather than re-targeting the one already in flight.
    let pendingTop: number | null = null;
    let pendingTimer: number | null = null;

    const clearPending = () => {
      pendingTop = null;
      if (pendingTimer !== null) {
        window.clearTimeout(pendingTimer);
        pendingTimer = null;
      }
    };

    const onScroll = () => {
      if (pendingTop === null) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(scrollY - pendingTop) <= ARRIVAL_EPSILON_PX) clearPending();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // only plain Space / ArrowDown (next section) or ArrowUp (previous section), no modifiers
      const isSpace = e.code === 'Space' || e.key === ' ';
      const isDown = e.key === 'ArrowDown';
      const isUp = e.key === 'ArrowUp';
      if (!isSpace && !isDown && !isUp) return;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;

      const active = document.activeElement;
      if (isEditable(active)) return;

      // find page sections: prefer <section id="..."> or any element with [data-anchor]
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('section[id], [data-anchor]'))
        .filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (candidates.length === 0) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const tops = candidates.map(el => el.getBoundingClientRect().top + scrollY);

      // measure from the in-flight target when there is one, otherwise from where we are
      const from = pendingTop ?? scrollY;

      // next section: the first whose top is below the reference point (small threshold)
      // previous section: the last whose top is above it
      const targetTop = isUp
        ? tops.reduce<number | null>((acc, t) => (t < from - 5 ? t : acc), null)
        : tops.find(t => t > from + 5) ?? null;

      // always swallow the key so the browser never does its own smaller scroll
      e.preventDefault();

      // if there's no section in that direction, do nothing
      if (targetTop === null) return;

      // clamp to the real scroll range so arrival detection can't wait on a position
      // the page is unable to reach (e.g. a final section shorter than the viewport)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      pendingTop = Math.min(targetTop, maxScroll);
      if (pendingTimer !== null) window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(clearPending, PENDING_TIMEOUT_MS);

      window.scrollTo({ top: pendingTop, behavior: 'smooth' });
    };

    // manual input takes over: drop the queued target so the next press is relative to reality
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', clearPending, { passive: true });
    window.addEventListener('touchstart', clearPending, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown as EventListener);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', clearPending);
      window.removeEventListener('touchstart', clearPending);
      if (pendingTimer !== null) window.clearTimeout(pendingTimer);
    };
  }, []);
}
