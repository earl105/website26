# CARD-005 — Skeleton Loaders

**Status:** 🟢 Implemented

## Summary
Replaced the plain "Loading projects..." / "Loading jobs..." text with shimmer skeletons matching the real layout footprint while `public/data/*.json` is fetched.

## Implementation
- `src/index.css`: added a pure-CSS `.skeleton` class (light gradient sweep over dark glass via `skeleton-shimmer` keyframe). Under `prefers-reduced-motion: reduce` the sweep is disabled and a static tint remains.
- `src/components/ProjectCardSkeleton.tsx`: mirrors the project card (`h-96` glass card, top accent bar, image block, title line, description lines, tag pills).
- `src/components/JobsSkeleton.tsx`: mirrors the **new** Jobs editor-window layout (title bar with traffic-light dots, explorer sidebar file rows, detail pane with logo block + summary + bullet lines) at the same responsive height (`86vh`/`76vh`, max `620px`).
- `Projects.tsx` loading branch renders `perPage` `<ProjectCardSkeleton />` inside the real carousel wrapper. `Jobs.tsx` loading branch renders `<JobsSkeleton />`; the error branch was split back out into its own box.

> **Note:** the original instruction called for a per-card `<JobCardSkeleton />` (old `h-44` job cards). Since CARD-003 replaced the job cards with a single editor window, the job skeleton is a single window-shaped `<JobsSkeleton />` instead.

## Acceptance criteria
- [x] While fetching, skeletons of the same size/shape as the real layout are shown.
- [x] No layout shift when real data replaces skeletons (same wrappers/dimensions).
- [x] Shimmer is pure CSS (no new dependency) and respects `prefers-reduced-motion`.
- [x] Project skeleton count matches responsive `perPage`; job skeleton matches the single-window layout.

## Nuances & considerations
- Data loads from local `public/data/*.json` — very fast in prod, so skeletons may flash briefly. Left as-is per "don't over-engineer"; a minimum-visible duration can be added later if the flash is jarring.
- Skeletons are dark-mode consistent (light shimmer over dark glass).

## Files touched
- `src/index.css`
- `src/sections/Projects.tsx`, `src/sections/Jobs.tsx`
- New: `src/components/ProjectCardSkeleton.tsx`, `src/components/JobsSkeleton.tsx`
