# CARD-022 — Tests for Data-Driven Sections (Jobs / Projects)

**Status:** 🟢 Implemented

## Summary
No automated tests existed anywhere in the repo. `Jobs` and `Projects` sections render directly from `public/data/jobs.json` / `public/data/projects.json`, which are editable outside a normal code review/PR flow (writes straight to GitHub, triggering a redeploy with no review step). A malformed edit — missing field, bad color value, broken `sort_order` — could silently break a section in production with no warning. Added light test coverage; save-boundary validation (`api/_lib/validate.ts`, wired into `api/admin/jobs.ts` / `api/admin/projects.ts` via `handleResource`) was already in place.

## Implementation
- Added `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `jsdom` as dev dependencies.
- `vitest.config.ts`: jsdom environment, `react-swc` plugin, `src/test/setup.ts` as the setup file.
- `src/test/setup.ts`: stubs `window.matchMedia` (needed by `framer-motion`'s `useReducedMotion`), `window.IntersectionObserver` (Jobs' viewport-hint), and `HTMLElement.prototype.scrollIntoView` (Jobs' tab-strip auto-scroll) — none of which jsdom implements.
- `src/sections/Jobs.test.tsx` / `src/sections/Projects.test.tsx`: component tests covering normal render (multiple fixture entries), empty data (renders without crashing), and one malformed entry each (missing `color` for a job, missing `screenshot_url` for a project — both already handled with fallbacks/conditionals in the component code).
- `npm run test` script added (`vitest run`); documented in `README.md`.
- Confirmed `api/_lib/validate.ts` already rejects malformed job/project payloads before they reach `putJsonFile` (`handleResource` in `api/_lib/resource.ts` returns 400 with validation errors) — no changes needed there.
- `.github/workflows/ci.yml`: runs `npm run test` + `npm run build` on push to `main` and on pull requests. Note this is a **detection**, not a **prevention**, mechanism for admin-panel edits: the admin panel commits straight to `main` via the GitHub Contents API (no PR), so CI runs *after* the commit/redeploy, not before it. The actual pre-commit gate for admin edits is the synchronous schema validation in `api/_lib/validate.ts`. `npm run lint` was deliberately left out of the workflow — the repo currently has ~10 pre-existing lint errors unrelated to this card that would make every CI run fail; add it back once those are cleaned up.

## Acceptance criteria
- [x] `npm run test` runs Vitest and passes.
- [x] `Jobs.tsx` and `Projects.tsx` have component tests covering: normal render, empty data, one malformed entry.
- [x] Save endpoints reject payloads that don't match the expected job/project schema, with a clear error surfaced in the editor UI (pre-existing, verified).
- [x] Existing manual CRUD flow still works end-to-end after validation is added (validation was already in place; unchanged).

## Files touched
- New: `vitest.config.ts`, `src/test/setup.ts`, `src/sections/Jobs.test.tsx`, `src/sections/Projects.test.tsx`
- `package.json` (new devDependencies, `test` script)
- `README.md` (documented `npm run test`)
