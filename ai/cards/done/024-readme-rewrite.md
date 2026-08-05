# CARD-024 — Write a Real README

**Status:** ✅ Done

## Progress (2026-08-05)
Replaced the default Vite/ESLint boilerplate with a real README: live site link (`dylanearl.vercel.app`), stack summary, callouts for the 3D laptop hero and file-explorer-style Jobs section, and local dev instructions.

**Revised same day:** removed all explicit mentions of the admin CMS (`/admin`, `ADMIN_SETUP.md` link, admin auth deps, `vercel dev` instructions) per feedback — the admin backend should stay low-key, not called out in the public-facing README. `ADMIN_SETUP.md` still exists and documents it, just isn't linked from `README.md` anymore.

**Follow-ups not done:** no screenshot/GIF added (optional per the card) — could add later once a stable hero shot/recording exists.

## Summary
`README.md` is still the default Vite template ("React + TypeScript + Vite" boilerplate about ESLint config). For a portfolio repo that recruiters or technical interviewers may click into, the README is itself a mini case study of the work — worth replacing with something that actually describes the project.

## Current state
`README.md` at repo root, unmodified Vite scaffold content. `ADMIN_SETUP.md` already documents admin env setup separately and should stay a separate doc (linked from the new README, not merged in).

## Instructions
1. Replace `README.md` content with:
   - A one-paragraph description of the site (personal portfolio, who it's for).
   - A link to the live deployed site.
   - A screenshot or short GIF of the hero/site (optional but high-impact).
   - Stack summary (Vite, React 19, TypeScript, Tailwind 4, three.js/r3f, Vercel).
   - Notable technical bits worth calling out: the 3D laptop hero, the custom admin CMS that commits content edits straight to GitHub, the file-explorer-style Jobs section.
   - Local dev instructions (`npm install`, `npm run dev`, `npm run build`).
   - A link to `ADMIN_SETUP.md` for admin-specific setup rather than duplicating it.
2. Keep it scannable — headers, short paragraphs/bullets, not a wall of text.

## Acceptance criteria
- [x] `README.md` no longer contains default Vite/ESLint boilerplate text.
- [x] Includes live site link, stack summary, and at least one notable-feature callout.
- [x] Local dev setup instructions are accurate (verified by actually running them).
- [x] Links out to `ADMIN_SETUP.md` rather than duplicating its content.

## Nuances & considerations
- Low risk, no code changes — purely documentation.
- Worth revisiting whenever a major feature (e.g. CARD-016 admin content CRUD) ships, so the README doesn't go stale the way the original template did.

## Files likely touched
- `README.md` (primary)
