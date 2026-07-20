import Grain from "../shared/Grain";
import { useAtmosphere } from "../shared/useAtmosphere";
import ForestMotes from "./ForestMotes";

/**
 * Direction A's background: the forest room, lit rather than flat. Three
 * tonal-green layers track scroll (via useAtmosphere), plus a slow ambient
 * drift so the room still breathes when the page is still, plus film grain
 * so the flat green reads as material.
 */
export default function NocturneAtmosphere() {
  const { y, opacity } = useAtmosphere();

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-theme-bg">
      {/* Base depth: darkens toward the edges so the room has walls, not just a lit ceiling */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140vw 120vh at 50% 40%, transparent 0%, transparent 45%, rgba(10,20,12,0.35) 100%)",
        }}
      />
      {/* Primary light: the scroll-linked bloom */}
      <div
        className="craft-a-drift absolute inset-0"
        style={{
          transform: `translate3d(0, ${y}vh, 0)`,
          opacity,
          background:
            "radial-gradient(ellipse 130vw 90vh at 50% 0%, rgba(58,92,64,0.42) 0%, rgba(44,74,50,0.16) 38%, transparent 68%)",
        }}
      />
      {/* Secondary bloom, drifting the opposite direction for parallax depth */}
      <div
        className="craft-a-drift-slow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90vw 60vh at 15% 70%, rgba(44,74,50,0.14) 0%, transparent 60%)",
        }}
      />
      {/* Third, warmer glow low-right, mostly static — gives the room a second light source */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70vw 50vh at 85% 85%, rgba(66,88,58,0.12) 0%, transparent 55%)",
        }}
      />
      <ForestMotes parallaxY={y} />
      <Grain variant="film" />
    </div>
  );
}
