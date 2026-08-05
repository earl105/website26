# Portfolio Features

> All features must use free, non-deprecated, open source software.
> No cloud databases. No external services beyond what's already in use.
> No contact form — `mailto:`/`tel:` links only. This is a deliberate design choice, not a gap.

---

## 🛠️ Tech Stack

- **Vite 7 + React 19 + TypeScript**, compiled with SWC
- **Tailwind CSS 4**
- **three.js** (`@react-three/fiber` + `@react-three/drei`) — animated 3D laptop hero
- **framer-motion** + **gsap** — scroll/interaction animation
- **Vercel** — hosting + serverless functions

### Data Layer
Job and project content lives in `public/data/jobs.json` / `public/data/projects.json`, fetched at runtime (`useEffect` + `useState`) rather than hardcoded as TS constants. Keeps content separate from component code and enables the skeleton-loader states below.

`public/data/jobs.json` fields: `id`, `company`, `role`, `start_date`, `end_date`, `summary`, `icon`, `color`, `file`, `bullets[]`, `logo_url`, `category`, `sort_order`

`public/data/projects.json` fields: `id`, `title`, `description`, `tags[]`, `github_url`, `demo_url`, `screenshot_url`, `clickable`, `clickable_override`, `sort_order`

---

## 📊 Logging

**Current:** Vercel built-in — function logs, deployment logs, and error traces in the Vercel dashboard. No custom logging built; sufficient for a portfolio's traffic level.

**If ever needed:** Vercel Analytics free tier (`@vercel/analytics`, already installed) is the next step before reaching for anything self-hosted (Umami/Plausible) or repo-committed (`logs/traffic.json` via GitHub API, batched). See [`ai/cards/done/017-data-logging.md`](ai/cards/done/017-data-logging.md).

---

## ✅ Implemented

- **3D laptop hero** — interactive three.js scene via `@react-three/fiber`; screen opens/closes on scroll
- **Typewriter effect** on the terminal (Home)
- **Jobs as a file explorer** — VS Code–style file tree/editor rather than a card carousel (superseded an earlier vertical-carousel approach)
- **Project carousel** — 3D coverflow-style stage (framer-motion: position/scale/rotateY/blur per card), slide/fade transitions between cards
- **Screenshot thumbnails** — rendered when `screenshot_url` is set; card layout adapts when it's `null`
- **Clickable project cards** — linked only when a valid `github_url`/`demo_url` exists, with a per-project `clickable_override` to force-disable
- **Tag chips** — each project's `tags[]` rendered as pills on the card (informational; no filter/sort UI — see Not implemented)
- **Skeleton loaders** — shimmer placeholders (`JobsSkeleton`, `ProjectCardSkeleton`) while data fetches
- **Liquid glass / transparency** — `backdrop-filter` blur + saturation + layered highlight/shadow, centralized in `src/index.css` (`.glass-surface`, `-soft`, `-strong`)
- **Background** — single global subtle gradient + hairline texture + vignette (`src/components/Background.tsx`); simpler than the originally considered spotlight/particle/per-section options
- **Tech marquee** — auto-scrolling icon row (`TechCarousel`) on About; single row, not yet grouped by category
- **Smooth scroll + active nav highlighting**
- **Clickable `mailto:`/`tel:` links** (Contact) — no form, by design
- **SEO metadata** — meta description, OG/Twitter card tags, canonical link, generated preview image ([CARD-020](ai/cards/done/020-seo-metadata.md))

## 🚧 Not implemented (still open)

- **Filter/sort projects by tag** — tags display as chips but there's no pill-based multi-select filter above the carousel yet
- **Global scroll-reveal animations** — no `IntersectionObserver`/`whileInView` fade-in/slide-up pass exists across sections (the one `IntersectionObserver` in the codebase is scoped to the Jobs file-switch hint tooltip, not a general scroll-reveal system)
- **Tech icons grouped by category** — currently one flat marquee row; not split into labeled language/framework/tool rows
- **Section backgrounds beyond the current global gradient** — see [`ai/cards/discarded/007-backgrounds.md`](ai/cards/discarded/007-backgrounds.md) (superseded by the simpler global `Background` component actually shipped)
- **Accessibility: keyboard nav + `prefers-reduced-motion`** — see [`ai/cards/ready/023-accessibility-reduced-motion.md`](ai/cards/ready/023-accessibility-reduced-motion.md)
- **Automated tests** — none exist yet; see [`ai/cards/ready/022-tests-data-driven-sections.md`](ai/cards/ready/022-tests-data-driven-sections.md)
