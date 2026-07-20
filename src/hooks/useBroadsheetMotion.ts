import { useEffect, type RefObject } from "react";
import { gsap } from "../lib/gsapSetup";
import { useMotionPrefs } from "../lib/motion";

/**
 * The "plate strike" headline reveal: split-line units drop in from above and
 * overshoot slightly on landing, like a letterpress plate hitting paper.
 * Drives `[data-split-unit]` children of `containerRef` (see SplitLine).
 *
 * `enabled` gates the effect until fonts have loaded (so Maghfirea's real
 * metrics are in place before GSAP measures anything) — pass `false` until
 * then and flip it to `true` once ready.
 */
export function usePlateStrike(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: { stagger?: number; distance?: number }
) {
  const { reduced } = useMotionPrefs();
  const stagger = options?.stagger ?? 0.05;
  const distance = options?.distance ?? -28;

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;
    const units = gsap.utils.toArray<HTMLElement>("[data-split-unit]", el);
    if (units.length === 0) return;

    if (reduced) {
      gsap.set(units, { y: 0, opacity: 1, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(units, { y: distance, opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } }).to(units, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "back.out(1.7)",
        stagger,
      });
    }, el);

    return () => ctx.revert();
  }, [containerRef, enabled, reduced, stagger, distance]);
}
