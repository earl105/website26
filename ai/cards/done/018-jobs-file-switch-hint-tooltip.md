# CARD-018 — Jobs File-Switch Hint Tooltip

**Status:** 🟢 Implemented

> ✅ **Built.** Shipped as a low-key glass pill via a new shared `src/components/HintTooltip.tsx`, wired into `Jobs.tsx` with an intersection-observer trigger and `sessionStorage` persistence. See Implementation for where the build diverged from the original proposal.

> Numbered 018 (next available ID). This splits the Jobs half of a proposed "discovery tooltips" concept into its own card; the sibling **hero scroll cue** is [CARD-019](../tbd/019-hero-scroll-cue-tooltip.md), which shares the `HintTooltip` component.

## Summary
Add a small, self-dismissing hint on the Jobs section that nudges visitors to click through the file-explorer sidebar, since the file/tab list isn't obviously interactive at a glance (see [CARD-003](../done/003-job-carousel-redo.md) for the underlying explorer implementation).

## Implementation (as built)
- **Component:** `HintTooltip` — a glass pill (`glass-surface-strong`) with a small border-triangle pointer (`arrow` prop: `top | bottom | left | right`), a close (×) button, and Escape-to-dismiss. Wrapper is `pointer-events-none` (only × opts back in) so it never blocks the underlying UI.
- **Desktop:** sits in the **left margin, outside** the editor window (`right-full`), with its arrow pointing **right at the next not-yet-selected job's row** — measured against the sidebar button via `data-file-index` + `getBoundingClientRect`, and repositioned on resize. Copy: "Click to switch roles."
- **Mobile:** points **up** at the horizontal tab strip, centered. Copy: "Tap to switch roles."
- **Trigger:** `IntersectionObserver` (threshold 0.4) on the section; ~600ms after it enters view the hint appears. Not mount-based.
- **Dismiss:** on job switch (any file/tab click), Escape, or ×. **No auto-timeout** — it stays until the user acts (changed from the original ~3–4s timeout per direction that it should persist until interacted with).
- **Persistence:** `sessionStorage` flag (`jobs-file-hint-seen`), set when first shown, so it appears at most once per session.

## Divergences from the original proposal
- Desktop anchor moved from "points at the sidebar" (overlapping the pane) to the **left margin outside the window**, pointing at the specific next job.
- Auto-timeout **removed** — persists until interaction instead.

## Data changes
None — presentation-only.

## Acceptance criteria
- [x] Hint appears once per session, triggered by the Jobs section entering the viewport (not on page load).
- [x] Dismisses on file/tab click (plus Esc / ×). _(Auto-timeout intentionally dropped.)_
- [x] Desktop hint anchors to the left margin pointing at the next job; mobile hint anchors to the horizontal tab strip.
- [x] Styling reuses existing glass/panel tokens and shares the component with CARD-019.
- [x] Accessible: dismissible via keyboard (Esc), not solely color-dependent, doesn't trap focus.
- [x] File-switching remains fully functional and undelayed regardless of hint state.

## Nuances & considerations
- Needs an intersection observer (not mount-based trigger) since Jobs is below the fold and may load before it's ever seen.
- Keep it low-key — the goal is a nudge, not a modal, and it shouldn't compete with the cross-fade transition between files already happening in CARD-003.
- ⚠️ On narrow desktop widths (~1024–1280px) the left margin is thin, so the desktop pill can crowd the viewport edge. Acceptable for now; revisit with a wider breakpoint fallback if it becomes an issue.

## Files touched
- Shared: `src/components/HintTooltip.tsx` (new; also used by CARD-019)
- `src/sections/Jobs.tsx` (hint state, intersection observer, file-click dismiss, next-job anchoring)
