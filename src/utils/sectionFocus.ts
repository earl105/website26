// Scoping helpers for section-level keyboard shortcuts.
//
// Several sections listen on `window` for the same keys (arrows, Enter). Without
// scoping, one keypress hits every section at once — e.g. paging the Jobs tabs
// would also spin the Projects carousel offscreen. These helpers let each
// section ignore keys that aren't meant for it.

// True when the section spans the vertical middle of the viewport, i.e. it's the
// one the user is currently looking at. Sections here are full-height and snap
// into place, so exactly one holds the midpoint at rest.
export function holdsViewport(el: HTMLElement | null | undefined): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const middle = window.innerHeight / 2;
  return rect.top <= middle && rect.bottom >= middle;
}

// True when the user is typing, so shortcuts should stay out of the way.
export function isTypingTarget(el: Element | null = document.activeElement): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return (el as HTMLElement).isContentEditable;
}
