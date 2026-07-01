import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Vortex from "./Vortex";
import SoccerTeam from "./SoccerTeam";
import NoodlePlace from "./NoodlePlace";
import {
  Github,
  ArrowRight,
  Activity
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

// Elegant self-drawing border divider rule
function SelfDrawingLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-[1px] bg-[#F6F0DF]/10 overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#F6F0DF]/30 origin-left"
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// SHARED PREVIEW: Scaled page thumbnail with unified hover
// ----------------------------------------------------------------------
function ProjectPreview({ onClick, layoutId, bgColor, children, hoverLabel = "Open Project" }: {
  onClick: () => void;
  layoutId: string;
  bgColor: string;
  children: React.ReactNode;
  hoverLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setScale(width / 1280);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", updateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
      whileHover={{ scale: 1.015 }}
      className="w-full aspect-[16/10] border border-theme-text/10 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg"
      style={{ background: bgColor, borderRadius: 20, overflow: "hidden", position: "relative", clipPath: "inset(0 round 20px)" }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{ width: 1280, height: 800, transform: `scale(${scale})` }}
      >
        {children}
      </div>
      {/* Unified hover overlay */}
      <div
        className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${isHovered ? "bg-black/20" : "bg-transparent"}`}
        style={{ borderRadius: 20 }}
      >
        <div className={`transition-all duration-300 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 text-theme-text font-mono text-[9px] tracking-[0.25em] uppercase flex items-center gap-2 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <ArrowRight size={10} strokeWidth={2.5} />
          {hoverLabel}
        </div>
      </div>
    </motion.div>
  );
}



// ----------------------------------------------------------------------
// MAIN PORTFOLIO COMPONENT
// ----------------------------------------------------------------------
interface PortfolioProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Portfolio({ lang, setLang }: PortfolioProps) {
  const [isReady, setIsReady] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const maxScrollRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVortexOpen, setIsVortexOpen] = useState(false);
  const [isSoccerOpen, setIsSoccerOpen] = useState(false);
  const [isNoodleOpen, setIsNoodleOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const currentScrollY = useRef(0);
  const navigate = useNavigate();

  const getGlassClass = () => "glass-deep-blur";

  const t = TRANSLATIONS[lang];

  // Smooth scroll tracking matching other scrollable screens
  const scrollProgress = useMotionValue(0);
  const smoothScrollY = useSpring(scrollProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });

  const contentY = useTransform(smoothScrollY, y => -y);

  // Dynamic background parallax matching About page
  const bgY = useTransform(smoothScrollY, y => {
    const max = maxScrollRef.current;
    if (max <= 0) return "0px";
    const progress = y / max;
    const travel = Math.min(300, Math.max(100, max * 0.1));
    return `${progress * -travel}px`;
  });

  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setVh(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  // Lock scroll bar on document mount/unmount
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  // Listen to Escape key to close preview modals
  useEffect(() => {
    if (!isVortexOpen && !isSoccerOpen && !isNoodleOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVortexOpen(false);
        setIsSoccerOpen(false);
        setIsNoodleOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isVortexOpen, isSoccerOpen, isNoodleOpen]);

  // Scroll and Resize Observer initialization
  useEffect(() => {
    if (!isReady) return;
    if (isVortexOpen || isSoccerOpen || isNoodleOpen) return;

    const updateMaxScroll = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const newMax = Math.max(0, contentHeight - viewportHeight);
        setMaxScroll(newMax);
        maxScrollRef.current = newMax;

        if (currentScrollY.current > newMax) {
          currentScrollY.current = newMax;
          scrollProgress.set(newMax);
        }
      }
    };

    let observer: ResizeObserver | null = null;
    if (contentRef.current) {
      observer = new ResizeObserver(() => {
        updateMaxScroll();
      });
      observer.observe(contentRef.current);
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const contentHeight = contentRef.current ? contentRef.current.scrollHeight : 0;
      const viewportHeight = window.innerHeight;
      const activeMax = Math.max(0, contentHeight - viewportHeight);

      const delta = e.deltaY * 1.8;
      currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current + delta));
      scrollProgress.set(currentScrollY.current);
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const contentHeight = contentRef.current ? contentRef.current.scrollHeight : 0;
      const viewportHeight = window.innerHeight;
      const activeMax = Math.max(0, contentHeight - viewportHeight);

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const delta = deltaY * 2.4;
      currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current + delta));
      scrollProgress.set(currentScrollY.current);
      startY = currentY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const contentHeight = contentRef.current ? contentRef.current.scrollHeight : 0;
      const viewportHeight = window.innerHeight;
      const activeMax = Math.max(0, contentHeight - viewportHeight);

      if (e.key === "ArrowDown") {
        currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current + 100));
        scrollProgress.set(currentScrollY.current);
      } else if (e.key === "ArrowUp") {
        currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current - 100));
        scrollProgress.set(currentScrollY.current);
      } else if (e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current + viewportHeight * 0.8));
        scrollProgress.set(currentScrollY.current);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        currentScrollY.current = Math.max(0, Math.min(activeMax, currentScrollY.current - viewportHeight * 0.8));
        scrollProgress.set(currentScrollY.current);
      } else if (e.key === "Home") {
        currentScrollY.current = 0;
        scrollProgress.set(currentScrollY.current);
      } else if (e.key === "End") {
        currentScrollY.current = activeMax;
        scrollProgress.set(currentScrollY.current);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateMaxScroll);

    updateMaxScroll();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMaxScroll);
      if (observer) observer.disconnect();
    };
  }, [isReady, isVortexOpen, isSoccerOpen, isNoodleOpen]);

  const headerText = t.portfolioTitle;

  // Title morph animation (centered -> scaled top banner -> scrolling with page)
  const titleY = useTransform(smoothScrollY, (value) => {
    const targetLimit = 500;
    const vh = window.innerHeight;
    const baseOffset = -0.16 * vh;
    if (value <= targetLimit) {
      return (value / targetLimit) * baseOffset;
    } else {
      return baseOffset - (value - targetLimit);
    }
  });
  const titleScale = useTransform(smoothScrollY, [0, 500], [1, isMobile ? 0.65 : 0.45]);

  // Invites fade out on scroll
  const inviteOpacity = useTransform(smoothScrollY, [0, 150], [1, 0]);
  const inviteY = useTransform(smoothScrollY, [0, 150], ["0px", "15px"]);

  // Dynamic floating language switcher positions
  const switcherTopClamp = isMobile ? 24 : 32;
  const switcherY = useTransform(smoothScrollY, (y) => {
    const initialPos = vh + 48; // vh + pt-12
    const currentPos = initialPos - y;
    return Math.max(switcherTopClamp, currentPos);
  });

  const switcherLeft = useTransform(smoothScrollY, (y) => {
    const clampVal = vh + 48 - switcherTopClamp;
    const endVal = clampVal + 150;
    if (y <= clampVal) return "50%";
    if (y >= endVal) return "100%";
    const pct = 50 + ((y - clampVal) / (endVal - clampVal)) * 50;
    return `${pct}%`;
  });

  const switcherX = useTransform(smoothScrollY, (y) => {
    const clampVal = vh + 48 - switcherTopClamp;
    const endVal = clampVal + 150;
    if (y <= clampVal) return "-50%";
    if (y >= endVal) return "-100%";
    const pct = -50 - ((y - clampVal) / (endVal - clampVal)) * 50;
    return `${pct}%`;
  });

  const cardRevealVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: idx * 0.12,
      }
    })
  };

  return (
    <div className="w-full h-screen min-h-screen bg-theme-bg text-theme-text relative overflow-hidden touch-none selection:bg-theme-text selection:text-theme-bg">

      {/* Large Centered Title */}
      <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10">
        <motion.div
          style={{ y: titleY, scale: titleScale }}
          className="cursor-default pointer-events-auto select-none"
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            className="font-maghfirea text-[clamp(2.3rem,12vw,200px)] text-theme-text flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] px-4 w-full"
          >
            {(() => {
              let charCounter = 0;
              return headerText.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, charIndex) => {
                    const globalIndex = charCounter++;
                    return (
                      <span
                        key={charIndex}
                        className="inline-block overflow-hidden"
                        style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                      >
                        <motion.span
                          className="inline-block"
                          custom={globalIndex}
                          variants={{
                            hidden: { opacity: 0, y: 55, filter: "blur(10px)" },
                            visible: (idx: number) => ({
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                              transition: {
                                duration: 1.1,
                                ease: [0.16, 1, 0.3, 1],
                                delay: idx * 0.04
                              }
                            })
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              ));
            })()}
          </motion.h1>
        </motion.div>
      </div>

      {/* Scroll Invite indicator */}
      <motion.div
        style={{ opacity: inviteOpacity, y: inviteY }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-theme-text/60">
            {t.scrollLabel}
          </span>
          <div className="w-[1.5px] h-[22px] bg-theme-text/20 relative overflow-hidden">
            <motion.div
              animate={{
                y: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-theme-text/80 h-full w-full"
              style={{ originY: 0 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Dynamic Floating Language Switcher Container */}
      {isReady && (
        <motion.div
          style={{ y: switcherY }}
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-6 md:px-16 lg:px-24 xl:px-36 h-12 flex items-center"
        >
          <div className="relative w-full h-full">
            <motion.div
              style={{
                left: switcherLeft,
                x: switcherX
              }}
              className="absolute top-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <LanguageSwitcher lang={lang} setLang={setLang} layoutId="active-lang-bg-portfolio" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Scrollable Container */}
      {isReady && (
        <motion.div
          key="portfolio-scroll-container"
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 w-full px-6 md:px-16 lg:px-24 xl:px-36 pb-8 flex flex-col items-center z-20 select-text"
          style={{ y: contentY }}
        >
          {/* Scroll fold spacer */}
          <div className="w-full h-screen flex-shrink-0" />

          {/* Subtitle / Intro paragraph */}
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-6 mb-8 md:mb-10 text-center pt-12">
            <div className="h-6" /> {/* Visual spacer matching switcher height to keep paragraph position aligned */}
            <motion.p
              key={`intro-${lang}`}
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-theme-text/60 max-w-xl leading-relaxed mt-2"
            >
              {t.portfolioIntro}
            </motion.p>
          </div>

          {/* Exhibition Grid */}
          <div key={`grid-${lang}`} className="grid grid-cols-12 gap-8 md:gap-12 w-full max-w-[1440px] mx-auto items-stretch">

            {/* FEATURED PROJECT 1: Vortex OS Creative Sandbox */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12"
            >
              <div className={`glass-square ${getGlassClass()} p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-left overflow-hidden relative group`}>

                {/* Text Description Column */}
                <div className="flex-1 flex flex-col justify-center min-h-[280px]">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-theme-text/10 pb-4">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">01 / {t.featuredProjectLabel}</span>
                      <span className="font-mono text-[8px] tracking-wider text-theme-text/40 uppercase px-2 py-0.5 rounded border border-theme-text/10 bg-black/10 flex items-center gap-1.5">
                        <Activity size={10} className="text-orange-500 animate-pulse" />
                        {t.sandboxLabel}
                      </span>
                    </div>

                    <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-theme-text tracking-wide mb-4 leading-tight">
                      Vortex Sandbox
                    </h2>

                    <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-theme-text/70 mb-6">
                      {t.vortexDesc}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["REACT", "FRAMER MOTION", "SVG FILTERS", "CSS KEYFRAMES", "MODULAR STATE"].map((tech) => (
                        <span key={tech} className="font-mono text-[8px] tracking-widest text-theme-text/80 px-2 py-1 rounded bg-theme-text/5 border border-theme-text/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsVortexOpen(true)}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-widest hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      {t.openProjectLabel}
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>

                    <a
                      href="https://github.com/CherifBouabdallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text/5 hover:bg-theme-text/10 text-theme-text border border-theme-text/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
                    >
                      <Github size={12} />
                      {t.sourceCodeLabel}
                    </a>
                  </div>
                </div>

                {/* Preview Column — vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <ProjectPreview
                      onClick={() => setIsVortexOpen(true)}
                      layoutId="vortex-sandbox-card"
                      bgColor="#141212"
                      hoverLabel={t.openProjectHover}
                    >
                      <Vortex isPreview={true} />
                    </ProjectPreview>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* FEATURED PROJECT 2: Olympus FC Soccer Team Website */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12"
            >
              <div className={`glass-square ${getGlassClass()} p-6 md:p-10 flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-center text-left overflow-hidden relative group`}>

                {/* Text Description Column */}
                <div className="flex-1 flex flex-col justify-center min-h-[280px]">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-theme-text/10 pb-4">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">02 / {t.featuredProjectLabel}</span>
                      <span className="font-mono text-[8px] tracking-wider text-theme-text/40 uppercase px-2 py-0.5 rounded border border-theme-text/10 bg-black/10 flex items-center gap-1.5">
                        <Activity size={10} className="text-red-500 animate-pulse" />
                        {t.webDesignLabel}
                      </span>
                    </div>

                    <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-theme-text tracking-wide mb-4 leading-tight">
                      Olympus FC
                    </h2>

                    <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-theme-text/70 mb-6">
                      {t.soccerDesc}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["REACT", "FRAMER MOTION", "RESPONSIVE", "SVG ANIMATION", "MODERN UI"].map((tech) => (
                        <span key={tech} className="font-mono text-[8px] tracking-widest text-theme-text/80 px-2 py-1 rounded bg-theme-text/5 border border-theme-text/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsSoccerOpen(true)}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-widest hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      {t.openProjectLabel}
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>

                    <a
                      href="https://github.com/CherifBouabdallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text/5 hover:bg-theme-text/10 text-theme-text border border-theme-text/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
                    >
                      <Github size={12} />
                      {t.sourceCodeLabel}
                    </a>
                  </div>
                </div>

                {/* Preview Column — vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <ProjectPreview
                      onClick={() => setIsSoccerOpen(true)}
                      layoutId="soccer-team-card"
                      bgColor="#FAFAF8"
                      hoverLabel={t.openProjectHover}
                    >
                      <SoccerTeam isPreview={true} />
                    </ProjectPreview>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* FEATURED PROJECT 3: Kiri Ramen Landing Page */}
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12"
            >
              <div className={`glass-square ${getGlassClass()} p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-left overflow-hidden relative group`}>

                {/* Text Description Column */}
                <div className="flex-1 flex flex-col justify-center min-h-[280px]">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-theme-text/10 pb-4">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">03 / {t.featuredProjectLabel}</span>
                      <span className="font-mono text-[8px] tracking-wider text-theme-text/40 uppercase px-2 py-0.5 rounded border border-theme-text/10 bg-black/10 flex items-center gap-1.5">
                        <Activity size={10} className="text-[#C85A32] animate-pulse" />
                        {t.ramenLabel}
                      </span>
                    </div>

                    <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-theme-text tracking-wide mb-4 leading-tight">
                      Kiri Ramen
                    </h2>

                    <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-theme-text/70 mb-6">
                      {t.ramenDesc}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["REACT", "FRAMER MOTION", "BENTO LAYOUT", "WABI-SABI STYLE", "PRECISE CONTRAST"].map((tech) => (
                        <span key={tech} className="font-mono text-[8px] tracking-widest text-theme-text/80 px-2 py-1 rounded bg-theme-text/5 border border-theme-text/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsNoodleOpen(true)}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-widest hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      {t.openProjectLabel}
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>

                    <a
                      href="https://github.com/CherifBouabdallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text/5 hover:bg-theme-text/10 text-theme-text border border-theme-text/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
                    >
                      <Github size={12} />
                      {t.sourceCodeLabel}
                    </a>
                  </div>
                </div>

                {/* Preview Column — vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <ProjectPreview
                      onClick={() => setIsNoodleOpen(true)}
                      layoutId="noodle-place-card"
                      bgColor="#121212"
                      hoverLabel={t.openProjectHover}
                    >
                      <NoodlePlace isPreview={true} />
                    </ProjectPreview>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Minimal Editorial Footer */}
          <Footer className="w-full text-center text-theme-text/30 mt-10 z-10" />

        </motion.div>
      )}

      {/* Soccer Team Preview Overlay Modal */}
      <AnimatePresence>
        {isSoccerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
            onClick={() => setIsSoccerOpen(false)}
          >
            <div
              className="w-full h-full max-w-[1280px] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                layoutId="soccer-team-card"
                transition={{ type: "spring", stiffness: 180, damping: 25 }}
                className="w-full h-full bg-[#FAFAF8] border border-white/15 overflow-y-auto no-scrollbar cursor-default relative"
                style={{ borderRadius: 28, transform: "translate3d(0,0,0)" }}
              >
                <SoccerTeam isPreview={true} />
              </motion.div>

              {/* Floating Close Button */}
              <button
                onClick={() => setIsSoccerOpen(false)}
                className="absolute top-6 right-6 z-[120] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center font-mono text-[10px] tracking-wider cursor-pointer transition-all duration-300 shadow-md"
                title="Close Preview (Esc)"
              >
                ESC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vortex Sandbox Overlay Modal */}
      <AnimatePresence>
        {isVortexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
            onClick={() => setIsVortexOpen(false)}
          >
            <div
              className="w-full h-full max-w-[1280px] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                layoutId="vortex-sandbox-card"
                transition={{ type: "spring", stiffness: 180, damping: 25 }}
                className="w-full h-full bg-[#141212] border border-white/10 overflow-y-auto no-scrollbar cursor-default relative"
                style={{ borderRadius: 28, transform: "translate3d(0,0,0)" }}
              >
                <Vortex isPreview={true} startUnlocked={true} />
              </motion.div>

              {/* Floating Close Button pinned at top right corner of the modal window card */}
              <button
                onClick={() => setIsVortexOpen(false)}
                className="absolute top-6 right-6 z-[120] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center font-mono text-[10px] tracking-wider cursor-pointer transition-all duration-300 shadow-md"
                title="Close Preview (Esc)"
              >
                ESC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kiri Ramen Preview Overlay Modal */}
      <AnimatePresence>
        {isNoodleOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
            onClick={() => setIsNoodleOpen(false)}
          >
            <div
              className="w-full h-full max-w-[1280px] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                layoutId="noodle-place-card"
                transition={{ type: "spring", stiffness: 180, damping: 25 }}
                className="w-full h-full bg-[#121212] border border-white/10 overflow-y-auto no-scrollbar cursor-default relative"
                style={{ borderRadius: 28, transform: "translate3d(0,0,0)" }}
              >
                <NoodlePlace isPreview={true} />
              </motion.div>

              {/* Floating Close Button */}
              <button
                onClick={() => setIsNoodleOpen(false)}
                className="absolute top-6 right-6 z-[120] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center font-mono text-[10px] tracking-wider cursor-pointer transition-all duration-300 shadow-md"
                title="Close Preview (Esc)"
              >
                ESC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
