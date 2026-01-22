import { useEffect } from 'react';

function isEditable(el: Element | null) {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export default function useSpacebarNavigation(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // only plain Space (no modifiers)
      if (e.code !== 'Space' && e.key !== ' ') return;
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;

      const active = document.activeElement;
      if (isEditable(active)) return;

      // find page sections: prefer <section id="..."> or any element with [data-anchor]
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('section[id], [data-anchor]'))
        .filter(el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));
      if (candidates.length === 0) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const tops = candidates.map(el => el.getBoundingClientRect().top + scrollY);

      // next section: the first whose top is greater than current scroll (small threshold)
      const nextIndex = tops.findIndex(t => t > scrollY + 5);

      // if there's no next section, prevent default scrolling and do nothing
      if (nextIndex === -1) {
        e.preventDefault();
        return;
      }

      const nextEl = candidates[nextIndex];
      e.preventDefault();
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown as EventListener);
  }, []);
}
