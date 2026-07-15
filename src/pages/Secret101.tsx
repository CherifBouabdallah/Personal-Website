import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Egg pixel art configuration
const EGG_COLORS: Record<string, string> = {
  O: "#1F3124", // Outline (dark moss green to blend nicely)
  H: "#FFFFFF", // Highlight (white)
  S: "#F6F0DF", // Shell main (cream)
  D: "#DEDBC8", // Shell shadow (muted beige)
  C: "#1F3124", // Crack color (matching outline)
};

const EGG_PATTERN = [
  ".....OOOOO.....", // 0
  "....OHHSSSDO...", // 1
  "...OHHHSSSSDO..", // 2
  "..OHHHSSSSSSDO.", // 3
  "..OHHSSSSSSSDO.", // 4
  ".OHHSSSSSSSSSDO", // 5
  ".OHSSSSSSSSSSDO", // 6
  ".OHSSSSSSSSSSDO", // 7
  ".OSSSSSSSSSSSDO", // 8
  ".OSSSSSSSSSSSDO", // 9
  ".OSSSSSSSSSSDDO", // 10
  ".OSSSSSSSSSDDOO", // 11
  "..OSSSSSSSSDDO.", // 12
  "..OSSSSSSSDDO..", // 13
  "...OOSSSSDDO...", // 14
  ".....OOOOO....."  // 15
];

// Cracking stages
const CRACK_STAGE_1 = [
  { x: 7, y: 8 },
  { x: 8, y: 8 },
  { x: 6, y: 9 }
];

const CRACK_STAGE_2 = [
  ...CRACK_STAGE_1,
  { x: 5, y: 9 },
  { x: 4, y: 7 },
  { x: 9, y: 9 },
  { x: 10, y: 9 },
  { x: 11, y: 7 }
];

// Split line boundary: y < getSplitY(x) is top half, else bottom half
const getSplitY = (x: number) => {
  const map: Record<number, number> = {
    0: 8, 1: 8, 2: 8,
    3: 7, 4: 7,
    5: 9, 6: 9,
    7: 8, 8: 8,
    9: 9, 10: 9,
    11: 7, 12: 7,
    13: 8, 14: 8, 15: 8
  };
  return map[x] ?? 8;
};

// Heart pixel art configuration
const HEART_COLORS: Record<string, string> = {
  O: "#5C0C1E", // Heart Outline (deep crimson)
  H: "#FF4D6D", // Heart Main (vibrant pinkish red)
  L: "#FFF0F3", // Heart Highlight (soft light pink)
};

const HEART_PATTERN = [
  "..OO...OO..", // 0
  ".OLHO.OHHO.", // 1
  "OLLHHOOHHHO", // 2
  "OLLHHHHHHHO", // 3
  ".OHHHHHHHO.", // 4
  "..OHHHHHO..", // 5
  "...OHHHO...", // 6
  "....OHO....", // 7
  ".....O....."  // 8
];

interface Sparkle {
  id: number;
  tx: number;
  ty: number;
  color: string;
  size: number;
  delay: number;
}

interface RisingSparkle {
  id: number;
  x: number;
  color: string;
}

export default function Secret101() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<"password" | "egg" | "broken">("password");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [eggClicks, setEggClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [risingSparkles, setRisingSparkles] = useState<RisingSparkle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (step === "password") {
      inputRef.current?.focus();
    }
  }, [step]);

  // Scroll to top on mount to ensure perfect centering alignment
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle password verification (obfuscated base64 of 'paris' to prevent static analysis bundle scanning)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hash = window.btoa(passwordInput.trim().toLowerCase());
    if (hash === "cGFyaXM=") {
      setPasswordError(false);
      setStep("egg");
    } else {
      setPasswordError(true);
      setShakeKey((prev) => prev + 1);
      // Retain focus
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // Egg interaction click handler
  const handleEggClick = () => {
    if (step !== "egg" || isShaking) return;

    const nextClicks = eggClicks + 1;
    setEggClicks(nextClicks);

    if (nextClicks >= 3) {
      // Trigger break
      setStep("broken");
      // Generate burst sparkles
      setSparkles(generateBurstSparkles());
    } else {
      // Small crack shake
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  // Generate explosion sparkles
  const generateBurstSparkles = (): Sparkle[] => {
    const list: Sparkle[] = [];
    const colors = ["#FFD700", "#FFF", "#FF85A1", "#FF4D6D", "#FFB703"];
    const count = prefersReducedMotion ? 6 : 18;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count + (Math.random() * 0.4 - 0.2);
      const distance = 90 + Math.random() * 90;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      list.push({
        id: i,
        tx,
        ty,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 12,
        delay: Math.random() * 0.1,
      });
    }
    return list;
  };

  // Emit small rising sparkles continuously in broken state
  useEffect(() => {
    if (step !== "broken" || prefersReducedMotion) return;
    let counter = 0;
    const interval = setInterval(() => {
      setRisingSparkles((prev) => [
        ...prev.slice(-12),
        {
          id: counter++,
          x: (Math.random() - 0.5) * 60,
          color: ["#FFD700", "#FFF", "#FF85A1"][Math.floor(Math.random() * 3)],
        },
      ]);
    }, 350);
    return () => clearInterval(interval);
  }, [step, prefersReducedMotion]);

  // Parse Egg pixels
  const topPixels: { x: number; y: number; color: string }[] = [];
  const bottomPixels: { x: number; y: number; color: string }[] = [];

  EGG_PATTERN.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (char === ".") continue;

      let color = EGG_COLORS[char] || "#FFF";

      // Apply crack overlay based on current click stage
      if (eggClicks === 1) {
        if (CRACK_STAGE_1.some((p) => p.x === x && p.y === y)) {
          color = EGG_COLORS.C;
        }
      } else if (eggClicks === 2) {
        if (CRACK_STAGE_2.some((p) => p.x === x && p.y === y)) {
          color = EGG_COLORS.C;
        }
      }

      if (y < getSplitY(x)) {
        topPixels.push({ x, y, color });
      } else {
        bottomPixels.push({ x, y, color });
      }
    }
  });

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-theme-bg z-[100] flex flex-col items-center justify-center select-none overflow-hidden text-theme-text px-6 pb-16 md:pb-0">
      
      {/* Background radial soft light grid to fit the theme */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(246,240,223,0.03)_1px,transparent_0)] bg-[size:16px_16px] opacity-70 pointer-events-none" />



      <AnimatePresence mode="wait">
        
        {/* STEP 1: PASSWORD SCREEN */}
        {step === "password" && (
          <motion.div
            key="password-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm flex flex-col items-center text-center z-10 -translate-y-8 sm:-translate-y-12"
          >
            <div className="mb-6 w-12 h-12 rounded-full border border-theme-text/20 flex items-center justify-center opacity-80">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="font-maghfirea text-3xl md:text-4xl tracking-wide uppercase mb-2">
              Zone Secrète
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-theme-text/60 mb-8 max-w-xs">
              Saisissez le mot de passe pour continuer
            </p>

            <motion.form
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              onSubmit={handlePasswordSubmit}
              className="w-full flex flex-col items-center gap-4"
            >
              <input
                ref={inputRef}
                type="text"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                placeholder="Mot de passe..."
                className="w-full bg-transparent border-b border-theme-text/20 focus:border-theme-text outline-none text-center font-mono py-2 text-base transition-colors tracking-wide text-theme-text placeholder-theme-text/30"
                autoComplete="off"
                spellCheck="false"
              />

              <div className="flex flex-row gap-6 mt-4 justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-theme-text font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase cursor-pointer select-none text-center relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-[1px] after:bg-theme-text after:scale-x-100 hover:after:scale-x-110 after:transition-transform after:duration-300 active:scale-[0.97] transition-all duration-300"
                >
                  Déverrouiller
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 text-theme-text/50 hover:text-theme-text font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase cursor-pointer select-none text-center relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-[1px] after:bg-theme-text/30 hover:after:bg-theme-text after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 active:scale-[0.97] transition-all duration-300"
                >
                  Retour
                </button>
              </div>
            </motion.form>

            <AnimatePresence>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 font-mono text-[9px] uppercase tracking-widest text-[#FF4D6D]"
                >
                  Accès refusé. Réessayez.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2: EGG INTERACTION SCREEN */}
        {step === "egg" && (
          <motion.div
            key="egg-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center z-10 -translate-y-8 sm:-translate-y-12"
          >
            <h2 className="font-maghfirea text-2xl tracking-wide uppercase mb-2 opacity-80">
              L'Œuf Mystère
            </h2>
            <p className="font-mono text-[9px] uppercase tracking-widest text-theme-text/40 mb-6 animate-pulse">
              Touchez pour craqueler
            </p>

            <motion.div
              onClick={handleEggClick}
              animate={isShaking && !prefersReducedMotion ? {
                x: [-6, 6, -4, 4, -2, 2, 0],
                rotate: [-2, 2, -1, 1, 0],
              } : {}}
              transition={{ duration: 0.25 }}
              whileTap={{ scale: 0.96 }}
              className="w-48 h-48 cursor-pointer flex items-center justify-center relative active:scale-98 select-none"
            >
              {/* Scaleable Pixel Art Egg SVG */}
              <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                {/* Top Half Pixels */}
                <g>
                  {topPixels.map((p, i) => (
                    <rect key={`top-${i}`} x={p.x} y={p.y} width="1.05" height="1.05" fill={p.color} />
                  ))}
                </g>
                {/* Bottom Half Pixels */}
                <g>
                  {bottomPixels.map((p, i) => (
                    <rect key={`bot-${i}`} x={p.x} y={p.y} width="1.05" height="1.05" fill={p.color} />
                  ))}
                </g>
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: BROKEN STATE (HEART & SUCCESS) */}
        {step === "broken" && (
          <motion.div
            key="broken-screen"
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center z-10 relative -translate-y-8 sm:-translate-y-12"
          >
            
            {/* Sparkles Particle Burst */}
            {sparkles.map((sp) => (
              <motion.div
                key={`sparkle-${sp.id}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: sp.tx,
                  y: sp.ty,
                  opacity: 0,
                  scale: [0.5, 1.3, 0],
                }}
                transition={{
                  duration: 1.1,
                  ease: "easeOut",
                  delay: sp.delay,
                }}
                className="absolute pointer-events-none"
                style={{ width: sp.size, height: sp.size }}
              >
                <svg viewBox="0 0 3 3" className="w-full h-full">
                  <rect x="1" y="0" width="1" height="1" fill="#FFF" />
                  <rect x="0" y="1" width="1" height="1" fill={sp.color} />
                  <rect x="1" y="1" width="1" height="1" fill="#FFF" />
                  <rect x="2" y="1" width="1" height="1" fill={sp.color} />
                  <rect x="1" y="2" width="1" height="1" fill="#FFF" />
                </svg>
              </motion.div>
            ))}

            {/* Continuous Rising Sparkles */}
            {risingSparkles.map((sp) => (
              <motion.div
                key={`rising-${sp.id}`}
                initial={{ x: sp.x, y: 0, opacity: 1, scale: 0.6 }}
                animate={{
                  y: -100 - Math.random() * 60,
                  opacity: 0,
                  scale: [0.6, 1.1, 0.2],
                  x: sp.x + (Math.random() - 0.5) * 30,
                }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="absolute pointer-events-none"
                style={{ width: 8, height: 8 }}
              >
                <svg viewBox="0 0 3 3" className="w-full h-full">
                  <rect x="1" y="0" width="1" height="1" fill="#FFF" />
                  <rect x="0" y="1" width="1" height="1" fill={sp.color} />
                  <rect x="1" y="1" width="1" height="1" fill="#FFF" />
                  <rect x="2" y="1" width="1" height="1" fill={sp.color} />
                  <rect x="1" y="2" width="1" height="1" fill="#FFF" />
                </svg>
              </motion.div>
            ))}

            {/* Central glowing background halo */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -z-10 rounded-full bg-[#FF4D6D]/15 blur-3xl"
              style={{ width: 220, height: 220 }}
            />

            {/* Egg Shards splitting outwards */}
            {!prefersReducedMotion && (
              <div className="absolute w-48 h-48 pointer-events-none">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  {/* Fly-away Top Half */}
                  <motion.g
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: -70, y: 50, rotate: -55, opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
                  >
                    {topPixels.map((p, i) => (
                      <rect key={`top-shard-${i}`} x={p.x} y={p.y} width="1.05" height="1.05" fill={p.color} />
                    ))}
                  </motion.g>

                  {/* Fly-away Bottom Half */}
                  <motion.g
                    initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    animate={{ x: 70, y: 65, rotate: 45, opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
                  >
                    {bottomPixels.map((p, i) => (
                      <rect key={`bot-shard-${i}`} x={p.x} y={p.y} width="1.05" height="1.05" fill={p.color} />
                    ))}
                  </motion.g>
                </svg>
              </div>
            )}

            {/* Rising Heart */}
            <motion.div
              initial={{ y: 30, scale: 0, opacity: 0 }}
              animate={{
                y: -10,
                scale: [1, 1.08, 1],
                opacity: 1,
              }}
              transition={{
                y: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
                scale: {
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9
                },
                opacity: { duration: 0.5 }
              }}
              className="w-32 h-32 relative select-none"
            >
              {/* Heart SVG */}
              <svg viewBox="0 0 11 9" className="w-full h-full drop-shadow-[0_8px_20px_rgba(255,77,109,0.3)]">
                {HEART_PATTERN.map((row, y) => {
                  return row.split("").map((char, x) => {
                    if (char === ".") return null;
                    const color = HEART_COLORS[char] || "#FFF";
                    return (
                      <rect key={`h-${y}-${x}`} x={x} y={y} width="1.05" height="1.05" fill={color} />
                    );
                  });
                })}
              </svg>
            </motion.div>

            {/* Success copy and Retour Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center mt-6"
            >
              <h3 className="font-maghfirea text-2xl tracking-wider text-[#FF85A1] mb-2">
                Félicitations !
              </h3>
              <p className="font-mono text-[10px] max-w-xs leading-relaxed uppercase tracking-wider text-theme-text/70 mb-8">
                Vous avez trouvé le cœur de Paris.
              </p>

              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 text-theme-text font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase cursor-pointer select-none text-center relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-[1px] after:bg-theme-text after:scale-x-100 hover:after:scale-x-110 after:transition-transform after:duration-300 active:scale-[0.97] transition-all duration-300"
              >
                Retour
              </button>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
