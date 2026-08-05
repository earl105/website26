# CARD-024 — Write a Real README

**Status:** ✅ Done

## Progress (2026-08-05)
Replaced the default Vite/ESLint boilerplate with a real README: live site link (`dylanearl.vercel.app`), stack summary, callouts for the 3D laptop hero and file-explorer-style Jobs section, and local dev instructions.

**Revised same day:** kept the README focused on public-facing features only — no mention of any internal tooling.

**Follow-ups not done:** no screenshot/GIF added (optional per the card) — could add later once a stable hero shot/recording exists.

## Summary
`README.md` is still the default Vite template ("React + TypeScript + Vite" boilerplate about ESLint config). For a portfolio repo that recruiters or technical interviewers may click into, the README is itself a mini case study of the work — worth replacing with something that actually describes the project.

## Current state
`README.md` at repo root, unmodified Vite scaffold content.

## Instructions
1. Replace `README.md` content with:
   - A one-paragraph description of the site (personal portfolio, who it's for).
   - A link to the live deployed site.
   - A screenshot or short GIF of the hero/site (optional but high-impact).
   - Stack summary (Vite, React 19, TypeScript, Tailwind 4, three.js/r3f, Vercel).
   - Notable public-facing technical bits worth calling out: the 3D laptop hero, the file-explorer-style Jobs section.
   - Local dev instructions (`npm install`, `npm run dev`, `npm run build`).
2. Keep it scannable — headers, short paragraphs/bullets, not a wall of text.
3. Keep the scope to public-facing features only — no internal tooling call-outs.

## Acceptance criteria
- [x] `README.md` no longer contains default Vite/ESLint boilerplate text.
- [x] Includes live site link, stack summary, and at least one notable-feature callout.
- [x] Local dev setup instructions are accurate (verified by actually running them).
- [x] No mention of internal tooling in the public README.

## Nuances & considerations
- Low risk, no code changes — purely documentation.
- Worth revisiting whenever a major public-facing feature ships, so the README doesn't go stale the way the original template did.

## Files likely touched
- `README.md` (primary)
