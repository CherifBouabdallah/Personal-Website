# Motion & Finish Craft Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three comparable motion/finish variants (A, A2, B) of the preloader, Home,
Portfolio, and Contact experience behind a temporary dev-only switcher, so the final
direction is chosen by watching the running site rather than by reading a spec.

**Architecture:** A new shared constants module (`src/lib/motion.ts`) centralizes every
easing curve/spring/duration currently hand-copied across files. A temporary
`src/motionLab/` context+panel lets `App.tsx` and each touched page branch on
`variant: 'a' | 'a2' | 'b'`. All new/changed animation gets an explicit reduced-motion
branch via a shared `useMotionPrefs()` hook, on top of the existing blanket CSS fallback.

**Tech Stack:** React 19, TypeScript, Framer Motion (existing dependency, no new libraries),
Tailwind v4. No GSAP/Draggable involved in this pass (there is none in the repo currently).

## Global Constraints

- Background must always stay Forest Green `#223D27` — no new overlay/backdrop introduces a
  different base color anywhere in this pass.
- `Maghfirea` stays reserved for single-line statements/titles only — the new mask-rise title
  treatment does not change font usage, only how the line reveals.
- Max card rounding 24px — the modal (`28px`, pre-existing) and card (`20px`, pre-existing)
  radii are untouched by this pass.
- Cards stay flat/flush at rest; shadows/hover-scale only on direct interaction — no new
  at-rest decoration is added.
- Every new or changed animation must have a `prefers-reduced-motion` branch via
  `useMotionPrefs()`, in addition to the existing blanket CSS override in `index.css`.
- No automated test suite exists in this repo (no Jest/Vitest). The correctness bar per task
  is: `npm run lint` (`tsc --noEmit`) passes with no new errors, plus the specific manual
  browser check described in that task's steps. Full cross-variant verification (reduced
  motion, slow scroll, resize) happens in the dedicated Task 12, not repeated per task.
- The `src/motionLab/` directory, the `MotionLabProvider` wrapper, and every
  `variant === '...'` branch are temporary — they get deleted in Task 13 once one variant is
  chosen. Do not add production error handling, tests, or polish to `src/motionLab/` itself —
  it is scaffolding with a fixed, short lifespan.

---

### Task 1: Shared motion constants module

**Files:**
- Create: `src/lib/motion.ts`

**Interfaces:**
- Produces: `EASE_ENTER`, `EASE_ENTER_CHAR`, `SPRING_MORPH`, `SPRING_UI`, `SPRING_SCROLL`,
  `SPRING_NAV`, `TWEEN_INSTANT`, `DURATION`, `ARRIVAL_SETTLE_MS`, `ARRIVAL_CONTRACT_MS`,
  `useMotionPrefs()` — consumed by every later task.

- [ ] **Step 1: Create the constants + hook file**

```ts
// src/lib/motion.ts
import { useReducedMotion } from "framer-motion";

// Deceleration curve used for general reveals/exits (unify what was previously
// re-typed per file as [0.16, 1, 0.3, 1]).
export const EASE_ENTER = [0.16, 1, 0.3, 1] as const;

// Slightly softer curve reserved for the per-character title reveal
// (previously re-typed per file as [0.21, 1, 0.36, 1]).
export const EASE_ENTER_CHAR = [0.21, 1, 0.36, 1] as const;

// The one spring reserved for Portfolio's card <-> modal shared-element morph.
export const SPRING_MORPH = { type: "spring", stiffness: 180, damping: 25 } as const;

// Canonical UI chrome spring (popups, small interactive elements). Resolves the
// previous drift between {stiffness:380, damping:22} and {stiffness:380, damping:30}.
export const SPRING_UI = { type: "spring", stiffness: 380, damping: 26 } as const;

// Canonical scroll-linked reveal spring (previously identical but hand-copied in
// Portfolio.tsx and Contact.tsx).
export const SPRING_SCROLL = { damping: 30, stiffness: 120, mass: 0.8 } as const;

// LiquidNavbar's underline spring (duration-based spring, distinct shape from the
// stiffness/damping springs above).
export const SPRING_NAV = { type: "spring", duration: 0.38, bounce: 0 } as const;

// Reduced-motion fallback: an effectively instant tween.
export const TWEEN_INSTANT = { type: "tween", duration: 0 } as const;

export const DURATION = { short: 0.3, medium: 0.6, long: 1.0 } as const;

// Timing for the Variant A/A2 preloader "Arrival" sequence.
export const ARRIVAL_SETTLE_MS = 250;
export const ARRIVAL_CONTRACT_MS = 350;

/**
 * Every animated surface should call this instead of useReducedMotion() directly,
 * so reduced-motion handling is consistent site-wide.
 */
export function useMotionPrefs() {
  const reduced = Boolean(useReducedMotion());
  const transition = <T extends object>(full: T): T | typeof TWEEN_INSTANT =>
    reduced ? TWEEN_INSTANT : full;
  return { reduced, transition };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no new TypeScript errors (this file has no consumers yet, so it just needs to be
syntactically/type valid on its own).

- [ ] **Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "feat: add shared motion constants module"
```

---

### Task 2: Motion Lab context and dev panel

**Files:**
- Create: `src/motionLab/MotionLabContext.tsx`
- Create: `src/motionLab/MotionLabPanel.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `MotionVariant` (`'a' | 'a2' | 'b'`), `MotionLabProvider`, `useMotionVariant()`,
  `MotionLabPanel` — consumed by Task 3 onward.

- [ ] **Step 1: Create the context**

```tsx
// src/motionLab/MotionLabContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

export type MotionVariant = "a" | "a2" | "b";

const STORAGE_KEY = "motion-lab-variant";

interface MotionLabValue {
  variant: MotionVariant;
  setVariant: (v: MotionVariant) => void;
}

const MotionLabContext = createContext<MotionLabValue>({
  variant: "a",
  setVariant: () => {},
});

function isValidVariant(value: string | null): value is MotionVariant {
  return value === "a" || value === "a2" || value === "b";
}

function readStoredVariant(): MotionVariant {
  // Outside dev, always lock to "a" regardless of any stray localStorage value —
  // this context (and the panel that writes to it) is deleted before ship, but this
  // keeps a real visitor's experience deterministic if that hasn't happened yet.
  if (!import.meta.env.DEV || typeof window === "undefined") return "a";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isValidVariant(stored) ? stored : "a";
}

export function MotionLabProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<MotionVariant>(readStoredVariant);

  const setVariant = (v: MotionVariant) => {
    setVariantState(v);
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, v);
    }
  };

  return (
    <MotionLabContext.Provider value={{ variant, setVariant }}>
      {children}
    </MotionLabContext.Provider>
  );
}

export function useMotionVariant() {
  return useContext(MotionLabContext);
}
```

- [ ] **Step 2: Create the floating panel**

```tsx
// src/motionLab/MotionLabPanel.tsx
import { useMotionVariant, MotionVariant } from "./MotionLabContext";

const OPTIONS: MotionVariant[] = ["a", "a2", "b"];

export function MotionLabPanel() {
  const { variant, setVariant } = useMotionVariant();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-1 rounded-md border border-theme-text/20 bg-theme-bg/90 backdrop-blur-sm px-2 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase select-none">
      <span className="text-theme-text/40 mr-1">Motion</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => setVariant(opt)}
          className={`px-2 py-1 rounded cursor-pointer transition-colors ${
            variant === opt
              ? "bg-theme-text text-theme-bg"
              : "text-theme-text/60 hover:text-theme-text"
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/motionLab/
git commit -m "feat: add temporary motion-lab variant switcher"
```

---

### Task 3: Wire the Motion Lab into App.tsx

**Files:**
- Modify: `src/App.tsx:36` (component start), `src/App.tsx:161-276` (return block)

**Interfaces:**
- Consumes: `MotionLabProvider`, `useMotionVariant`, `MotionLabPanel` from Task 2.
- Produces: `variant` available inside `App` for Task 6; panel visible in the DOM for later
  manual checks.

- [ ] **Step 1: Import and wrap**

At the top of `src/App.tsx`, add:

```tsx
import { MotionLabProvider, useMotionVariant } from "./motionLab/MotionLabContext";
import { MotionLabPanel } from "./motionLab/MotionLabPanel";
```

Rename the existing `export default function App()` to an inner component and wrap it, so
`useMotionVariant()` can be called inside (context must be read below its own provider):

```tsx
export default function App() {
  return (
    <MotionLabProvider>
      <AppInner />
    </MotionLabProvider>
  );
}

function AppInner() {
  const { variant } = useMotionVariant();
  // ... existing body of the old `App` function goes here unchanged for now ...
```

- [ ] **Step 2: Render the panel**

Just before the closing `</div>` of the root return (`src/App.tsx:273-275`, right after
`<SpeedInsights />`), add:

```tsx
      <Analytics />
      <SpeedInsights />
      <MotionLabPanel />
    </div>
```

- [ ] **Step 3: Manual check**

Run `npm run dev`, open the site. Confirm a small "Motion A / A2 / B" panel appears bottom-left,
clicking each button highlights it, and a page reload keeps the last-clicked selection
(persisted via localStorage). No visual behavior changes yet — this task is pure plumbing.

- [ ] **Step 4: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire motion-lab provider and panel into App"
```

---

### Task 4: LiquidNavbar onto shared constants

**Files:**
- Modify: `src/components/LiquidNavbar.tsx:1-29`

**Interfaces:**
- Consumes: `SPRING_NAV`, `TWEEN_INSTANT` from `src/lib/motion.ts` (Task 1).
- Produces: no new interface; behavior-neutral refactor.

- [ ] **Step 1: Replace the inlined transition with the shared constants**

Replace:
```tsx
import { motion, useReducedMotion } from "framer-motion";
```
with:
```tsx
import { motion } from "framer-motion";
import { SPRING_NAV, TWEEN_INSTANT, useMotionPrefs } from "../lib/motion";
```

Replace (`LiquidNavbar.tsx:16` and `:26-29`):
```tsx
  const shouldReduceMotion = useReducedMotion();
  ...
  const transition = shouldReduceMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, duration: 0.38, bounce: 0 };
```
with:
```tsx
  const { reduced } = useMotionPrefs();
  ...
  const transition = reduced ? TWEEN_INSTANT : SPRING_NAV;
```

- [ ] **Step 2: Manual check**

With the dev server running, resize the window and switch between Home/Portfolio/Contact —
confirm the underline still slides under the active link exactly as before (this step should
be visually indistinguishable from before the change).

- [ ] **Step 3: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LiquidNavbar.tsx
git commit -m "refactor: point LiquidNavbar at shared motion constants"
```

---

### Task 5: Home onto shared constants + individual reduced-motion branch

**Files:**
- Modify: `src/pages/Home.tsx:1-2`, `:237-248`, `:423-434`

**Interfaces:**
- Consumes: `EASE_ENTER_CHAR`, `useMotionPrefs` from Task 1.
- Produces: no new interface. This is the one genuinely-new fix in this task (all variants
  get it): Home's title reveal currently has no individual reduced-motion check.

- [ ] **Step 1: Import the shared helpers**

Add to the top of `src/pages/Home.tsx`:
```tsx
import { EASE_ENTER_CHAR, useMotionPrefs } from "../lib/motion";
```

- [ ] **Step 2: Add the reduced-motion branch and swap the easing constant**

Inside `export default function Home(...)`, add near the top:
```tsx
  const { reduced } = useMotionPrefs();
```

Replace the desktop char-reveal transition (`Home.tsx:239-245`):
```tsx
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.05,
                            }}
                          >
```
with:
```tsx
                          <motion.span
                            className="inline-block"
                            initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={
                              reduced
                                ? { opacity: 1 }
                                : isReady
                                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, y: 50, filter: "blur(10px)" }
                            }
                            transition={
                              reduced
                                ? { duration: 0 }
                                : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }
                            }
                          >
```

Apply the identical replacement to the mobile char-reveal block at `Home.tsx:423-434`
(same shape, `y: 50` in `initial` there — keep that value, only the `reduced` branch and
`EASE_ENTER_CHAR` import are new).

- [ ] **Step 3: Manual check**

In a Chromium-based browser devtools, enable "Emulate CSS prefers-reduced-motion: reduce"
(Rendering tab), reload Home. Confirm the name title appears immediately with no blur/slide,
just a fade. Turn the emulation off and confirm the original staggered blur/slide reveal is
unchanged.

- [ ] **Step 4: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: add individual reduced-motion handling to Home title reveal"
```

---

### Task 6: Preloader seam-fix (B) and Arrival sequence (A/A2) in App.tsx

**Files:**
- Modify: `src/App.tsx` (the `AppInner` component from Task 3: state near line 37-38, the
  progress effect at 99-131, and the JSX at 163-206)

**Interfaces:**
- Consumes: `variant` (Task 3), `EASE_ENTER`, `ARRIVAL_SETTLE_MS`, `ARRIVAL_CONTRACT_MS`,
  `useMotionPrefs` (Task 1).
- Produces: no new interface consumed elsewhere — this is the Arrival moment itself.

- [ ] **Step 1: Import what's needed**

```tsx
import { EASE_ENTER, ARRIVAL_SETTLE_MS, ARRIVAL_CONTRACT_MS, useMotionPrefs } from "./lib/motion";
```

- [ ] **Step 2: Add the phase state machine**

Add alongside the existing `progress`/`isSiteReady` state in `AppInner`:
```tsx
  type PreloaderPhase = "loading" | "settling" | "contracting" | "done";
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const { reduced } = useMotionPrefs();
```

- [ ] **Step 3: Branch the completion logic on variant**

Replace the completion block inside the progress effect (`App.tsx:116-120`):
```tsx
      if (currentProgress >= 100) {
        timeoutId = window.setTimeout(() => {
          setIsSiteReady(true);
        }, 300);
        return;
      }
```
with:
```tsx
      if (currentProgress >= 100) {
        if (variant === "b" || reduced) {
          // Seam-fix baseline: same short hold, then a single coordinated crossfade
          // (duration/easing now shared with the app fade-in below, so it reads as
          // one clip instead of two).
          timeoutId = window.setTimeout(() => setIsSiteReady(true), 300);
        } else {
          // Arrival (A/A2): label settles -> bar contracts -> dissolve into the navbar.
          setPhase("settling");
          timeoutId = window.setTimeout(() => {
            setPhase("contracting");
            timeoutId = window.setTimeout(() => {
              setPhase("done");
              setIsSiteReady(true);
            }, ARRIVAL_CONTRACT_MS);
          }, ARRIVAL_SETTLE_MS);
        }
        return;
      }
```

- [ ] **Step 4: Update the preloader JSX**

Replace the preloader block (`App.tsx:163-192`):
```tsx
      <AnimatePresence mode="wait">
        {!isSiteReady && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 w-full h-full bg-theme-bg z-[999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono text-xs md:text-sm tracking-[0.45em] uppercase text-theme-text/80 text-center px-4"
            >
              CHERIF BOUABDALLAH
            </motion.div>
            <div className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase text-theme-text/30 text-center px-4">
              loading ...
            </div>
            {/* Minimalist luxury loading status bar */}
            <div className="mt-6 w-40 h-[1px] bg-theme-text/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-theme-text/70"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
```
with:
```tsx
      <AnimatePresence mode="wait">
        {!isSiteReady && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_ENTER }}
            className="fixed inset-0 w-full h-full bg-theme-bg z-[999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={phase === "loading" ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0.8 }}
              transition={phase === "loading" ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
              className="font-mono text-xs md:text-sm tracking-[0.45em] uppercase text-theme-text/80 text-center px-4"
            >
              CHERIF BOUABDALLAH
            </motion.div>
            <div className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase text-theme-text/30 text-center px-4">
              loading ...
            </div>
            {/* Minimalist luxury loading status bar */}
            <div
              className="mt-6 h-[1px] bg-theme-text/10 relative overflow-hidden transition-[width] duration-300 ease-out"
              style={{ width: phase === "contracting" || phase === "done" ? "24px" : "160px" }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-theme-text/70"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
```

- [ ] **Step 5: Match the app fade-in to the preloader exit, and skip it entirely for A/A2**

Replace the app wrapper (`App.tsx:202-206`):
```tsx
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen relative flex flex-col items-stretch justify-start"
          >
```
with:
```tsx
          <motion.div
            initial={variant === "b" ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={variant === "b" ? { duration: 0.5, ease: EASE_ENTER } : { duration: 0 }}
            className="w-full min-h-screen relative flex flex-col items-stretch justify-start"
          >
```
(`initial={false}` tells Framer Motion to skip the entrance animation and render directly at
the `animate` value — since the background never changes, Variant A/A2 has nothing to fade in
over; Variant B keeps a real 0.5s fade that now matches the preloader's 0.5s exit above,
closing the "two independent clips" gap.)

- [ ] **Step 6: Manual check — all three variants**

Run `npm run dev`, hard-reload with each panel option selected:
- **B**: preloader label pulses normally, then the whole preloader and the app crossfade
  together in one visible beat (no separate lingering fade-in after the preloader is gone).
- **A / A2**: label stops pulsing and holds, the thin bar visibly contracts from 160px to
  24px, then the preloader dissolves at the same moment the navbar's underline first slides
  into place under "Home" — content is already at full opacity, only the title reveal and
  navbar underline are animating in.

- [ ] **Step 7: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add preloader seam-fix (B) and Arrival sequence (A/A2)"
```

---

### Task 7: Portfolio onto shared constants + individual reduced-motion branch

**Files:**
- Modify: `src/pages/Portfolio.tsx:1`, `:110`, `:193-209`, `:224-234`, `:363`, `:441-445`

**Interfaces:**
- Consumes: `SPRING_MORPH`, `SPRING_SCROLL`, `EASE_ENTER_CHAR`, `useMotionPrefs` (Task 1).
- Produces: `reduced` (and, in `PreviewModal` specifically, `transition`) available for
  Task 8/9 to reuse within the same component tree.

- [ ] **Step 1: Import the shared helpers**

```tsx
import { SPRING_MORPH, SPRING_SCROLL, EASE_ENTER_CHAR, useMotionPrefs } from "../lib/motion";
```

- [ ] **Step 2: Make the two inlined `{stiffness:180, damping:25}` springs reduced-motion-aware**

This is the site's one shared-element (`layoutId`) spring — a blanket CSS override cannot
safely no-op a `layoutId` animation mid-flight, so both usages need an explicit branch, not
just a constant swap.

Inside `ProjectPreview` (`Portfolio.tsx:67`), add near its other hooks:
```tsx
  const { transition } = useMotionPrefs();
```
Replace (`:110`):
```tsx
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
```
with:
```tsx
      transition={transition(SPRING_MORPH)}
```

Inside `PreviewModal` (`Portfolio.tsx:324`), add near its other hooks:
```tsx
  const { reduced, transition } = useMotionPrefs();
```
Replace (`:363`):
```tsx
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
```
with:
```tsx
      transition={transition(SPRING_MORPH)}
```
(`reduced` here is also consumed by Task 9's close-sequence logic in this same component —
declaring it now avoids a second hook call later.)

- [ ] **Step 3: Replace the scroll spring**

At `Portfolio.tsx:441-445`, replace:
```tsx
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });
```
with:
```tsx
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL);
```

- [ ] **Step 4: Add a reduced-motion branch to `MorphingTitle`**

Inside `MorphingTitle` (`Portfolio.tsx:141`), add:
```tsx
  const { reduced } = useMotionPrefs();
```
Replace the char transition (`:193-199`):
```tsx
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                animate={shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                transition={{
                  duration: 1.0,
                  ease: [0.21, 1, 0.36, 1],
                  delay: globalIndex * 0.05,
                }}
              >
```
with:
```tsx
              <motion.span
                className="inline-block"
                initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                animate={reduced ? { opacity: 1 } : shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }}
              >
```

- [ ] **Step 5: Add a reduced-motion branch to `FeaturedCard`'s reveal**

Inside `FeaturedCard` (`Portfolio.tsx:219`), add:
```tsx
  const { reduced } = useMotionPrefs();
```
Replace `cardRevealVariants` (`:224-234`):
```tsx
  const cardRevealVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: idx * 0.12,
      }
    })
  };
```
with:
```tsx
  const cardRevealVariants: Variants = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 35 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0 }
        : { duration: 0.9, ease: EASE_ENTER, delay: idx * 0.12 },
    })
  };
```
(This also needs `EASE_ENTER` added to the Task 7 Step 1 import list — update it to:
`import { SPRING_MORPH, SPRING_SCROLL, EASE_ENTER, EASE_ENTER_CHAR, useMotionPrefs } from "../lib/motion";`)

- [ ] **Step 6: Manual check**

With reduced-motion emulation off, scroll through Portfolio in each of the three variants —
confirm nothing looks different yet (this task is a behavior-neutral refactor for all
variants). With reduced-motion emulation on, confirm the title and cards appear instantly
with no blur/slide.

- [ ] **Step 7: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Portfolio.tsx
git commit -m "feat: point Portfolio at shared motion constants, add reduced-motion branches"
```

---

### Task 8: Portfolio title/card variant treatment (A/A2 only)

**Files:**
- Modify: `src/pages/Portfolio.tsx` (`MorphingTitle`, `FeaturedCard`, both touched in Task 7)

**Interfaces:**
- Consumes: `variant` from `useMotionVariant()` (Task 2/3), `DURATION` (Task 1).
- Produces: no new interface.

- [ ] **Step 1: Import the variant hook**

Add to the Task 7 import block:
```tsx
import { useMotionVariant } from "../motionLab/MotionLabContext";
```

- [ ] **Step 2: Give `MorphingTitle` a mask-rise branch**

Inside `MorphingTitle`, add:
```tsx
  const { variant } = useMotionVariant();
  const useMaskRise = variant !== "b";
```
Wrap the existing return with a branch — replace the `return (...)` block (`:178-208`) with:
```tsx
  if (useMaskRise) {
    return (
      <h1
        ref={titleRef}
        className="font-maghfirea text-[clamp(2.3rem,12vw,200px)] text-theme-text text-center leading-[0.95] px-4 w-full overflow-hidden"
      >
        <motion.span
          className="inline-block"
          initial={reduced ? false : { y: "110%" }}
          animate={reduced ? { opacity: 1 } : shouldAnimate ? { y: "0%" } : { y: "110%" }}
          transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER }}
        >
          {text}
        </motion.span>
      </h1>
    );
  }

  return (
    <motion.h1
      ref={titleRef}
      className="font-maghfirea text-[clamp(2.3rem,12vw,200px)] text-theme-text flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] px-4 w-full"
    >
      {splitText.map(({ wordIndex, chars }) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {chars.map(({ char, globalIndex }, charIndex) => (
            <span
              key={charIndex}
              className="inline-block overflow-hidden"
              style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
            >
              <motion.span
                className="inline-block"
                initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                animate={reduced ? { opacity: 1 } : shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
```
(`titleRef` still needs to be attached in the mask-rise branch's `<h1>` — it is, above.)

- [ ] **Step 3: Give `FeaturedCard` the no-slide variant**

Inside `FeaturedCard`, add:
```tsx
  const { variant } = useMotionVariant();
```
Replace the `cardRevealVariants` definition from Task 7 with a variant-branched version:
```tsx
  const cardRevealVariants: Variants = reduced
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : variant === "b"
    ? {
        hidden: { opacity: 0, y: 35 },
        visible: (idx: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: EASE_ENTER, delay: idx * 0.12 },
        }),
      }
    : {
        hidden: { opacity: 0 },
        visible: (idx: number) => ({
          opacity: 1,
          transition: { duration: DURATION.medium, ease: EASE_ENTER, delay: idx * 0.08 },
        }),
      };
```
(Add `DURATION` to the import list alongside the others from Task 7.)

- [ ] **Step 4: Manual check — all three variants**

Scroll through Portfolio with each panel option:
- **B**: title still reveals per-character with blur; cards still slide up 35px on scroll.
- **A / A2**: title reveals as one line rising out of a mask (no per-character stagger, no
  blur); cards simply fade in on scroll with no vertical slide.

- [ ] **Step 5: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Portfolio.tsx
git commit -m "feat: add Portfolio title/card variant treatment for A/A2"
```

---

### Task 9: Portfolio modal backdrop timing + close sequence (A/A2 only)

**Files:**
- Modify: `src/pages/Portfolio.tsx` (`PreviewModal`, `:324-417`)

**Interfaces:**
- Consumes: `variant` from `useMotionVariant()` (already imported in Task 8), `EASE_ENTER`,
  `reduced`/`transition` from `useMotionPrefs()` (already called in this component in Task 7
  Step 2).
- Produces: no new interface.

- [ ] **Step 1: Add a closing state and variant-aware backdrop transition**

Inside `PreviewModal` (`Portfolio.tsx:324`), add after the existing `isLoading` state:
```tsx
  const { variant } = useMotionVariant();
  const [isClosing, setIsClosing] = useState(false);

  // Reduced motion skips the staged close (content-fade -> morph -> backdrop-clear)
  // entirely and closes immediately, same as Variant B.
  const requestClose = () => {
    if (variant === "b" || reduced) {
      onClose();
      return;
    }
    setIsClosing(true);
  };

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(onClose, 180);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);
```

- [ ] **Step 2: Route both close triggers through `requestClose`**

Replace the outer backdrop's `onClick={onClose}` (`:355`) with `onClick={requestClose}`.
Replace the close button's `onClick={onClose}` (`:408`) with `onClick={requestClose}`.

(Note: `Portfolio.tsx:461-470`'s window-level ESC listener calls `setActiveModal(null)`
directly in the parent `Portfolio` component, not through `PreviewModal.onClose` — leave
that as-is; it is a fast-path power-user shortcut and is out of scope for this pass.)

- [ ] **Step 3: Extend the backdrop transition for A/A2**

Replace the outer motion.div (`:350-356`):
```tsx
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
      onClick={onClose}
    >
```
with:
```tsx
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={variant === "b" ? undefined : transition({ duration: 0.6, ease: EASE_ENTER })}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
      onClick={requestClose}
    >
```

- [ ] **Step 4: Fade content out first when closing (A/A2)**

Inside the content `AnimatePresence` (`:371-403`), add an `isClosing` branch before the
existing `!isLayoutComplete` check:
```tsx
          <AnimatePresence mode="wait">
            {isClosing && variant !== "b" ? (
              <motion.div
                key="closing"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="w-full h-full"
              />
            ) : !isLayoutComplete ? (
```
(the rest of the ternary chain — `isLoading ? ... : ...` — stays exactly as it is, just
nested one level deeper under this new leading condition; close the extra parenthesis this
opens at the end of the existing chain, no other content changes).

- [ ] **Step 5: Manual check — all three variants**

Open and close each of the three project previews under each panel option:
- **B**: unchanged — clicking the backdrop or the ESC button closes immediately, morph and
  backdrop exit together as before.
- **A / A2**: clicking to close briefly fades the modal's inner content to transparent first
  (~180ms), then the card visibly morphs back into its grid position while the backdrop
  clears slightly slower than before (trailing the ~0.5s morph spring).

- [ ] **Step 6: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Portfolio.tsx
git commit -m "feat: add Portfolio modal close sequencing and backdrop timing for A/A2"
```

---

### Task 10: Contact onto shared constants + individual reduced-motion branch

**Files:**
- Modify: `src/pages/Contact.tsx:1`, `:55-60`, `:134-138`, `:191-211`

**Interfaces:**
- Consumes: `SPRING_UI`, `SPRING_SCROLL`, `EASE_ENTER_CHAR`, `useMotionPrefs` (Task 1).
- Produces: `reduced` available for Task 11 to reuse.

- [ ] **Step 1: Import the shared helpers**

```tsx
import { SPRING_UI, SPRING_SCROLL, EASE_ENTER_CHAR, useMotionPrefs } from "../lib/motion";
```

- [ ] **Step 2: Replace the popup spring**

Replace `popupVariants` (`:55-60`):
```tsx
const popupVariants = {
  initial: { opacity: 0, y: -40, scale: 0.1, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, scale: 0.1, filter: "blur(8px)" },
  transition: { type: "spring", stiffness: 380, damping: 22 }
} as const;
```
with:
```tsx
const popupVariants = {
  initial: { opacity: 0, y: -40, scale: 0.1, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, scale: 0.1, filter: "blur(8px)" },
  transition: SPRING_UI,
} as const;
```

- [ ] **Step 3: Replace the scroll spring**

Replace (`:134-138`):
```tsx
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });
```
with:
```tsx
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL);
```

- [ ] **Step 4: Add the reduced-motion branch to the title reveal**

Add near the top of `Contact`:
```tsx
  const { reduced } = useMotionPrefs();
```
Replace the char transition (`:191-199`):
```tsx
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.05,
                            }}
                          >
```
with:
```tsx
                          <motion.span
                            className="inline-block"
                            initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={reduced ? { opacity: 1 } : shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }}
                          >
```

- [ ] **Step 5: Manual check**

With reduced-motion emulation on, scroll to Contact — confirm the title and social icons
appear instantly with no blur/slide/scale. With it off, confirm no visual change from before
this task (behavior-neutral refactor for all variants).

- [ ] **Step 6: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: point Contact at shared motion constants, add reduced-motion branch"
```

---

### Task 11: Contact title/icon variant treatment (Variant A only)

**Files:**
- Modify: `src/pages/Contact.tsx` (title block from Task 10, icons block `:215-218`)

**Interfaces:**
- Consumes: `variant` from `useMotionVariant()` (Task 2/3), `DURATION`, `EASE_ENTER`.
- Produces: no new interface.

- [ ] **Step 1: Import the variant hook and remaining constants**

```tsx
import { SPRING_UI, SPRING_SCROLL, EASE_ENTER, EASE_ENTER_CHAR, DURATION, useMotionPrefs } from "../lib/motion";
import { useMotionVariant } from "../motionLab/MotionLabContext";
```

Add near the other hooks:
```tsx
  const { variant } = useMotionVariant();
```

- [ ] **Step 2: Branch the title between per-char and mask-rise**

Wrap the title `<h1>` (`:176-212`) in a variant check. Replace the whole `<h1>...</h1>` block
with:
```tsx
          <h1
            ref={titleRef}
            className={`font-maghfirea text-[clamp(2.5rem,8vw,5.5rem)] md:text-[clamp(3.5rem,10vw,140px)] text-theme-text text-center leading-[0.95] selection:bg-theme-text selection:text-theme-bg px-4 w-full ${
              variant === "a" ? "overflow-hidden" : "flex flex-wrap justify-center gap-x-[0.25em]"
            }`}
          >
            {variant === "a" ? (
              <motion.span
                className="inline-block"
                initial={reduced ? false : { y: "110%" }}
                animate={reduced ? { opacity: 1 } : (isReady && hasBeenInView) ? { y: "0%" } : { y: "110%" }}
                transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER }}
              >
                {text}
              </motion.span>
            ) : (
              (() => {
                const shouldAnimate = isReady && hasBeenInView;
                let charCounter = 0;
                return text.split(" ").map((word, wordIndex, arr) => (
                  <Fragment key={wordIndex}>
                    <span className="inline-block whitespace-nowrap">
                      {word.split("").map((char, charIndex) => {
                        const globalIndex = charCounter++;
                        return (
                          <span
                            key={charIndex}
                            className="inline-block overflow-hidden"
                            style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
                          >
                            <motion.span
                              className="inline-block"
                              initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                              animate={reduced ? { opacity: 1 } : shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                              transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }}
                            >
                              {char}
                            </motion.span>
                          </span>
                        );
                      })}
                    </span>
                    {wordIndex < arr.length - 1 && " "}
                  </Fragment>
                ));
              })()
            )}
          </h1>
```

- [ ] **Step 3: Branch the social icons between scroll-driven and simple presence**

Replace the icons wrapper (`:215-218`):
```tsx
        <motion.div
          style={{ opacity: iconsOpacity, y: iconsY, scale: iconsScale }}
          className="flex items-center justify-center gap-6 sm:gap-8 md:gap-14"
        >
```
with:
```tsx
        <motion.div
          {...(variant === "a"
            ? {
                initial: reduced ? false : { opacity: 0 },
                animate: { opacity: 1 },
                transition: reduced ? { duration: 0 } : { duration: DURATION.medium, ease: EASE_ENTER, delay: 0.2 },
              }
            : { style: { opacity: iconsOpacity, y: iconsY, scale: iconsScale } })}
          className="flex items-center justify-center gap-6 sm:gap-8 md:gap-14"
        >
```

- [ ] **Step 4: Manual check — all three variants**

Scroll to Contact under each panel option:
- **B / A2**: title still reveals per-character; icons still fade/translate/scale in as you
  scroll — unchanged from before this pass.
- **A**: title rises as one mask-revealed line; icons are simply present with a single quiet
  fade-in, no scroll choreography.

- [ ] **Step 5: Verify build**

Run: `npm run lint`
Expected: no new TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: add Contact title/icon variant treatment for Variant A"
```

---

### Task 12: Cross-variant verification pass

**Files:** none (verification only)

- [ ] **Step 1: Golden path, each variant**

With `npm run dev` running, for each of A / A2 / B: hard-reload, watch the preloader through
to Home, scroll through Portfolio, open and close each project preview, scroll to Contact.
Confirm the switcher panel correctly changes behavior and the choice persists across reload.

- [ ] **Step 2: Reduced motion, Variant A (full depth)**

Emulate `prefers-reduced-motion: reduce`. Reload with Variant A selected. Confirm: preloader
handoff is a near-instant opacity change with no Arrival choreography stall, Home/Portfolio/
Contact titles appear with no blur/slide, Portfolio's modal open/close doesn't leave the
backdrop or card in a stuck intermediate state.

- [ ] **Step 3: Reduced motion, spot-check A2 and B**

Repeat the reload check from Step 2 for A2 and B — confirm no stuck states, since these share
most of the same code paths as A but were not exercised as deeply.

- [ ] **Step 4: Slow/deliberate scroll**

In Variant A, scroll Portfolio and Contact slowly (not a fast fling) — confirm the simplified
presence-only reveals don't flicker or double-fire, and `whileInView` triggers don't refire on
scroll-up/scroll-down.

- [ ] **Step 5: Resize**

At both desktop and mobile breakpoints (resize the browser across the `md:` breakpoint),
confirm the navbar underline recalculates correctly after the Arrival sequence, and that
Home/Portfolio/Contact's existing mobile layouts are unaffected by any variant.

- [ ] **Step 6: Record which variant is chosen**

Ask the site owner which variant to keep. Note the answer — it drives Task 13.

---

### Task 13: Simplify — collapse to the chosen variant

**Files:** all files touched in Tasks 2-11, plus deletion of `src/motionLab/`

- [ ] **Step 1: Invoke the simplify skill**

Once a variant is chosen, use the `simplify` skill against the diff introduced by this whole
plan (Tasks 1-11) to remove the two non-chosen variants' branches, replacing each
`variant === 'x' ? ... : ...` with just the chosen branch's code, inlined.

- [ ] **Step 2: Delete the temporary harness**

```bash
rm -rf src/motionLab
```
Remove the `MotionLabProvider`/`useMotionVariant`/`MotionLabPanel` imports and usage from
`src/App.tsx`, `src/pages/Portfolio.tsx`, `src/pages/Contact.tsx` — un-wrap `AppInner` back
into a single `App` component if the wrapper is no longer needed for any other reason.

- [ ] **Step 3: Verify build**

Run: `npm run lint`
Expected: no TypeScript errors, no remaining references to `motionLab` or `MotionVariant`
anywhere (`grep -rn "motionLab\|MotionVariant" src/` should return nothing).

- [ ] **Step 4: Final manual pass**

Repeat Task 12's golden-path, reduced-motion, slow-scroll, and resize checks one more time
against the single remaining implementation.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: collapse motion craft pass to the chosen variant, remove motion lab"
```

---

### Task 14: Flag for review

- [ ] **Step 1: Summarize the change for the site owner**

State what shipped (the chosen variant's Arrival sequence, Portfolio morph treatment,
Contact treatment, the new `src/lib/motion.ts` constants module, the reduced-motion audit),
and that the temporary comparison harness has been fully removed. Ask if they want a PR
opened, or if they'll review the working tree directly.
