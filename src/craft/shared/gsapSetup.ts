import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let bridged = false;

/**
 * Syncs ScrollTrigger to the app's existing Lenis instance (stored on
 * window.__lenis by App.tsx). App.tsx already drives Lenis with its own
 * requestAnimationFrame loop — this only adds the scroll listener so
 * ScrollTrigger recalculates on Lenis's eased scroll, not raw wheel deltas.
 * It must NOT also drive lenis.raf() here, or Lenis would be stepped twice
 * per frame (once by App.tsx's loop, once by gsap.ticker).
 */
export function bridgeLenisToScrollTrigger() {
  if (bridged) return;
  const lenis = (window as any).__lenis;
  if (!lenis) return;

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
  bridged = true;
}

export { gsap, ScrollTrigger };
