# CARD-019 — Hero Scroll Cue Tooltip

**Status:** 🟡 Proposed

> Numbered 019 (next available ID). This splits the hero half of a proposed "discovery tooltips" concept into its own card; its sibling is [CARD-018](018-jobs-file-switch-hint-tooltip.md) (Jobs file-switch hint). Build the shared `HintTooltip` component alongside CARD-018 if built together.

## Summary
Add a small, self-dismissing hint on the Home hero section that nudges first-time visitors to scroll past the laptop, since there's currently no visual cue that the page continues below the fold.

## Implementation
- Small pill/callout with a down-chevron, styled with the existing glass aesthetic (semi-transparent panel, soft border) — not a foreign UI element.
- Positioned near the bottom of the hero or beside the laptop.
- Copy: something short like "Scroll to explore" — final wording is a nice-to-have, not load-bearing.
- **Trigger timing:** appears a beat after the laptop's first type/delete animation cycle completes — not immediately on page load, so it doesn't compete with the opening animation.
- **Dismiss triggers (first to fire wins):**
  - User scrolls at all
  - Timeout (~4–5s)
  - Manual dismiss (small × or click-anywhere)
- **Persistence:** store a flag (`sessionStorage` or `localStorage`) so the hint only shows once per session — avoid re-showing on every visit within the same browsing session.
- Should not delay or interfere with the laptop's ongoing type/delete loop or its open/close-on-scroll behavior — the hint is additive, not blocking.

## Data changes
None — presentation-only.

## Acceptance criteria
- [ ] Hint appears once per session, after the laptop's first animation cycle completes (not on mount).
- [ ] Dismisses on scroll, timeout, or manual close — whichever happens first.
- [ ] Hero animations (type/delete loop, scroll-driven open/close) continue unaffected by the hint's presence or dismissal.
- [ ] Styling reuses existing glass/panel tokens, not a new visual style.
- [ ] Accessible: dismissible via keyboard (Esc or tab-away), not solely color-dependent, doesn't trap focus.

## Nuances & considerations
- Timing off the *first* animation cycle only matters — the laptop repeats indefinitely, and the hint shouldn't reappear on every loop.
- If `sessionStorage` is used, the hint will reappear in a new tab; if that's undesirable, use `localStorage` instead for a true "first visit ever" hint.

## Files touched (anticipated)
- New: `src/components/HintTooltip.tsx` (shared with [CARD-018](018-jobs-file-switch-hint-tooltip.md) if built together)
- `src/sections/Hero.tsx` (mount hint, wire to animation-complete + scroll listener)
