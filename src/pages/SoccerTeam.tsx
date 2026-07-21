import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouteFonts, MONOCHROME_FONTS_HREF } from "../hooks/useRouteFonts";
import { useMotionPrefs, EASE_ENTER } from "../lib/motion";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";
import { gsap, ScrollTrigger } from "../lib/gsapSetup";
import DitherField from "../components/DitherField";
import BackToPortfolioButton from "../components/BackToPortfolioButton";

// ---------------------------------------------------------------- tokens
// Luxury matchday-programme palette:
//   paper  #F4EFE4  warm ivory        ink   #0D0C0A  warm near-black
//   pine   #14261E  deep green        gold  #A07C3E  antique gold (on light)
//   champ  #D8BC80  champagne gold (on dark)
//   muted  #6E6555  secondary text    hair  #DAD1BD  hairlines on light
const DISPLAY = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const INK = "#0D0C0A";
const CHAMP = "#D8BC80";
const GOLD = "#A07C3E";

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Layered print textures — rendered as absolutely-positioned overlays.
const TEXTURE: Record<"lines" | "grid" | "diag" | "vlinesGold", React.CSSProperties> = {
  lines: {
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 1px, #0D0C0A 1px, #0D0C0A 2px)",
    backgroundSize: "100% 4px",
    opacity: 0.02,
  },
  grid: {
    backgroundImage:
      "linear-gradient(#0D0C0A08 1px, transparent 1px), linear-gradient(90deg, #0D0C0A08 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.4,
  },
  diag: {
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 40px, #0D0C0A10 40px, #0D0C0A10 42px)",
    opacity: 0.5,
  },
  vlinesGold: {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent, transparent 1px, #D8BC80 1px, #D8BC80 2px)",
    backgroundSize: "4px 100%",
    opacity: 0.05,
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

const RULE_TONE = {
  ink: "bg-[#0D0C0A]",
  gold: "bg-[#A07C3E]",
  champagne: "bg-[#D8BC80]",
  paper: "bg-[#F4EFE4]",
} as const;

function Rule({ weight = 4, tone = "ink", className = "", animated = false }: {
  weight?: 1 | 2 | 4 | 8; tone?: keyof typeof RULE_TONE; className?: string; animated?: boolean;
}) {
  return (
    <div
      aria-hidden
      data-rule={animated || undefined}
      className={`w-full origin-left ${RULE_TONE[tone]} ${className}`}
      style={{ height: weight }}
    />
  );
}

function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <p className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase text-[#6E6555]" style={MONO}>
      <span aria-hidden className="block w-2 h-2 bg-[#A07C3E]" />
      {n} — {label}
    </p>
  );
}

function ImagePlaceholder({ src, alt, description, treatment = "GRAYSCALE · HIGH CONTRAST", aspect = "4 / 5", inverted = false, className = "" }: {
  src?: string; alt?: string; description: string; treatment?: string; aspect?: string; inverted?: boolean; className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden border-2 ${inverted ? "border-[#D8BC80] bg-[#0F1E17]" : "border-[#0D0C0A] bg-[#EDE6D6]"} ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt ?? description}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border-2 ${inverted ? "border-[#D8BC80] bg-[#0F1E17]" : "border-[#0D0C0A] bg-[#EDE6D6]"} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={inverted ? "#3A4A3F" : "#D5CCB8"} strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={inverted ? "#3A4A3F" : "#D5CCB8"} strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className={`border px-4 py-3 text-center max-w-[36ch] ${inverted ? "border-[#D8BC80] bg-[#14261E] text-[#F4EFE4]" : "border-[#0D0C0A] bg-[#F4EFE4]"}`}>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={MONO}>[ image ]</p>
          <p className={`mt-2 text-[10px] leading-relaxed uppercase tracking-wider ${inverted ? "text-[#B9A97E]" : "text-[#6E6555]"}`} style={MONO}>
            {description}
          </p>
          <p className={`mt-2 text-[9px] tracking-[0.2em] ${inverted ? "text-[#B9A97E]" : "text-[#6E6555]"}`} style={MONO}>{treatment}</p>
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

// ponytail: default 3 layers (was 5) — backdrop-filter stacks are the main scroll cost
function GradualBlur({ direction, steps = [1, 3, 8] }: { direction: "bottom" | "left" | "right"; steps?: number[] }) {
  const toEdge = direction === "bottom" ? "to top" : direction === "left" ? "to right" : "to left";
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {steps.map((px, i) => {
        // each layer blurs a progressively nearer-the-edge band
        const from = 100 - (i + 1) * (100 / steps.length);
        const mask = `linear-gradient(${toEdge}, black ${from}%, transparent ${Math.min(from + 100 / steps.length + 10, 100)}%)`;
        return (
          <div key={px} className="absolute inset-0"
            style={{ backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`, maskImage: mask, WebkitMaskImage: mask }} />
        );
      })}
    </div>
  );
}

/** Draws every [data-rule] in from the left on scroll, once. Window scroller only. */
function useRuleDraw(rootRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    if (!enabled || reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((rule) => {
        gsap.fromTo(rule, { scaleX: 0 }, {
          scaleX: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rule, start: "top 92%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [rootRef, enabled, reduced]);
}

/**
 * Scroll choreography (window scroller only):
 *  - [data-drift="N"]    vertical parallax, N px each way, scrubbed
 *  - [data-drift-x="N"]  horizontal drift in xPercent, scrubbed (bg words)
 *  - [data-wipe]         clip-path wipe reveal, once
 *  - [data-hero-drift]   hero content recedes and fades as it scrolls out
 */
function useScrollFx(rootRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    if (!enabled || reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((node) => {
        const amount = parseFloat(node.dataset.drift || "60");
        gsap.fromTo(node, { y: amount }, {
          y: -amount, ease: "none",
          scrollTrigger: { trigger: node.parentElement ?? node, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-drift-x]").forEach((node) => {
        const amount = parseFloat(node.dataset.driftX || "12");
        gsap.fromTo(node, { xPercent: amount }, {
          xPercent: -amount, ease: "none",
          scrollTrigger: { trigger: node.parentElement ?? node, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((node) => {
        gsap.fromTo(node, { clipPath: "inset(0% 100% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut",
          scrollTrigger: { trigger: node, start: "top 80%", once: true },
        });
      });
      const hero = el.querySelector<HTMLElement>("[data-hero-drift]");
      if (hero) {
        gsap.to(hero, {
          yPercent: -10, opacity: 0.35, ease: "none",
          scrollTrigger: { trigger: hero.closest("section"), start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [rootRef, enabled, reduced]);
}



/**
 * Pin-and-reveal for the featured player section: pins the section for one
 * viewport of scroll and reveals its content across that pinned range,
 * instead of a plain scroll-into-view fade — the "sticky intro" pattern.
 */
function useFeaturedPin(
  pinnedRef: React.RefObject<HTMLElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    if (!enabled || reduced) return;
    const pinnedSection = pinnedRef.current;
    const section = sectionRef.current;
    if (!pinnedSection || !section) return;

    const kicker = section.querySelector<HTMLElement>("[data-feat-kicker]");
    const numeral = section.querySelector<HTMLElement>("[data-feat-numeral]");
    const name = section.querySelector<HTMLElement>("[data-feat-name]");
    const portrait = section.querySelector<HTMLElement>("[data-feat-portrait]");
    const stats = section.querySelector<HTMLElement>("[data-feat-stats]");
    if (!kicker || !numeral || !name || !portrait || !stats) return;

    const ctx = gsap.context(() => {
      // 1. Freeze/pin the preceding intro section ONLY while the card section is sliding up over it
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "top top",
        pin: pinnedSection,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      gsap.set(kicker, { opacity: 0, y: 20 });
      gsap.set(numeral, { opacity: 0, y: 80 });
      gsap.set(name, { opacity: 0, y: 24 });
      gsap.set(portrait, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(stats, { opacity: 0, y: 24 });

      // 2. Extra-rounded dynamic corner flattening (3.5rem / 56px -> 0rem) as card approaches top: 0
      gsap.fromTo(
        section,
        { borderTopLeftRadius: "3.5rem", borderTopRightRadius: "3.5rem" },
        {
          borderTopLeftRadius: "0rem",
          borderTopRightRadius: "0rem",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // 3. Interior content reveal timeline for the card section
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      })
        .to(kicker, { opacity: 1, y: 0, duration: 0.15 })
        .to(numeral, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "<0.05")
        .to(portrait, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: "power2.out" }, "<")
        .to(name, { opacity: 1, y: 0, duration: 0.2 }, "-=0.15")
        .to(stats, { opacity: 1, y: 0, duration: 0.2 }, "-=0.1");
    });

    ScrollTrigger.refresh();
    (window as any).__lenis?.resize();

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
      (window as any).__lenis?.resize();
    };
  }, [pinnedRef, sectionRef, enabled, reduced]);
}

/**
 * Endless marquee driven by GSAP; when velocityReactive, scroll speed
 * multiplies the marquee's timeScale, which then eases back to 1.
 */
function useMarquee(
  trackRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  velocityReactive: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const track = trackRef.current;
    if (!track) return;
    const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
    let st: ScrollTrigger | undefined;
    const proxy = { ts: 1 };
    if (velocityReactive) {
      st = ScrollTrigger.create({
        onUpdate(self) {
          const v = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 700);
          if (v > proxy.ts) {
            proxy.ts = v;
            gsap.to(proxy, {
              ts: 1, duration: 1.4, ease: "power2.out", overwrite: true,
              onUpdate: () => tween.timeScale(proxy.ts),
            });
          }
        },
      });
    }
    return () => { st?.kill(); tween.kill(); };
  }, [trackRef, enabled, velocityReactive]);
}

// ---------------------------------------------------------------- data
const SQUAD = [
  {
    group: "Goalkeepers", players: [
      { n: 1, name: "Álvaro Montero", pos: "Goalkeeper", nat: "COL" },
    ]
  },
  {
    group: "Defenders", players: [
      { n: 2, name: "James O'Brien", pos: "Right-Back", nat: "IRL" },
      { n: 3, name: "Yuto Nakamura", pos: "Left-Back", nat: "JPN" },
      { n: 4, name: "Lucas Delvaux", pos: "Centre-Back", nat: "BEL" },
      { n: 5, name: "Karim Hadj", pos: "Centre-Back", nat: "ALG" },
    ]
  },
  {
    group: "Midfielders", players: [
      { n: 6, name: "André Ferreira", pos: "Defensive Mid", nat: "POR" },
      { n: 8, name: "Sami El-Masri", pos: "Central Mid", nat: "EGY" },
      { n: 10, name: "Nils Eriksen", pos: "Attacking Mid", nat: "NOR" },
    ]
  },
  {
    group: "Forwards", players: [
      { n: 7, name: "Diego Vargas", pos: "Right Wing", nat: "ARG" },
      { n: 9, name: "Luca Moretti", pos: "Striker", nat: "ITA" },
      { n: 11, name: "Moussa Diallo", pos: "Left Wing", nat: "SEN" },
    ]
  },
];

const FIXTURES = [
  { home: "Olympus FC", away: "Titan Athletic", date: "Jun 08", venue: "Olympus Arena", score: "3–1" },
  { home: "Nova United", away: "Olympus FC", date: "Jun 15", venue: "Nova Park", score: "1–2" },
  { home: "Olympus FC", away: "Stellar FC", date: "Jun 22", venue: "Olympus Arena", score: null },
  { home: "Phoenix Rising", away: "Olympus FC", date: "Jun 29", venue: "Phoenix Stadium", score: null },
  { home: "Olympus FC", away: "Apex City", date: "Jul 06", venue: "Olympus Arena", score: null },
] as const;

// ---------------------------------------------------------------- page
interface SoccerTeamProps {
  isPreview?: boolean;
  onClose?: () => void;
  isCardPreview?: boolean;
}

export default function SoccerTeam({ isPreview = false, onClose, isCardPreview = false }: SoccerTeamProps) {
  useRouteFonts([MONOCHROME_FONTS_HREF]);
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, []);

  // GSAP scroll reveals only make sense against the window scroller —
  // disabled in the Portfolio modal, where the page scrolls inside a div.
  const gsapReveals = fontsReady && !isPreview && !isCardPreview;

  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pinnedTeamRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useRuleDraw(rootRef, gsapReveals);
  useScrollFx(rootRef, gsapReveals);
  usePlateStrike(heroRef, gsapReveals, { stagger: 0.08, distance: -40 });
  usePlateStrike(manifestoRef, gsapReveals, { stagger: 0.06 });
  usePlateStrike(ctaRef, gsapReveals, { stagger: 0.07 });
  useFeaturedPin(pinnedTeamRef, featuredRef, gsapReveals);
  useMarquee(marqueeRef, !reduced && !isCardPreview, gsapReveals);

  useEffect(() => {
    if (!gsapReveals) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      (window as any).__lenis?.resize();
    }, 100);
    return () => clearTimeout(timer);
  }, [gsapReveals]);

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-screen overflow-x-hidden bg-[#F4EFE4] text-[#0D0C0A] selection:bg-[#A07C3E] selection:text-[#F4EFE4]"
      style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
    >
      {!isPreview && <BackToPortfolioButton />}
      {/* global paper noise */}
      <div
        aria-hidden
        className={`${isPreview ? "absolute" : "fixed"} inset-0 pointer-events-none z-40`}
        style={{ backgroundImage: NOISE_BG, opacity: 0.02 }}
      />

      {/* ------------------------------------------------ header */}
      <header className={`${isPreview ? "absolute" : "fixed"} top-0 left-0 w-full z-50 bg-[#F4EFE4] border-b border-[#0D0C0A]`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 select-none">
            <span aria-hidden className="block w-2 h-2 bg-[#A07C3E]" />
            <span className="text-lg font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Squad", "Fixtures", "Arena", "Club"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-[#A07C3E] focus-visible:border-[#A07C3E] focus-visible:outline-none transition-none py-2"
                style={MONO}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="text-[10px] tracking-[0.25em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0D0C0A] focus-visible:outline-offset-2 min-h-[44px] px-2 cursor-pointer"
              style={MONO}
            >
              {onClose ? "Close" : "Back"}
            </button>
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 bg-[#0D0C0A] text-[#F4EFE4] px-5 min-h-[44px] text-[10px] tracking-[0.25em] uppercase font-medium border border-[#0D0C0A] hover:bg-[#A07C3E] hover:text-[#0D0C0A] hover:border-[#A07C3E] transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0D0C0A] focus-visible:outline-offset-[3px] cursor-pointer"
              style={MONO}
            >
              Season Tickets <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ---------------------------------------------- 00 · hero (dark, matching the sections below) */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-16 bg-[#0D0C0A] text-[#F4EFE4]">
          {/* champagne dot-dither field, full-bleed (PixelBlast-style circle variant) */}
          <div aria-hidden className="absolute inset-0 opacity-50">
            <DitherField animate={!isCardPreview && !reduced} speed={0.4} pixelSize={3.5} dot ink={CHAMP} paper={INK} />
          </div>
          <Texture style={TEXTURE.vlinesGold} />

          <div ref={heroRef} data-hero-drift className="relative max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12 py-24">
            {/* kicker */}
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-[#D8BC80]" />
              <p className="text-[11px] tracking-[0.3em] uppercase" style={MONO}>
                Est. 2018 — Athletic Club — Division I
              </p>
              <span aria-hidden className="h-px flex-1 bg-[#D8BC80]/40" />
            </div>

            {/* headline */}
            <h1
              className="mt-8 font-black uppercase leading-[0.85] tracking-tighter text-[clamp(4rem,17vw,15rem)]"
              style={DISPLAY}
            >
              <SplitLine text="OLYMPUS" />
            </h1>
            <p className="mt-2 md:text-right italic text-[clamp(1.75rem,5vw,4rem)] leading-none text-[#D8BC80]" style={DISPLAY}>
              <SplitLine text="Football Club" />
            </p>

            {/* thick rule terminated by a bordered square */}
            <div className="mt-10 flex items-center gap-3">
              <Rule weight={4} tone="champagne" animated className="flex-1" />
              <span aria-hidden className="block w-3 h-3 border-2 border-[#D8BC80] shrink-0" />
            </div>

            {/* meta + CTAs */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div className="flex flex-wrap items-center gap-4">
                <button type="button"
                  className="flex items-center gap-2 bg-[#D8BC80] text-[#0D0C0A] px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border border-[#D8BC80] hover:bg-[#F4EFE4] hover:border-[#F4EFE4] transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#D8BC80] focus-visible:outline-offset-[3px] cursor-pointer"
                  style={MONO}>
                  Match Programme <span aria-hidden>→</span>
                </button>
                <button type="button"
                  className="px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border-2 border-[#F4EFE4]/70 text-[#F4EFE4] hover:bg-[#F4EFE4] hover:text-[#0D0C0A] transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#F4EFE4] focus-visible:outline-offset-[3px] cursor-pointer"
                  style={MONO}>
                  The Squad
                </button>
              </div>

              <motion.dl
                variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="justify-self-stretch md:justify-self-end w-full md:max-w-xs text-[11px] uppercase tracking-[0.15em]"
                style={MONO}
              >
                {[
                  ["Next fixture", "Olympus v Stellar FC — Jun 22"],
                  ["Kick-off", "21:00 — Olympus Arena"],
                  ["Position", "1st — Division I"],
                ].map(([k, v]) => (
                  <motion.div key={k} variants={fadeUp} className="flex justify-between gap-6 border-t border-[#F4EFE4]/20 py-3 last:border-b">
                    <dt className="text-[#F4EFE4]/50">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- marquee */}
        <section aria-hidden className="relative bg-[#14261E] text-[#D8BC80] overflow-hidden select-none">
          <Rule weight={4} tone="gold" className="absolute top-0" />
          <div className="py-6 overflow-hidden relative">
            <div ref={marqueeRef} className="flex w-max whitespace-nowrap will-change-transform">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center">
                  {["Olympus FC", "Est. MMXVIII", "Fortuna Audaces Iuvat", "The Unbeaten Treble"].map((text) => (
                    <span key={text} className="flex items-center">
                      <span className="px-8 text-2xl md:text-3xl uppercase font-bold tracking-tight" style={DISPLAY}>{text}</span>
                      <span className="block w-2 h-2 bg-[#D8BC80]" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {/* gradual blur at both ends of the band */}
            <div className="absolute inset-y-0 left-0 w-24"><GradualBlur direction="left" /></div>
            <div className="absolute inset-y-0 right-0 w-24"><GradualBlur direction="right" /></div>
          </div>
          <Rule weight={4} tone="gold" className="absolute bottom-0" />
        </section>

        {/* ---------------------------------------------- 01 · the club */}
        <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
          <Texture style={TEXTURE.grid} />
          {/* outlined background word, drifting horizontally on scroll */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 overflow-hidden">
            <p
              data-drift-x="8"
              className="whitespace-nowrap text-center uppercase font-black leading-none text-[20vw]"
              style={{ ...DISPLAY, color: "transparent", WebkitTextStroke: "1px rgba(160, 124, 62, 0.28)" }}
            >
              Gloria
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5" ref={manifestoRef}>
                <SectionIndex n="01" label="The Club" />
                <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight" style={DISPLAY}>
                  <SplitLine text="Discipline is a style." />
                </h2>
                <Rule weight={2} tone="gold" animated className="mt-8 max-w-[120px]" />
              </div>

              <div className="lg:col-span-7 text-lg leading-relaxed max-w-[62ch]">
                <p>
                  <span aria-hidden className="float-left mr-4 mt-1 flex h-16 w-16 items-center justify-center border-2 border-[#A07C3E] text-5xl font-bold leading-none text-[#A07C3E]" style={DISPLAY}>F</span>
                  <span aria-hidden>ounded</span><span className="sr-only">Founded</span> in 2018, Olympus was built on a
                  refusal: that athletic ambition and visual restraint could not share a crest. The club plays in ivory,
                  pine and gold because the game, reduced to its essence, is geometry — lines held, angles closed, space
                  created and denied.
                </p>
                <p className="mt-6">
                  Every department of the club answers to the same standard. The pitch is measured, the press is
                  choreographed, the badge is set in serif. Nothing decorative survives unless it works.
                </p>
              </div>
            </div>

            {/* pull quote */}
            <motion.figure
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="mt-20 md:mt-28 border-t border-b border-[#0D0C0A] py-12 md:py-16 relative"
            >
              <span aria-hidden className="absolute -top-2 left-0 text-8xl md:text-9xl leading-none text-[#A07C3E] opacity-30 select-none" style={DISPLAY}>“</span>
              <blockquote className="italic text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto text-center" style={DISPLAY}>
                We do not chase the ball. We move the geometry until the ball arrives.
              </blockquote>
              <figcaption className="mt-8 text-center text-[11px] tracking-[0.3em] uppercase text-[#6E6555]" style={MONO}>
                R. Vallgren — Head Coach
              </figcaption>
            </motion.figure>
          </div>
        </section>

        {/* ---------------------------------------------- 02 · first team */}
        <section ref={pinnedTeamRef} className="relative z-10 bg-[#F4EFE4] min-h-screen py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Rule weight={4} className="absolute top-0 left-0" />
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-6">
              <div>
                <SectionIndex n="02" label="First Team" />
                <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Eleven</h2>
              </div>
              <p className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#6E6555] pb-2" style={MONO}>Season 2026–27</p>
            </div>

            <div className="mt-16">
              {SQUAD.map(({ group, players }) => (
                <div key={group} className="mt-12 first:mt-0">
                  <div className="flex items-baseline justify-between border-b-2 border-[#0D0C0A] pb-3">
                    <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold" style={MONO}>{group}</h3>
                    <span className="text-[11px] tracking-[0.2em] text-[#6E6555]" style={MONO}>/ {players.length}</span>
                  </div>
                  <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    {players.map((p) => (
                      <motion.li key={p.n} variants={fadeUp}>
                        <div className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_1fr_10rem_4rem_3rem] items-center gap-4 border-b border-[#0D0C0A] py-5 px-2 -mx-2 hover:bg-[#14261E] hover:text-[#F4EFE4] transition-none cursor-default">
                          <span className="text-lg md:text-xl tabular-nums text-[#6E6555] group-hover:text-[#D8BC80]" style={MONO}>
                            {String(p.n).padStart(2, "0")}
                          </span>
                          <span className="text-2xl md:text-3xl tracking-tight" style={DISPLAY}>{p.name}</span>
                          <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#6E6555] group-hover:text-[#F4EFE4]/70" style={MONO}>{p.pos}</span>
                          <span className="text-[11px] tracking-[0.2em] justify-self-end md:justify-self-start" style={MONO}>{p.nat}</span>
                          <span aria-hidden className="hidden md:block justify-self-end text-xl group-hover:text-[#D8BC80]">→</span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- featured №9 (rises over the squad, then flattens rounded corners & pins to reveal) */}
        <section
          ref={featuredRef}
          className="relative z-20 bg-[#14261E] text-[#F4EFE4] py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden shadow-2xl rounded-t-[3.5rem] will-change-[border-radius,transform]"
          style={{
            borderTopLeftRadius: "3.5rem",
            borderTopRightRadius: "3.5rem",
            transform: "translateZ(0)",
          }}
        >
          <Texture style={TEXTURE.vlinesGold} />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <p data-feat-kicker className="text-[11px] tracking-[0.3em] uppercase text-[#D8BC80]" style={MONO}>Featured — Striker</p>
                <div data-feat-numeral aria-hidden className="leading-[0.75] font-black text-[clamp(10rem,28vw,22rem)] select-none -ml-4 text-[#D8BC80]" style={DISPLAY}>9</div>
                <div data-feat-name>
                  <h2 className="mt-4 text-4xl md:text-5xl tracking-tight" style={DISPLAY}>Luca Moretti</h2>
                  <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-[#D8BC80]/80" style={MONO}>№ 9 — Striker — Italy</p>
                </div>
              </div>

              <div className="lg:col-span-6" data-feat-portrait>
                <ImagePlaceholder
                  inverted
                  src="/images/soccer-team/no9.webp"
                  alt="Luca Moretti, Olympus FC striker, mid-air overhead kick"
                  description="Full-body studio portrait of striker Luca Moretti, black & white, dark background"
                  treatment="GRAYSCALE · HIGH CONTRAST · DARK SET"
                  aspect="4 / 5"
                />
              </div>
            </div>

            {/* stat strip */}
            <div data-feat-stats className="mt-16 grid grid-cols-3 border-t border-b border-[#D8BC80]/40 divide-x divide-[#D8BC80]/40 text-center">
              {[
                { target: 24, label: "Goals" },
                { target: 12, label: "Assists" },
                { target: 32, label: "Matches" },
              ].map(({ target, label }) => (
                <div key={label} className="py-8">
                  <p className="text-4xl md:text-5xl font-bold text-[#D8BC80]" style={DISPLAY}><Counter target={target} /></p>
                  <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-[#F4EFE4]/60" style={MONO}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- 03 · fixtures */}
        <section className="relative z-10 bg-[#F4EFE4] py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Texture style={TEXTURE.diag} />
          <div className="relative max-w-6xl mx-auto">
            <SectionIndex n="03" label="Fixtures" />
            <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Ledger</h2>

            <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 border-t border-[#0D0C0A]">
              {FIXTURES.map((f) => {
                const olympusHome = f.home === "Olympus FC";
                return (
                  <motion.li key={`${f.home}-${f.away}`} variants={fadeUp}>
                    <div className="group grid grid-cols-1 md:grid-cols-[6rem_1fr_auto] items-center gap-4 md:gap-8 border-b border-[#0D0C0A] hover:border-b-[3px] hover:-mb-[2px] py-8 transition-none">
                      <div style={MONO} className="text-[11px] tracking-[0.25em] uppercase text-[#6E6555]">
                        {f.date}
                        <span className="block mt-1 text-[10px] normal-case tracking-[0.15em]">{f.venue}</span>
                      </div>
                      <p className="text-2xl md:text-4xl tracking-tight" style={DISPLAY}>
                        <span className={olympusHome ? "font-bold" : ""}>{f.home}</span>
                        <span className="italic text-[#A07C3E] mx-3 text-xl md:text-2xl">vs</span>
                        <span className={!olympusHome ? "font-bold" : ""}>{f.away}</span>
                      </p>
                      {f.score ? (
                        <p className="text-4xl md:text-5xl font-bold tabular-nums justify-self-start md:justify-self-end text-[#A07C3E]" style={DISPLAY}>{f.score}</p>
                      ) : (
                        <button type="button"
                          className="justify-self-start md:justify-self-end text-[11px] tracking-[0.25em] uppercase border-2 border-[#0D0C0A] px-6 py-3 min-h-[44px] hover:bg-[#14261E] hover:text-[#F4EFE4] hover:border-[#14261E] transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#0D0C0A] focus-visible:outline-offset-[3px] cursor-pointer"
                          style={MONO}>
                          Reserve <span aria-hidden>→</span>
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>

        <section className="relative z-20 bg-[#0D0C0A] text-[#F4EFE4] py-24 md:py-32 px-6 md:px-8 lg:px-12 overflow-hidden">
          <div aria-hidden className="absolute inset-0 opacity-30">
            <DitherField animate={!isCardPreview && !reduced} speed={0.35} pixelSize={3.5} dot ink={GOLD} paper={INK} />
          </div>
          <Texture style={TEXTURE.vlinesGold} />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-[#D8BC80]/30 text-center">
              {[
                { target: 48, label: "Played" },
                { target: 34, label: "Wins" },
                { target: 87, label: "Goals" },
                { target: 3, suffix: "×", label: "Titles" },
              ].map(({ target, suffix, label }) => (
                <div key={label} className="py-10 px-4">
                  <p className="text-7xl md:text-8xl font-bold leading-none text-[#D8BC80]" style={DISPLAY}>
                    <Counter target={target} suffix={suffix} />
                  </p>
                  <p className="mt-4 text-[11px] tracking-[0.35em] uppercase text-[#F4EFE4]/60" style={MONO}>{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 pt-8 border-t border-[#D8BC80]/30 text-center text-[11px] tracking-[0.3em] uppercase text-[#F4EFE4]/60" style={MONO}>
              Unbeaten Treble — Domestic League · Continental Cup · Super Cup — 2023
            </p>
          </div>
        </section>

        {/* ---------------------------------------------- 04 · the arena */}
        <section className="relative z-10 bg-[#F4EFE4] py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Texture style={TEXTURE.grid} />
          <div className="relative max-w-6xl mx-auto">
            <SectionIndex n="04" label="The Arena" />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* image: the ONE sanctioned slow hover (border thickens, 300ms) */}
              <div className="lg:col-span-7 group" data-wipe>
                <div className="border-2 border-[#0D0C0A] group-hover:border-4 group-hover:-m-[2px] transition-all duration-100 overflow-hidden">
                  <ImagePlaceholder
                    src="/images/soccer-team/stadium.webp"
                    alt="Aerial view of Olympus Arena at dusk during a match"
                    description="Aerial black & white photograph of the stadium's retractable geometric steel roof"
                    treatment="GRAYSCALE · ARCHITECTURAL · AERIAL"
                    aspect="16 / 10"
                    className="border-0"
                  />
                </div>
              </div>

              <div className="lg:col-span-5">
                <h2 className="text-5xl md:text-6xl tracking-tight" style={DISPLAY}>Olympus Arena</h2>
                <p className="mt-6 text-lg leading-relaxed max-w-[52ch]">
                  Opened in 2021, the Olympus Arena seats 42,000 beneath a fully retractable geometric steel roof.
                  Hybrid turf, sight-lines engineered to the millimetre, and not a single decorative surface in the building.
                </p>
                <dl className="mt-10" style={MONO}>
                  {[
                    ["Capacity", "42,000"],
                    ["Built", "2021"],
                    ["Pitch", "Hybrid"],
                    ["Roof", "Retractable"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-t border-[#DAD1BD] last:border-b py-3 text-[11px] tracking-[0.2em] uppercase">
                      <dt className="text-[#6E6555]">{k}</dt>
                      <dd className="font-medium tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* milestones */}
            <div className="mt-24">
              {[
                { year: "2021", title: "Retractable Canopy & Hybrid Pitch", text: "State-of-the-art hybrid turf and a fully retractable geometric steel roof over the home ground." },
                { year: "2023", title: "The Unbeaten Treble", text: "League, continental cup and super cup lifted in a single season without a defeat." },
                { year: "2025", title: "Digital Arena Integration", text: "Real-time analytics, full-stadium connectivity, and physical-to-virtual matchday sensing." },
              ].map(({ year, title, text }) => (
                <div key={year} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-12 border-t border-[#0D0C0A] last:border-b py-10 items-baseline">
                  <p className="text-5xl md:text-6xl font-bold tabular-nums text-[#A07C3E]" style={DISPLAY}>{year}</p>
                  <div>
                    <h3 className="text-[12px] tracking-[0.3em] uppercase font-bold" style={MONO}>{title}</h3>
                    <p className="mt-3 text-base leading-relaxed max-w-[62ch] text-[#6E6555]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- final cta */}
        <section className="relative z-20 bg-[#0D0C0A] text-[#F4EFE4] py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
          <Rule weight={8} tone="gold" className="absolute top-0 left-0" />
          {/* same dot-dither field as the hero, champagne on ink */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
            <DitherField animate={!isCardPreview && !reduced} speed={0.4} pixelSize={3.5} dot ink={CHAMP} paper={INK} />
          </div>
          {/* soft ink pool behind the centered content */}
          <div aria-hidden className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "radial-gradient(ellipse at center, #0D0C0A 25%, transparent 75%)" }} />
          <div ref={ctaRef} className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase font-bold" style={DISPLAY}>
              <SplitLine text="Join the First Eleven" />
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-[#F4EFE4]/70 max-w-[48ch] mx-auto">
              Season 2026–27 registration of interest. Early access to fixtures, programmes and season tickets.
            </p>

            <form onSubmit={dead} className="mt-12 max-w-md mx-auto text-left">
              <label htmlFor="olympus-email" className="block text-[11px] tracking-[0.3em] uppercase text-[#D8BC80]" style={MONO}>
                Email address
              </label>
              <div className="mt-3 flex items-stretch gap-4">
                <input
                  id="olympus-email" type="email" placeholder="name@example.com"
                  className="flex-1 min-w-0 bg-transparent border-b-2 border-[#F4EFE4]/70 px-1 py-3 text-base placeholder:italic placeholder:text-[#F4EFE4]/40 focus:outline-none focus:border-b-4 focus:border-[#D8BC80] focus-visible:border-b-4"
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                />
                <button type="submit"
                  className="bg-[#D8BC80] text-[#0D0C0A] px-8 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border border-[#D8BC80] hover:bg-[#F4EFE4] hover:border-[#F4EFE4] transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#D8BC80] focus-visible:outline-offset-[3px] cursor-pointer"
                  style={MONO}>
                  Register <span aria-hidden>→</span>
                </button>
              </div>
              <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[#F4EFE4]/40" style={MONO}>
                * A design study — no data is collected, nothing is sent
              </p>
            </form>
          </div>
        </section>
      </main>

      {!isPreview && !isCardPreview && (
        <div aria-hidden className="fixed bottom-0 left-0 right-0 h-24 z-30 pointer-events-none">
          {/* ponytail: single blur layer here — a 5-layer stack over full-width scrolling content is the priciest thing on the page */}
          <GradualBlur direction="bottom" steps={[6]} />
        </div>
      )}

      {/* ------------------------------------------------ footer */}
      <footer className="relative border-t border-[#0D0C0A] py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="block w-2 h-2 bg-[#A07C3E]" />
            <span className="text-base font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Press"].map((item) => (
              <a key={item} href="#" onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-[#A07C3E] focus-visible:border-[#A07C3E] focus-visible:outline-none py-2"
                style={MONO}>
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6E6555]" style={MONO}>
            © {new Date().getFullYear()} Olympus FC — A design study
          </p>
        </div>
      </footer>
    </div>
  );
}
