import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SegmentCascade, Segment } from "../components/BiographyAnimations";

// Elegant self-drawing border divider rule
function SelfDrawingLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-[1px] bg-theme-text/10 overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-theme-text/30 origin-left"
      />
    </div>
  );
}

const JavaLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3M10 1v3M14 1v3" />
  </svg>
);

const PythonLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5h5z" />
    <path d="M12 22v-8a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v4a5 5 0 0 1-5 5h-5z" />
    <circle cx="5" cy="5" r="0.75" fill="currentColor" />
    <circle cx="19" cy="19" r="0.75" fill="currentColor" />
  </svg>
);

const RiscVLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="12" height="12" x="6" y="6" rx="2" />
    <path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4" />
  </svg>
);

const VerilogLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h3l3-8 4 16 3-10 2 2h3" />
  </svg>
);

const ArduinoLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2.5-3.5-6-3.5-8-1.5s-2 5 0 7 5.5 2 8-1.5c2.5 3.5 6 3.5 8 1.5s2-5 0-7-5.5-2-8 1.5z" />
    <path d="M6 12h2M16 12h2M17 11v2" />
  </svg>
);

const LatexLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h4l-3-3 3-3H9" />
  </svg>
);

const BlenderLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M12 5.5V2M16.5 7.5L19.5 5M17.5 12h4" />
  </svg>
);

const PhotoshopLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h2.5a1.5 1.5 0 0 1 0 3H7v4M13.5 11c0-.5.5-1 1-1h.5a1 1 0 0 1 1 1c0 1-2 1-2 2a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1" />
  </svg>
);

const DesignLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

interface SkillData {
  name: string;
  logo: React.ReactNode;
}

const skillsData: SkillData[] = [
  { name: "Java", logo: <JavaLogo /> },
  { name: "Python", logo: <PythonLogo /> },
  { name: "Risc-V Assembly", logo: <RiscVLogo /> },
  { name: "Verilog", logo: <VerilogLogo /> },
  { name: "Arduino", logo: <ArduinoLogo /> },
  { name: "Latex", logo: <LatexLogo /> },
  { name: "Blender", logo: <BlenderLogo /> },
  { name: "Photoshop", logo: <PhotoshopLogo /> },
  { name: "Creative web design", logo: <DesignLogo /> }
];

const biographySegments: Segment[] = [
  { text: "I am a designer and full-stack software engineer who focuses on bridging the gap between aesthetics and clean code.", className: "text-[#E1E0CC] font-normal" },
  { text: " I build performant front-ends and interactive experiences that are highly responsive and structured.", className: "font-serif italic text-[#DEDBC8]" },
  { text: " Driven by curiosity, I aim to craft memorable digital products that look beautiful and feel extremely premium.", className: "text-[#E1E0CC] font-medium" }
];

const backgroundParagraphs = [
  "Currently pursuing software engineering at EPFL (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.",
  "When I am not coding, you will find me playing competitive Volleyball, designing high-fidelity layouts, or studying new patterns in digital systems. I enjoy creating seamless interactions and testing fluid web interfaces."
];

interface DiagnosticsPanelProps {
  smoothScrollY: any;
  maxScroll: number;
}

function DiagnosticsPanel({ smoothScrollY, maxScroll }: DiagnosticsPanelProps) {
  const [scrollYVal, setScrollYVal] = useState(0);

  useEffect(() => {
    const unsubscribe = smoothScrollY.on("change", (latest: number) => {
      setScrollYVal(latest);
    });
    return () => unsubscribe();
  }, [smoothScrollY]);

  const maxSafeTravel = 0.15 * window.innerHeight + 345;
  const translation = (maxScroll > 0 ? (scrollYVal / maxScroll) : 0) * -maxSafeTravel;

  return (
    <div className="w-full max-w-7xl mx-auto mt-24 border border-theme-text/10 rounded-2xl p-6 md:p-8 bg-black/20 backdrop-blur-sm z-10 flex flex-col gap-8 text-left">
      <div className="flex justify-between items-center border-b border-theme-text/10 pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-mono text-xs tracking-[0.35em] uppercase font-bold text-theme-text">05 / Parallax Calibration & Diagnostics</h3>
          <span className="font-mono text-[8px] tracking-[0.2em] text-theme-text/40">CALIBRATING: UNTITLED_ARTWORK.PNG</span>
        </div>
        <div className="px-3 py-1 bg-white/5 border border-theme-text/20 rounded font-mono text-[9px] text-theme-text/75 uppercase tracking-widest animate-pulse">
          SYSTEM ACTIVE
        </div>
      </div>

      {/* Dynamic Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] text-theme-text/80">
        <div className="border border-theme-text/10 rounded-xl p-4 bg-white/[0.02] flex flex-col gap-2">
          <div className="font-bold border-b border-theme-text/5 pb-1 text-theme-text/50">1. SCROLL METRICS</div>
          <div><span className="font-bold">SCROLL_Y (y):</span> {Math.round(scrollYVal)}px</div>
          <div><span className="font-bold">MAX_SCROLL:</span> {Math.round(maxScroll)}px</div>
          <div><span className="font-bold">SCROLL_PERCENT:</span> {maxScroll > 0 ? Math.round((scrollYVal / maxScroll) * 100) : 0}%</div>
        </div>

        <div className="border border-theme-text/10 rounded-xl p-4 bg-white/[0.02] flex flex-col gap-2">
          <div className="font-bold border-b border-theme-text/5 pb-1 text-theme-text/50">2. ARTWORK TRANSLATION</div>
          <div><span className="font-bold">TRANSLATION (bgY):</span> {Math.round(translation)}px</div>
          <div><span className="font-bold">SCALE FACTOR:</span> 1.15x</div>
          <div><span className="font-bold">PARALLAX RATE:</span> {maxScroll > 0 ? (maxSafeTravel / maxScroll).toFixed(3) : "0.000"}x</div>
        </div>

        <div className="border border-theme-text/10 rounded-xl p-4 bg-white/[0.02] flex flex-col gap-2">
          <div className="font-bold border-b border-theme-text/5 pb-1 text-theme-text/50">3. SAFETY THRESHOLDS</div>
          <div><span className="font-bold">VIEWPORT_HEIGHT:</span> {window.innerHeight}px</div>
          <div><span className="font-bold">MAX_SAFE_TRAVEL:</span> -{Math.round(maxSafeTravel)}px</div>
          <div>
            <span className="font-bold">EDGE_SAFETY_MARGIN:</span> 
            {" "}{Math.max(0, Math.round(maxSafeTravel + translation))}px
          </div>
        </div>
      </div>

      {/* Parallax Limit Meter */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between font-mono text-[9px] text-theme-text/50 tracking-wider">
          <span>PARALLAX LIMIT CAP:</span>
          <span>{Math.round(Math.abs(translation))}px / {Math.round(maxSafeTravel)}px</span>
        </div>
        <div className="w-full h-2.5 bg-white/5 border border-theme-text/15 rounded-full overflow-hidden p-[2px]">
          <div 
            className="h-full bg-theme-text rounded-full origin-left transition-all duration-100 ease-out"
            style={{
              width: `${Math.min(100, (maxScroll > 0 ? (scrollYVal / maxScroll) : 0) * 100)}%`
            }}
          />
        </div>
      </div>

      {/* Calibration Instructions & Placeholder text */}
      <div className="space-y-4 font-normal text-xs md:text-sm text-theme-text/75 leading-relaxed pt-2">
        <p className="font-bold text-theme-text">Testing scroll limits:</p>
        <p>
          We have added dense placeholder paragraphs of calibration text below. Scroll to the bottom of the page to watch the progress bar fill and witness the background artwork reach its exact physical translation limit of -{Math.round(maxSafeTravel)}px.
        </p>
        
        {/* DENSE PLACEHOLDER PARAGRAPHS */}
        <div className="space-y-6 opacity-35 border-l border-theme-text/10 pl-6 py-2 select-text font-mono text-[10px] uppercase tracking-wide leading-loose">
          <p>
            [CALIBRATION_BLOCK_A] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            [CALIBRATION_BLOCK_B] Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
          <p>
            [CALIBRATION_BLOCK_C] Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
          </p>
          <p>
            [CALIBRATION_BLOCK_D] At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
          </p>
          <p>
            [CALIBRATION_BLOCK_E] Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
          <p>
            [CALIBRATION_BLOCK_F] Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Experimental() {
  const [isReady, setIsReady] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"monograph" | "cinema" | "blueprint" | "techscroll" | "blueprintnarrative">("monograph");
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [maxScroll, setMaxScroll] = useState(0);
  const maxScrollRef = useRef(0);

  const navigate = useNavigate();
  const currentScrollY = useRef(0);

  // Smooth virtual scroll values matching Contact page spring settings
  const scrollProgress = useMotionValue(0);
  const smoothScrollY = useSpring(scrollProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });

  const contentY = useTransform(smoothScrollY, y => -y);
  const bgY = useTransform(smoothScrollY, y => {
    const max = maxScrollRef.current;
    if (max <= 0) return "0px";
    const progress = y / max;
    const maxSafeTravel = 0.15 * window.innerHeight + 345;
    return `${progress * -maxSafeTravel}px`;
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Apply no-scrollbar to HTML and Body to hide vertical scrollbars globally on PC/Desktop
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    const updateMaxScroll = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const newMax = Math.max(0, contentHeight - viewportHeight);
        setMaxScroll(newMax);
        maxScrollRef.current = newMax;

        // Clamp current scroll if it exceeds new max
        if (currentScrollY.current > newMax) {
          currentScrollY.current = newMax;
          scrollProgress.set(newMax);
        }
      }
    };

    // Use ResizeObserver to detect any content resize dynamically (tab changes, window resize, content changes)
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

      // Snappy and natural wheel multiplier
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
      const delta = deltaY * 2.4; // Responsive mobile touch scroll sensitivity
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

    // Initial size calculation
    updateMaxScroll();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMaxScroll);
      if (observer) observer.disconnect();
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, [isReady]);

  const titleText = "Cherif Bouabdallah";

  // Micro-interaction entry animation variants
  const elementVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (delayIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1, 0.36, 1] as [number, number, number, number],
        delay: delayIndex * 0.12,
      },
    }),
  };

  // Leica-style blur-reveal for paragraphs
  const blurRevealVariants: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.4,
      },
    },
  };

  return (
    <div
      className="w-full h-screen min-h-screen relative overflow-hidden touch-none bg-theme-bg text-theme-text"
    >
      {/* Background Artwork Image */}
      <motion.div
        ref={bgRef}
        className="fixed top-0 left-0 right-0 bottom-[-300px] w-full pointer-events-none select-none z-0 overflow-hidden"
        style={{
          opacity: 0.12,
          y: bgY,
          scale: 1.15,
          transformOrigin: "center top",
        }}
      >
        <img
          src="/Untitled_Artwork.png"
          alt="Background Artwork"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ========================================== */}
      {/* HOMEPAGE CORE CONTENT                      */}
      {/* ========================================== */}
      {isReady && (
        <motion.div
          key="content"
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 w-full px-6 md:px-16 lg:px-24 xl:px-36 pb-32 pt-[150px] md:pt-[max(320px,calc(50vh-clamp(1.5rem,8vw,120px)/2))] flex flex-col items-center select-text"
          style={{
            y: contentY,
          }}
        >
          {/* Main Core Layout (Stretches full width, borderless Apple-style) */}
          <div className="w-full max-w-none flex flex-col gap-16 md:gap-28 z-10">

            {/* ========================================== */}
            {/* HERO TITLE & DYNAMIC LAYOUT PORTALS        */}
            {/* ========================================== */}
            <div className="flex flex-col gap-12 md:gap-20 w-full animate-layout-container">

              {/* Apple-style animated responsive title */}
              <h1 className="font-maghfirea text-[clamp(2.8rem,9vw,120px)] text-theme-text flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] relative translate-y-0 md:-translate-y-48">
                {titleText.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = wordIndex * 7 + charIndex;
                      return (
                        <span
                          key={charIndex}
                          className="inline-block overflow-hidden"
                          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                        >
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.05,
                            }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>

              {/* Elegant Layout Switcher Panel */}
              <div className="flex flex-col items-center gap-3 select-none mb-8 md:-mt-40 z-20">
                <span className="font-mono text-[8px] tracking-[0.3em] opacity-35">EXPERIMENT_LAYOUT_VIEWPORT</span>
                <div className="flex p-1 bg-white/5 border border-theme-text/10 rounded-full backdrop-blur-sm relative">
                  {[
                    { id: "monograph", name: "01 / MONOGRAPH" },
                    { id: "cinema", name: "02 / CINEMA" },
                    { id: "blueprint", name: "03 / BLUEPRINT" },
                    { id: "techscroll", name: "04 / TECH SCROLL" },
                    { id: "blueprintnarrative", name: "05 / NARRATIVE GRID" }
                  ].map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setLayoutMode(layout.id as any)}
                      className={`px-4 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase transition-all duration-500 cursor-pointer ${
                        layoutMode === layout.id
                          ? "bg-theme-text text-theme-bg font-bold scale-[1.02] shadow-lg"
                          : "text-theme-text/50 hover:text-theme-text hover:bg-white/5"
                      }`}
                    >
                      {layout.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Content wrapper with smooth Leica-style transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={layoutMode}
                  initial={{ opacity: 0, filter: "blur(8px)", y: 15 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(8px)", y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full mt-4 md:-mt-32"
                >
                  {layoutMode === "monograph" && (
                    <div className="w-full flex flex-col gap-16 md:gap-28 animate-fade-in">
                      {/* Section 1: Portrait & Bio */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-center">
                        {/* Column 1: Portrait Frame with coordinates */}
                        <div className="col-span-1 md:col-span-5 flex flex-col justify-start w-full max-w-[280px] md:max-w-none mx-auto select-none">
                          <div className="w-full aspect-[4/5] border border-theme-text/30 overflow-hidden bg-white/5 relative">
                            <img
                              src="/IMG_2656.JPEG"
                              alt="Portrait of Cherif Bouabdallah"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="font-mono text-[8px] tracking-[0.25em] opacity-40 mt-3 text-center md:text-left">
                            IMG_2656 // 46.5191° N, 6.5668° E
                          </div>
                        </div>

                        {/* Column 2: Biography with Cascade Animation */}
                        <div className="col-span-1 md:col-span-7 flex flex-col justify-center text-center md:text-left select-text">
                          <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none">
                            01 / Biography
                          </div>
                          <SegmentCascade segments={biographySegments} containerClassName="text-lg md:text-xl lg:text-2xl leading-relaxed text-theme-text/80" />
                        </div>
                      </div>

                      {/* Divider line */}
                      <SelfDrawingLine className="my-2" />

                      {/* Section 2: Skills & Background & Connect */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 lg:gap-16 items-start">
                        {/* Column 1: Skills Index */}
                        <div className="col-span-1 md:col-span-4 flex flex-col justify-start text-left select-text">
                          <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                            02 / Skills Index
                          </div>
                          <div className="w-full font-mono text-[10px] divide-y divide-theme-text/10">
                            {skillsData.map((skill) => (
                              <div
                                key={skill.name}
                                className="flex justify-between items-center py-3.5 text-theme-text/75 hover:text-white transition-colors duration-200"
                              >
                                <span className="font-bold tracking-wide">{skill.name}</span>
                                <span>{skill.logo}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Background Details with on-scroll animation */}
                        <motion.div 
                          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                          className="col-span-1 md:col-span-5 flex flex-col justify-start text-center md:text-left select-text"
                        >
                          <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                            03 / Background
                          </div>
                          <div className="space-y-6 text-sm md:text-base leading-relaxed text-theme-text/85 font-normal">
                            <p>
                              Currently pursuing software engineering at <span className="text-theme-text font-semibold underline decoration-theme-text/30 underline-offset-4">EPFL</span> (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.
                            </p>
                            <p>
                              When I am not coding, you will find me playing competitive <span className="text-theme-text font-semibold">Volleyball</span>, designing high-fidelity layouts, or studying new patterns in digital systems. I enjoy creating seamless interactions.
                            </p>
                          </div>
                        </motion.div>

                        {/* Column 3: Connect Gate */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => navigate("/contact")}
                          className="col-span-1 md:col-span-3 border border-theme-text/20 hover:border-theme-text rounded-2xl p-6 flex flex-col justify-between min-h-[220px] cursor-pointer group select-none transition-all duration-300 text-left bg-white/[0.01]"
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">
                              04 / Connect
                            </div>
                            <div className="font-mono text-[8px] tracking-[0.2em] text-theme-text/40 uppercase mt-0.5">
                              Route: /contact
                            </div>
                          </div>
                          <div className="my-2">
                            <span className="font-maghfirea text-2xl text-theme-text tracking-wide block transition-transform duration-300 group-hover:translate-x-1.5">
                              Get In Touch
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-[9px] pt-1">
                            <span className="opacity-0"></span>
                            <span className="text-theme-text/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1.5">
                              ENTER GATE <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {layoutMode === "cinema" && (
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-16 md:gap-24 animate-fade-in">
                      {/* Vertical Scroll Indicator */}
                      <div className="flex flex-col items-center gap-3 select-none">
                        <span className="font-mono text-[8px] tracking-[0.3em] uppercase opacity-30">READ DOWN</span>
                        <div className="w-[1px] h-10 bg-theme-text/10 relative overflow-hidden">
                          <motion.div
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-theme-text/50"
                          />
                        </div>
                      </div>

                      {/* Double-Bordered Portrait */}
                      <div className="flex justify-center w-full select-none">
                        <div className="relative p-2.5 border border-theme-text/10 rounded-2xl">
                          <div className="absolute inset-0 border border-theme-text/25 m-1 rounded-xl pointer-events-none" />
                          <div className="w-[260px] sm:w-[300px] aspect-[4/5] overflow-hidden bg-white/5 relative rounded-lg">
                            <img
                              src="/IMG_2656.JPEG"
                              alt="Portrait of Cherif Bouabdallah"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Narrative Story */}
                      <div className="max-w-2xl mx-auto text-center md:text-left select-text space-y-8 px-4 w-full">
                        <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 text-center mb-6 select-none">
                          01 / The Narrative
                        </div>
                        <SegmentCascade segments={biographySegments} containerClassName="text-base md:text-lg lg:text-xl leading-relaxed text-theme-text/90" />
                        
                        <div className="w-12 h-[1px] bg-theme-text/20 mx-auto my-8" />
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-6 text-sm md:text-base leading-relaxed text-theme-text/75 font-normal text-center md:text-left"
                        >
                          <p>{backgroundParagraphs[0]}</p>
                          <p>{backgroundParagraphs[1]}</p>
                        </motion.div>
                      </div>

                      {/* Horizontal Capabilities */}
                      <div className="w-full px-4 text-center">
                        <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8 select-none">
                          02 / Capabilities
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 font-mono text-[10px] max-w-2xl mx-auto">
                          {skillsData.map((skill) => (
                            <div
                              key={skill.name}
                              className="px-4 py-2.5 bg-white/5 border border-theme-text/10 rounded-full flex items-center gap-2 hover:bg-white/10 hover:border-theme-text/30 transition-all duration-300 cursor-default"
                            >
                              <span className="font-bold tracking-wide text-theme-text/80">{skill.name}</span>
                              <span className="opacity-75">{skill.logo}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Centered Connect Gate */}
                      <div className="w-full px-4 flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => navigate("/contact")}
                          className="max-w-md w-full border border-theme-text/20 hover:border-theme-text rounded-2xl p-8 flex flex-col items-center justify-center gap-6 cursor-pointer group select-none transition-all duration-500 bg-white/[0.01] text-center"
                        >
                          <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">
                            03 / Gateway
                          </div>
                          <span className="font-maghfirea text-3xl sm:text-4xl text-theme-text tracking-wide block transition-transform duration-300 group-hover:scale-103">
                            Get In Touch
                          </span>
                          <span className="font-mono text-[9px] text-theme-text/50 group-hover:text-white transition-colors duration-300 flex items-center gap-1.5">
                            ENTER SYSTEM PORTAL <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {layoutMode === "blueprint" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start relative text-left animate-fade-in">
                      {/* Lane 1: Left (3 cols) */}
                      <div className="col-span-1 md:col-span-3 flex flex-col gap-8 md:border-r md:border-theme-text/10 md:pr-8">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            01 / Portrait
                          </div>
                          <div className="w-full aspect-[4/5] border border-theme-text/20 overflow-hidden bg-white/5 relative rounded-lg">
                            <img
                              src="/IMG_2656.JPEG"
                              alt="Portrait of Cherif Bouabdallah"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            02 / Tools
                          </div>
                          <div className="flex flex-col gap-2 font-mono text-[9px] text-theme-text/75">
                            {skillsData.slice(0, 6).map((skill) => (
                              <div key={skill.name} className="flex justify-between items-center py-1.5 border-b border-theme-text/5">
                                <span>{skill.name}</span>
                                <span className="scale-75 opacity-60">{skill.logo}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Lane 2: Center (6 cols) */}
                      <div className="col-span-1 md:col-span-6 flex flex-col gap-12 md:px-4">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                            03 / Monologue
                          </div>
                          <SegmentCascade segments={biographySegments} containerClassName="text-base md:text-lg leading-relaxed text-theme-text/90" />
                        </div>

                        <div className="w-full h-[1px] bg-theme-text/10" />

                        <motion.div
                          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                            04 / Background
                          </div>
                          <div className="space-y-6 text-sm md:text-base leading-relaxed text-theme-text/80">
                            {backgroundParagraphs.map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      </div>

                      {/* Lane 3: Right (3 cols) */}
                      <div className="col-span-1 md:col-span-3 flex flex-col gap-8 md:border-l md:border-theme-text/10 md:pl-8">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            05 / Metadata
                          </div>
                          <div className="font-mono text-[8px] leading-relaxed text-theme-text/50 space-y-2 border border-theme-text/10 rounded-xl p-4 bg-black/10">
                            <div><span className="text-theme-text opacity-80 font-bold">CLIENT:</span> Cherif Bouabdallah</div>
                            <div><span className="text-theme-text opacity-80 font-bold">ROLE:</span> EPFL CS Engineer</div>
                            <div><span className="text-theme-text opacity-80 font-bold">GRID:</span> Modular Swiss 12-Col</div>
                            <div><span className="text-theme-text opacity-80 font-bold">LOC:</span> Lausanne, CH</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            06 / Portal
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => navigate("/contact")}
                            className="w-full border border-theme-text/20 hover:border-theme-text rounded-2xl p-5 flex flex-col justify-between min-h-[140px] cursor-pointer group select-none transition-all duration-300 bg-white/[0.01]"
                          >
                            <span className="font-maghfirea text-lg text-theme-text tracking-wide block transition-transform duration-300 group-hover:translate-x-1">
                              Contact
                            </span>
                            <span className="font-mono text-[8px] text-theme-text/50 group-hover:text-white transition-colors flex items-center gap-1">
                              OPEN →
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  {layoutMode === "techscroll" && (
                    <div className="max-w-4xl mx-auto relative px-8 md:px-16 py-8 flex flex-col items-center gap-16 md:gap-24 animate-fade-in">
                      {/* Left Blueprint vertical guide line */}
                      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-theme-text/10" />
                      {/* Right Blueprint vertical guide line */}
                      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-theme-text/10" />

                      {/* Centered Double-Bordered Portrait with coordinates */}
                      <div className="flex flex-col items-center select-none w-full">
                        <div className="relative p-2.5 border border-theme-text/10 rounded-2xl">
                          <div className="absolute inset-0 border border-theme-text/25 m-1 rounded-xl pointer-events-none" />
                          <div className="w-[240px] sm:w-[285px] aspect-[4/5] overflow-hidden bg-white/5 relative rounded-lg">
                            <img
                              src="/IMG_2656.JPEG"
                              alt="Portrait of Cherif Bouabdallah"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="font-mono text-[7px] tracking-[0.25em] opacity-40 mt-3.5 text-center">
                          TECH_SCROLL_MODEL // 46.5191° N, 6.5668° E
                        </div>
                      </div>

                      {/* Narrative Story */}
                      <div className="max-w-2xl text-center md:text-left select-text space-y-8 px-4 w-full">
                        <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 text-center mb-4 select-none">
                          01 / The Narrative Specimen
                        </div>
                        <SegmentCascade segments={biographySegments} containerClassName="text-base md:text-lg leading-relaxed text-theme-text/90" />
                        
                        <div className="w-full h-[1px] bg-theme-text/10 my-6" />
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-6 text-sm md:text-base leading-relaxed text-theme-text/75 font-normal text-center md:text-left"
                        >
                          <p>{backgroundParagraphs[0]}</p>
                          <p>{backgroundParagraphs[1]}</p>
                        </motion.div>
                      </div>

                      {/* Capabilities in a structured blueprint tags block */}
                      <div className="w-full px-4 text-center">
                        <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-8 select-none">
                          02 / Technical Stack Directory
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 font-mono text-[9px] max-w-2xl mx-auto">
                          {skillsData.map((skill) => (
                            <div
                              key={skill.name}
                              className="px-4 py-2 border border-theme-text/15 hover:border-theme-text rounded-none bg-black/10 flex items-center gap-2 hover:bg-white/5 transition-all duration-300 cursor-default"
                            >
                              <span className="font-bold tracking-wide text-theme-text/80">{skill.name}</span>
                              <span className="scale-75 opacity-70">{skill.logo}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Centered Connect Gate with blueprint frame look */}
                      <div className="w-full px-4 flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => navigate("/contact")}
                          className="max-w-md w-full border border-theme-text/15 hover:border-theme-text p-8 flex flex-col items-center justify-center gap-4 cursor-pointer group select-none transition-all duration-500 bg-white/[0.01] text-center"
                        >
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40">
                            03 / Gate
                          </div>
                          <span className="font-maghfirea text-2xl sm:text-3xl text-theme-text tracking-wide block transition-transform duration-300 group-hover:scale-103">
                            Get In Touch
                          </span>
                          <span className="font-mono text-[8px] text-theme-text/50 group-hover:text-white transition-colors duration-300 flex items-center gap-1.5">
                            ENTER GATEWAY <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {layoutMode === "blueprintnarrative" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start relative text-left animate-fade-in">
                      {/* Lane 1: Left (3 cols) */}
                      <div className="col-span-1 md:col-span-3 flex flex-col gap-10 md:border-r md:border-theme-text/10 md:pr-8">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            01 / Grid Metadata
                          </div>
                          <div className="font-mono text-[8px] leading-relaxed text-theme-text/50 space-y-2 border border-theme-text/10 rounded-xl p-4 bg-black/10">
                            <div><span className="text-theme-text opacity-85 font-bold">MODE:</span> Narrative Grid</div>
                            <div><span className="text-theme-text opacity-85 font-bold">CLIENT:</span> Cherif Bouabdallah</div>
                            <div><span className="text-theme-text opacity-85 font-bold">LOC:</span> EPFL Lausanne</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            02 / Details
                          </div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4 text-xs leading-relaxed text-theme-text/75 font-normal"
                          >
                            <p>{backgroundParagraphs[0]}</p>
                            <p>{backgroundParagraphs[1]}</p>
                          </motion.div>
                        </div>
                      </div>

                      {/* Center Column (6 cols) */}
                      <div className="col-span-1 md:col-span-6 flex flex-col gap-16 md:px-4 items-center">
                        {/* Portrait */}
                        <div className="flex justify-center w-full select-none">
                          <div className="relative p-2 border border-theme-text/10 rounded-xl">
                            <div className="w-[200px] sm:w-[240px] aspect-[4/5] overflow-hidden bg-white/5 relative rounded-lg">
                              <img
                                src="/IMG_2656.JPEG"
                                alt="Portrait of Cherif Bouabdallah"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Monologue */}
                        <div className="w-full">
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none text-left">
                            03 / Monologue
                          </div>
                          <SegmentCascade segments={biographySegments} containerClassName="text-base leading-relaxed text-theme-text/90 text-left" />
                        </div>

                        {/* Capabilities */}
                        <div className="w-full">
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none text-left">
                            04 / Capabilities
                          </div>
                          <div className="flex flex-wrap gap-2 font-mono text-[8px]">
                            {skillsData.map((skill) => (
                              <div
                                key={skill.name}
                                className="px-3 py-1.5 bg-white/5 border border-theme-text/10 rounded-full flex items-center gap-1.5"
                              >
                                <span className="font-bold tracking-wide text-theme-text/80">{skill.name}</span>
                                <span className="opacity-75 scale-90">{skill.logo}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Lane 3: Right (3 cols) */}
                      <div className="col-span-1 md:col-span-3 flex flex-col gap-8 md:border-l md:border-theme-text/10 md:pl-8">
                        <div>
                          <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                            05 / Connection
                          </div>
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => navigate("/contact")}
                            className="w-full border border-theme-text/20 hover:border-theme-text rounded-2xl p-5 flex flex-col justify-between min-h-[140px] cursor-pointer group select-none transition-all duration-300 bg-white/[0.01]"
                          >
                            <span className="font-maghfirea text-lg text-theme-text tracking-wide block transition-transform duration-300 group-hover:translate-x-1">
                              Contact
                            </span>
                            <span className="font-mono text-[8px] text-theme-text/50 group-hover:text-white transition-colors flex items-center gap-1">
                              OPEN PORTAL →
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* ========================================== */}
          {/* PARALLAX CALIBRATION & PLACEHOLDER SECTION */}
          {/* ========================================== */}
          <DiagnosticsPanel smoothScrollY={smoothScrollY} maxScroll={maxScroll} />

          {/* ========================================== */}
          {/* MINIMAL FOOTER                             */}
          {/* ========================================== */}
          <footer className="mt-32 w-full pt-8 border-t border-theme-text/10 flex flex-col sm:flex-row items-center justify-between text-xs text-theme-text/40 gap-4 z-10 select-none text-center sm:text-left">
            <div>
              🔬 Simple Luxury Experimental Sandbox — EPFL Edition
            </div>
            <div className="font-mono text-[10px] break-all">
              To delete: remove <code className="text-theme-text/60 bg-white/5 px-1 py-0.5 rounded">src/pages/Experimental.tsx</code> & route in <code className="text-theme-text/60 bg-white/5 px-1 py-0.5 rounded">src/App.tsx</code>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
