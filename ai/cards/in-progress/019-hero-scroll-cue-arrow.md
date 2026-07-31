# CARD-019 — Hero Scroll Cue Arrow

**Status:** 🔵 In progress

> Sibling of [CARD-018](../done/018-jobs-file-switch-hint-tooltip.md) (Jobs file-switch hint). **Design changed from the original "tooltip" concept:** no text, no pill — just a small, low-key animated bouncing chevron (a down-arrow head, *no shaft*) that quietly signals "there's more below." Distinct enough from CARD-018's text pill that it does **not** reuse `HintTooltip`; it's its own tiny presentational component.

## Summary
Add a low-key visual cue on the hero that there's more page below the fold: a small down-chevron that gently bounces. No copy, no panel — purely a nudge. Fades away once the visitor scrolls.

## Implementation
- **Visual:** a single down-chevron (SVG `v` / arrow *head only*, no vertical shaft), small and muted (uses `--muted`, low opacity ~0.55) so it reads as ambient, not a button.
- **Motion:** a gentle vertical bounce loop (framer-motion `y: [0, 6, 0]`, ~1.6s, infinite, ease-in-out). Honors `prefers-reduced-motion` — no bounce, just a static faded-in chevron.
- **Position:** absolutely anchored bottom-center of the hero section. `pointer-events-none` + `aria-hidden` — decorative, never blocks clicks or traps focus.
- **Appear:** fades in a beat after load (~1.4s delay) so it doesn't compete with the hero's entrance. _(Simple timer rather than plumbing into the laptop's type/delete cycle — see divergences.)_
- **Dismiss:** fades out on the first real scroll (`scrollY > 8`). No manual close needed since it's non-interactive and already hides on the exact action it's cueing.
- **Persistence:** `sessionStorage` flag (`hero-scroll-cue-seen`) set on dismiss, so it doesn't reappear if the user scrolls back to the top in the same session.
- Additive only — does not touch or delay the laptop's type/delete loop or scroll-driven open/close.

## Data changes
None — presentation-only.

## Acceptance criteria
- [ ] A muted, shaft-less down-chevron bounces gently at the bottom of the hero.
- [ ] Appears a beat after load (not instantly on mount), fades out on first scroll.
- [ ] Shows at most once per session (`sessionStorage`).
- [ ] Honors `prefers-reduced-motion` (no bounce).
- [ ] Decorative: `aria-hidden`, `pointer-events-none`, no focus trap; not solely color-dependent (motion carries the meaning).
- [ ] Hero animations continue unaffected.

## Divergences from the original proposal
- **Not a tooltip** — no text ("Scroll to explore" dropped), no glass pill, no × button. Just the bouncing chevron.
- **Does not reuse `HintTooltip`** (that's the text-pill component from CARD-018).
- Trigger is a **short post-load timer**, not wired to the laptop's first animation-cycle completion (would require a callback out of `LaptopScene`; deferred as not worth the coupling for a low-key cue).

## Files touched
- New: `src/components/ScrollCue.tsx`
- `src/sections/Hero.tsx` (mount the cue inside the hero section)
