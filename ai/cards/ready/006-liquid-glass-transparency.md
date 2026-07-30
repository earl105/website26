# CARD-006 — Liquid Glass / Transparency

**Status:** 🟢 Ready

> **Note:** The current glass implementation is NOT good enough yet. The existing `.glass-surface`, `.glass-surface-strong`, and `.glass-surface-soft` classes in `src/index.css` are a rough starting point only — treat this as a real implementation task, not a tweak.

## Summary
Implement a proper, polished "liquid glass" / frosted-transparency treatment across cards, nav, and modals that visibly elevates the site's look.

## Current state
`src/index.css` defines `.glass-surface`, `.glass-surface-strong`, `.glass-surface-soft` (used widely across `Projects`, `Jobs`, `About`, loaders). These exist but the effect is insufficient — redo/upgrade them centrally so every consumer improves at once.

## Instructions
1. Redesign the three glass utility classes centrally in `src/index.css` so all existing consumers inherit the upgrade.
2. Target a convincing frosted-glass look:
   - `backdrop-filter: blur(...)` + `saturate(...)` over a low-alpha fill (`bg-white/5` / `bg-black/30` equivalents)
   - Subtle 1px inner border (`border-white/10`) and a soft highlight edge (top/left light, bottom/right shadow) for depth
   - Layered translucency — consider stacked pseudo-elements or gradients to read as real glass, not a flat tint
3. Ensure a graceful fallback where `backdrop-filter` is unsupported (opaque-ish fill).
4. Verify against the site's backgrounds (see CARD-007) — glass only reads as glass over texture/gradient behind it.

## Acceptance criteria
- [ ] Glass surfaces have real depth (blur + saturation + edge highlight/shadow), not a flat semi-transparent box.
- [ ] Text on glass meets accessible contrast (check WCAG AA with devtools).
- [ ] `.glass-surface` / `-strong` / `-soft` remain the single source of truth — no per-component one-offs.
- [ ] Fallback renders acceptably where `backdrop-filter` is unsupported.
- [ ] Works in dark mode (the only mode) and doesn't wash out over dark backgrounds.

## Nuances & considerations
- `backdrop-filter` blur is GPU-cost heavy on mobile, especially stacked over the `LaptopScene` R3F canvas — profile on a real phone; the laptop/hero is already animation-heavy.
- Effect depends on what's behind it; coordinate with CARD-007 (backgrounds) so glass has texture to refract.
- Safari needs `-webkit-backdrop-filter`.

## Files likely touched
- `src/index.css` (primary)
- Spot-check consumers: `Projects.tsx`, `Jobs.tsx`, `About.tsx`, `Navbar.tsx`, `FullscreenJob.tsx`

## Possible example:

```import React from "react";

/**
 * GlassPanel
 * -----------
 * A reusable "liquid glass" surface for React + TypeScript + Tailwind.
 *
 * Tier 1 (default): backdrop-filter blur/saturate + translucent fill +
 * light border + soft shadow. Cheap, works everywhere, good for 90% of
 * cases (toolbars, modals, cards, nav bars).
 *
 * Tier 2 (optional): pass `refraction` to also apply an SVG displacement
 * filter for actual edge-warping "liquid" distortion. Heavier on the GPU,
 * so reserve it for a small number of high-value elements.
 *
 * Usage:
 *   <GlassPanel className="p-6 max-w-sm">
 *     <p>Your content</p>
 *   </GlassPanel>
 *
 *   <GlassPanel refraction intensity="strong" as="nav" className="p-3">
 *     ...toolbar content...
 *   </GlassPanel>
 */

type Intensity = "subtle" | "medium" | "strong";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a different element (e.g. "nav", "section", "button"). */
  as?: React.ElementType;
  /** Blur/saturation strength. Defaults to "medium". */
  intensity?: Intensity;
  /** Also apply SVG displacement-based refraction (tier 2). Off by default. */
  refraction?: boolean;
  /** Tint color for the glass fill. Any valid Tailwind bg color works via className too. */
  tint?: "white" | "black" | "none";
  children?: React.ReactNode;
}

const INTENSITY_MAP: Record<Intensity, { blur: string; saturate: string }> = {
  subtle: { blur: "backdrop-blur-md", saturate: "backdrop-saturate-125" },
  medium: { blur: "backdrop-blur-lg", saturate: "backdrop-saturate-150" },
  strong: { blur: "backdrop-blur-xl", saturate: "backdrop-saturate-200" },
};

const TINT_MAP: Record<NonNullable<GlassPanelProps["tint"]>, string> = {
  white: "bg-white/15 border-white/30",
  black: "bg-black/20 border-white/10",
  none: "bg-transparent border-white/20",
};

let filterIdCounter = 0;

export function GlassPanel({
  as: Component = "div",
  intensity = "medium",
  refraction = false,
  tint = "white",
  className = "",
  style,
  children,
  ...rest
}: GlassPanelProps) {
  const filterId = React.useRef(`liquid-glass-refract-${filterIdCounter++}`);
  const { blur, saturate } = INTENSITY_MAP[intensity];
  const tintClasses = TINT_MAP[tint];

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(refraction ? { filter: `url(#${filterId.current})` } : {}),
  };

  return (
    <>
      {refraction && <GlassRefractionDefs id={filterId.current} />}
      <Component
        className={[
          "relative overflow-hidden rounded-2xl border",
          blur,
          saturate,
          tintClasses,
          "shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
          // inset highlight, approximated with a pseudo-border via ring
          "ring-1 ring-inset ring-white/20",
          className,
        ].join(" ")}
        style={combinedStyle}
        {...rest}
      >
        {children}
      </Component>
    </>
  );
}

/**
 * SVG filter defs for refraction (tier 2). Render once per unique filter id.
 * Uses fractal noise as a displacement map to warp the backdrop near edges,
 * approximating the light-bending look of Apple's Liquid Glass.
 *
 * Feature-detect before relying on this: browsers without SVG-filter +
 * backdrop-filter chaining support will just ignore the filter and fall
 * back to the tier-1 look, which is an acceptable degrade.
 */
function GlassRefractionDefs({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={2} result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default GlassPanel;

/**
 * Progressive enhancement helper: check support before enabling refraction
 * so unsupported browsers get the tier-1 fallback instead of a broken
 * or overly heavy render.
 *
 *   const canRefract = useSupportsGlassRefraction();
 *   <GlassPanel refraction={canRefract} ... />
 */
export function useSupportsGlassRefraction(): boolean {
  const [supported, setSupported] = React.useState(false);

  React.useEffect(() => {
    const supportsBackdrop =
      typeof CSS !== "undefined" &&
      CSS.supports("backdrop-filter", "blur(1px)");
    const supportsFilter =
      typeof CSS !== "undefined" && CSS.supports("filter", "url(#x)");
    setSupported(supportsBackdrop && supportsFilter);
  }, []);

  return supported;
}
```