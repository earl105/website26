# CARD-012 — Add Tech Icons (Claude Code, Playwright, pnpm, Jest, just)

**Status:** 🟢 Ready

## Summary
Add placeholder/real icons for: **Claude Code**, **Playwright**, **pnpm**, **Jest**, and **just**. (`npm` already exists in the carousel — TODO listed it but it's present.)

## Current state
`src/data/techIcons.tsx` loads assets from `src/assets/techIcons/*.{png,svg}` via `import.meta.glob`, maps ids → filenames in `fileMap`, and renders `techIcons[]`. Missing files fall back to a built-in `placeholderDataUrl`. `npm` is already registered (`{ id: 'npm', name: 'npm' }`) with `src/assets/techIcons/npm.svg`.

## Instructions
1. Add SVG assets to `src/assets/techIcons/` for each (prefer official FOSS/brand SVGs; `.svg` is preferred over `.png` by `getSrc`):
   - `claude.svg` (Claude Code), `playwright.svg`, `pnpm.svg`, `jest.svg`, `just.svg`
2. Add entries to `fileMap` in `techIcons.tsx` mapping id → base filename.
3. Add corresponding objects to the `techIcons[]` array with `id`, human `name`, and `getSrc(id)`.
4. If a real asset isn't ready, still add the `fileMap` + array entry — `getSrc` returns the placeholder automatically, satisfying "add placeholder for...".
5. Place each in a sensible category comment block (e.g. Playwright/Jest → testing; pnpm → package managers; Claude Code → tools/IDEs). Note CARD-? grouping is handled in the About marquee revamp (features.md item 10).

## Acceptance criteria
- [ ] Claude Code, Playwright, pnpm, Jest, and just each appear in the tech carousel.
- [ ] Real SVGs render where provided; missing assets show the placeholder (no broken images).
- [ ] `name` labels are correct and human-readable.
- [ ] All added icon assets are FOSS/appropriately licensed brand marks.
- [ ] `npm` confirmed already present (no duplicate added).

## Nuances & considerations
- `getSrc` prefers `.svg` when both `.svg` and `.png` exist — provide SVGs to match the existing set.
- "just" is the command runner (casey/just) — use its logo, not the word.
- Brand-asset licensing: use official press/brand SVGs; keep everything FOSS-compatible per global constraint.

## Files likely touched
- `src/data/techIcons.tsx`
- `src/assets/techIcons/` (new asset files)
