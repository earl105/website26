//src/utils/setVh.ts
// Sets a CSS variable `--vh` equal to 1% of the visual viewport height
// and updates it on resize/orientationchange. This helps avoid layout
// jumps on mobile when browser chrome shows/hides (Instagram in-app, iOS Safari).
let rafId: number | null = null
let timeout: number | null = null

function setVh() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export function enableVhUpdater() {
  setVh()
  const onResize = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      setVh()
      // some browsers fire many resizes; debounce final stabilization
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        setVh()
      }, 200)
    })
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
}

export default enableVhUpdater
