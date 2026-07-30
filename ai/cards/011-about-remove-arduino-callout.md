# CARD-011 — Remove Arduino IDE Callout in About (Keep Icon)

**Status:** 🟢 Ready (content fix)

## Summary
Remove the "Arduino IDE" mention from the About Me prose. Keep the Arduino icon in the tech carousel.

## Current state
`src/sections/About.tsx`, desktop paragraph: *"I am well-versed in software such as Git, Autodesk Inventor, Fusion 360, Onshape, and **the Arduino IDE**."* The Arduino icon is registered separately in `src/data/techIcons.tsx` (`{ id: 'arduino', name: 'Arduino IDE' }`).

## Instructions
1. In `src/sections/About.tsx`, remove "the Arduino IDE" from the software list, fixing the Oxford comma / conjunction so the sentence still reads correctly (e.g. "...Fusion 360, and Onshape.").
2. **Do NOT** remove the Arduino entry from `src/data/techIcons.tsx` — the icon stays in the carousel.

## Acceptance criteria
- [ ] About prose no longer mentions Arduino IDE.
- [ ] Sentence grammar (list conjunction/comma) is correct after removal.
- [ ] Arduino icon still appears in the tech carousel.

## Nuances & considerations
- Only the desktop `<p className="hidden md:block">` contains the software list; the mobile paragraph does not — verify before editing so you don't hunt for it in the mobile copy.

## Files likely touched
- `src/sections/About.tsx`
