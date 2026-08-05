# CARD-021 — Reconsider AI-Crawler Block in `robots.txt`

**Status:** 🟡 Requirements TBD — needs a decision before building

## Summary
`public/robots.txt` explicitly blocks AI/scraper bots (`GPTBot`, `CCBot`, and others) while allowing general crawlers. This may be an intentional privacy/content-protection choice, but it also means AI-assisted search and recruiting tools (which increasingly summarize or surface personal sites for recruiters) can't index the site. Needs a deliberate decision, not a default carried over from a template.

## Open questions (resolve before building)
- Was the AI-crawler block intentional (e.g. concerns about the resume/bio content or headshot being scraped/reused), or a leftover default?
    - this was intentional - i want to block all scrapers and AI usage
- Is the goal to maximize discoverability by recruiters (who may use AI search tools) or to minimize any scraping of personal content/likeness?
    - minimize scraping
- Should the block be all-or-nothing, or should some bots be allowed (e.g. allow crawlers tied to search-adjacent recruiting tools) while blocking bulk scrapers?
    -minimize as much scraping as possible

## Instructions (once decided)
1. If opening up: remove or scope down the `Disallow` rules for the specific bot user-agents in `public/robots.txt`.
2. If keeping the block: leave as-is, but note the rationale in a comment in the file (or here) so a future pass doesn't "fix" it without context.
3. Re-verify `public/sitemap.xml` still just lists the root URL (correct for a single anchor-based SPA) — no change expected there.

## Acceptance criteria (draft)
- [ ] Decision recorded (keep block / open up / partial) with rationale.
- [ ] `public/robots.txt` reflects the decision.
- [ ] If a headshot/likeness concern drove the original block, confirm that concern is independently addressed (e.g. image not otherwise trivially scrapable) before opening the file up.

## Nuances & considerations
- This is a values/tradeoff call (privacy vs. discoverability), not a technical one — the fix itself is a one-line edit either way.
- Low risk either direction; the main cost of getting it wrong is either reduced discoverability or unwanted scraping, neither of which is severe for a personal portfolio.

## Files likely touched
- `public/robots.txt`
