# CARD-017 — Data Logging (Traffic, Failures, Dashboard)

**Status:** 🟡 Requirements TBD — lowest priority, do last

> ⚠️ **Low priority / do last.** `features.md` notes Vercel already provides most of this for free. Only build custom logging if Vercel's built-in visibility proves insufficient. Decide the approach before investing.

## Summary
Covers three related TODO items: (1) traffic logging, (2) failure logging, (3) a logging dashboard.

## Default recommendation
Use **Vercel built-in** logging/analytics first — function logs, deploy logs, and error traces in the Vercel dashboard require zero setup and satisfy a portfolio's needs. Treat the custom work below as a fallback.

## Sub-tasks & options (if custom logging is needed)
### 1. Traffic logging
- **Option A** — append visits to `logs/traffic.json` in the repo via GitHub API, **batched** (flush every N visits or via Vercel Cron). Never per-request (too many commits). FOSS, self-owned.
- **Option B** — Vercel Analytics free tier (`npm i @vercel/analytics` + wrapper). Cookieless, GDPR-friendly, stays in the Vercel ecosystem.
- **Option C** — self-hosted Umami/Plausible (FOSS) — only if a backend is already deployed for another reason.

### 2. Failure logging
- Capture serverless function errors + client error boundary events.
- Persist via the same batched GitHub-commit approach, or rely on Vercel error traces.

### 3. Logging dashboard
- Admin-only view (behind CARD-013 auth) that reads the log file(s)/analytics and visualizes traffic + failures.
- Only meaningful if custom logging (Option A) is chosen; otherwise the "dashboard" is just the Vercel dashboard.

## Acceptance criteria (draft)
- [ ] Decision recorded: Vercel built-in vs. custom (and which option).
- [ ] If custom: traffic + failures are captured without excessive commits/writes.
- [ ] If dashboard: admin-only, reads real data, shows traffic and failure summaries.
- [ ] No cloud database, no non-FOSS external service (per global constraints).

## Nuances & considerations
- Per-request commits would spam the git history and hit GitHub rate limits — batching is mandatory for Option A.
- Privacy: prefer cookieless/anonymous analytics.
- Revisit only after Phase 1 + admin backend are live; not worth building speculatively.

## Files likely touched
- (If custom) New: `api/log/*`, `logs/traffic.json`, admin dashboard UI
- Or: `src/main.tsx` / `App.tsx` for a Vercel Analytics wrapper
