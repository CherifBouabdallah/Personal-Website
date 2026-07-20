interface GrainProps {
  /** "film" = variant A's soft overlay grain. "paper" = variant B's finer,
   * multiply-blended paper tooth. */
  variant?: "film" | "paper";
  opacity?: number;
  className?: string;
}

const FREQ = { film: 0.85, paper: 0.5 } as const;
const BLEND = { film: "overlay", paper: "multiply" } as const;
const DEFAULT_OPACITY = { film: 0.035, paper: 0.05 } as const;

function noiseSvg(freq: number) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`;
}

export default function Grain({ variant = "film", opacity, className = "" }: GrainProps) {
  return (
    <div
      aria-hidden
      className={`fixed inset-0 pointer-events-none z-40 ${className}`}
      style={{
        opacity: opacity ?? DEFAULT_OPACITY[variant],
        mixBlendMode: BLEND[variant] as any,
        backgroundImage: `url("${noiseSvg(FREQ[variant])}")`,
      }}
    />
  );
}
