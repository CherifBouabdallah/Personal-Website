"use client";

import { motion, AnimatePresence, useScroll, Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowUpRight,
  Shield,
  Zap
} from "lucide-react";
import HolographicBall from "../components/HolographicBall";

// --- ANIMATION CONFIGURATION ---
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// --- COMPONENT: COUNTER ---
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease out
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isIntersecting, target]);

  return <span ref={ref} className="font-mono tabular-nums">{count}{suffix}</span>;
}

// --- COMPONENT: TICKER ---
function Ticker({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="w-full overflow-hidden border-y border-slate-200/80 bg-[#FAF8F5]/60 py-5 select-none relative z-20">
      <motion.div
        animate={{ x: [0, `-${100 / doubled.length * items.length}%`] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        className="flex gap-16 whitespace-nowrap w-max"
      >
        {doubled.map((text, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#12224A]/60 uppercase font-semibold select-none">
              // OLYMPUS ATHLETIC SYSTEM
            </span>
            <span
              className="font-display font-bold text-xl md:text-2xl tracking-tight text-slate-800 uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// --- COMPONENT: DOUBLE BEZEL CARD ENCLOSURE ---
function DoubleBezelCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-100/50 border border-slate-200/40 p-2 rounded-[2rem] flex flex-col justify-stretch items-stretch ${className}`}>
      <div className="bg-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.8)] border border-slate-100/60 rounded-[calc(2rem-0.5rem)] p-6 md:p-8 flex-1 flex flex-col justify-between overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}

// --- COMPONENT: PLAYER CARD WITH COUNTRY FLAG ---
function PlayerCard({ name, position, number, country }: {
  name: string; position: string; number: number; country: string;
}) {
  // Map country code to ISO 3166-1 alpha-2 for flag CDN
  const countryMap: { [key: string]: string } = {
    COL: "co",
    BEL: "be",
    ALG: "dz",
    JPN: "jp",
    IRL: "ie",
    POR: "pt",
    EGY: "eg",
    NOR: "no",
    SEN: "sn",
    ITA: "it",
    ARG: "ar"
  };
  const flagCode = countryMap[country] || "un";

  return (
    <motion.div
      variants={fadeUp}
      className="group relative bg-white border border-slate-200/60 rounded-xl p-4 flex items-center gap-4 hover:border-slate-350 hover:bg-slate-50/50 active:scale-[0.98] transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
    >
      <div
        className="w-10 h-10 rounded-lg bg-slate-900/[0.03] border border-slate-200/50 flex items-center justify-center font-mono font-bold text-sm text-[#0F172A] group-hover:text-white group-hover:bg-[#12224A] group-hover:border-[#12224A] transition-all duration-300 tabular-nums"
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-sans font-semibold text-xs text-[#0F172A] truncate">{name}</span>
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/40">
            <img
              src={`https://flagcdn.com/16x12/${flagCode}.png`}
              alt={`${country} flag`}
              className="w-3.5 h-2.5 object-cover rounded-[1px]"
              loading="lazy"
            />
            <span className="font-mono text-[8px] text-slate-655 font-bold uppercase">{country}</span>
          </div>
        </div>
        <span className="block font-mono text-[8px] tracking-[0.18em] text-slate-600 uppercase mt-1">{position}</span>
      </div>
    </motion.div>
  );
}

// --- COMPONENT: MATCH ROW ---
function MatchRow({ homeTeam, awayTeam, date, time, venue, isHome, result }: {
  homeTeam: string; awayTeam: string; date: string; time: string; venue: string; isHome: boolean; result?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-350 hover:bg-slate-50/30 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2.5">
          <span className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded border font-bold ${isHome
              ? "bg-slate-150 border-slate-200 text-slate-700"
              : "bg-slate-50 border-slate-200/50 text-slate-500"
            }`}>
            {isHome ? "HOME" : "AWAY"}
          </span>
          <span className="font-mono text-[8px] text-slate-500 font-semibold">{date}</span>
        </div>

        <div
          className="flex items-center gap-3 font-display font-semibold text-sm md:text-base text-[#0F172A]"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          <span className={isHome ? "text-[#0F172A]" : "text-slate-700"}>{homeTeam}</span>
          <span className="font-mono text-[9px] text-slate-350 tracking-widest font-normal">VS</span>
          <span className={!isHome ? "text-[#0F172A]" : "text-slate-700"}>{awayTeam}</span>
        </div>

        <div className="flex items-center gap-4 mt-2.5 font-mono text-[8px] text-slate-655">
          <span>{time}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span className="truncate">{venue}</span>
        </div>
      </div>

      {result ? (
        <div className="flex items-center gap-4 md:text-right border-t border-slate-100/80 md:border-none pt-3.5 md:pt-0">
          <div>
            <div
              className="font-display font-bold text-xl tracking-tight text-[#12224A]"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {result}
            </div>
            <div className="font-mono text-[8px] tracking-widest text-slate-550 uppercase mt-1">FULL TIME</div>
          </div>
        </div>
      ) : (
        <button className="self-start md:self-auto group/btn flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#12224A] border border-slate-200 hover:border-[#12224A] text-slate-700 hover:text-white font-mono text-[8px] tracking-widest uppercase pl-4 pr-3 py-3 min-h-[44px] rounded-lg active:scale-[0.98] transition-all duration-300 cursor-pointer font-bold">
          Pre-register
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-450 group-hover/btn:text-white transition-colors" />
        </button>
      )}
    </motion.div>
  );
}

interface SoccerTeamProps {
  isPreview?: boolean;
  onClose?: () => void;
}

// ====================================================================
// MAIN COMPONENT: SOCCER TEAM LANDING PAGE (LIGHT CREAM/LUXURY BLUE EXCLUSIVELY)
// ====================================================================
export default function SoccerTeam({ isPreview = false, onClose }: SoccerTeamProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"squad" | "fixtures">("squad");
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Clash Display, Satoshi, and JetBrains Mono dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@400,500,600,700&f[]=jet-brains-mono@300,400,500,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const players = {
    goalkeepers: [
      { name: "Álvaro Montero", position: "Goalkeeper", number: 1, country: "COL" },
    ],
    defenders: [
      { name: "Lucas Delvaux", position: "Centre-Back", number: 4, country: "BEL" },
      { name: "Karim Hadj", position: "Centre-Back", number: 5, country: "ALG" },
      { name: "Yuto Nakamura", position: "Left-Back", number: 3, country: "JPN" },
      { name: "James O'Brien", position: "Right-Back", number: 2, country: "IRL" },
    ],
    midfielders: [
      { name: "André Ferreira", position: "Defensive Mid", number: 6, country: "POR" },
      { name: "Sami El-Masri", position: "Central Mid", number: 8, country: "EGY" },
      { name: "Nils Eriksen", position: "Attacking Mid", number: 10, country: "NOR" },
    ],
    forwards: [
      { name: "Moussa Diallo", position: "Left Wing", number: 11, country: "SEN" },
      { name: "Luca Moretti", position: "Striker", number: 9, country: "ITA" },
      { name: "Diego Vargas", position: "Right Wing", number: 7, country: "ARG" },
    ],
  };

  const matches = [
    { homeTeam: "Olympus FC", awayTeam: "Titan Athletic", date: "JUN 08", time: "20:00", venue: "Olympus Arena", isHome: true, result: "3 – 1" },
    { homeTeam: "Nova United", awayTeam: "Olympus FC", date: "JUN 15", time: "18:30", venue: "Nova Park", isHome: false, result: "1 – 2" },
    { homeTeam: "Olympus FC", awayTeam: "Stellar FC", date: "JUN 22", time: "21:00", venue: "Olympus Arena", isHome: true },
    { homeTeam: "Phoenix Rising", awayTeam: "Olympus FC", date: "JUN 29", time: "19:00", venue: "Phoenix Stadium", isHome: false },
    { homeTeam: "Olympus FC", awayTeam: "Apex City", date: "JUL 06", time: "20:30", venue: "Olympus Arena", isHome: true },
  ];

  const stats = [
    { value: 48, label: "PLAYED" },
    { value: 34, label: "WINS" },
    { value: 87, label: "GOALS" },
    { value: 3, suffix: "x", label: "TITLES" },
  ];

  const milestones = [
    {
      year: "2021",
      title: "RETRACTABLE CANOPY & HYBRID PITCH",
      description: "A major engineering breakthrough for our home ground, installing state-of-the-art hybrid pitch technology and a fully retractable geometric steel roof.",
    },
    {
      year: "2023",
      title: "THE UNBEATEN TRIPLE CHAMPIONSHIP",
      description: "Writing historic records by lifting the domestic league trophy, continental cup, and super cup in a single run without suffering a single defeat.",
    },
    {
      year: "2025",
      title: "DIGITAL ARENA INTEGRATION",
      description: "Launching real-time analytic fan tracking, full-stadium digital connectivity, and modern physical-to-virtual sensory matches.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-[#FDFBF7] text-[#0F172A] overflow-x-hidden relative transition-colors duration-500"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Light structural noise background texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.012] mix-blend-overlay bg-repeat"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      />

      {/* Subtle radial atmospheric glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#12224A]/[0.02] blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#12224A]/[0.01] blur-[150px]" />
      </div>

      {/* 3D Holographic Canvas Element (Strictly Light Themed) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <HolographicBall themeColor="#12224A" isLightMode={true} />
      </div>

      {/* --- navigation bar (totally reworked, minimalist topbar, no shadow, no glow, sits flush at top) --- */}
      <header className={`${isPreview ? "absolute" : "fixed"
        } top-0 left-0 w-full z-50 bg-[#FDFBF7]/95 border-b border-slate-200/50 backdrop-blur-md transition-colors duration-500 shadow-none`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo Crest - Minimalist Bold Text with no icons */}
          <div className="flex items-baseline gap-2.5 select-none">
            <span
              className="font-display font-bold text-sm tracking-wider text-[#12224A] leading-none uppercase"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              OLYMPUS FC
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 md:gap-2">
            {["Squad", "Fixtures", "Stadium"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-mono text-[8.5px] tracking-[0.22em] text-[#1D2E54] hover:text-[#12224A] uppercase transition-colors duration-200 font-semibold px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-slate-200 min-h-[38px] flex items-center"
              >
                {item}
              </a>
            ))}
            {(onClose || !isPreview) && (
              <button
                onClick={() => {
                  if (onClose) onClose();
                  else navigate("/portfolio");
                }}
                className="font-mono text-[8.5px] tracking-[0.22em] text-[#1D2E54] hover:text-[#12224A] uppercase transition-colors cursor-pointer font-semibold px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-slate-200 min-h-[38px] flex items-center"
              >
                {onClose ? "Close" : "Back"}
              </button>
            )}
          </nav>

          {/* CTA Button (44px target, no shadow, no glow) */}
          <a
            href="#tickets"
            className="group flex items-center gap-2.5 bg-[#12224A] hover:bg-[#1D3557] text-[#FDFBF7] font-mono text-[8.5px] tracking-widest uppercase pl-4 pr-3 py-2.5 min-h-[44px] rounded-md active:scale-[0.98] transition-all duration-200 shadow-none border border-[#12224A]"
          >
            Reserve
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FDFBF7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

        </div>
      </header>

      {/* --- CONTENT CONTAINER --- */}
      <main className="relative z-20 w-full overflow-hidden">

        {/* --- HERO SECTION --- */}
        <section className="min-h-[100dvh] flex flex-col justify-center px-6 pt-32 pb-16 relative">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            {/* Left Block: Stark Typography */}
            <div className="md:col-span-8 z-30">

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-5xl md:text-8xl tracking-tighter leading-[0.92] uppercase text-[#0F172A]"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                OLYMPUS <br />
                <span className="text-[#12224A] drop-shadow-[0_4px_25px_rgba(18,34,74,0.04)]">ATHLETIC</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-xs md:text-sm text-slate-655 max-w-[42ch] mt-6 leading-relaxed"
              >
                Engineered physical performance. Tactical discipline, computational movement, and athletic velocity on the pitch.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 mt-8 flex-wrap"
              >
                {/* Button-in-Button Trailing Icon for CTA (44px target) */}
                <a
                  href="#tickets"
                  className="group flex items-center gap-3 bg-[#12224A] text-white font-mono text-[8.5px] tracking-widest uppercase pl-6 pr-3.5 py-3.5 min-h-[44px] rounded-full shadow-lg shadow-[#12224A]/10 hover:bg-[#1D3557] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Secure Tickets
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>

                <a
                  href="#squad"
                  className="group font-mono text-[8.5px] tracking-widest uppercase border border-slate-200 bg-[#FDFBF7] hover:bg-[#FAF6EE] text-slate-700 px-6 py-3.5 min-h-[44px] rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center"
                >
                  Explore Squad
                </a>
              </motion.div>
            </div>

            {/* Right Block: Empty spacing to reveal 3D canvas object */}
            <div className="hidden md:block md:col-span-4 h-64 pointer-events-none" />

          </div>
        </section>

        {/* --- TICKER --- */}
        <Ticker items={["Olympus FC", "High Performance Design", "Three Championship Titles", "WebGL Sandbox Integration"]} />

        {/* --- BENTO GRID SECTION --- */}
        <section className="py-24 md:py-36 px-6 relative">
          <div className="max-w-6xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">

              {/* Card 1: Striker Showcase (Double Bezel Layout) */}
              <div className="md:col-span-4">
                <DoubleBezelCard className="h-full min-h-[380px] group">
                  {/* Background portrait with high-contrast grayscale filter */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
                      alt="Luca Moretti Striker Profile"
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale contrast-[1.1] opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/50 to-transparent" />
                  </div>

                  {/* Top Header */}
                  <div className="z-10 flex justify-between items-start">
                    <span className="font-mono text-[8px] tracking-[0.18em] text-[#12224A] uppercase font-bold bg-[#12224A]/5 border border-[#12224A]/10 px-2.5 py-0.5 rounded">
                      Featured Striker
                    </span>
                    <span
                      className="font-mono font-bold text-2xl text-[#12224A]/10 group-hover:text-[#12224A]/20 transition-colors duration-500"
                    >
                      09
                    </span>
                  </div>

                  {/* Bottom Stats */}
                  <div className="z-10 mt-auto">
                    <h3
                      className="font-display font-semibold text-xl tracking-tight text-[#0F172A] leading-tight"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Luca Moretti
                    </h3>
                    <p className="font-mono text-[8px] tracking-widest text-slate-555 uppercase mt-1">Striker / Italy</p>

                    <div className="h-px bg-slate-150 my-4" />

                    <div className="grid grid-cols-3 gap-2 font-mono text-left font-bold">
                      <div>
                        <div className="text-sm text-[#0F172A] tabular-nums">24</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold">Goals</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#0F172A] tabular-nums">12</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold">Assists</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#0F172A] tabular-nums">32</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold">Matches</div>
                      </div>
                    </div>
                  </div>
                </DoubleBezelCard>
              </div>

              {/* Card 2: Performance Metrics (Double Bezel Layout) */}
              <div className="md:col-span-8">
                <DoubleBezelCard className="h-full">
                  <div>
                    <h3
                      className="font-display font-semibold text-lg tracking-wider text-[#0F172A] uppercase"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Performance Indicators
                    </h3>
                    <p className="font-sans text-xs text-slate-655 mt-1 max-w-[45ch] leading-relaxed">
                      Overview of historical stats achieved by the roster since the club's entry.
                    </p>
                  </div>

                  {/* Core metric modules */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-4">
                    {stats.map((s, i) => (
                      <div key={i} className="relative p-4 rounded-xl bg-slate-50 border border-slate-200/50">
                        <div
                          className="font-display font-bold text-3xl text-[#12224A] tracking-tight"
                          style={{ fontFamily: "'Clash Display', sans-serif" }}
                        >
                          <Counter target={s.value} suffix={s.suffix} />
                        </div>
                        <div className="font-mono text-[8px] tracking-widest text-slate-550 uppercase mt-1.5 font-bold">
                          {s.label}
                        </div>
                        {/* Sleek status indicator tag */}
                        <div className="absolute top-3 right-3 font-mono text-[7px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100 font-bold select-none">
                          ACTIVE
                        </div>
                      </div>
                    ))}
                  </div>
                </DoubleBezelCard>
              </div>

              {/* Card 3: Philosophy (Double Bezel Layout) */}
              <div className="md:col-span-5">
                <DoubleBezelCard className="h-full min-h-[260px]">
                  <div>
                    <span className="font-mono text-[7.5px] tracking-[0.2em] text-slate-550 uppercase font-bold">Core Ethos</span>
                    <h3
                      className="font-display font-semibold text-lg tracking-tight text-[#0F172A] uppercase mt-2.5"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      Tactical Adaptation
                    </h3>
                    <p className="font-sans text-xs text-slate-655 leading-relaxed mt-3">
                      We reject mechanical sports automation. We value organic error transformed by rapid adaptation. We construct visual geometry on the pitch, executing asymmetric plays that puzzle the defense.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#12224A]" />
                    <span className="font-mono text-[8px] tracking-widest text-[#12224A] uppercase font-bold">Unwavering Vision</span>
                  </div>
                </DoubleBezelCard>
              </div>

              {/* Card 4: Stadium Details (Double Bezel Layout) */}
              <div className="md:col-span-7">
                <DoubleBezelCard className="h-full min-h-[260px] group">
                  {/* Background architectural shot in grayscale */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1524646888194-7ea97032017e?auto=format&fit=crop&w=1200&q=80"
                      alt="Olympus Stadium Architecture"
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale contrast-[1.15] opacity-25 group-hover:scale-103 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                  </div>

                  <div className="z-10 flex flex-col h-full justify-between">
                    <div>
                      <span className="font-mono text-[7.5px] tracking-[0.2em] text-[#12224A] uppercase font-bold">Home Arena</span>
                      <h3
                        className="font-display font-semibold text-xl tracking-tight text-[#0F172A] uppercase mt-1.5"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        Olympus Arena
                      </h3>
                      <p className="font-sans text-xs text-slate-650 mt-2 max-w-[40ch] leading-relaxed">
                        A 42,000-seat state-of-the-art structure featuring a fully retractable roof system and premium hybrid turf.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-150 font-mono">
                      <div>
                        <div className="font-bold text-sm text-[#0F172A] tabular-nums">42,000</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold mt-0.5">Capacity</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0F172A] tabular-nums">2021</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold mt-0.5">Built</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#0F172A]">Hybrid</div>
                        <div className="text-[6.5px] text-slate-600 tracking-wider uppercase font-semibold mt-0.5">Pitch</div>
                      </div>
                    </div>
                  </div>
                </DoubleBezelCard>
              </div>

            </div>
          </div>
        </section>

        {/* --- VIEWPORT CARD STACK SECTION --- */}
        <section className="py-24 md:py-36 px-6 relative border-t border-slate-200/60 bg-slate-50/30">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-16 md:mb-20">
              <h2
                className="font-display font-semibold text-3xl md:text-4xl tracking-tight text-[#0F172A] uppercase"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Club Milestones
              </h2>
            </div>

            {/* Sticky Viewport Stack with Double Bezel styling */}
            <div className="relative flex flex-col gap-10 max-w-3xl mx-auto">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="sticky top-32 bg-slate-100/50 border border-slate-200/40 p-2 rounded-[2.25rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
                  style={{
                    transform: `translateY(${idx * 10}px) scale(${1 - (milestones.length - 1 - idx) * 0.02})`,
                    zIndex: idx + 1
                  }}
                >
                  <div className="bg-white border border-slate-100 rounded-[calc(2.25rem-0.5rem)] p-6 md:p-10 min-h-[260px] flex flex-col justify-between">

                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span
                        className="font-display font-bold text-3xl text-[#12224A]"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {m.year}
                      </span>
                      <span className="font-mono text-[8px] text-slate-500 tracking-widest uppercase font-bold">Milestone // 0{idx + 1}</span>
                    </div>

                    <div className="my-5">
                      <h3
                        className="font-display font-semibold text-base md:text-lg text-[#0F172A] tracking-tight uppercase"
                        style={{ fontFamily: "'Clash Display', sans-serif" }}
                      >
                        {m.title}
                      </h3>
                      <p className="font-sans text-xs text-slate-655 mt-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-mono text-[8px] tracking-widest text-[#12224A] uppercase font-bold">Championship Level</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* --- INTERACTIVE DIRECTORY --- */}
        <section id="squad" className="py-24 md:py-36 px-6 relative border-t border-slate-200/60 bg-slate-50/10">
          <div className="max-w-6xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2
                  className="font-display font-semibold text-3xl md:text-4xl tracking-tight text-[#0F172A] uppercase"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  Club Directory
                </h2>
              </div>

              {/* High-Performance Selector Toggle */}
              <div className="flex bg-slate-100 border border-slate-200/60 rounded-xl p-1 w-max">
                {(["squad", "fixtures"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-mono text-[9px] tracking-widest uppercase px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-300 font-bold ${activeTab === tab
                        ? "bg-[#12224A] text-white shadow-sm"
                        : "text-slate-500 hover:text-[#12224A]"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Transition View Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "squad" ? (
                  <div className="flex flex-col gap-10">
                    {(Object.entries(players) as [string, typeof players.goalkeepers][]).map(([group, list]) => (
                      <div key={group}>
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#12224A]" />
                          <span className="font-mono text-[8.5px] tracking-widest text-[#12224A] uppercase font-bold">
                            {group}
                          </span>
                          <span className="font-mono text-[8px] text-slate-550 font-semibold">
                            / {list.length} players
                          </span>
                        </div>

                        <motion.div
                          variants={stagger}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: true }}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        >
                          {list.map(p => <PlayerCard key={p.number} {...p} />)}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    id="fixtures"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 max-w-4xl mx-auto"
                  >
                    {matches.map((m, i) => <MatchRow key={i} {...m} />)}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* --- TICKET RESERVATION BANNER --- */}
        <section id="tickets" className="py-24 md:py-36 px-6 relative border-t border-slate-200/60">
          <div className="max-w-4xl mx-auto">

            {/* Double-Bezel Light Container */}
            <div className="bg-slate-100/50 border border-slate-200/40 p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <div className="bg-white border border-slate-100/60 rounded-[calc(2rem-0.5rem)] p-8 md:p-14 text-center relative overflow-hidden">

                {/* Radial Glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[#12224A]/[0.02] blur-[80px]" />
                </div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mx-auto mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                    <Trophy className="w-5 h-5 text-[#D4AF37]" />
                  </div>

                  <h2
                    className="font-display font-semibold text-2xl md:text-4xl tracking-tight text-[#0F172A] uppercase"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    Join the Glory
                  </h2>

                  <p className="font-sans text-xs text-slate-555 max-w-[42ch] mx-auto mt-3 leading-relaxed">
                    Reserve your seat for the upcoming 2026-27 championship campaign. Sign up below to get early ticket access and match updates.
                  </p>

                  {/* Form Block */}
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="max-w-md mx-auto mt-8"
                  >
                    <div className="text-left mb-2">
                      <label
                        htmlFor="email-reserve"
                        className="font-mono text-[7.5px] tracking-[0.2em] text-slate-555 uppercase pl-3 font-bold cursor-pointer"
                      >
                        Email Address
                      </label>
                    </div>

                    {/* Double-Bezel inspired Input */}
                    <div className="flex bg-[#F9FAFB] border border-slate-200 focus-within:border-slate-400 focus-within:bg-white rounded-xl p-1.5 transition-all duration-300">
                      <input
                        type="email"
                        id="email-reserve"
                        placeholder="placeholder@domain.com"
                        required
                        className="flex-1 bg-transparent border-none text-xs text-[#0F172A] px-3 focus:outline-none placeholder-slate-400 font-sans"
                      />
                      <button
                        type="submit"
                        className="group flex items-center justify-center gap-2 bg-[#12224A] hover:bg-[#1D3557] text-[#FDFBF7] font-mono text-[8.5px] tracking-widest uppercase pl-4 pr-2.5 py-3 min-h-[44px] rounded-lg active:scale-[0.98] transition-all duration-200 cursor-pointer font-bold"
                      >
                        Reserve
                        <div className="w-4 h-4 rounded bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    </div>

                    <div className="text-left mt-2.5">
                      <span className="font-mono text-[7.5px] text-[#12224A] uppercase pl-3 block font-bold tracking-wider">
                        * Early access registrations close soon
                      </span>
                    </div>
                  </form>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200/60 bg-[#FAF8F5] py-10 px-6 relative z-20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#12224A]/10 border border-[#12224A]/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#12224A]" />
            </div>
            <span className="font-display font-semibold text-[10.5px] tracking-wider text-slate-700 uppercase" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              Olympus FC
            </span>
          </div>

          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Support"].map(item => (
              <span key={item} className="font-mono text-[8.5px] tracking-wider text-slate-500 hover:text-[#12224A] uppercase cursor-pointer transition-colors font-semibold">
                {item}
              </span>
            ))}
          </div>

          <div className="font-mono text-[8.5px] text-slate-500 font-semibold tracking-wider">
            &copy; {new Date().getFullYear()} Olympus FC. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
}
