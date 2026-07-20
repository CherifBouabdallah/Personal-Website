import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "../lib/gsapSetup";
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

/**
 * Desktop-only, reduced-motion-safe: gently pulls scroll toward this
 * section's top edge when a scroll gesture settles mid-transition. Uses a
 * self-contained ScrollTrigger with `snap` on the normal scroll position
 * (no pinning, no spacer, so MainPage's scroll-spy math is untouched) and
 * kills it on unmount / breakpoint change so route changes never leave an
 * orphaned trigger behind.
 */
export function useSectionSnap(sectionRef: RefObject<HTMLElement | null>) {
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;

    const mq = window.matchMedia("(min-width: 768px)");
    let trigger: ScrollTrigger | null = null;

    const sync = () => {
      trigger?.kill();
      trigger = null;
      if (!mq.matches) return;
      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "top top",
        snap: { snapTo: 1, duration: { min: 0.25, max: 0.6 }, delay: 0.15, ease: "power1.inOut" },
      });
    };

    sync();
    mq.addEventListener("change", sync);

    return () => {
      mq.removeEventListener("change", sync);
      trigger?.kill();
    };
  }, [sectionRef, reduced]);
}
