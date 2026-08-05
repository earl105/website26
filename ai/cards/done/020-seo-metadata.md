# CARD-020 — SEO Metadata (Meta Description, Open Graph, Twitter Card, Canonical)

**Status:** ✅ Done

## Progress (2026-08-05)
Added meta description, OG (`og:type`/`og:url`/`og:title`/`og:description`/`og:image`), Twitter Card (`summary_large_image` + title/description/image), and a canonical link to `index.html`, all pointing at `https://dylanearl.vercel.app/`.

First pass generated `public/og-image.jpg` as a centered crop of the headshot photo. Replaced per feedback — didn't want a giant face on the preview card. Final version is `public/og-image.png` (1200×630): a branded card built from `og-image-source.svg` (kept in `public/` for future edits) — dark `#1e1e1e` background matching the site theme, the same "`</>`" bracket mark as `logo.svg` scaled up, "Dylan Earl" in white, "Software Developer" in the site's accent blue (`#3794ff`). Rasterized via macOS `sips` (no ImageMagick/PIL available in this environment). Verified `npm run build` succeeds and the image + meta tags land correctly in `dist/`.

**Follow-ups not done:** live verification with a link-preview tool (e.g. opengraph.xyz, Facebook Sharing Debugger) requires the change to be deployed — do that once this ships to production.

## Summary
`index.html` currently only has a `<title>` plus `charset`/`viewport` tags — no meta description, no Open Graph/Twitter card tags, no canonical link. Any link to the site shared on LinkedIn, Slack, or Twitter/X renders with no preview card, which matters for a portfolio meant to be shared with recruiters.

## Current state
`index.html` at repo root — bare `<title>Dylan Earl</title>`, no other SEO-relevant tags. `public/logo.svg` exists and can double as a base for a social preview image.

## Instructions
1. Add a concise `<meta name="description">` (1–2 sentences: who you are, what the site shows).
2. Add Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`.
3. Add Twitter Card tags: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
4. Add a `<link rel="canonical">` pointing at the production URL.
5. Create a dedicated social preview image (1200×630px recommended) — either a static export of the hero or a simple branded card — and reference it in `og:image`/`twitter:image`. Do not reuse `logo.svg` directly as the OG image (wrong aspect ratio for previews).
6. Verify with a link-preview debugger (e.g. paste the URL into Slack/Discord, or use a metadata-preview tool) once deployed.

## Acceptance criteria
- [x] `index.html` has meta description, OG tags, Twitter card tags, and canonical link.
- [x] A properly sized (1200×630) social preview image exists in `public/` and is referenced.
- [ ] Sharing the production URL in Slack/LinkedIn/Twitter renders a title, description, and image preview. _(needs verification post-deploy)_
- [x] No broken/relative image URLs — `og:image`/`twitter:image` use absolute URLs.

## Nuances & considerations
- This is a single-page app with anchor sections, not per-route pages — one shared meta set for the whole site is fine; no per-section OG tags needed.
- Keep the description accurate to current content (OSU CS&E student, CoverMyMeds intern, portfolio) — revisit if `jobs.json`/`about` content changes materially.
- Low effort, high value — no data model or backend changes required.

## Files likely touched
- `index.html` (primary)
- New: a social preview image under `public/` (e.g. `public/og-image.png`)
