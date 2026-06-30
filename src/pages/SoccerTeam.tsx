import { motion, useScroll, useTransform, useInView, useSpring, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface SoccerTeamProps {
  isPreview?: boolean;
  onClose?: () => void;
}

// ── COLORS ──
const C = {
  bg: "#FAFAF8",
  surface: "#F0EFEB",
  text: "#1A1A1A",
  muted: "#6B6B6B",
  light: "#9E9E9E",
  accent: "#C62828",
  accentLight: "#FCEAEA",
  border: "#E2E0DC",
  white: "#FFFFFF",
};

// ── Animated counter ──
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Stagger container ──
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

// ── Horizontal ticker ──
function Ticker({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap" style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        animate={{ x: [0, `-${100 / doubled.length * items.length}%`] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap", width: "max-content" }}
      >
        {doubled.map((t, i) => (
          <span key={i} style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: i % 2 === 0 ? C.border : "transparent",
            WebkitTextStroke: i % 2 === 0 ? "none" : `1.5px ${C.border}`,
            lineHeight: 1,
            userSelect: "none",
          }}>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Player Card ──
function PlayerCard({ name, position, number, flag }: {
  name: string; position: string; number: number; flag: string;
}) {
  return (
    <motion.div variants={fadeUp} style={{
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "1rem 1.25rem",
      background: C.white,
      border: `1px solid ${C.border}`,
      borderRadius: "12px",
      cursor: "default",
      transition: "border-color 0.25s",
    }}
      whileHover={{ borderColor: C.accent }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.25rem",
        color: C.accent, flexShrink: 0,
      }}>
        {number}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
          <span style={{ fontSize: "0.85rem" }}>{flag}</span>
        </div>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>{position}</span>
      </div>
    </motion.div>
  );
}

// ── Match Row ──
function MatchRow({ homeTeam, awayTeam, date, time, venue, isHome, result }: {
  homeTeam: string; awayTeam: string; date: string; time: string; venue: string; isHome: boolean; result?: string;
}) {
  return (
    <motion.div variants={fadeUp} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1rem 1.25rem", background: C.white,
      border: `1px solid ${C.border}`, borderRadius: "12px",
      gap: "1rem", cursor: "default", transition: "border-color 0.25s",
    }}
      whileHover={{ borderColor: C.accent }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
            fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "2px 8px", borderRadius: 6,
            background: isHome ? C.accentLight : C.surface,
            color: isHome ? C.accent : C.muted,
          }}>
            {isHome ? "HOME" : "AWAY"}
          </span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.7rem", color: C.light }}>{date}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: C.text }}>{homeTeam}</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: "0.65rem", color: C.light, letterSpacing: "0.1em" }}>VS</span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: C.text }}>{awayTeam}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.7rem", color: C.light }}>{time}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400, fontSize: "0.7rem", color: C.light }}>{venue}</span>
        </div>
      </div>
      {result && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: C.accent, letterSpacing: "-0.02em" }}>{result}</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.light }}>FULL TIME</div>
        </div>
      )}
    </motion.div>
  );
}


// ====================================================================
// MAIN COMPONENT
// ====================================================================
export default function SoccerTeam({ isPreview = false }: SoccerTeamProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"squad" | "fixtures">("squad");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax for hero
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const players = {
    goalkeepers: [
      { name: "Álvaro Montero", position: "Goalkeeper", number: 1, flag: "🇨🇴" },
    ],
    defenders: [
      { name: "Lucas Delvaux", position: "Centre-Back", number: 4, flag: "🇧🇪" },
      { name: "Karim Hadj", position: "Centre-Back", number: 5, flag: "🇩🇿" },
      { name: "Yuto Nakamura", position: "Left-Back", number: 3, flag: "🇯🇵" },
      { name: "James O'Brien", position: "Right-Back", number: 2, flag: "🇮🇪" },
    ],
    midfielders: [
      { name: "André Ferreira", position: "Defensive Mid", number: 6, flag: "🇵🇹" },
      { name: "Sami El-Masri", position: "Central Mid", number: 8, flag: "🇪🇬" },
      { name: "Nils Eriksen", position: "Attacking Mid", number: 10, flag: "🇳🇴" },
    ],
    forwards: [
      { name: "Moussa Diallo", position: "Left Wing", number: 11, flag: "🇸🇳" },
      { name: "Luca Moretti", position: "Striker", number: 9, flag: "🇮🇹" },
      { name: "Diego Vargas", position: "Right Wing", number: 7, flag: "🇦🇷" },
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

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", minHeight: isPreview ? undefined : "100vh",
        background: C.bg, color: C.text, fontFamily: "'Barlow', sans-serif",
        overflowX: "hidden", position: "relative",
      }}
    >
      {/* ── NAV ── */}
      <header style={{
        position: isPreview ? "absolute" : "fixed",
        top: 0, left: 0, right: 0, zIndex: 30,
        background: `${C.bg}E6`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
          className="py-3 px-4 md:px-6"
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => !isPreview && navigate("/portfolio")}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: C.accent, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1, letterSpacing: "-0.01em", color: C.text }}>OLYMPUS FC</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: "0.55rem", letterSpacing: "0.2em", color: C.light, textTransform: "uppercase" }}>EST. 2019</div>
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }} className="gap-3 sm:gap-6">
            {["Squad", "Fixtures", "Stadium"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase",
                color: C.muted, textDecoration: "none", transition: "color 0.2s",
              }}
                className="hidden sm:inline"
                onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              >
                {item}
              </a>
            ))}
            {!isPreview && (
              <button
                onClick={() => navigate("/portfolio")}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                  fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: C.light, background: "none", border: "none", cursor: "pointer",
                }}
              >
                ← Portfolio
              </button>
            )}
            <button style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "0.5rem 1.25rem", borderRadius: 8,
              background: C.accent, color: C.white, border: "none", cursor: "pointer",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Tickets
            </button>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <motion.section
        style={{
          y: heroY, opacity: heroOpacity,
          paddingTop: isPreview ? "6rem" : "8rem",
          paddingBottom: "3rem",
          textAlign: "center",
          maxWidth: 1200, margin: "0 auto",
          paddingLeft: "1.5rem", paddingRight: "1.5rem",
          position: "relative",
        }}
      >
        {/* Shield badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 16, margin: "0 auto",
            background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.border}`,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill={C.accent}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(3.5rem, 12vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: C.text,
            margin: 0,
          }}
        >
          OLYMPUS
          <br />
          <span style={{ color: C.accent }}>FC</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 400, fontSize: "1rem",
            color: C.muted, maxWidth: 440, margin: "1.25rem auto 2rem",
            lineHeight: 1.6,
          }}
        >
          Where legacy meets ambition. Five seasons of relentless pursuit, three championship titles, one unwavering vision.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}
        >
          <a href="#squad" style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.75rem 2rem", borderRadius: 10,
            background: C.accent, color: C.white, textDecoration: "none",
            transition: "opacity 0.2s",
          }}>
            Meet the Squad
          </a>
          <a href="#fixtures" style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
            fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "0.75rem 2rem", borderRadius: 10,
            background: "transparent", color: C.text, textDecoration: "none",
            border: `1px solid ${C.border}`,
            transition: "border-color 0.2s",
          }}>
            View Fixtures
          </a>
        </motion.div>
      </motion.section>

      {/* ── TICKER ── */}
      <div style={{ padding: "1.5rem 0", overflow: "hidden" }}>
        <Ticker items={["OLYMPUS FC", "SINCE 2019", "CHAMPIONS", "GLORY", "OLYMPUS FC", "FEARLESS"]} speed={40} />
      </div>

      {/* ── STATS ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ gap: "1rem" }}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} style={{
              textAlign: "center", padding: "2rem 1rem",
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 14,
            }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: C.accent,
                lineHeight: 1, letterSpacing: "-0.03em",
              }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                fontSize: "0.65rem", letterSpacing: "0.2em", color: C.light,
                textTransform: "uppercase", marginTop: "0.5rem",
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: 1, background: C.border }} />
      </div>

      {/* ── SQUAD / FIXTURES TABS ── */}
      <section id="squad" style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}
        >
          <div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3rem)", textTransform: "uppercase",
              letterSpacing: "-0.02em", margin: 0, lineHeight: 1,
            }}>
              Club <span style={{ color: C.accent }}>Directory</span>
            </h2>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500,
              fontSize: "0.7rem", letterSpacing: "0.15em", color: C.light,
              textTransform: "uppercase", marginTop: 4,
            }}>
              Season 2025–26
            </p>
          </div>

          {/* Tab toggle */}
          <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            {(["squad", "fixtures"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.5rem 1.25rem", border: "none", cursor: "pointer",
                background: activeTab === tab ? C.accent : "transparent",
                color: activeTab === tab ? C.white : C.muted,
                transition: "all 0.2s",
              }}>
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "squad" ? (
              <div>
                {(Object.entries(players) as [string, typeof players.goalkeepers][]).map(([group, list]) => (
                  <div key={group} style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                      <div style={{ width: 3, height: 16, borderRadius: 2, background: C.accent }} />
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                        fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted,
                      }}>
                        {group}
                      </span>
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                        fontSize: "0.6rem", color: C.light,
                      }}>
                        {list.length}
                      </span>
                    </div>
                    <motion.div
                      variants={stagger}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}
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
                viewport={{ once: true, margin: "-40px" }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {matches.map((m, i) => <MatchRow key={i} {...m} />)}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ height: 1, background: C.border }} />
      </div>

      {/* ── STADIUM ── */}
      <section id="stadium" style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          style={{
            alignItems: "center", background: C.white,
            border: `1px solid ${C.border}`, borderRadius: 20,
          }}
          className="flex flex-wrap gap-6 md:gap-12 p-6 md:p-10"
        >
          {/* Text */}
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.accent,
              }}>
                Home Ground
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 2.8rem)", textTransform: "uppercase",
              letterSpacing: "-0.02em", margin: "0 0 0.75rem", lineHeight: 1,
            }}>
              Olympus <span style={{ color: C.accent }}>Arena</span>
            </h2>

            <p style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 400,
              fontSize: "0.9rem", color: C.muted, lineHeight: 1.65, maxWidth: 400, marginBottom: "1.5rem",
            }}>
              A 42,000-seat state-of-the-art stadium featuring a fully retractable roof, hybrid pitch technology, and the iconic Golden Stand.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[
                { label: "CAPACITY", value: "42,000" },
                { label: "BUILT", value: "2021" },
                { label: "PITCH", value: "Hybrid" },
              ].map(item => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: C.accent }}>{item.value}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: "0.55rem", letterSpacing: "0.18em", color: C.light, textTransform: "uppercase" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadium SVG */}
          <div style={{ flex: "1 1 300px", maxWidth: 400 }}>
            <svg viewBox="0 0 240 160" style={{ width: "100%" }} fill="none">
              <motion.path
                d="M20,120 Q20,50 120,30 Q220,50 220,120"
                stroke={C.accent} strokeWidth="1.5" fill="none" strokeOpacity="0.3"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true }} transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.path
                d="M45,115 Q45,65 120,48 Q195,65 195,115"
                stroke={C.accent} strokeWidth="1" fill="none" strokeOpacity="0.15"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
              <rect x="55" y="95" width="130" height="55" rx="3" fill={C.accentLight} stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.2"/>
              <circle cx="120" cy="122" r="12" stroke={C.accent} strokeWidth="0.5" fill="none" strokeOpacity="0.25"/>
              <circle cx="120" cy="122" r="1.5" fill={C.accent} fillOpacity="0.3"/>
              <line x1="120" y1="95" x2="120" y2="150" stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.15"/>
              <rect x="85" y="95" width="70" height="18" rx="1" fill="none" stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.12"/>
              <rect x="85" y="132" width="70" height="18" rx="1" fill="none" stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.12"/>
              {[30, 210].map(x => (
                <g key={x}>
                  <line x1={x} y1="120" x2={x} y2="35" stroke={C.accent} strokeWidth="1.5" strokeOpacity="0.2"/>
                  <circle cx={x} cy="35" r="3" fill={C.accent} fillOpacity="0.15"/>
                  <circle cx={x} cy="35" r="1.5" fill={C.accent} fillOpacity="0.4"/>
                </g>
              ))}
              <line x1="10" y1="135" x2="230" y2="135" stroke={C.border} strokeWidth="0.5"/>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ── SECOND TICKER ── */}
      <div style={{ padding: "1rem 0 2rem", overflow: "hidden" }}>
        <Ticker items={["MATCH DAY", "OLYMPUS ARENA", "42K SEATS", "GOLDEN STAND", "HYBRID PITCH"]} speed={35} />
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.5rem" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accent}>
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                fontSize: "0.75rem", letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase",
              }}>
                Olympus FC
              </span>
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Privacy", "Terms", "Press", "Careers"].map(l => (
                <span key={l} style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
                  fontSize: "0.65rem", letterSpacing: "0.1em", color: C.light,
                  textTransform: "uppercase", cursor: "pointer",
                }}>
                  {l}
                </span>
              ))}
            </div>

            <span style={{
              fontFamily: "'Barlow', sans-serif", fontWeight: 400,
              fontSize: "0.65rem", color: C.light,
            }}>
              © {new Date().getFullYear()} Olympus FC
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
