//src\utils\anchorSnap.ts
let enabled = false
let observer: IntersectionObserver | null = null
let visibility = new Map<Element, number>()
let scrollTimeout: number | null = null
let programmaticScroll = false
let lastSnapped: Element | null = null

const VISIBILITY_THRESHOLD = 0.65
const SCROLL_DEBOUNCE_MS = 150
const PROGRAMMATIC_CLEAR_MS = 800

function buildThresholds() {
  const t: number[] = []
  for (let i = 0; i <= 100; i++) t.push(i / 100)
  return t
}

function onIntersections(entries: IntersectionObserverEntry[]) {
  entries.forEach((e) => {
    visibility.set(e.target, e.intersectionRatio)
  })
}

function getCandidate(): Element | null {
  let best: Element | null = null
  let bestRatio = 0
  visibility.forEach((ratio, el) => {
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = el
    }
  })
  return bestRatio >= VISIBILITY_THRESHOLD ? best : null
}

function isAligned(el: Element) {
  const rect = el.getBoundingClientRect()
  return Math.abs(rect.top) < 2
}

function handleScrollEnd() {
  if (!enabled) return
  if (programmaticScroll) return
  const candidate = getCandidate()
  if (!candidate) return
  if (lastSnapped === candidate && isAligned(candidate)) return
  lastSnapped = candidate
  programmaticScroll = true
  const rect = candidate.getBoundingClientRect()
  const top = Math.round(window.scrollY + rect.top)
  window.scrollTo({ top, behavior: 'smooth' })
  window.setTimeout(() => {
    programmaticScroll = false
  }, PROGRAMMATIC_CLEAR_MS)
}

function onScroll() {
  if (scrollTimeout) window.clearTimeout(scrollTimeout)
  scrollTimeout = window.setTimeout(() => {
    handleScrollEnd()
  }, SCROLL_DEBOUNCE_MS)
}

function markUserScroll() {
  // marker hook intentionally minimal; presence of wheel/touch/keyboard denotes manual input
}

export function enableAnchorSnap() {
  if (enabled) return
  enabled = true
  visibility = new Map()
  observer = new IntersectionObserver(onIntersections, {
    root: null,
    threshold: buildThresholds(),
  })
  const els = Array.from(document.querySelectorAll('section[id], [data-anchor]'))
  els.forEach((el) => observer!.observe(el))
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('wheel', markUserScroll, { passive: true })
  window.addEventListener('touchstart', markUserScroll, { passive: true })
  window.addEventListener('keydown', (e) => {
    const k = e.key
    if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'PageUp' || k === 'PageDown' || k === 'Home' || k === 'End' || k === ' ') {
      markUserScroll()
    }
  })
}

export function disableAnchorSnap() {
  if (!enabled) return
  enabled = false
  if (observer) {
    observer.disconnect()
    observer = null
  }
  visibility.clear()
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('wheel', markUserScroll)
  window.removeEventListener('touchstart', markUserScroll)
}

export default { enableAnchorSnap, disableAnchorSnap }
