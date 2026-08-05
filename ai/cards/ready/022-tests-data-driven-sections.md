# CARD-022 — Tests for Data-Driven Sections (Jobs / Projects)

**Status:** 🟢 Ready to build, not started

## Summary
No automated tests exist anywhere in the repo. `Jobs` and `Projects` sections render directly from `public/data/jobs.json` / `public/data/projects.json`, which are editable outside a normal code review/PR flow (writes straight to GitHub, triggering a redeploy with no review step). A malformed edit — missing field, bad color value, broken `sort_order` — could silently break a section in production with no warning. Add light test coverage plus validation at the save boundary.

## Current state
- No test runner configured in `package.json`.
- `src/sections/Jobs.tsx`, `src/sections/Projects.tsx` fetch and render `jobs.json`/`projects.json` at runtime with (as far as observed) no schema validation.
- `api/admin/jobs.ts`, `api/admin/projects.ts` accept edits and commit straight to GitHub — this is the actual boundary where bad data should be caught, since bad data past this point ships automatically.

## Instructions
1. Add Vitest + React Testing Library (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`) as dev dependencies, matching the existing Vite/TS setup.
2. Write component tests for `Jobs.tsx` and `Projects.tsx`: renders expected number of cards from fixture data, handles an empty array gracefully, handles a missing/malformed field (e.g. no `color`) without crashing.
3. Add a JSON schema (or a simple hand-written validator function) for the job/project shape, and call it server-side in `api/admin/jobs.ts` / `api/admin/projects.ts` before committing — reject the save with a clear error instead of letting bad data reach GitHub/production.
4. Add an `npm run test` script; wire it into CI once CARD (CI setup) exists, or at minimum document `npm run test` in the README.

## Acceptance criteria
- [ ] `npm run test` runs Vitest and passes.
- [ ] `Jobs.tsx` and `Projects.tsx` have component tests covering: normal render, empty data, one malformed entry.
- [ ] Save endpoints reject payloads that don't match the expected job/project schema, with a clear error surfaced in the editor UI.
- [ ] Existing manual CRUD flow still works end-to-end after validation is added.

## Nuances & considerations
- Keep validation logic shared between the two save endpoints if the shapes overlap, rather than duplicating field checks.
- Don't over-engineer: hand-written validator functions are fine for this scale; a full schema library (zod, etc.) is optional, not required — pick whichever is already idiomatic if one is already a dependency.
- FOSS constraint (global): Vitest/RTL/zod are all FOSS, fine to add.

## Files likely touched
- New: `vitest.config.ts` (or Vite test config block), `src/sections/Jobs.test.tsx`, `src/sections/Projects.test.tsx`, a shared validator (e.g. `api/_lib/validateContent.ts`)
- `api/admin/jobs.ts`, `api/admin/projects.ts`
- `package.json` (new scripts/deps)
