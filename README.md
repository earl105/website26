# Dylan Earl — Portfolio

Personal portfolio site: [dylanearl.vercel.app](https://dylanearl.vercel.app)

A single-page site built around a 3D animated hero, a VS Code–style "file explorer" for work experience, and a coverflow-style project carousel.

## Stack

- **Vite 7 + React 19 + TypeScript**, compiled with SWC
- **Tailwind CSS 4**
- **three.js** (`@react-three/fiber` + `@react-three/drei`) for the animated 3D laptop hero
- **framer-motion** + **gsap** for scroll/interaction animation
- **Vercel** — hosting, serverless functions, analytics

## Notable bits

- **3D laptop hero** — an interactive three.js scene rendered via `@react-three/fiber`.
- **Jobs as a file explorer** — the work-experience section is styled like a VS Code file tree/editor rather than a typical card list.
- **Content as data** — job and project content lives in `public/data/jobs.json` / `public/data/projects.json`, fetched at runtime rather than hardcoded in components.

## Local development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build       # tsc -b && vite build
npm run lint         # eslint .
npm run test         # vitest run
```
