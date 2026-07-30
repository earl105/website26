# CARD-001 — Project Carousel Slide/Fade Animations

**Status:** 🟢 Implemented

## Summary
Added slide-in / fade-out animations to the project carousel so the visible set shifts left/right when navigating, instead of snapping instantly.

## Implementation
- `src/sections/Projects.tsx`: the visible card row is wrapped in a `framer-motion` `AnimatePresence` (`mode="wait"`) with a `motion.div` keyed by `index`. Keying by index means the modulo-wrap navigation animates as a normal slide with no backward jump.
- `direction` state (1 = next, -1 = prev) is set in `handleNext` / `handlePrev` and passed via `custom` so the exiting set leaves toward the correct edge.
- `animating` boolean locks navigation until the incoming set's `center` animation completes (`onAnimationComplete`), preventing rapid-click breakage.
- Variants: `slideVariants` (enter from ±100%, exit to ∓100%, with opacity) for normal motion; `fadeVariants` (opacity only) when `useReducedMotion()` is true. Duration 0.3s normal / 0.15s reduced.

## Acceptance criteria
- [x] Clicking next slides cards leftward; clicking prev slides rightward.
- [x] Outgoing cards fade out, incoming cards fade in — no instant snap.
- [x] Rapid clicks don't visually break the carousel (`animating` lock until enter completes).
- [x] `prefers-reduced-motion` minimizes the animation (cross-fade, shortened).
- [x] Works at both breakpoints: `perPage = 3` (md+) and `perPage = 1` (mobile) — the whole visible row animates regardless of count.

## Nuances & considerations
- The carousel indexes with modulo wrap (`(index + perPage) % n`), so the "next" set can wrap past the end — the animation must handle the wrap without a visual jump backwards.
- The viewport uses `overflow-hidden` (`px-10 py-2.5` container); ensure sliding cards clip cleanly and arrow buttons stay above (`z-10`).
- Card accent colors come from CSS vars via seeded `shuffledIndices` — stable per card, derived from `index`, so they don't reshuffle across the transition.
- `mode="wait"` fully exits the old set before the new one enters; both use fixed `h-96` cards so the row height stays stable and the absolutely-positioned arrows don't jump.
- Leftover unused `.animate-slide-left` / `.animate-slide-right` keyframes remain in `App.css` (superseded by framer-motion) — safe to remove in a cleanup pass.

## Files likely touched
- `src/sections/Projects.tsx`
