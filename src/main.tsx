//src\main.tsx
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import { enableVhUpdater } from './utils/setVh'

// Admin lives at /admin and is code-split into its own chunk so none of it
// ships with the public site (and vice versa).
const AdminApp = lazy(() => import('./admin/AdminApp'))

const path = typeof window !== 'undefined' ? window.location.pathname : '/'
const isAdmin = path === '/admin' || path.startsWith('/admin/')

// Prevent browser from restoring scroll position on reload/navigation
if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
  try {
    history.scrollRestoration = 'manual'
  } catch (e) {
    // ignore in case browser restricts access
  }
}

const root = createRoot(document.getElementById('root')!)

if (!isAdmin && typeof window !== 'undefined') {
  // Ensure we start at the top on initial load / reload (site only)
  window.scrollTo(0, 0)
  window.addEventListener('load', () => window.scrollTo(0, 0))
  requestAnimationFrame(() => window.scrollTo(0, 0))
  // enable --vh CSS variable for mobile viewport-height stability
  enableVhUpdater()
}

root.render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div style={{ padding: 24, color: '#9da0a6' }}>Loading admin…</div>}>
        <AdminApp />
      </Suspense>
    ) : (
      <>
        <App />
        <Analytics />
      </>
    )}
  </StrictMode>
)
