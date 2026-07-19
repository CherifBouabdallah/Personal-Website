# Motion & Finish Craft Pass — Design

## Goal

Make the site read as art-directed by one person with a strong point of view, focused on
animation and finish (micro-interactions, transitions, scroll behavior, hover states,
loading sequence) — not scattered polish. Deliver via three concrete, comparable variants
so the decision is made by looking at the running site, not by reading prose.

## Point of view: "The Room Was Always Here"

The Forest Canopy Rule (background is always Forest Green, never scene-cuts) is the site's
unused advantage. Thesis: things become visible in a space that already existed, rather than
arriving from offscreen. Emotionally: patience, mass, inevitability.

**The risk taken**: deletion, not addition. Home, Portfolio, and Contact currently all reuse
an identical per-character title reveal and near-identical `whileInView` fade-ups — polished
but repetitive ("wallpaper"). The bold move is to strip most of that so two orchestrated
moments carry the whole site, and let Contact go nearly still in the boldest variant.

## Ground truth from the existing codebase (verified by direct file reads, not assumption)

- **Preloader** (`src/App.tsx`): custom rAF progress animation (exponential-decay easing to
  90%, fast sweep to 100%), a literal thin bar (`w-40 h-[1px]`, `App.tsx:184-189`). On
  completion, `AnimatePresence` exits the preloader (`opacity+y`, 0.7s) while, independently,
  the revealed app fades in (`opacity 0→1`, 1.0s) — two animations, not one sequence
  (`App.tsx:163-206`).
- **LiquidNavbar** (`src/components/LiquidNavbar.tsx`): pure Framer Motion, no GSAP/Draggable
  anywhere in this repo currently. Active-link underline is a single spring
  (`type:"spring", duration:0.38, bounce:0`), already `useReducedMotion`-aware
  (`LiquidNavbar.tsx:27-29`).
- **Home** (`src/pages/Home.tsx`): per-character blur+y title reveal
  (`ease:[0.21,1,0.36,1]`, `delay: i*0.05`, `Home.tsx:237-248`). No HolographicBall or any
  orbital element on this page — confirmed by grep, `HolographicBall` is only used in
  `src/pages/SoccerTeam.tsx` (light mode, blue theme, sandbox route). The Arrival sequence
  therefore ends on the title reveal itself, not an orbit.
- **Portfolio** (`src/pages/Portfolio.tsx`): card→modal shared-element morph via
  `layoutId`, spring `{stiffness:180, damping:25}` used identically on the card
  (`Portfolio.tsx:110`) and the modal (`:363`) — the site's best existing mechanic.
  `MorphingTitle` reuses Home's per-char reveal. `FeaturedCard` reveal is a
  `whileInView` `y:35→0` fade-up (`:224-234`).
- **Contact** (`src/pages/Contact.tsx`): same per-char title reveal; social icons fade in via
  a scroll-driven spring (`damping:30, stiffness:120, mass:0.8`, shared verbatim with
  Portfolio's invite-arrow spring); popup spring is `{stiffness:380, damping:22}` — a
  near-duplicate of a `{stiffness:380, damping:30}` spring elsewhere, drifted apart by
  copy-paste.
- **Reduced motion**: a blanket CSS override (`index.css`, forces near-zero durations) plus
  one component-level `useReducedMotion()` check (navbar only). Home, Portfolio, Contact,
  and the preloader do not check it individually — CSS alone cannot no-op a `layoutId`
  spring or a `filter: blur()` value cleanly.
- No shared motion-constants file exists; every easing curve/spring is inlined and hand-copied.

## Approach: build three variants behind a temporary comparison switcher

Rather than commit to one direction from prose, all three get built behind a runtime
switch, compared live in the browser, and then two get deleted along with the switcher
itself in the simplify pass. This is scaffolding for decision-making, not a shipped feature.

### Switcher mechanism
- `src/motionLab/MotionLabContext.tsx` — a small React context (`variant: 'a' | 'a2' | 'b'`
  + setter), persisted to `localStorage` (`motion-lab-variant`), default `'a'`. Scoped to this
  one directory so full removal later is one directory delete + un-wrapping `App`.
  (This is a deliberate, temporary exception to the codebase's normal
  lift-state-in-App/pass-as-props convention — justified because it avoids threading a
  throwaway prop through `MainPage` → `Home`/`Portfolio`/`Contact` and back out again in the
  simplify pass.)
- `src/motionLab/MotionLabPanel.tsx` — floating panel, fixed bottom-left, monospace label
  matching the design system's label typography, three buttons (A / A2 / B). Rendered only
  when `import.meta.env.DEV` is true, so it is structurally impossible for it to ship in a
  production build even if this branch were deployed prematurely.

### Shared foundation (all three variants use this)
`src/lib/motion.ts`:
- `EASE_ENTER` / `EASE_EXIT` — the two canonical deceleration curves already in use
  (`[0.16,1,0.3,1]` and `[0.21,1,0.36,1]`), consolidated to one name each instead of
  re-typed per file.
- `SPRING_MORPH` — canonical `{stiffness:180, damping:25}`, reserved for the Portfolio
  card↔modal morph only (in variants A/A2 this becomes the site's *only* spring).
- `SPRING_UI` — canonical `{stiffness:380, damping:26}` resolving the 22-vs-30 drift,
  used for navbar/popup-style motion in variant B and for any UI chrome springs retained
  in A/A2.
- `DURATION` — a short/medium/long scale replacing inlined magic numbers.
- `useMotionPrefs()` — wraps Framer's `useReducedMotion()`, returning ready-to-spread
  "reduced" variants (opacity-only, duration ~0) so every consumer gets a real branch
  instead of relying solely on the blanket CSS override.

### Variant B — "Fix the Seam" (baseline / safe)
- Preloader: replace the two-independent-animations handoff with one coordinated sequence
  — label stops pulsing and holds, then a single crossfade retires the preloader while the
  app fades in (no separate unrelated exit clip). No Arrival choreography, no bar→underline
  handoff.
- Reduced motion individually checked in Preloader, Home, Portfolio, Contact (currently only
  the navbar does this).
- Home/Portfolio/Contact reveals and the Portfolio morph are otherwise **behaviorally
  unchanged** — just re-pointed at `src/lib/motion.ts` instead of inlined/hand-copied values.
- Purpose: a polished-not-authored control to compare the bolder variants against.

### Variant A — "Two Moments, One Clock" (recommended)
**Signature moment 1 — The Arrival** (preloader → Home as one continuous sequence):
1. Progress completes; the pulsing "CHERIF BOUABDALLAH" label stops breathing and holds at
   full opacity for a beat (~250ms) — stillness announces the transition.
2. The existing thin progress bar contracts in width toward a short centered hairline and
   holds briefly.
3. The hairline dissolves in the same beat the navbar's underline spring plays for the
   first time under "Home" (coordinated timing, not a literal cross-component `layoutId`
   flight — the preloader and navbar are different mount trees, so this is achieved by
   sequencing, not shared-element animation).
4. App's separate `opacity:0→1` wrapper fade (`App.tsx:202-206`) is deleted outright — since
   the background never changes, there is nothing to fade in over. Home's per-character
   title reveal *is* the reveal.

**Signature moment 2 — The Morph, given silence** (Portfolio card↔modal):
- `SPRING_MORPH` becomes the only spring on the site.
- The modal backdrop's dim/blur-in is extended to ~0.6s so it visibly trails the morph
  instead of appearing in lockstep with it — the morph leads, the room follows.
- Closing gets a real reverse sequence: content fades out first (~150-200ms), *then* the
  layoutId spring reverses the card back, *then* the backdrop clears — replacing today's
  everything-exits-at-once close.

**The deletions** (this variant's aesthetic risk):
- Per-character blur+y title reveal becomes Home-exclusive. Portfolio's `MorphingTitle` and
  Contact's title switch to a single quiet mask-rise (one clip/translate reveal of the whole
  line, no per-character stagger).
- Portfolio's `FeaturedCard` `whileInView` reveal loses its `y:35` slide — becomes a simple
  opacity presence, no scroll-position choreography.
- Contact's scroll-driven icon fade/translate/scale spring is removed — icons are simply
  present. Contact reads calm/still, which is the deliberate risk.

### Variant A2 — A, but Contact keeps its current motion
Identical to Variant A for preloader/Home/Portfolio/navbar. Contact keeps its existing
per-character title reveal and scroll-driven icon animation, just re-pointed at
`src/lib/motion.ts` (fixing the spring drift) and given an individual reduced-motion branch.
Exists because stripping Contact is the single most debatable move in Variant A, and it's
cheap to offer the alternative for a side-by-side call.

## Reduced motion

Every new/touched animation gets an explicit `useMotionPrefs()` branch (opacity-only,
near-zero duration) in addition to the existing blanket CSS fallback — this specifically
matters for the Arrival sequence (multi-stage) and the Portfolio close sequence (multi-stage
exit), which the CSS override alone cannot correctly no-op without leaving visual artifacts
(e.g. a `layoutId` spring frozen mid-flight).

## Verification

Dev server + Playwright, driven manually in-browser (not just `tsc --noEmit`):
- Golden path per variant: preloader → Home → Portfolio (open/close a project morph) →
  Contact, confirm the switcher correctly swaps behavior and persists across reload.
- `prefers-reduced-motion: reduce` emulated: confirm Arrival collapses to a near-instant,
  opacity-only handoff; confirm Portfolio's open/close sequence doesn't leave the modal or
  backdrop in an intermediate state.
- Slow/deliberate scroll through Portfolio and Contact in each variant.
- Resize (desktop ↔ mobile breakpoints) to confirm navbar underline recalculation and
  Home/Portfolio/Contact mobile layouts aren't affected by the new choreography.
- Full re-verification depth on Variant A (the recommended default); spot-check the deltas
  for A2 and B rather than repeating every check three times.

## End state (after you pick one)

Simplify pass deletes: `src/motionLab/` entirely, the `MotionLabProvider` wrapper in
`App.tsx`, and every `variant === '...'` branch in every touched file — collapsing to the
single chosen behavior. `src/lib/motion.ts` and the reduced-motion audit remain regardless of
which variant wins, since Variant B's fixes are a strict subset of A/A2's.
