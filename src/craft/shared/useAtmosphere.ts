import { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { useMotionPrefs } from "../../lib/motion";

export interface Atmosphere {
  /** vh offset of the light source, top of viewport = 0 */
  y: number;
  opacity: number;
}

// "Walking through a lit room": light starts overhead on Home, sinks and
// dims to near-dark at the Home->Portfolio seam (the spotlight moment), then
// rises to its brightest behind Contact.
const KEYFRAMES: Atmosphere[] & { at: number }[] = [
  { at: 0, y: 0, opacity: 1 },
  { at: 0.38, y: 55, opacity: 0.22 },
  { at: 0.7, y: 30, opacity: 0.6 },
  { at: 1, y: 8, opacity: 0.95 },
] as any;

function sampleAt(progress: number): Atmosphere {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (progress >= a.at && progress <= b.at) {
      const t = (progress - a.at) / (b.at - a.at || 1);
      return {
        y: gsap.utils.interpolate(a.y, b.y, t),
        opacity: gsap.utils.interpolate(a.opacity, b.opacity, t),
      };
    }
  }
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  return { y: last.y, opacity: last.opacity };
}

/**
 * Maps whole-page scroll progress to the Nocturne light source's position
 * and intensity. Reduced motion holds at the midpoint (no scroll-driven
 * movement, but the room still reads as lit rather than flat).
 */
export function useAtmosphere(): Atmosphere {
  const { reduced } = useMotionPrefs();
  const [state, setState] = useState<Atmosphere>(sampleAt(0));

  useEffect(() => {
    if (reduced) {
      setState(sampleAt(0.5));
      return;
    }
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.6,
      onUpdate: (self) => setState(sampleAt(self.progress)),
    });
    return () => trigger.kill();
  }, [reduced]);

  return state;
}
