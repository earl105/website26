# Task Cards — Portfolio Website26

One card (`.md` file) per task, derived from [`TODO.md`](../../TODO.md) and cross-referenced with [`features.md`](../../features.md). Each card has a stable ID (`CARD-0XX`) matching its filename prefix.

## How to read a card
- **Status flag** — `🟢 Ready`, `🟡 Requirements TBD`, or `🔵 Partially implemented`
- **Summary / Instructions / Acceptance criteria / Nuances & considerations / Files likely touched**

## Global constraints (apply to every card)
- **All implementation must be FOSS** — free, non-deprecated, open source. No cloud databases. No external services beyond what's already in use (Vercel, GitHub API, Gmail SMTP).
- **Design language:** dark-mode only, alternating section colors. Avoid distracting add-ins (cursor-following spotlights, interactive backgrounds).
- **Data layer:** Already migrated to `public/data/projects.json` and `public/data/jobs.json` (fetched at runtime).

## Index

### Animations
- **CARD-001** — [`001-anim-project-carousel-slide.md`](001-anim-project-carousel-slide.md) — 🟢 implemented (framer-motion slide/fade)
- **CARD-002** — [`002-anim-job-carousel.md`](002-anim-job-carousel.md) — 🟢 completed (superseded by CARD-003 cross-fade)

### Changes
- **CARD-003** — [`003-job-carousel-redo.md`](003-job-carousel-redo.md) — 🟢 reworked into VS Code file-explorer experience section
- **CARD-004** — [`004-project-card-click-behavior.md`](004-project-card-click-behavior.md) — 🔵 conditional/override click behavior
- **CARD-005** — [`005-skeleton-loaders.md`](005-skeleton-loaders.md) — 🟢 skeleton loaders while data fetches
- **CARD-006** — [`006-liquid-glass-transparency.md`](006-liquid-glass-transparency.md) — 🟢 implement proper liquid glass (current impl insufficient)
- **CARD-007** — [`007-backgrounds.md`](007-backgrounds.md) — 🟡 section backgrounds (direction TBD)
- **CARD-008** — [`008-laptop-scaling-desktop.md`](008-laptop-scaling-desktop.md) — 🟢 laptop appears too small on desktop
- **CARD-009** — [`009-job-carousel-vertical-centering.md`](009-job-carousel-vertical-centering.md) — 🟢 vertically center jobs carousel
- **CARD-010** — [`010-content-update-fourth-year.md`](010-content-update-fourth-year.md) — 🟢 update "third-year" → "fourth-year"
- **CARD-011** — [`011-about-remove-arduino-callout.md`](011-about-remove-arduino-callout.md) — 🟢 remove Arduino IDE text mention (keep icon)
- **CARD-012** — [`012-add-tech-icons.md`](012-add-tech-icons.md) — 🟢 add Claude Code, Playwright, pnpm, Jest, just icons

### New features (Phase 2 — backend/admin)
- **CARD-013** — [`013-admin-login.md`](013-admin-login.md) — 🟢 admin login button + JWT auth
- **CARD-014** — [`014-admin-crud-projects.md`](014-admin-crud-projects.md) — 🟢 admin CRUD for project cards
- **CARD-015** — [`015-admin-crud-jobs.md`](015-admin-crud-jobs.md) — 🟢 admin CRUD for job cards
- **CARD-016** — [`016-admin-crud-text-components.md`](016-admin-crud-text-components.md) — 🟡 admin CRUD for other text components

### Less important (do last)
- **CARD-017** — [`017-data-logging.md`](017-data-logging.md) — 🟡 traffic + failure logging and dashboard
