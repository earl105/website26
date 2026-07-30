# CARD-004 — Project Card Click Behavior

**Status:** 🔵 Partially implemented — verify + finish

## Summary
Project cards should only be clickable when a link exists, with a manual per-project override flag to force-disable the link even when one is present.

## Current state
The logic already exists in `src/sections/Projects.tsx`:
```
if (project.clickable && !project.clickable_override && (project.github_url || project.demo_url)) {
  // render as <a>
} else {
  // render as plain <div class="cursor-default">
}
```
`projects.json` entries carry `clickable`, `clickable_override`, `github_url`, `demo_url`. So the mechanism is in place — this card is mostly verification, data hygiene, and UX affordance.

## Instructions
1. Verify every entry in `public/data/projects.json` has correct `clickable` / `clickable_override` / URL values.
2. Confirm affordance: clickable cards get hover lift + glow/pointer; non-clickable get `cursor-default` and no hover affordance. (Currently both share `hover:scale-103` on the inner `<article>` — decide whether non-clickable cards should lose the hover scale.)
3. Confirm link target: prefers `github_url`, falls back to `demo_url`. Confirm this priority is intended.
4. Ensure `target="_blank"` links keep `rel="noreferrer"` (already present).

## Acceptance criteria
- [ ] A card with no `github_url` and no `demo_url` is never a link, regardless of `clickable`.
- [ ] Setting `clickable_override: true` disables the link even when a URL exists.
- [ ] Clickable cards show a distinct hover affordance; non-clickable cards do not signal clickability.
- [ ] No console errors / dead `#` hrefs rendered.

## Nuances & considerations
- Semantics: `clickable_override` currently means "override OFF." Document this clearly in the schema so the admin GUI (CARD-014) labels the toggle intuitively (e.g. "Disable link").
- The whole `<article>` currently has `hover:scale-103` even inside a plain `<div>` — this can imply clickability falsely. Consider gating the hover transform on the clickable branch.

## Files likely touched
- `src/sections/Projects.tsx`
- `public/data/projects.json`
