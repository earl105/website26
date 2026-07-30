# CARD-008 — Laptop Appears Too Small on Desktop

**Status:** 🟢 Ready

## Summary
The 3D laptop model in the hero renders too small on desktop/PC. Scale it up so it reads as a focal element on larger viewports.

## Instructions
1. In `src/components/LaptopScene.tsx` (and/or `LaptopModel.tsx`), inspect the model scale, camera position/FOV, and container sizing.
2. Increase apparent size on desktop — via a responsive `scale` on the model, camera distance, or container dimensions. Prefer a breakpoint-aware value so mobile is unaffected.
3. Verify the open/close-on-scroll animation still frames correctly at the new size (the scene drives a "close" animation based on visibility — see `ContactShadows` and the visibility tracking around line 48).

## Acceptance criteria
- [ ] Laptop is visibly larger / better-proportioned on desktop (≥768px, and especially wide screens).
- [ ] Mobile sizing unchanged (or intentionally adjusted, not regressed).
- [ ] Open/close scroll animation still frames the laptop without clipping.
- [ ] Contact shadow stays anchored under the laptop.
- [ ] No performance regression.

## Nuances & considerations
- `LaptopScene` uses `@react-three/fiber` + `drei`. Scaling can be done on the model `scale`, camera, or CSS container — pick the one that keeps the scroll animation math intact.
- Watch aspect ratio across ultrawide vs. laptop screens; test a few widths.
- Keep it responsive — don't hardcode a size that breaks mobile.

## Files likely touched
- `src/components/LaptopScene.tsx`
- `src/components/LaptopModel.tsx`
