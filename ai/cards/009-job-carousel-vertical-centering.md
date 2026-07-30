# CARD-009 — Vertically Center Jobs Carousel

**Status:** 🟢 Ready (quick fix)

## Summary
The jobs carousel currently sits too high in its section; it should be vertically centered within the full-height section.

## Current state
In `src/sections/Jobs.tsx` the section uses `flex flex-col px-6 py-12 pt-16` with `min-height: calc(var(--vh) * 100)`. The desktop branch uses `items-start md:items-center`, but the outer column is top-aligned, pushing content up.

## Instructions
1. Center the carousel content vertically in the section (e.g. add `justify-center` to the section's flex column, or center the inner `max-w-5xl` wrapper).
2. Confirm on desktop (3 cards) and mobile (2 cards + up/down buttons) — mobile has extra buttons above/below that affect centering.
3. Ensure the `pt-16` (navbar offset) doesn't fight the centering — account for the fixed navbar so content is optically centered, not just mathematically.

## Acceptance criteria
- [ ] Jobs content is vertically centered within the section on desktop.
- [ ] Mobile layout (buttons + 2 cards) is balanced, not top-heavy.
- [ ] Fixed navbar overlap accounted for (nothing hidden behind it).
- [ ] No regression to the `FullscreenJob` expanded overlay position.

## Nuances & considerations
- If [CARD-003](003-job-carousel-redo.md) (redo) lands first, this may be absorbed there — but it's a valid standalone quick fix meanwhile.
- `--vh` is a custom viewport unit (`src/utils/setVh.ts`) for mobile browser chrome; rely on it rather than raw `100vh`.

## Files likely touched
- `src/sections/Jobs.tsx`
