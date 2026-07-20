import { useMotionPrefs } from "../../lib/motion";

interface Mote {
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Fixed positions/timings so motes never sync into a visible pattern —
// randomized once at module load, not per-render.
const MOTES: Mote[] = Array.from({ length: 16 }, (_, i) => {
  // Deterministic pseudo-random spread (no Math.random re-roll per render).
  const seed = i * 137.508; // golden angle, gives an even scattered spread
  const top = (seed * 1.7) % 100;
  const left = (seed * 2.3) % 100;
  return {
    top,
    left,
    size: 2 + ((i * 7) % 5), // 2-6px
    duration: 18 + ((i * 11) % 23), // 18-40s
    delay: -((i * 13) % 30), // negative delay so they start mid-cycle, not all at once
    opacity: 0.15 + ((i * 3) % 10) / 40, // 0.15-0.4
  };
});

/**
 * Forest dust motes — small soft-glow particles drifting slowly upward, like
 * dust or pollen catching light in a forest canopy. Purely decorative, sits
 * between the base gradients and the grain in NocturneAtmosphere.
 */
export default function ForestMotes({ parallaxY }: { parallaxY: number }) {
  const { reduced } = useMotionPrefs();

  return (
    <div
      className="absolute inset-0"
      style={{ transform: reduced ? undefined : `translate3d(0, ${parallaxY * 0.4}vh, 0)` }}
    >
      {MOTES.map((m, i) => (
        <span
          key={i}
          className={reduced ? undefined : "craft-a-mote"}
          style={{
            position: "absolute",
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            borderRadius: "50%",
            background: "rgba(246, 240, 223, 1)",
            opacity: m.opacity,
            filter: `blur(${m.size * 0.6}px)`,
            animationDuration: reduced ? undefined : `${m.duration}s`,
            animationDelay: reduced ? undefined : `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
