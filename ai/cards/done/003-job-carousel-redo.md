# CARD-003 — Redo Job Carousel

**Status:** 🟢 Implemented

> ✅ **Direction set and built.** The vertical stacked-card carousel was replaced with a VS Code–style "file explorer" experience section. See Implementation below.

## Summary
Reworked the job section from a vertical stacked-card carousel (with up/down arrow pagination + a fullscreen morph modal) into a single **VS Code editor window**: a file-explorer sidebar of jobs on the left, and a detail pane on the right. Chosen because it reads as visually distinct from the horizontal Projects carousel while reinforcing the site's VS Code theme, and because all jobs fit one screen with no pagination.

## Implementation
- **Editor window:** one fixed-height glass panel with a title bar (traffic-light dots + `experience / <file>` breadcrumb). Height is `76vh` desktop / `86vh` mobile, capped at `620px`, so the section stays one screen and internal panes scroll instead of the section growing.
- **Explorer sidebar (desktop):** `experience/` folder tree; each job is a file (`covermymeds.tsx`, `lowes.md`, `gojo-purell.md`, `dicks-sporting.md`) with a role-type glyph tinted in the company accent color. Active file gets a left inset stripe + highlight.
- **Explorer (mobile):** the sidebar collapses to a horizontal, scrollable file-tab strip (folder header hidden); active tab uses an underline indicator. This frees vertical space so all bullets fit without scrolling.
- **Detail pane:** logo chip (accent bg), company, role, dates (mono), a one-line `// summary` in VS Code comment-green (`#6A9955`), then bullets with an accent `▹` marker. Switching files cross-fades via `framer-motion` `AnimatePresence`.

## Data changes
- `public/data/jobs.json` gained per-job `summary` (one-liner), `icon` (`code` | `cart` | `box` | `tag`), and `file` (explicit filename, e.g. `gojo-purell.md`).
- `Job` type in `Jobs.tsx` extended with `summary`, `icon`, `file`; `file` falls back to a derived slug if absent.

## Acceptance criteria
- [x] Redo direction documented and approved (Concept B — file explorer).
- [x] Preserves per-job data: company, role, date range, bullets, logo, accent color.
- [x] Respects equal-height section philosophy (fixed-height window, internal scroll).
- [x] Mobile-friendly: bullets readable without scrolling on typical phones.
- [x] Accessible: file buttons are keyboard-focusable with `aria-current` on the active file.
- [~] Old fullscreen/expand modal removed — no longer needed since all jobs are reachable in one view. (Supersedes the prior "fullscreen view still works" criterion.)

## Nuances & considerations
- Accent colors still hardcoded per company in `accentColors` (`Jobs.tsx`) — unchanged.
- Role glyphs live in `src/data/jobIcons.tsx` (Feather-style line icons).
- `JobCard.tsx` and `FullscreenJob.tsx` were deleted — the new layout doesn't use them.
- [CARD-002](002-anim-job-carousel.md) (job carousel animations) is completed/superseded — the pagination it targeted is gone; only the cross-fade remains.
- [CARD-009](../discarded/009-job-carousel-vertical-centering.md) ("too high" complaint) is addressed by the section now centering the window (`items-center justify-center`).

## Files touched
- `src/sections/Jobs.tsx` (rewritten)
- `src/data/jobIcons.tsx` (new)
- `public/data/jobs.json` (added `summary`, `icon`, `file`)
- `src/components/JobCard.tsx`, `src/components/FullscreenJob.tsx` (deleted)
