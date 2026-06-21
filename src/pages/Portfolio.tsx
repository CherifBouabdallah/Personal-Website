import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Vortex from "./Vortex";
import SoccerTeam from "./SoccerTeam";
import { 
  ExternalLink, 
  Github, 
  Cpu, 
  Globe, 
  Code2, 
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Shield
} from "lucide-react";

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
function ProjectPreview({ onClick, layoutId, bgColor, children }: {
  onClick: () => void;
  layoutId: string;
  bgColor: string;
  children: React.ReactNode;
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 180, damping: 25 }}
      whileHover={{ scale: 1.015 }}
      className="w-full aspect-[16/10] border border-[#F6F0DF]/10 cursor-pointer select-none"
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
        <div className={`transition-all duration-300 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 text-[#F6F0DF] font-mono text-[9px] tracking-[0.25em] uppercase flex items-center gap-2 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <ArrowRight size={10} strokeWidth={2.5} />
          Open Project
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// PROJECT 3 PREVIEW: RAY TRACER PROCEDURAL DIAGRAM
// ----------------------------------------------------------------------
function RayTracerPreview() {
  return (
    <div className="w-full h-full min-h-[220px] bg-black/20 rounded-2xl border border-[#F6F0DF]/10 overflow-hidden flex items-center justify-center p-4 select-none relative shadow-xl">
      <svg className="w-full h-full max-w-[280px] aspect-[4/3] overflow-visible" viewBox="0 0 200 150" fill="none">
        {/* Camera block */}
        <rect x="15" y="65" width="25" height="20" rx="3" stroke="#F6F0DF" strokeWidth="1.5" strokeOpacity="0.4" />
        <polygon points="40,70 47,65 47,85 40,80" stroke="#F6F0DF" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Sphere grid representation */}
        <circle cx="130" cy="75" r="30" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.2" />
        <ellipse cx="130" cy="75" rx="30" ry="12" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.1" />
        <ellipse cx="130" cy="75" rx="10" ry="30" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.1" />
        <circle cx="130" cy="75" r="2" fill="#F6F0DF" fillOpacity="0.6" />

        {/* Light source star */}
        <g transform="translate(140, 20)">
          <path d="M0 -8 L0 8 M-8 0 L8 0 M-5 -5 L5 5 M-5 5 L5 -5" stroke="#F6F0DF" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="0" cy="0" r="3" fill="#F6F0DF" fillOpacity="0.8" />
        </g>

        {/* Camera Ray (Primary) */}
        <motion.path 
          d="M47,75 L102,70" 
          stroke="#F6F0DF" 
          strokeWidth="1.5" 
          strokeDasharray="4 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <text x="55" y="65" className="font-mono text-[7px] fill-[#F6F0DF]/40">PRIMARY_RAY</text>

        {/* Bounced Ray to Light Source */}
        <motion.path 
          d="M102,70 L140,20" 
          stroke="#F6F0DF" 
          strokeWidth="1.2" 
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
        />
        <text x="125" y="50" className="font-mono text-[6px] fill-[#F6F0DF]/30">SHADOW_RAY</text>

        {/* Reflected Ray (Specular) */}
        <motion.path 
          d="M102,70 L60,120" 
          stroke="#F6F0DF" 
          strokeWidth="1" 
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.3, ease: "easeOut" }}
        />
        
        {/* Intersection Point Ring */}
        <motion.circle 
          cx="102" 
          cy="70" 
          r="4" 
          stroke="#F6F0DF" 
          strokeWidth="1" 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
      </svg>
      
      {/* Background wire grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(246,240,223,0.02)_1px,transparent_0),linear-gradient(90deg,rgba(246,240,223,0.02)_1px,transparent_0)] bg-[size:16px_16px] pointer-events-none" />
    </div>
  );
}

// ----------------------------------------------------------------------
// PROJECT 3 PREVIEW: DISTRIBUTED NODES SIMULATION
// ----------------------------------------------------------------------
function DistributedSyncPreview() {
  return (
    <div className="w-full h-full min-h-[220px] bg-black/20 rounded-2xl border border-[#F6F0DF]/10 overflow-hidden flex items-center justify-center p-4 select-none relative shadow-xl">
      <svg className="w-full h-full max-w-[280px] aspect-[4/3] overflow-visible" viewBox="0 0 200 150" fill="none">
        
        {/* Three nodes layout */}
        {/* Node A (Leader / Consensus) */}
        <g transform="translate(100, 35)">
          <motion.circle 
            r="16" 
            stroke="#F6F0DF" 
            strokeWidth="1.5" 
            strokeOpacity="0.4"
            animate={{ scale: [1, 1.05, 1], strokeOpacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <circle r="6" fill="#F6F0DF" fillOpacity="0.2" />
          <text y="3" className="font-mono text-[7px] text-center fill-[#F6F0DF]/60" textAnchor="middle">NODE_A</text>
        </g>

        {/* Node B */}
        <g transform="translate(45, 110)">
          <motion.circle 
            r="16" 
            stroke="#F6F0DF" 
            strokeWidth="1.5" 
            strokeOpacity="0.4"
            animate={{ scale: [1, 1.03, 1], strokeOpacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
          />
          <circle r="6" fill="#F6F0DF" fillOpacity="0.2" />
          <text y="3" className="font-mono text-[7px] text-center fill-[#F6F0DF]/60" textAnchor="middle">NODE_B</text>
        </g>

        {/* Node C */}
        <g transform="translate(155, 110)">
          <motion.circle 
            r="16" 
            stroke="#F6F0DF" 
            strokeWidth="1.5" 
            strokeOpacity="0.4"
            animate={{ scale: [1, 1.04, 1], strokeOpacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.2 }}
          />
          <circle r="6" fill="#F6F0DF" fillOpacity="0.2" />
          <text y="3" className="font-mono text-[7px] text-center fill-[#F6F0DF]/60" textAnchor="middle">NODE_C</text>
        </g>

        {/* Communication channels */}
        {/* Node A to B */}
        <path d="M85,47 L60,98" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.1" />
        <motion.path 
          d="M85,47 L60,98" 
          stroke="#F6F0DF" 
          strokeWidth="1.2" 
          strokeDasharray="4 12"
          strokeOpacity="0.6"
          animate={{ strokeDashoffset: [0, -32] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />

        {/* Node A to C */}
        <path d="M115,47 L140,98" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.1" />
        <motion.path 
          d="M115,47 L140,98" 
          stroke="#F6F0DF" 
          strokeWidth="1.2" 
          strokeDasharray="4 12"
          strokeOpacity="0.6"
          animate={{ strokeDashoffset: [0, 32] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
        />

        {/* Node B to C */}
        <path d="M61,110 L139,110" stroke="#F6F0DF" strokeWidth="1" strokeOpacity="0.1" />
        <motion.path 
          d="M61,110 L139,110" 
          stroke="#F6F0DF" 
          strokeWidth="1.2" 
          strokeDasharray="3 10"
          strokeOpacity="0.5"
          animate={{ strokeDashoffset: [0, -26] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        />

        {/* Small synchronization pulse wave */}
        <motion.circle 
          cx="100" 
          cy="35" 
          r="26" 
          stroke="#F6F0DF" 
          strokeWidth="1"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.8], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
        />
      </svg>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(246,240,223,0.015)_1px,transparent_0)] bg-[size:12px_12px] pointer-events-none" />
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN PORTFOLIO COMPONENT
// ----------------------------------------------------------------------
export default function Portfolio() {
  const [isReady, setIsReady] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const maxScrollRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVortexOpen, setIsVortexOpen] = useState(false);
  const [isSoccerOpen, setIsSoccerOpen] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const currentScrollY = useRef(0);
  const navigate = useNavigate();

  const getGlassClass = () => "glass-deep-blur";

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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
    if (!isVortexOpen && !isSoccerOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVortexOpen(false);
        setIsSoccerOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isVortexOpen, isSoccerOpen]);

  // Scroll and Resize Observer initialization
  useEffect(() => {
    if (!isReady) return;
    if (isVortexOpen || isSoccerOpen) return;

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
  }, [isReady, isVortexOpen, isSoccerOpen]);

  const headerText = "Portfolio";

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
    <div className="w-full h-screen min-h-screen bg-[#223D27] text-[#F6F0DF] relative overflow-hidden touch-none selection:bg-[#F6F0DF] selection:text-[#223D27]">
      


      {/* Large Centered Title */}
      <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10">
        <motion.div
          style={{ y: titleY, scale: titleScale }}
          className="cursor-default pointer-events-auto select-none"
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            className="font-maghfirea text-[clamp(2.3rem,12vw,200px)] text-[#F6F0DF] flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] px-4 w-full"
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
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F6F0DF]/60">
            SCROLL
          </span>
          <div className="w-[1.5px] h-[22px] bg-[#F6F0DF]/20 relative overflow-hidden">
            <motion.div
              animate={{
                y: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[#F6F0DF]/80 h-full w-full"
              style={{ originY: 0 }}
            />
          </div>
        </div>
      </motion.div>

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
            <motion.p
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-[#F6F0DF]/60 max-w-xl leading-relaxed mt-2"
            >
              A showcase of interactive software development, graphics physics, and distributed systems built at the intersection of aesthetic design and clean engineering.
            </motion.p>
          </div>

          <SelfDrawingLine className="mb-12 max-w-[1440px] mx-auto" />

           {/* Exhibition Grid */}
          <div className="grid grid-cols-12 gap-8 md:gap-12 w-full max-w-[1440px] mx-auto items-stretch">
            
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
                    <div className="flex justify-between items-center mb-6 border-b border-[#F6F0DF]/10 pb-4">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">01 / Featured Project</span>
                      <span className="font-mono text-[8px] tracking-wider text-[#F6F0DF]/40 uppercase px-2 py-0.5 rounded border border-[#F6F0DF]/10 bg-black/10 flex items-center gap-1.5">
                        <Activity size={10} className="text-orange-500 animate-pulse" />
                        Interactive Sandbox
                      </span>
                    </div>

                    <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-[#F6F0DF] tracking-wide mb-4 leading-tight">
                      Vortex Sandbox
                    </h2>

                    <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-[#F6F0DF]/70 mb-6">
                      An interactive digital gallery and OS mockup created to display high-performance frontend micro-interactions. Includes a ticking clock thread, custom responsive Dynamic Island widgets, parametric control docks, gooey physics morph filter elements, and custom Framer Motion spring sliders.
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["REACT", "FRAMER MOTION", "SVG FILTERS", "CSS KEYFRAMES", "MODULAR STATE"].map((tech) => (
                        <span key={tech} className="font-mono text-[8px] tracking-widest text-[#F6F0DF]/80 px-2 py-1 rounded bg-[#F6F0DF]/5 border border-[#F6F0DF]/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsVortexOpen(true)}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F6F0DF] text-[#223D27] font-mono text-[10px] font-bold tracking-widest hover:bg-[#F6F0DF]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      OPEN PROJECT
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>
                    
                    <a
                      href="https://github.com/CherifBouabdallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F6F0DF]/5 hover:bg-[#F6F0DF]/10 text-[#F6F0DF] border border-[#F6F0DF]/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
                    >
                      <Github size={12} />
                      SOURCE CODE
                    </a>
                  </div>
                </div>

                {/* Preview Column — vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <ProjectPreview onClick={() => setIsVortexOpen(true)} layoutId="vortex-sandbox-card" bgColor="#141212">
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
                    <div className="flex justify-between items-center mb-6 border-b border-[#F6F0DF]/10 pb-4">
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">02 / Featured Project</span>
                      <span className="font-mono text-[8px] tracking-wider text-[#F6F0DF]/40 uppercase px-2 py-0.5 rounded border border-[#F6F0DF]/10 bg-black/10 flex items-center gap-1.5">
                        <Activity size={10} className="text-red-500 animate-pulse" />
                        Web Design
                      </span>
                    </div>

                    <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-[#F6F0DF] tracking-wide mb-4 leading-tight">
                      Olympus FC
                    </h2>

                    <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-[#F6F0DF]/70 mb-6">
                      A clean, modern one-page website designed for a professional soccer club. Features a light flat theme with bold sporty typography, animated stat counters, interactive squad & fixture tabs, horizontal scroll tickers, and SVG stadium illustrations with draw-on scroll animations.
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["REACT", "FRAMER MOTION", "RESPONSIVE", "SVG ANIMATION", "MODERN UI"].map((tech) => (
                        <span key={tech} className="font-mono text-[8px] tracking-widest text-[#F6F0DF]/80 px-2 py-1 rounded bg-[#F6F0DF]/5 border border-[#F6F0DF]/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsSoccerOpen(true)}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F6F0DF] text-[#223D27] font-mono text-[10px] font-bold tracking-widest hover:bg-[#F6F0DF]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                    >
                      OPEN PROJECT
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </button>
                    
                    <a
                      href="https://github.com/CherifBouabdallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#F6F0DF]/5 hover:bg-[#F6F0DF]/10 text-[#F6F0DF] border border-[#F6F0DF]/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
                    >
                      <Github size={12} />
                      SOURCE CODE
                    </a>
                  </div>
                </div>

                {/* Preview Column — vertically centered */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[520px]">
                    <ProjectPreview onClick={() => setIsSoccerOpen(true)} layoutId="soccer-team-card" bgColor="#FAFAF8">
                      <SoccerTeam isPreview={true} />
                    </ProjectPreview>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* PROJECT 3: Physically Based Ray Tracer */}
            <motion.div
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 md:col-span-6"
            >
              <div className={`glass-square ${getGlassClass()} p-6 md:p-8 flex flex-col justify-between h-full text-left overflow-hidden relative group`}>
                <div>
                  <div className="flex justify-between items-center mb-6 border-b border-[#F6F0DF]/10 pb-4">
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">03 / Graphics</span>
                    <Code2 size={13} className="text-[#F6F0DF]/60" />
                  </div>

                  <h3 className="font-maghfirea text-[clamp(1.5rem,3vw,2rem)] text-[#F6F0DF] tracking-wide mb-3 leading-tight">
                    Physically Based Renderer
                  </h3>

                  <p className="font-mono text-[10px] md:text-[11px] leading-relaxed text-[#F6F0DF]/60 mb-6">
                    A photorealistic, CPU global illumination path tracer written from scratch in C++. Features a high-speed Bounding Volume Hierarchy (BVH) spatial accelerator, microfacet specular BRDF reflections (GGX model), and Next Event Estimation (NEE) for direct lighting sampling under complex geometries.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {["C++20", "CUDA", "EMBREE", "RAY CASTING", "GGX BRDF"].map((tech) => (
                      <span key={tech} className="font-mono text-[7px] tracking-widest text-[#F6F0DF]/60 px-1.5 py-0.5 rounded bg-black/10 border border-[#F6F0DF]/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Procedural Visual Representation */}
                  <RayTracerPreview />
                  
                  {/* Footer Link */}
                  <a 
                    href="https://github.com/CherifBouabdallah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#F6F0DF]/50 hover:text-[#F6F0DF] transition-colors flex items-center justify-between group/link py-1"
                  >
                    <span>View Repository Specs</span>
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* PROJECT 3: Distributed State Sync Protocol */}
            <motion.div
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 md:col-span-6"
            >
              <div className={`glass-square ${getGlassClass()} p-6 md:p-8 flex flex-col justify-between h-full text-left overflow-hidden relative group`}>
                <div>
                  <div className="flex justify-between items-center mb-6 border-b border-[#F6F0DF]/10 pb-4">
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">04 / Systems</span>
                    <Terminal size={13} className="text-[#F6F0DF]/60" />
                  </div>

                  <h3 className="font-maghfirea text-[clamp(1.5rem,3vw,2rem)] text-[#F6F0DF] tracking-wide mb-3 leading-tight">
                    Distributed Sync Protocol
                  </h3>

                  <p className="font-mono text-[10px] md:text-[11px] leading-relaxed text-[#F6F0DF]/60 mb-6">
                    A peer-to-peer real-time consensus and state-sync engine built on Conflict-free Replicated Data Types (CRDTs). Utilizes custom hybrid logical clocks, delta state compression, and WebSocket transport channels to synchronise state across highly partitioned networks with microsecond reconciliation steps.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {["GO", "WEBSOCKETS", "CRDTS", "PROTOBUF", "CONSENSUS"].map((tech) => (
                      <span key={tech} className="font-mono text-[7px] tracking-widest text-[#F6F0DF]/60 px-1.5 py-0.5 rounded bg-black/10 border border-[#F6F0DF]/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Procedural Visual Representation */}
                  <DistributedSyncPreview />
                  
                  {/* Footer Link */}
                  <a 
                    href="https://github.com/CherifBouabdallah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#F6F0DF]/50 hover:text-[#F6F0DF] transition-colors flex items-center justify-between group/link py-1"
                  >
                    <span>View Protocol Docs</span>
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Minimal Editorial Footer */}
          <Footer className="w-full text-center text-[#F6F0DF]/30 mt-10 z-10" />

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

    </div>
  );
}
