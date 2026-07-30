# Task Cards — Portfolio Website26

One card (`.md` file) per task, derived from [`TODO.md`](../../TODO.md) and cross-referenced with [`features.md`](../../features.md). Each card has a stable ID (`CARD-0XX`) matching its filename prefix.

## Folder layout (status = directory)

Cards are filed into subdirectories by status, so status is visible from the folder — not just the card body. When a card's status changes, **move the file** to the matching folder (and update its `Status:` line, which stays the source of truth).

| Folder | Meaning |
| --- | --- |
| `done/` | 🟢 Implemented / completed |
| `in-progress/` | 🔵 Partially implemented — needs verify/finish |
| `ready/` | 🟢 Ready to build, not started |
| `tbd/` | 🟡 Requirements undefined — needs direction before building |
| `discarded/` | ⚫ Obsolete / superseded — kept for history |

## How to read a card
- **Status flag** — `🟢`, `🔵`, `🟡`, `⚫` (matches its folder)
- **Summary / Instructions / Acceptance criteria / Nuances & considerations / Files likely touched**

## Global constraints (apply to every card)
- **All implementation must be FOSS** — free, non-deprecated, open source. No cloud databases. No external services beyond what's already in use (Vercel, GitHub API, Gmail SMTP).
- **Design language:** dark-mode only, alternating section colors. Avoid distracting add-ins (cursor-following spotlights, interactive backgrounds).
- **Data layer:** Already migrated to `public/data/projects.json` and `public/data/jobs.json` (fetched at runtime).

## Index

### 🟢 Done — [`done/`](done/)
- **CARD-001** — [`001-anim-project-carousel-slide.md`](done/001-anim-project-carousel-slide.md) — framer-motion slide/fade for project carousel
- **CARD-002** — [`002-anim-job-carousel.md`](done/002-anim-job-carousel.md) — completed (superseded by CARD-003 cross-fade)
- **CARD-003** — [`003-job-carousel-redo.md`](done/003-job-carousel-redo.md) — reworked into VS Code file-explorer experience section
- **CARD-005** — [`005-skeleton-loaders.md`](done/005-skeleton-loaders.md) — shimmer skeletons for projects + jobs
- **CARD-008** — [`008-laptop-scaling-desktop.md`](done/008-laptop-scaling-desktop.md) — desktop FOV 65→60 enlarges laptop
- **CARD-010** — [`010-content-update-fourth-year.md`](done/010-content-update-fourth-year.md) — update "third-year" → "fourth-year"
- **CARD-011** — [`011-about-remove-arduino-callout.md`](done/011-about-remove-arduino-callout.md) — remove Arduino IDE text mention (keep icon)
- **CARD-012** — [`012-add-tech-icons.md`](done/012-add-tech-icons.md) — added Claude Code, Playwright, pnpm, Jest icons (just dropped — no brand mark)
- **CARD-013** — [`013-admin-login.md`](done/013-admin-login.md) — admin auth (scrypt + jose JWT httpOnly cookie), security-reviewed _(Phase 2)_
- **CARD-014** — [`014-admin-crud-projects.md`](done/014-admin-crud-projects.md) — admin CRUD for projects → GitHub commit _(Phase 2)_
- **CARD-015** — [`015-admin-crud-jobs.md`](done/015-admin-crud-jobs.md) — admin CRUD for jobs → GitHub commit; accent color migrated to JSON _(Phase 2)_

### 🔵 In progress — [`in-progress/`](in-progress/)
- **CARD-004** — [`004-project-card-click-behavior.md`](in-progress/004-project-card-click-behavior.md) — conditional/override click behavior (verify + finish)

### 🟢 Ready — [`ready/`](ready/)
- **CARD-006** — [`006-liquid-glass-transparency.md`](ready/006-liquid-glass-transparency.md) — implement proper liquid glass (current impl insufficient)

### 🟡 Requirements TBD — [`tbd/`](tbd/)
- **CARD-007** — [`007-backgrounds.md`](tbd/007-backgrounds.md) — section backgrounds (visual direction not chosen)
- **CARD-016** — [`016-admin-crud-text-components.md`](tbd/016-admin-crud-text-components.md) — admin CRUD for other text components (scope undefined)
- **CARD-017** — [`017-data-logging.md`](tbd/017-data-logging.md) — traffic + failure logging and dashboard (lowest priority)

### ⚫ Discarded — [`discarded/`](discarded/)
- **CARD-009** — [`009-job-carousel-vertical-centering.md`](discarded/009-job-carousel-vertical-centering.md) — obsolete; jobs is no longer a carousel (resolved by CARD-003)
