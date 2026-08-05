# CARD-023 — Accessibility Pass: Keyboard Nav + `prefers-reduced-motion`

**Status:** 🟢 Ready to build, not started

## Summary
Alt text and aria coverage on the site is reasonably good already (12 `alt=`, 35 `aria-` usages, decorative SVGs correctly `aria-hidden`). The gap is around the animation-heavy interactive elements: the three.js/r3f laptop scene, the coverflow-style project carousel, and the animated "Hire me" speech bubble on Contact. Verify keyboard operability and add a `prefers-reduced-motion` fallback so users sensitive to motion (parallax/3D, especially) aren't forced through the full animation set.

## Current state
- `src/components/LaptopScene.tsx` / `LaptopModel` — 3D hero element, animation-driven.
- `src/sections/Projects.tsx` — coverflow-style card carousel using framer-motion.
- `src/sections/Contact.tsx` — animated speech bubble.
- gsap/framer-motion used across sections for scroll-triggered and hover animations. No `prefers-reduced-motion` media query handling observed.

## Instructions
1. Audit keyboard navigation: can a user tab to and operate the project carousel (advance/select cards) and any interactive laptop-scene controls without a mouse? Fix missing `tabIndex`/`onKeyDown` handlers or focus-visible styles where needed.
2. Check focus states on the "Hire me" speech bubble and other hover/click-triggered animated elements — ensure focus is visible and doesn't get trapped or lost.
3. Add a `prefers-reduced-motion: reduce` media query (via CSS and/or a shared `useReducedMotion` hook wrapping framer-motion's built-in `useReducedMotion`) that:
   - Disables or shortens non-essential animations (parallax, bounce, speech bubble entrance).
   - For the 3D laptop scene, consider freezing to a static pose or a much-reduced animation rather than fully removing it (since it's the hero centerpiece).
4. Spot-check with a screen reader (VoiceOver/NVDA) on the carousel and Contact section for sane read order.

## Acceptance criteria
- [ ] Project carousel is fully keyboard-operable (tab + enter/arrow keys as appropriate).
- [ ] All interactive elements have visible focus states.
- [ ] `prefers-reduced-motion: reduce` measurably reduces animation across laptop scene, carousel, and speech bubble — verified by toggling the OS/browser setting.
- [ ] No regression to existing animations for users without the reduced-motion preference set.

## Nuances & considerations
- Don't strip the 3D laptop scene entirely under reduced motion — it's the hero's main visual identity; aim for a calmer static/near-static version rather than removing it.
- framer-motion has a built-in `useReducedMotion()` hook — prefer it over hand-rolling media query detection where framer-motion is already used.
- Global design constraint (per `ai/cards/00-README.md`): dark-mode only, avoid distracting add-ins — reduced-motion versions should still respect that aesthetic, not look broken/empty.

## Files likely touched
- `src/components/LaptopScene.tsx`, `src/components/LaptopModel.tsx`
- `src/sections/Projects.tsx`, `src/sections/Contact.tsx`
- `src/index.css` (media query), possibly a new `src/hooks/useReducedMotion.ts`
