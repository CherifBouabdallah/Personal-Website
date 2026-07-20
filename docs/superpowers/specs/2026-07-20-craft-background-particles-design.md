# Craft Backgrounds: Ambient Particle Layers for Directions A & C — Design

## Context

`src/craft/a` (Nocturne) and `src/craft/c` (Kinetic Canopy) each got a coded background pass (`NocturneAtmosphere.tsx`, `KineticBackdrop.tsx`) — static/scroll-linked layered gradients + grain. Feedback: too basic, wants actual movement ("make it fun"). This spec adds a drifting-particle layer to each, on top of the existing gradients, without new dependencies.

## Approach

Pure CSS/DOM particle layers — no canvas/WebGL. A handful of small absolutely-positioned elements, each with its own CSS `@keyframes` drift animation (`transform`/`opacity` only, GPU-accelerated), plus a scroll-linked parallax offset on the whole layer via the existing `gsapSetup` (`ScrollTrigger`). Matches the stack already used elsewhere in `src/craft/`. Reduced motion: particles render static (no drift/rotation), same convention as the rest of the codebase.

## Direction A — "Forest dust motes"

- New: nothing extra needed structurally — motes render inline inside `NocturneAtmosphere.tsx` (the single mounted background layer for this direction).
- ~16 small soft-glow circles (blurred radial-gradient dots, `rgba(246,240,223, 0.15–0.4)`, 2–6px core), positioned via a fixed data array (`top/left` % + size + animation-delay/duration), each drifting slowly upward with slight horizontal sway via CSS `@keyframes`, staggered 18–40s durations/delays so they never sync visibly.
- Parallax: reuses the `y` value already computed by `useAtmosphere()` in that component, offset at a slower rate (`y * 0.4`) than the primary light bloom, for depth.
- CSS lives in `nocturne.css`, scoped under `[data-craft="a"]`; reduced-motion media query disables the drift keyframe (motes stay in their base position, still visible for texture).

## Direction C — "Drifting geometric marks"

- New: a small set (~8) of thin-line SVG shapes (circle, cross, grid-fragment) rendered inline inside `KineticBackdrop.tsx`.
- Each drifts slowly (translate) and rotates a few degrees via CSS `@keyframes` — restrained, not lively, matching this direction's discipline thesis.
- Scroll parallax: a lightweight `ScrollTrigger` scrub (via the shared `gsapSetup`) applied to the marks container, subtler than Direction A's.
- New file `src/craft/c/kinetic.css` (didn't exist yet — this direction had no CSS file), scoped under `[data-craft="c"]`, imported from `KineticBackdrop.tsx`. Reduced motion: skip the ScrollTrigger tween entirely, marks render in their static base position.

## Non-goals

- No new color values outside the existing palette (alabaster/tonal greens).
- No new dependency (no canvas/particle library) — this is a from-scratch DOM+CSS+GSAP implementation using what's already installed.
- No changes to Direction B, or to any pristine `src/pages/*` file.

## Verification

`npm run lint` (`tsc --noEmit`) clean; visual check in the already-running dev server (toggle craft variant A/C via the dev panel); confirm reduced-motion emulation freezes both particle layers; confirm no new console errors.
