//src\main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enableVhUpdater } from './utils/setVh'


// Prevent browser from restoring scroll position on reload/navigation
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  try {
    history.scrollRestoration = 'manual'
  } catch (e) {
    // ignore in case browser restricts access
  }
}

const root = createRoot(document.getElementById('root')!)

// Ensure we start at the top on initial load / reload
if (typeof window !== 'undefined') {
  // some browsers may restore scroll after load; attempt multiple overrides
  window.scrollTo(0, 0)
  window.addEventListener('load', () => window.scrollTo(0, 0))
  requestAnimationFrame(() => window.scrollTo(0, 0))
}

// enable --vh CSS variable for mobile viewport-height stability
if (typeof window !== 'undefined') {
  enableVhUpdater()
}


root.render(
  <StrictMode>
    <App />
  </StrictMode>
)


