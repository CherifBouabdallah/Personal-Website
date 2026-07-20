import "./kinetic.css";
import Grain from "../shared/Grain";
import DriftingMarks from "./DriftingMarks";

/**
 * Direction C's background. The thesis is restraint — type carries the page,
 * not atmosphere — so this stays minimal: a faint static centered glow (just
 * enough that the flat green reads as a surface, not a void) plus film grain.
 * No scroll-linked movement, unlike Direction A's Nocturne — the discipline
 * here is what makes the kinetic type read as loud by comparison.
 */
export default function KineticBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-theme-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90vw 70vh at 50% 35%, rgba(52,82,58,0.22) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120vw 100vh at 50% 50%, transparent 40%, rgba(8,16,10,0.3) 100%)",
        }}
      />
      <DriftingMarks />
      <Grain variant="film" opacity={0.025} />
    </div>
  );
}
