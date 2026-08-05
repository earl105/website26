import { track } from '@vercel/analytics'

// Thin wrapper over Vercel Analytics' `track` so custom-event names and props
// stay consistent across call sites. In local dev this is a no-op that logs to
// the console; real data is only sent from the deployed Vercel site.
export const trackEvent = (name: string, props?: Record<string, string>) =>
  track(name, props)
