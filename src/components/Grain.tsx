interface GrainProps {
  opacity?: number;
  className?: string;
}

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Fine paper-tooth grain texture, multiply-blended over a section. */
export default function Grain({ opacity = 0.05, className = "" }: GrainProps) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      // ponytail: dropped mix-blend-mode:multiply — it forced a full-viewport
      // re-blend against scrolling content every frame (measured ~6x more long
      // frames). translateZ(0) promotes to a cheap, cached GPU layer instead.
      style={{ opacity, transform: "translateZ(0)", backgroundImage: `url("${NOISE_SVG}")` }}
    />
  );
}
