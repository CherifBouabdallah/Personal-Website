import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRouteFonts, MONOCHROME_FONTS_HREF } from "../hooks/useRouteFonts";
import { useMotionPrefs, EASE_ENTER } from "../lib/motion";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";
import { gsap } from "../lib/gsapSetup";

// ---------------------------------------------------------------- tokens
const DISPLAY = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// RNRN.txt required textures — rendered as absolutely-positioned overlays.
const TEXTURE: Record<"lines" | "grid" | "diag" | "vlinesWhite", React.CSSProperties> = {
  lines: {
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
    backgroundSize: "100% 4px",
    opacity: 0.015,
  },
  grid: {
    backgroundImage:
      "linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.4,
  },
  diag: {
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 40px, #00000010 40px, #00000010 42px)",
    opacity: 0.5,
  },
  vlinesWhite: {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent, transparent 1px, #fff 1px, #fff 2px)",
    backgroundSize: "4px 100%",
    opacity: 0.03,
  },
};

function Texture({ style }: { style: React.CSSProperties }) {
  return <div aria-hidden className="pointer-events-none absolute inset-0" style={style} />;
}

// ---------------------------------------------------------------- helpers
const dead = (e: React.SyntheticEvent) => e.preventDefault();

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_ENTER } },
};

function Rule({ weight = 4, className = "", animated = false }: {
  weight?: 1 | 2 | 4 | 8; className?: string; animated?: boolean;
}) {
  return (
    <div
      aria-hidden
      data-rule={animated || undefined}
      className={`w-full bg-black origin-left ${className}`}
      style={{ height: weight }}
    />
  );
}

function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <p className="text-[11px] tracking-[0.25em] uppercase text-[#525252]" style={MONO}>
      {n} — {label}
    </p>
  );
}

function ImagePlaceholder({ description, treatment = "GRAYSCALE · HIGH CONTRAST", aspect = "4 / 5", inverted = false, className = "" }: {
  description: string; treatment?: string; aspect?: string; inverted?: boolean; className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-2 ${inverted ? "border-white bg-black" : "border-black bg-[#F5F5F5]"} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={inverted ? "#3F3F3F" : "#D4D4D4"} strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={inverted ? "#3F3F3F" : "#D4D4D4"} strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className={`border px-4 py-3 text-center max-w-[36ch] ${inverted ? "border-white bg-black text-white" : "border-black bg-white"}`}>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={MONO}>[ image ]</p>
          <p className={`mt-2 text-[10px] leading-relaxed uppercase tracking-wider ${inverted ? "text-[#A3A3A3]" : "text-[#525252]"}`} style={MONO}>
            {description}
          </p>
          <p className={`mt-2 text-[9px] tracking-[0.2em] ${inverted ? "text-[#A3A3A3]" : "text-[#525252]"}`} style={MONO}>{treatment}</p>
        </div>
      </div>
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) { setCount(target); return; }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const durationMs = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        setCount(Math.floor((1 - Math.pow(1 - progress, 4)) * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [target, reduced]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

// ---------------------------------------------------------------- page
interface SoccerTeamProps {
  isPreview?: boolean;
  onClose?: () => void;
  isCardPreview?: boolean;
}

export default function SoccerTeam({ isPreview = false, onClose, isCardPreview = false }: SoccerTeamProps) {
  useRouteFonts([MONOCHROME_FONTS_HREF]);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, []);

  // GSAP reveals only make sense against the window scroller — disabled in
  // the Portfolio modal, where the page scrolls inside a div.
  const gsapReveals = fontsReady && !isPreview && !isCardPreview;

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black selection:bg-black selection:text-white"
      style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
    >
      {/* global paper noise */}
      <div
        aria-hidden
        className={`${isPreview ? "absolute" : "fixed"} inset-0 pointer-events-none z-40`}
        style={{ backgroundImage: NOISE_BG, opacity: 0.02 }}
      />

      {/* ------------------------------------------------ header */}
      <header className={`${isPreview ? "absolute" : "fixed"} top-0 left-0 w-full z-50 bg-white border-b border-black`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 select-none">
            <span aria-hidden className="block w-2 h-2 bg-black" />
            <span className="text-lg font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Squad", "Fixtures", "Arena", "Club"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-black focus-visible:border-black focus-visible:outline-none transition-none py-2"
                style={MONO}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { if (onClose) onClose(); else navigate("/portfolio"); }}
              className="text-[10px] tracking-[0.25em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-2 min-h-[44px] px-2 cursor-pointer"
              style={MONO}
            >
              {onClose ? "Close" : "Back"}
            </button>
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 bg-black text-white px-5 min-h-[44px] text-[10px] tracking-[0.25em] uppercase font-medium border border-black hover:bg-white hover:text-black transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
              style={MONO}
            >
              Season Tickets <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* SECTIONS — inserted in spec order */}
      </main>

      {/* ------------------------------------------------ footer */}
      <footer className="relative border-t border-black py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="block w-2 h-2 bg-black" />
            <span className="text-base font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Press"].map((item) => (
              <a key={item} href="#" onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-black focus-visible:border-black focus-visible:outline-none py-2"
                style={MONO}>
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#525252]" style={MONO}>
            © {new Date().getFullYear()} Olympus FC — A design study
          </p>
        </div>
      </footer>
    </div>
  );
}
