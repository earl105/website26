# CARD-006 — Liquid Glass / Transparency

**Status:** 🟢 Ready

> **Note:** The current glass implementation is NOT good enough yet. The existing `.glass-surface`, `.glass-surface-strong`, and `.glass-surface-soft` classes in `src/index.css` are a rough starting point only — treat this as a real implementation task, not a tweak.

## Summary
Implement a proper, polished "liquid glass" / frosted-transparency treatment across cards, nav, and modals that visibly elevates the site's look.

## Current state
`src/index.css` defines `.glass-surface`, `.glass-surface-strong`, `.glass-surface-soft` (used widely across `Projects`, `Jobs`, `About`, loaders). These exist but the effect is insufficient — redo/upgrade them centrally so every consumer improves at once.

## Instructions
1. Redesign the three glass utility classes centrally in `src/index.css` so all existing consumers inherit the upgrade.
2. Target a convincing frosted-glass look:
   - `backdrop-filter: blur(...)` + `saturate(...)` over a low-alpha fill (`bg-white/5` / `bg-black/30` equivalents)
   - Subtle 1px inner border (`border-white/10`) and a soft highlight edge (top/left light, bottom/right shadow) for depth
   - Layered translucency — consider stacked pseudo-elements or gradients to read as real glass, not a flat tint
3. Ensure a graceful fallback where `backdrop-filter` is unsupported (opaque-ish fill).
4. Verify against the site's backgrounds (see CARD-007) — glass only reads as glass over texture/gradient behind it.

## Acceptance criteria
- [ ] Glass surfaces have real depth (blur + saturation + edge highlight/shadow), not a flat semi-transparent box.
- [ ] Text on glass meets accessible contrast (check WCAG AA with devtools).
- [ ] `.glass-surface` / `-strong` / `-soft` remain the single source of truth — no per-component one-offs.
- [ ] Fallback renders acceptably where `backdrop-filter` is unsupported.
- [ ] Works in dark mode (the only mode) and doesn't wash out over dark backgrounds.

## Nuances & considerations
- `backdrop-filter` blur is GPU-cost heavy on mobile, especially stacked over the `LaptopScene` R3F canvas — profile on a real phone; the laptop/hero is already animation-heavy.
- Effect depends on what's behind it; coordinate with CARD-007 (backgrounds) so glass has texture to refract.
- Safari needs `-webkit-backdrop-filter`.

## Files likely touched
- `src/index.css` (primary)
- Spot-check consumers: `Projects.tsx`, `Jobs.tsx`, `About.tsx`, `Navbar.tsx`, `FullscreenJob.tsx`
