# CARD-016 — Admin CRUD: Other Text-Based Components (GUI)

**Status:** 🟡 Requirements TBD — scope of "other text components" undefined

> ⚠️ **Requirements still being determined.** "Other text-based components" is open-ended. Enumerate exactly which text is editable before building. Depends on [CARD-013](013-admin-login.md).

## Summary
Admin GUI to edit other text-based content on the site (beyond projects/jobs) — e.g. About Me prose, involvement list, hero/typewriter strings, contact info.

## Open questions (resolve first)
- **Which text blocks** are in scope? Candidates from the code:
  - About Me paragraphs (`About.tsx` — currently hardcoded, duplicated mobile/desktop)
  - Name block bullets, Involvement list, Location (`About.tsx`)
  - Hero typewriter lines (`useTypewriter.ts` / `Hero.tsx`)
  - Contact links (`Contact.tsx`)
- **Data model:** introduce a `public/data/content.json` (or per-section files) that these components fetch at runtime — mirroring the projects/jobs migration — so the admin GUI can edit them the same way.

## Instructions (provisional)
1. Decide the editable set and design a `content.json` schema for it.
2. Migrate the chosen hardcoded strings out of components into `content.json`, fetched at runtime (same pattern as `Projects`/`Jobs`).
3. Build an admin editor (forms / rich-ish text) for those fields.
4. `POST /api/admin/content` (JWT-protected) → GitHub API commit → Vercel redeploy (same flow as CARD-014/015).

## Acceptance criteria (draft)
- [ ] Editable text set enumerated and approved.
- [ ] Chosen strings migrated to a fetched data file (no longer hardcoded).
- [ ] Admin can edit and save those strings via GUI; changes persist via GitHub commit.
- [ ] Endpoint auth-protected; server-side validation.
- [ ] Mobile/desktop duplicate copies (e.g. About) unified to a single source so edits apply everywhere.

## Nuances & considerations
- About Me currently stores the same prose twice (mobile vs desktop `<p>`). Migration should collapse to one source of truth (also see CARD-010).
- Biggest cost is the data-migration groundwork, not the GUI — sequence this after projects/jobs CRUD are proven.
- Keep FOSS constraint; if a rich text editor is added, pick a FOSS one and sanitize output.

## Files likely touched
- New: `public/data/content.json`, `api/admin/content.ts`, admin content UI
- `src/sections/About.tsx`, `src/sections/Hero.tsx`, `src/sections/Contact.tsx`, `src/hooks/useTypewriter.ts`
