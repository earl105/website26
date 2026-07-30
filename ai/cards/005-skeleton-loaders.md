# CARD-005 — Skeleton Loaders

**Status:** 🟢 Ready

## Summary
Replace the plain "Loading projects..." / "Loading jobs..." text with skeleton loaders that match card dimensions while `public/data/*.json` is being fetched.

## Current state
Both `Projects.tsx` and `Jobs.tsx` already have `loading` state and render a `glass-surface-soft` box with placeholder text. This card swaps that text for shimmer skeletons shaped like the real cards.

## Instructions
1. Add a CSS shimmer keyframe (gradient sweep) in `src/index.css`.
2. Create `<ProjectCardSkeleton />` matching the project card (`h-96`, top accent bar, title line, description lines, tag pills) and `<JobCardSkeleton />` matching the job card (`h-44`/auto, logo block, company/date lines, bullet lines).
3. In the `loading === true` branch of each section, render the correct count of skeletons (projects: `perPage`; jobs: `visible`) instead of the text box.
4. Reuse the existing `glass-surface` styling so skeletons match the final layout footprint (prevents layout shift on swap).

## Acceptance criteria
- [ ] While fetching, skeletons of the same size/shape as real cards are shown.
- [ ] No layout shift when real data replaces skeletons.
- [ ] Shimmer animation is pure CSS (no new dependency) and respects `prefers-reduced-motion` (static placeholder if reduced).
- [ ] Skeleton count matches the responsive `perPage` / `visible` values.

## Nuances & considerations
- Data loads from local `public/data/*.json` — very fast in prod, so skeletons may flash. Consider a small minimum-visible duration or a fade to avoid a jarring flash. Don't over-engineer.
- Keep skeletons dark-mode consistent (light shimmer over dark glass).

## Files likely touched
- `src/index.css`
- `src/sections/Projects.tsx`, `src/sections/Jobs.tsx`
- New: `src/components/ProjectCardSkeleton.tsx`, `src/components/JobCardSkeleton.tsx`
