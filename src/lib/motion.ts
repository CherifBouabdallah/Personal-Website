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
