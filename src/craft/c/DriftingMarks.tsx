import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../shared/gsapSetup";
import { useMotionPrefs } from "../../lib/motion";

type MarkType = "circle" | "cross" | "grid";

interface Mark {
  type: MarkType;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Fixed scattered positions/timings — deterministic, not re-rolled per render.
const MARKS: Mark[] = Array.from({ length: 8 }, (_, i) => {
  const seed = i * 137.508; // golden angle spread
  const types: MarkType[] = ["circle", "cross", "grid"];
  return {
    type: types[i % types.length],
    top: (seed * 1.3) % 100,
    left: (seed * 2.1) % 100,
    size: 24 + ((i * 9) % 40),
    duration: 26 + ((i * 13) % 28),
    delay: -((i * 17) % 30),
    opacity: 0.1 + ((i * 4) % 10) / 50,
  };
});

function MarkShape({ type }: { type: MarkType }) {
  const stroke = "rgba(246, 240, 223, 1)";
  if (type === "circle") {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="0.75" />
      </svg>
    );
  }
  if (type === "cross") {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <path d="M12 3v18M3 12h18" stroke={stroke} strokeWidth="0.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
      <path d="M2 8h14M8 2v14" stroke={stroke} strokeWidth="0.75" />
    </svg>
  );
}

/**
 * Drifting geometric marks — thin-line circles/crosses/grid fragments that
 * drift and rotate very slowly. Restrained, not lively: this direction's
 * thesis is discipline, so the marks stay precise rather than playful.
 */
export default function DriftingMarks() {
  const { reduced } = useMotionPrefs();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: "-6vh",
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => document.documentElement.scrollHeight - window.innerHeight,
          scrub: 0.6,
        },
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {MARKS.map((m, i) => (
        <div
          key={i}
          className={reduced ? undefined : "craft-c-mark"}
          style={{
            position: "absolute",
            top: `${m.top}%`,
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animationDuration: reduced ? undefined : `${m.duration}s`,
            animationDelay: reduced ? undefined : `${m.delay}s`,
          }}
        >
          <MarkShape type={m.type} />
        </div>
      ))}
    </div>
  );
}
