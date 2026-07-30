# CARD-002 — Vertical Job Carousel Animations

**Status:** 🟢 Completed (resolved by [CARD-003](003-job-carousel-redo.md))

> ✅ **Superseded by the job section rework.** The vertical stacked-card carousel this card targeted no longer exists, so its `startIndex` slide/fade animation is moot. The replacement file-explorer layout ships with its own transition.

## Outcome
- The job carousel was replaced with a VS Code file-explorer experience section (CARD-003). There is no longer an up/down `startIndex` to animate.
- Switching the active job now cross-fades the detail pane via `framer-motion` `AnimatePresence` (`mode="wait"`, fade + slight y-offset).
- `useReducedMotion()` is honored — the cross-fade collapses to a plain opacity change when reduced motion is preferred.

## Acceptance criteria
- [x] Direction decided in CARD-003 before implementation.
- [x] Job navigation animates rather than hard-snapping (cross-fade on file switch).
- [x] `prefers-reduced-motion` honored.
- [~] Desktop/mobile step-size animation and `FullscreenJob` morph criteria are obsolete — the paginated carousel and fullscreen modal were removed.

## Files touched
- `src/sections/Jobs.tsx` (cross-fade lives here)
- `src/components/JobCard.tsx`, `src/components/FullscreenJob.tsx` — deleted (no longer used)
