# CARD-007 — Section Backgrounds

**Status:** 🟡 Requirements TBD — visual direction not chosen

> ⚠️ **Direction still being determined.** The author listed options (textures, spotlight/vignette, patterns, images) but with firm constraints and no final pick. Choose/confirm the approach before building.

## Summary
Add backgrounds to give sections depth and give the new glass surfaces (CARD-006) something to refract, while keeping the existing design language.

## Hard constraints (from TODO)
- Keep the current design language: **alternating section colors**, **dark-mode only**.
- **Avoid** generic add-ins: no cursor-following spotlights, no interactive backgrounds that visually compete with the actual content.

## Candidate approaches (pick one or combine — subtle)
- Texture overlay — SVG noise filter or CSS dot/grid pattern
- Static vignette / radial gradient per section (NOT cursor-following)
- Subtle per-section gradient variant keyed to that section's accent color
- Lightweight static patterns or imagery

## Instructions
1. Confirm the chosen direction with the author (it's flagged TBD).
2. Implement as a reusable global `<Background />` component or per-section CSS layer. Note: `src/components/Background.tsx` already exists — review and extend it rather than adding a parallel system.
3. Keep it behind content and glass; must not reduce text contrast.
4. Static/GPU-cheap — do not add cursor listeners or heavy canvas animation.

## Acceptance criteria
- [ ] Direction approved before implementation.
- [ ] Alternating-color, dark-mode language preserved.
- [ ] No cursor-following or interactive/distracting effects.
- [ ] Backgrounds enhance (not fight) glass surfaces and text legibility.
- [ ] No measurable scroll/animation jank added (check with the R3F hero on screen).

## Nuances & considerations
- Tightly coupled with CARD-006 — glass needs texture behind it to read as glass. Sequence: decide background → upgrade glass → verify together.
- `Background.tsx` already exists; check what it currently does before designing.
- Project/job accent colors live as `--project-color-*` CSS vars in `index.css` and hardcoded `accentColors` in `Jobs.tsx` — reuse for per-section tints.

## Files likely touched
- `src/components/Background.tsx`
- `src/index.css`
- Possibly `src/App.tsx` (section wrappers)
