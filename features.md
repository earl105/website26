# Portfolio Features Roadmap

> All features must use free, non-deprecated, open source software.
> No cloud databases. No external services beyond what's already in use.

---

## 🛠️ Confirmed Tech Stack

### Frontend (existing — no changes)
- React + TypeScript + Tailwind CSS
- Deployed on Vercel

### Data Layer
- **Currently:** `const projects: Project[] = [...]` and `const jobs: Job[] = [...]` as TypeScript constants in source files
- **Migration target:** Two JSON files — `public/data/projects.json` and `public/data/jobs.json`
- **Why JSON over YAML:** Native to TypeScript/React (`fetch('/data/projects.json')` just works), no parser dependency, easiest for the GitHub API write layer to manipulate programmatically, and trivially typed with your existing `Project[]` / `Job[]` interfaces
- Frontend fetches these at runtime → enables skeleton loaders and keeps data separate from code

### Backend (Phase 2 — Vercel Serverless Functions)
- `/api` folder in existing repo — Vercel auto-deploys, no new hosting
- **GitHub API (Octokit)** — admin writes updated JSON files back to the repo as commits → Vercel auto-redeploys (~30–60s lag)
- **JWT in httpOnly cookie** — admin auth, no external auth service
- **Nodemailer + Gmail SMTP** — contact form email sending

### Environment variables needed (`.env`) — Phase 2
```
GITHUB_TOKEN=           # Personal access token (repo scope only)
GITHUB_REPO=            # e.g. "dylanearl/portfolio"
ADMIN_PASSWORD_HASH=    # bcrypt hash of admin password
JWT_SECRET=             # random secret string
GMAIL_USER=             # Gmail address
GMAIL_APP_PASSWORD=     # Gmail app password (not your real password)
```

### JSON Schema

`public/data/projects.json`
```json
[
  {
    "id": 1,
    "title": "Java Tag Cloud Generator",
    "description": "Developed a Java Tag Cloud Generator...",
    "tags": ["Java", "HTML", "CSS"],
    "github_url": "https://github.com/...",
    "demo_url": null,
    "screenshot_url": null,
    "clickable": true,
    "clickable_override": false,
    "sort_order": 0
  }
]
```

`public/data/jobs.json`
```json
[
  {
    "id": 1,
    "company": "CoverMyMeds",
    "role": "Technology Intern",
    "start_date": "June 2026",
    "end_date": "August 2026",
    "bullets": [
      "Supporting analysis, design, documentation...",
      "Collaborating with cross-functional engineers..."
    ],
    "logo_url": "/logos/covermymeds.png",
    "sort_order": 0
  }
]
```

---

## 📊 Logging Plan

### Primary: Vercel Built-in (deferred, free, already available)
- Function logs, deployment logs, and error traces visible in the Vercel dashboard
- Sufficient for a portfolio — no setup required

### Backup Plan (if Vercel logs become insufficient)
If traffic visibility or persistent error tracking becomes a priority later, the lightest option that maintains the no-cloud-service constraint:

- **Option A — Append to `logs/traffic.json` in repo via GitHub API**
  - Batch writes (e.g. flush every N visits or on a schedule via Vercel Cron)
  - Not per-request (too many commits); works for low-traffic portfolio use
  - Log file lives in the repo, fully owned, no external service

- **Option B — Vercel Analytics** (free tier)
  - One `npm install @vercel/analytics` and a single component wrapper
  - Page views, referrers, countries — no cookies, GDPR-friendly
  - Stays within the Vercel ecosystem, no new account

- **Option C — Plausible / Umami self-hosted**
  - Umami is open source and can be self-hosted on a free tier (Railway, Render)
  - Only viable if a backend is already being deployed for another reason
  - Revisit if/when admin backend is live

---

## 🗺️ Implementation Phases

### Phase 1 — Frontend (current focus)
Pure frontend work. No backend required. Implement in this order:

1. **Data migration** — move TS constants → `projects.json` + `jobs.json`, update fetch logic, add TypeScript interfaces
2. **Liquid glass / transparency** — foundational visual layer; affects cards, nav, modals globally
3. **Backgrounds** — texture, spotlight/vignette, or interactive; set the tone for everything else
4. **Skeleton loaders** — now that data is fetched at runtime, skeletons fill the gap
5. **Carousel UI/UX revamp** — redesign cards, controls, dot indicators, mobile swipe
6. **Slide-in / fade-out carousel animations** — layer on after revamp is stable
7. **Screenshot thumbnails + clickable cards** — conditional display and link behavior
8. **Filter / sort by tech stack tags** — tag pills, multi-select, animated transitions
9. **Fade-in / slide-up scroll animations** — global pass across all sections
10. **Group tech icons by category** — three labeled rows on About page

### Phase 2 — Backend + Admin
Implement after Phase 1 is complete and deployed:

1. **Vercel Serverless Functions setup** — `/api` scaffolding, shared middleware
2. **Admin login** — `/admin` route, JWT auth, password hash in `.env`
3. **Contact form** — `/api/contact`, Nodemailer + Gmail SMTP
4. **Admin CRUD: Projects** — GUI + GitHub API commit flow
5. **Admin CRUD: Jobs** — GUI + GitHub API commit flow
6. **Logging** — revisit based on need at that point

---

## 🎨 Phase 1 Feature Details

### 1. Data Migration (prerequisite for skeletons + admin)
- Move `const projects: Project[] = [...]` → `public/data/projects.json`
- Move `const jobs: Job[] = [...]` → `public/data/jobs.json`
- Update components to `fetch('/data/projects.json')` with `useEffect` + `useState`
- Keep existing TypeScript interfaces — just remove the `const` declarations

### 2. Liquid Glass / Transparency
- `backdrop-filter: blur(12px)` + `bg-white/5` or `bg-black/30` on cards, nav, modals
- Subtle inner border: `border border-white/10`
- Layered depth via stacked semi-transparent panels
- Maintain accessible contrast ratios (check with browser devtools)

### 3. Backgrounds
Choose one or combine — implement as a global `<Background />` component:
- **Texture overlay** — SVG noise filter or CSS `background-image` dot/grid pattern
- **Spotlight / Vignette** — `mousemove` listener → CSS `radial-gradient` follows cursor
- **Particle field** — lightweight `<canvas>` element, cursor-reactive dots/lines
- **Per-section** — each section div gets its own subtle `background` variant

### 4. Skeleton Loaders
- Pure CSS shimmer animation (`@keyframes shimmer` with gradient sweep)
- `<ProjectCardSkeleton />` and `<JobCardSkeleton />` components matching card dimensions
- Show while `loading === true`, swap for real content on resolve

### 5. Carousel UI/UX Revamp
- Card redesign: gradient top border (unique color per card), tilt on hover (`transform: perspective rotateX/Y` on `mousemove`), deeper shadow
- Controls: larger/cleaner arrow buttons, dot indicator row below cards, keyboard arrow support
- Mobile: swipe gesture support via `touchstart` / `touchend` delta

### 6. Slide-in / Fade-out Carousel Animations
- Track `direction` (left | right) and `animating` state
- Outgoing card: `translateX` + `opacity: 0` in exit direction
- Incoming card: enters from opposite side, settles to center
- CSS `transition` handles easing — no animation library needed

### 7. Screenshot Thumbnails + Clickable Cards
- If `screenshot_url !== null`: render `<img>` at top of card with `object-cover` aspect ratio
- If null: card renders as normal, no empty image container
- If `clickable === true && clickable_override === false && (github_url || demo_url)`: wrap card in `<a>` with hover lift + glow
- Otherwise: plain `<div>`, `cursor-default`, no hover affordance

### 8. Filter / Sort by Tech Stack Tags
- Collect all unique tags from loaded projects
- Render as pill buttons above carousel; selected pills highlight
- Filter logic: `projects.filter(p => selectedTags.length === 0 || p.tags.some(t => selectedTags.includes(t)))`
- On filter change, animate card list transition (fade + slight translate)

### 9. Fade-in / Slide-up Scroll Animations
- `IntersectionObserver` watching elements with a `data-animate` attribute
- On intersection: add class that transitions `opacity: 0 → 1` and `translateY(20px) → 0`
- Stagger delay for groups of cards via CSS `transition-delay`
- One global hook: `useScrollAnimation()` applied once at the app level

### 10. Group Tech Icons by Category
- Define three arrays: `languages[]`, `frameworks[]`, `tools[]`
- Render three separate auto-scrolling marquee rows, each with a small label
- Existing marquee component reused — just called three times with different data

---

## 🔐 Phase 2 Feature Details

### Admin Login
- `/admin` React route, guarded client-side
- `POST /api/admin/login` → validates against `ADMIN_PASSWORD_HASH` env var (bcrypt)
- Returns JWT in httpOnly `Set-Cookie` header
- Middleware on all `/api/admin/*` routes verifies cookie

### Contact Form (Nodemailer + Gmail SMTP)
- Fields: Name, Email, Message
- `POST /api/contact` → Nodemailer sends to your Gmail
- In-memory rate limiter (per IP, sliding window) in the serverless function
- Inline success/error state in the UI

### Admin CRUD Flow
```
Admin saves changes in GUI
  → POST /api/admin/projects or /api/admin/jobs
    → JWT validated
    → Fetch current JSON from repo via GitHub API (get file SHA + content)
    → Merge/replace with new data
    → PUT updated JSON back via GitHub API (creates a commit)
      → Vercel detects push → redeploys in ~30–60s
        → Live site updated
```

### Admin: CRUD Projects GUI
- Form fields: title, description, tags (add/remove chips), screenshot URL, GitHub URL, demo URL, clickable toggle, override toggle
- Drag-to-reorder list (updates `sort_order`)
- Delete with confirmation

### Admin: CRUD Jobs GUI
- Form fields: company, role, start/end date, bullets (add/remove lines), logo URL
- Drag-to-reorder list
- Delete with confirmation

---

## ✅ Already Implemented (Reference)

- Typewriter effect on terminal (Home)
- Laptop screen opens/closes on scroll
- Auto-scrolling tech icon marquee (About)
- Clickable `mailto:` and `tel:` links (Contact)
- Smooth scroll + active nav section highlighting
