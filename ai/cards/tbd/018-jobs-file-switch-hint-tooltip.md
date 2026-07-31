# CARD-018 — Jobs File-Switch Hint Tooltip

**Status:** 🟡 Proposed

> Numbered 018 (next available ID). This splits the Jobs half of a proposed "discovery tooltips" concept into its own card; a sibling **hero hint** card (referenced below as the hero hint) is not yet created in this repo. Build the shared `HintTooltip` component alongside that sibling if/when it exists.

## Summary
Add a small, self-dismissing hint on the Jobs section that nudges visitors to click through the file-explorer sidebar, since the file/tab list isn't obviously interactive at a glance (see [CARD-003](../done/003-job-carousel-redo.md) for the underlying explorer implementation).

## Implementation
- Small pill/callout with an arrow pointer, styled with the existing glass aesthetic — consistent with the hero hint sibling so both read as the same feature.
- **Desktop:** points at the file sidebar.
- **Mobile:** points at the horizontal, scrollable file-tab strip instead — needs a responsive anchor position, not just responsive copy.
- Copy: something short like "Click to switch roles."
- **Trigger timing:** appears once, shortly after the Jobs section scrolls into view — use an intersection observer, not just component mount, since the section may not be visible on initial page load.
- **Dismiss triggers (first to fire wins):**
  - User clicks any file/tab
  - Timeout (~3–4s)
- **Persistence:** store a flag (`sessionStorage` or `localStorage`, matching whatever the hero hint sibling uses) so returning visitors in the same session don't see it repeatedly.
- Should not delay or block the underlying interaction — files stay clickable immediately, hint or not.

## Data changes
None — presentation-only.

## Acceptance criteria
- [ ] Hint appears once per session, triggered by the Jobs section entering the viewport (not on page load).
- [ ] Dismisses on file/tab click or timeout — whichever happens first.
- [ ] Desktop hint anchors to the sidebar; mobile hint anchors to the horizontal tab strip.
- [ ] Styling reuses existing glass/panel tokens and matches the hero hint sibling's component visually.
- [ ] Accessible: dismissible via keyboard (Esc or tab-away), not solely color-dependent, doesn't trap focus.
- [ ] File-switching remains fully functional and undelayed regardless of hint state.

## Nuances & considerations
- Needs an intersection observer (not mount-based trigger) since Jobs is below the fold and may load before it's ever seen.
- Keep it low-key — the goal is a nudge, not a modal, and it shouldn't compete with the cross-fade transition between files already happening in CARD-003.

## Files touched (anticipated)
- Shared: `src/components/HintTooltip.tsx` (reused from the hero hint sibling if built together)
- `src/sections/Jobs.tsx` (mount hint, wire to intersection observer + file-click handler)
