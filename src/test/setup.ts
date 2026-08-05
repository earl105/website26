import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom doesn't implement these; framer-motion (useReducedMotion) and the
// Jobs section's scroll-into-view / viewport-hint logic rely on them.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!window.IntersectionObserver) {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = vi.fn();
}
