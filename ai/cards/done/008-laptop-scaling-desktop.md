# CARD-008 — Laptop Appears Too Small on Desktop

**Status:** 🟢 Implemented

## Summary
The 3D laptop model in the hero rendered too small on desktop. Enlarged its apparent size on desktop while leaving mobile unchanged.

## Implementation
- `src/components/LaptopScene.tsx`: lowered the **desktop camera FOV from 65 → 60** (mobile stays 80). A narrower FOV zooms the laptop in without moving any geometry, so the lid-rotation scroll animation and `ContactShadows` anchor stay intact.
- Updated the `useState` initial value to 60 to avoid a first-frame size flash.
- **Do NOT change the canvas container height** (`650px`). It was briefly set to `100%`, which changed the canvas aspect from portrait to square — that flattened the 3/4 view angle and disrupted the IntersectionObserver open/close tracking. Reverted.

## Clipping ceiling (important)
The canvas width equals the Hero card window (`min(480px, 90vw)`), so there's a hard zoom ceiling: below ~FOV 55 the diagonally-rotated laptop's corners run off the left/right edges. FOV 50 clipped for this reason. To go bigger without clipping you must widen the Hero card window in `Hero.tsx`, not zoom further.

## Acceptance criteria
- [x] Laptop is larger on desktop (≥768px) than the original FOV 65.
- [x] Mobile sizing unchanged (still FOV 80, canvas still 650px tall).
- [x] Open/close scroll animation + 3/4 view angle preserved (canvas aspect unchanged).
- [x] Contact shadow stays anchored (no geometry moved).
- [x] No performance regression (only a camera parameter changed).

## Nuances & considerations
- FOV chosen over model `scale` so the scroll-animation math and shadow anchoring stay untouched.
- **Needs a visual eyeball**: if corners still clip, raise FOV toward ~62; for a bigger laptop without clipping, widen the Hero card window instead of lowering FOV past ~55.

## Files likely touched
- `src/components/LaptopScene.tsx`
- `src/components/LaptopModel.tsx`
