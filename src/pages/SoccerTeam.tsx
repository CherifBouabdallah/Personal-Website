import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRouteFonts, MONOCHROME_FONTS_HREF } from "../hooks/useRouteFonts";
import { useMotionPrefs, EASE_ENTER } from "../lib/motion";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";
import { gsap } from "../lib/gsapSetup";
import DitherField from "../components/DitherField";

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

/**
 * "Shape blur" adaptation: two stacked copies of the child — a dimmed base
 * and a full layer masked by a soft-edged circle that lerps toward the
 * mouse pointer. Touch and disabled cases render the child plainly.
 */
function CursorRevealPanel({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 50, y: 50, tx: 50, ty: 50, raf: 0, active: false });

  const stop = () => { cancelAnimationFrame(state.current.raf); state.current.active = false; };
  useEffect(() => stop, []);

  if (disabled) return <div>{children}</div>;

  const tick = () => {
    const s = state.current;
    s.x += (s.tx - s.x) * 0.12;
    s.y += (s.ty - s.y) * 0.12;
    const el = overlayRef.current;
    if (el) {
      el.style.setProperty("--mx", `${s.x}%`);
      el.style.setProperty("--my", `${s.y}%`);
    }
    if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.1 || s.active) {
      s.raf = requestAnimationFrame(tick);
    }
  };

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const s = state.current;
        s.tx = ((e.clientX - rect.left) / rect.width) * 100;
        s.ty = ((e.clientY - rect.top) / rect.height) * 100;
        if (!s.active) { s.active = true; s.raf = requestAnimationFrame(tick); }
      }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") stop(); }}
    >
      {/* dimmed base — always visible so touch/no-hover still sees content */}
      <div className="opacity-40" aria-hidden>{children}</div>
      {/* full layer revealed through a soft cursor-following mask */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          ["--mx" as string]: "50%",
          ["--my" as string]: "50%",
          maskImage: "radial-gradient(circle 200px at var(--mx) var(--my), black 35%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle 200px at var(--mx) var(--my), black 35%, transparent 75%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const BLUR_STEPS = [0.5, 1, 2, 4, 8];
function GradualBlur({ direction }: { direction: "bottom" | "left" | "right" }) {
  const toEdge = direction === "bottom" ? "to top" : direction === "left" ? "to right" : "to left";
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {BLUR_STEPS.map((px, i) => {
        // each layer blurs a progressively nearer-the-edge band
        const from = 100 - (i + 1) * (100 / BLUR_STEPS.length);
        const mask = `linear-gradient(${toEdge}, black ${from}%, transparent ${from + 100 / BLUR_STEPS.length + 10}%)`;
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

// ---------------------------------------------------------------- data
const SQUAD = [
  { group: "Goalkeepers", players: [
    { n: 1, name: "Álvaro Montero", pos: "Goalkeeper", nat: "COL" },
  ]},
  { group: "Defenders", players: [
    { n: 2, name: "James O'Brien", pos: "Right-Back", nat: "IRL" },
    { n: 3, name: "Yuto Nakamura", pos: "Left-Back", nat: "JPN" },
    { n: 4, name: "Lucas Delvaux", pos: "Centre-Back", nat: "BEL" },
    { n: 5, name: "Karim Hadj", pos: "Centre-Back", nat: "ALG" },
  ]},
  { group: "Midfielders", players: [
    { n: 6, name: "André Ferreira", pos: "Defensive Mid", nat: "POR" },
    { n: 8, name: "Sami El-Masri", pos: "Central Mid", nat: "EGY" },
    { n: 10, name: "Nils Eriksen", pos: "Attacking Mid", nat: "NOR" },
  ]},
  { group: "Forwards", players: [
    { n: 7, name: "Diego Vargas", pos: "Right Wing", nat: "ARG" },
    { n: 9, name: "Luca Moretti", pos: "Striker", nat: "ITA" },
    { n: 11, name: "Moussa Diallo", pos: "Left Wing", nat: "SEN" },
  ]},
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

  useRuleDraw(rootRef, gsapReveals);
  const heroRef = useRef<HTMLDivElement>(null);
  usePlateStrike(heroRef, gsapReveals, { stagger: 0.08, distance: -40 });
  const manifestoRef = useRef<HTMLDivElement>(null);
  usePlateStrike(manifestoRef, gsapReveals, { stagger: 0.06 });

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black selection:bg-black selection:text-white"
      style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
    >
      <style>{`
        @keyframes olympus-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

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
        {/* ---------------------------------------------- 00 · hero */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-16">
          {/* dither field band, behind content */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 top-1/3 opacity-[0.55]">
            <DitherField animate={!isCardPreview && !reduced} speed={0.4} />
            {/* fade the field's top edge into the page */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
          </div>
          <Texture style={TEXTURE.lines} />

          <div ref={heroRef} className="relative max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12 py-24">
            {/* kicker */}
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-black" />
              <p className="text-[11px] tracking-[0.3em] uppercase" style={MONO}>
                Est. 2018 — Athletic Club — Division I
              </p>
              <span aria-hidden className="h-px flex-1 bg-black" />
            </div>

            {/* headline */}
            <h1
              className="mt-8 font-black uppercase leading-[0.85] tracking-tighter text-[clamp(4rem,17vw,15rem)]"
              style={DISPLAY}
            >
              <SplitLine text="OLYMPUS" />
            </h1>
            <p className="mt-2 md:text-right italic text-[clamp(1.75rem,5vw,4rem)] leading-none" style={DISPLAY}>
              <SplitLine text="Football Club" />
            </p>

            {/* RNRN hero punctuation: thick rule terminated by a bordered square */}
            <div className="mt-10 flex items-center gap-3">
              <Rule weight={4} animated className="flex-1" />
              <span aria-hidden className="block w-3 h-3 border-2 border-black shrink-0" />
            </div>

            {/* meta + CTAs */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div className="flex flex-wrap items-center gap-4">
                <button type="button"
                  className="flex items-center gap-2 bg-black text-white px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border border-black hover:bg-white hover:text-black transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
                  style={MONO}>
                  Match Programme <span aria-hidden>→</span>
                </button>
                <button type="button"
                  className="px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border-2 border-black hover:bg-black hover:text-white transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
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
                  <motion.div key={k} variants={fadeUp} className="flex justify-between gap-6 border-t border-[#E5E5E5] py-3 last:border-b">
                    <dt className="text-[#525252]">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- marquee */}
        <section aria-hidden className="relative bg-black text-white overflow-hidden select-none">
          <Rule weight={4} className="absolute top-0" />
          <div className="py-6 overflow-hidden relative">
            <div
              className="flex w-max whitespace-nowrap will-change-transform"
              style={(reduced || isCardPreview) ? undefined : { animation: "olympus-marquee 28s linear infinite" }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center">
                  {["Olympus FC", "Est. MMXVIII", "Fortuna Audaces Iuvat", "The Unbeaten Treble"].map((text) => (
                    <span key={text} className="flex items-center">
                      <span className="px-8 text-2xl md:text-3xl uppercase font-bold tracking-tight" style={DISPLAY}>{text}</span>
                      <span className="block w-2 h-2 bg-white" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            {/* gradual blur at both ends of the band */}
            <div className="absolute inset-y-0 left-0 w-24"><GradualBlur direction="left" /></div>
            <div className="absolute inset-y-0 right-0 w-24"><GradualBlur direction="right" /></div>
          </div>
          <Rule weight={4} className="absolute bottom-0" />
        </section>

        {/* ---------------------------------------------- 01 · the club */}
        <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Texture style={TEXTURE.grid} />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-5" ref={manifestoRef}>
                <SectionIndex n="01" label="The Club" />
                <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight" style={DISPLAY}>
                  <SplitLine text="Discipline is a style." />
                </h2>
                <Rule weight={2} animated className="mt-8 max-w-[120px]" />
              </div>

              <div className="lg:col-span-7 text-lg leading-relaxed max-w-[62ch]">
                <p>
                  <span aria-hidden className="float-left mr-4 mt-1 flex h-16 w-16 items-center justify-center border-2 border-black text-5xl font-bold leading-none" style={DISPLAY}>F</span>
                  <span aria-hidden>ounded</span><span className="sr-only">Founded</span> in 2018, Olympus was built on a
                  refusal: that athletic ambition and visual restraint could not share a crest. The club plays in black and
                  white because the game, reduced to its essence, is geometry — lines held, angles closed, space created
                  and denied.
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
              className="mt-20 md:mt-28 border-t border-b border-black py-12 md:py-16 relative"
            >
              <span aria-hidden className="absolute -top-2 left-0 text-8xl md:text-9xl leading-none opacity-10 select-none" style={DISPLAY}>“</span>
              <blockquote className="italic text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto text-center" style={DISPLAY}>
                We do not chase the ball. We move the geometry until the ball arrives.
              </blockquote>
              <figcaption className="mt-8 text-center text-[11px] tracking-[0.3em] uppercase text-[#525252]" style={MONO}>
                R. Vallgren — Head Coach
              </figcaption>
            </motion.figure>
          </div>
        </section>

        {/* ---------------------------------------------- 02 · first team */}
        <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Rule weight={4} className="absolute top-0 left-0" />
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-6">
              <div>
                <SectionIndex n="02" label="First Team" />
                <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Eleven</h2>
              </div>
              <p className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#525252] pb-2" style={MONO}>Season 2026–27</p>
            </div>

            <div className="mt-16">
              {SQUAD.map(({ group, players }) => (
                <div key={group} className="mt-12 first:mt-0">
                  <div className="flex items-baseline justify-between border-b-2 border-black pb-3">
                    <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold" style={MONO}>{group}</h3>
                    <span className="text-[11px] tracking-[0.2em] text-[#525252]" style={MONO}>/ {players.length}</span>
                  </div>
                  <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    {players.map((p) => (
                      <motion.li key={p.n} variants={fadeUp}>
                        <div className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_1fr_10rem_4rem_3rem] items-center gap-4 border-b border-black py-5 px-2 -mx-2 hover:bg-black hover:text-white transition-none cursor-default">
                          <span className="text-lg md:text-xl tabular-nums text-[#525252] group-hover:text-white" style={MONO}>
                            {String(p.n).padStart(2, "0")}
                          </span>
                          <span className="text-2xl md:text-3xl tracking-tight" style={DISPLAY}>{p.name}</span>
                          <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#525252] group-hover:text-white" style={MONO}>{p.pos}</span>
                          <span className="text-[11px] tracking-[0.2em] justify-self-end md:justify-self-start" style={MONO}>{p.nat}</span>
                          <span aria-hidden className="hidden md:block justify-self-end text-xl">→</span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- featured №9 */}
        <section className="relative bg-black text-white py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
          <Texture style={TEXTURE.vlinesWhite} />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <p className="text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>Featured — Striker</p>
                <div aria-hidden className="leading-[0.75] font-black text-[clamp(10rem,28vw,22rem)] select-none -ml-4" style={DISPLAY}>9</div>
                <h2 className="mt-4 text-4xl md:text-5xl tracking-tight" style={DISPLAY}>Luca Moretti</h2>
                <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>№ 9 — Striker — Italy</p>
              </div>

              <div className="lg:col-span-6">
                <CursorRevealPanel disabled={reduced || isCardPreview}>
                  <ImagePlaceholder
                    inverted
                    description="Full-body studio portrait of striker Luca Moretti, black & white, dark background"
                    treatment="GRAYSCALE · HIGH CONTRAST · DARK SET"
                    aspect="4 / 5"
                  />
                </CursorRevealPanel>
              </div>
            </div>

            {/* stat strip */}
            <div className="mt-16 grid grid-cols-3 border-t border-b border-white/40 divide-x divide-white/40 text-center">
              {[
                { target: 24, label: "Goals" },
                { target: 12, label: "Assists" },
                { target: 32, label: "Matches" },
              ].map(({ target, label }) => (
                <div key={label} className="py-8">
                  <p className="text-4xl md:text-5xl font-bold" style={DISPLAY}><Counter target={target} /></p>
                  <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- 03 · fixtures */}
        <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Texture style={TEXTURE.diag} />
          <div className="relative max-w-6xl mx-auto">
            <SectionIndex n="03" label="Fixtures" />
            <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Ledger</h2>

            <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 border-t border-black">
              {FIXTURES.map((f) => {
                const olympusHome = f.home === "Olympus FC";
                return (
                  <motion.li key={`${f.home}-${f.away}`} variants={fadeUp}>
                    <div className="group grid grid-cols-1 md:grid-cols-[6rem_1fr_auto] items-center gap-4 md:gap-8 border-b border-black hover:border-b-[3px] hover:-mb-[2px] py-8 transition-none">
                      <div style={MONO} className="text-[11px] tracking-[0.25em] uppercase text-[#525252]">
                        {f.date}
                        <span className="block mt-1 text-[10px] normal-case tracking-[0.15em]">{f.venue}</span>
                      </div>
                      <p className="text-2xl md:text-4xl tracking-tight" style={DISPLAY}>
                        <span className={olympusHome ? "font-bold" : ""}>{f.home}</span>
                        <span className="italic text-[#525252] mx-3 text-xl md:text-2xl">vs</span>
                        <span className={!olympusHome ? "font-bold" : ""}>{f.away}</span>
                      </p>
                      {f.score ? (
                        <p className="text-4xl md:text-5xl font-bold tabular-nums justify-self-start md:justify-self-end" style={DISPLAY}>{f.score}</p>
                      ) : (
                        <button type="button"
                          className="justify-self-start md:justify-self-end text-[11px] tracking-[0.25em] uppercase border-2 border-black px-6 py-3 min-h-[44px] hover:bg-black hover:text-white transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
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

        {/* ---------------------------------------------- records */}
        <section className="relative bg-black text-white py-24 md:py-32 px-6 md:px-8 lg:px-12 overflow-hidden">
          <Texture style={TEXTURE.vlinesWhite} />
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-white/30 text-center">
              {[
                { target: 48, label: "Played" },
                { target: 34, label: "Wins" },
                { target: 87, label: "Goals" },
                { target: 3, suffix: "×", label: "Titles" },
              ].map(({ target, suffix, label }) => (
                <div key={label} className="py-10 px-4">
                  <p className="text-7xl md:text-8xl font-bold leading-none" style={DISPLAY}>
                    <Counter target={target} suffix={suffix} />
                  </p>
                  <p className="mt-4 text-[11px] tracking-[0.35em] uppercase text-white/60" style={MONO}>{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 pt-8 border-t border-white/30 text-center text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>
              Unbeaten Treble — Domestic League · Continental Cup · Super Cup — 2023
            </p>
          </div>
        </section>

        {/* ---------------------------------------------- 04 · the arena */}
        <section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
          <Texture style={TEXTURE.grid} />
          <div className="relative max-w-6xl mx-auto">
            <SectionIndex n="04" label="The Arena" />
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* image: the ONE sanctioned slow hover (border thickens, content scales, 300ms) */}
              <div className="lg:col-span-7 group">
                <div className="border-2 border-black group-hover:border-4 group-hover:-m-[2px] transition-all duration-100 overflow-hidden">
                  <div className="transition-transform duration-300 group-hover:scale-105">
                    <ImagePlaceholder
                      description="Aerial black & white photograph of the stadium's retractable geometric steel roof"
                      treatment="GRAYSCALE · ARCHITECTURAL · AERIAL"
                      aspect="16 / 10"
                      className="border-0"
                    />
                  </div>
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
                    <div key={k} className="flex justify-between border-t border-[#E5E5E5] last:border-b py-3 text-[11px] tracking-[0.2em] uppercase">
                      <dt className="text-[#525252]">{k}</dt>
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
                <div key={year} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-12 border-t border-black last:border-b py-10 items-baseline">
                  <p className="text-5xl md:text-6xl font-bold tabular-nums" style={DISPLAY}>{year}</p>
                  <div>
                    <h3 className="text-[12px] tracking-[0.3em] uppercase font-bold" style={MONO}>{title}</h3>
                    <p className="mt-3 text-base leading-relaxed max-w-[62ch] text-[#525252]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {!isPreview && !isCardPreview && (
        <div aria-hidden className="fixed bottom-0 left-0 right-0 h-28 z-30 pointer-events-none">
          <GradualBlur direction="bottom" />
        </div>
      )}

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
