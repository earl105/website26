# CARD-010 — Update "third-year" → "fourth-year"

**Status:** 🟢 Implemented

## Summary
Update the About copy from "third-year student" to "fourth-year student" (and any other year references that are now stale).

## Current state
`src/sections/About.tsx` has the phrase in TWO places (mobile `<p className="block md:hidden">` and desktop `<p className="hidden md:block">`), both reading: *"As a third-year student at The Ohio State University..."*

## Instructions
1. In `src/sections/About.tsx`, change "third-year" → "fourth-year" in **both** the mobile and desktop paragraph copies.
2. Sanity-check other date/year statements while there:
   - "Summer 2026 internship at CoverMyMeds" — still accurate?
   - "post-graduation job opportunities beginning Summer 2027" — still accurate?
3. Grep the repo for other "third" / year references (e.g. any meta/SEO copy) to catch duplicates.

## Acceptance criteria
- [ ] Both About paragraphs say "fourth-year".
- [ ] No remaining "third-year" anywhere in the codebase.
- [ ] Related year claims verified consistent.

## Nuances & considerations
- The mobile and desktop copies are separate strings — easy to update one and miss the other.
- Consider whether this belongs in `public/data/*.json` later so it's editable without a code change, rather than hardcoded.

## Files likely touched
- `src/sections/About.tsx`
