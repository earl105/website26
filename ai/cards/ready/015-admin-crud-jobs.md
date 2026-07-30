# CARD-015 — Admin CRUD: Job Cards (GUI)

**Status:** 🟢 Ready (Phase 2 — blocked on [CARD-013](013-admin-login.md))

## Summary
Admin GUI to create/read/update/delete job cards, persisting to `public/data/jobs.json` in the repo via the GitHub API (triggers Vercel redeploy). Mirrors CARD-014.

## Instructions
1. **UI:** admin form/list for jobs with fields matching the schema: `company`, `role`, `start_date`, `end_date`, `bullets` (add/remove lines), `logo_url`, `sort_order`.
2. Drag-to-reorder list updating `sort_order`; delete with confirmation.
3. **API:** `POST /api/admin/jobs` (JWT-protected): fetch current `jobs.json` + SHA via GitHub API → merge → `PUT` back as a commit → Vercel redeploys.
4. Use Octokit; env `GITHUB_TOKEN`, `GITHUB_REPO`.

## Acceptance criteria
- [ ] Admin can add, edit, delete, and reorder job cards via GUI.
- [ ] Save writes valid JSON matching the `JobRecord` schema back to the repo.
- [ ] Live site reflects changes after redeploy.
- [ ] Endpoint rejects unauthenticated requests (401).
- [ ] Server-side validation prevents corrupt JSON commits.

## Nuances & considerations
- **Accent color mapping:** `Jobs.tsx` derives each job's color from a hardcoded `accentColors` map keyed by `company` (not stored in JSON). Decide whether the admin GUI should:
  - (a) add a `color`/accent field to `jobs.json` and migrate `accentColors` into the data, or
  - (b) leave color in code and just document that new companies need a code change.
  Recommend (a) so admin CRUD is fully self-service. Coordinate with CARD-003 if the carousel is being redone.
- `logo_url` points into `public/logos/` — uploading new logos means committing image files too (out of scope unless a file-upload flow is added). For now, admin supplies a path to an existing logo.
- Same GitHub SHA / redeploy-lag caveats as CARD-014.

## Files likely touched
- New: `api/admin/jobs.ts`
- New: admin jobs UI under `/admin`
- Contract ref: `src/sections/Jobs.tsx` (`JobRecord`, `accentColors`), `public/data/jobs.json`
