import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Type, 
  Palette, 
  Activity, 
  Copy, 
  Check, 
  Sparkles,
  MoveHorizontal 
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
// EXHIBIT I: TYPOGRAPHICAL SPECIMEN (MAGHFIREA FONT)
// ----------------------------------------------------------------------
function TypographyExhibit({ glassClass = "glass-deep-blur" }: { glassClass?: string }) {
  const [customText, setCustomText] = useState("Edit me !");
  
  return (
    <div className={`glass-square ${glassClass} p-6 md:p-8 flex flex-col justify-between h-full select-text text-left relative overflow-hidden`}>
      <div>
        <div className="flex justify-between items-center mb-6 select-none">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">01 / Typeface Specimen</span>
          <Type size={16} className="text-[#F6F0DF]/60" />
        </div>
        
        {/* Alphabet specimen */}
        <div className="font-mono text-[9px] text-[#F6F0DF]/50 leading-relaxed tracking-wider border border-[#F6F0DF]/10 rounded-xl p-4 bg-black/10 mb-6 select-none">
          <div className="border-b border-[#F6F0DF]/5 pb-1 mb-2 font-bold tracking-widest text-[#F6F0DF]/80">MAGHFIREA SYSTEM</div>
          ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
          abcdefghijklmnopqrstuvwxyz<br />
          0123456789 ( DISPLAY SERIF )
        </div>

        {/* Live preview */}
        <div className="text-center border-t border-b border-[#F6F0DF]/10 py-6 my-6 min-h-[130px] flex items-center justify-center overflow-hidden">
          <p className="font-maghfirea text-[clamp(1.8rem,4vw,3.2rem)] text-[#F6F0DF] leading-tight tracking-wide break-all w-full select-all">
            {customText || "Maghfirea"}
          </p>
        </div>
      </div>
      
      <div>
        <input 
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Type to test typeface..."
          maxLength={30}
          className="w-full bg-[#F6F0DF]/5 border border-[#F6F0DF]/15 rounded-xl px-4 py-3 font-mono text-[11px] text-[#F6F0DF] placeholder-[#F6F0DF]/30 focus:outline-none focus:border-[#F6F0DF]/40 focus:bg-[#F6F0DF]/10 transition-all duration-300 mb-4"
        />
        <p className="font-mono text-[10px] leading-relaxed text-[#F6F0DF]/60">
          <span className="text-[#F6F0DF] font-bold">Maghfirea</span> is a custom display serif chosen for headers to evoke editorial heritage and visual drama. This is paired with monospace fonts for code elements to create a contrast between organic style and technical precision.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// EXHIBIT II: COLOR SWATCHES
// ----------------------------------------------------------------------
function SwatchesExhibit({ glassClass = "glass-deep-blur" }: { glassClass?: string }) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };
  
  return (
    <div className={`glass-square ${glassClass} p-6 md:p-8 flex flex-col justify-between h-full text-left select-none relative overflow-hidden`}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">02 / Color Swatches</span>
          <Palette size={16} className="text-[#F6F0DF]/60" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Swatch 1 */}
          <div 
            onClick={() => copyColor("#223D27")}
            className="flex flex-col gap-3 group cursor-pointer"
          >
            <div className="w-full h-24 rounded-xl border border-[#F6F0DF]/20 bg-[#223D27] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] relative overflow-hidden flex items-center justify-center">
              {copiedColor === "#223D27" ? (
                <Check size={16} className="text-[#F6F0DF] drop-shadow" />
              ) : (
                <Copy size={16} className="opacity-0 group-hover:opacity-100 text-[#F6F0DF] transition-opacity duration-300 drop-shadow" />
              )}
            </div>
            <div className="font-mono text-[9px] leading-tight">
              <div className="text-[#F6F0DF] font-bold">FOREST GREEN</div>
              <div className="text-[#F6F0DF]/60 mt-0.5">#223D27</div>
            </div>
          </div>
          
          {/* Swatch 2 */}
          <div 
            onClick={() => copyColor("#F6F0DF")}
            className="flex flex-col gap-3 group cursor-pointer"
          >
            <div className="w-full h-24 rounded-xl border border-[#F6F0DF]/20 bg-[#F6F0DF] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden flex items-center justify-center">
              {copiedColor === "#F6F0DF" ? (
                <Check size={16} className="text-[#223D27]" />
              ) : (
                <Copy size={16} className="opacity-0 group-hover:opacity-100 text-[#223D27] transition-opacity duration-300" />
              )}
            </div>
            <div className="font-mono text-[9px] leading-tight">
              <div className="text-[#F6F0DF] font-bold">BUTTER CREAM</div>
              <div className="text-[#F6F0DF]/60 mt-0.5">#F6F0DF</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <p className="font-mono text-[10px] leading-relaxed text-[#F6F0DF]/60">
          The palette uses natural Forest Green (`#223D27`) as the base to represent grounding stability, contrasted by Warm Butter Cream (`#F6F0DF`) for text and borders, avoiding harsh digital white. Click color cards to copy.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// EXHIBIT III: LIQUID TOGGLE KINETICS
// ----------------------------------------------------------------------
function LiquidToggleExhibit({ glassClass = "glass-deep-blur" }: { glassClass?: string }) {
  const [activeTab, setActiveTab] = useState(0);

  // Configuration of varying widths and positions to bring organic variety
  const TABS_CONFIG = [
    { width: 42, left: 8 },
    { width: 58, left: 95 },
    { width: 50, left: 198 }
  ];
  
  return (
    <div className={`glass-square ${glassClass} p-6 md:p-8 flex flex-col justify-between h-full text-left select-none relative overflow-hidden`}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">03 / Liquid Nav Kinetics</span>
          <MoveHorizontal size={16} className="text-[#F6F0DF]/60" />
        </div>
        
        {/* Interactive goo prototype */}
        <div className="h-28 w-full border border-[#F6F0DF]/10 rounded-2xl bg-black/10 flex items-center justify-center relative mb-6">
          {/* Outer clean track container */}
          <div className="relative w-64 h-12 bg-[#F6F0DF]/5 border border-[#F6F0DF]/15 rounded-full p-1 overflow-hidden">
            
            {/* Nested Goo Layer (only applies filter to circles, not wrapper borders) */}
            <div className="absolute inset-0 w-full h-full" style={{ filter: "url(#about-goo-filter)" }}>
              {/* Morphing backdrop circles with varying widths */}
              {TABS_CONFIG.map((tab, idx) => (
                <div 
                  key={idx}
                  className="absolute h-10 rounded-full bg-[#F6F0DF]/15"
                  style={{
                    left: `${tab.left}px`,
                    width: `${tab.width}px`,
                    top: "3px"
                  }}
                />
              ))}
              
              {/* Sliding main liquid bubble that fluidly stretches to the destination width */}
              <motion.div 
                className="absolute h-10 rounded-full bg-[#F6F0DF]"
                animate={{
                  left: `${TABS_CONFIG[activeTab].left}px`,
                  width: `${TABS_CONFIG[activeTab].width}px`,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                style={{ top: "3px" }}
              />
            </div>
            
            {/* Foreground text buttons (outside goo layer to stay perfectly sharp) */}
            {TABS_CONFIG.map((tab, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`absolute h-10 rounded-full flex items-center justify-center font-mono text-[10px] font-bold z-10 cursor-pointer transition-colors duration-300 ${activeTab === idx ? "text-[#223D27]" : "text-[#F6F0DF]"}`}
                style={{
                  left: `${tab.left}px`,
                  width: `${tab.width}px`,
                  top: "3px"
                }}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <p className="font-mono text-[10px] leading-relaxed text-[#F6F0DF]/60">
          The routing menu uses SVG color matrix operations and blur parameters to produce organic gooey morphs. Click the numbers in the mini-controller above to experience the fluid bubble transition.
        </p>
      </div>
      
      {/* SVG filter definitions local to this page */}
      <svg className="absolute w-0 h-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gooey filter for Liquid Kinetics Toggle */}
          <filter id="about-goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

// ----------------------------------------------------------------------
// EXHIBIT V: MOTION PHYSICS (SPRING SIMULATOR)
// ----------------------------------------------------------------------
function MotionPhysicsExhibit({ glassClass = "glass-deep-blur" }: { glassClass?: string }) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  return (
    <div className={`glass-square ${glassClass} p-6 md:p-8 flex flex-col justify-between h-full text-left select-none relative overflow-hidden`}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">05 / Inertial Springs</span>
          <Activity size={16} className="text-[#F6F0DF]/60" />
        </div>
        
        {/* Interactive Drag Spring Field */}
        <div className="h-32 w-full border border-[#F6F0DF]/10 rounded-xl bg-black/15 relative overflow-hidden flex items-center justify-center">
          {/* Elastic connecting line */}
          <svg className="absolute w-24 h-24 pointer-events-none overflow-visible">
            <motion.line
              x1="48"
              y1="48"
              x2={useTransform(dragX, x => 48 + x)}
              y2={useTransform(dragY, y => 48 + y)}
              stroke="rgba(246, 240, 223, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          
          <div className="absolute font-mono text-[7px] tracking-widest text-[#F6F0DF]/20 pointer-events-none uppercase text-center">
            DRAG THE DOT AND RELEASE<br />
            STIFFNESS: 120 / DAMPING: 30
          </div>
          
          {/* Draggable spring dot */}
          <motion.div 
            drag
            dragConstraints={{ left: -100, right: 100, top: -45, bottom: 45 }}
            dragElastic={0.25}
            dragTransition={{ bounceStiffness: 120, bounceDamping: 30 }}
            style={{ x: dragX, y: dragY }}
            className="w-5 h-5 rounded-full bg-[#F6F0DF] shadow-[0_0_12px_rgba(246,240,223,0.5)] cursor-grab active:cursor-grabbing z-10"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <p className="font-mono text-[10px] leading-relaxed text-[#F6F0DF]/60">
          The scroll mechanics and transitions are powered by Newtonian mass-spring calculations. Drag the dot in the field above and release it to see it spring back using the site's exact physics constants.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// EXHIBIT VI: CREATOR PORTRAIT
// ----------------------------------------------------------------------
function ButtonCollectionExhibit({ glassClass = "glass-deep-blur" }: { glassClass?: string }) {
  const [copied, setCopied] = useState(false);
  const [testToggle, setTestToggle] = useState(true);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`glass-square ${glassClass} p-6 md:p-8 flex flex-col justify-between h-full text-left select-none relative overflow-hidden`}>
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">06 / UI Component Showcase</span>
          <Sparkles size={16} className="text-[#F6F0DF]/60" />
        </div>
        
        {/* Buttons Showcase area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {/* Panel 1: Social Badges & Toggles */}
          <div className="flex flex-col gap-4 border border-[#F6F0DF]/10 rounded-2xl p-4 bg-black/10 items-center justify-center min-h-[160px]">
            <div className="font-mono text-[8px] tracking-widest text-[#F6F0DF]/40 uppercase mb-1 text-center">
              Social Badges & Toggles
            </div>
            
            {/* Social icons row */}
            <div className="flex gap-4">
              {/* GitHub mini representation */}
              <div className="w-10 h-10 rounded-full border border-[#F6F0DF]/20 flex items-center justify-center text-[#F6F0DF] bg-[#F6F0DF]/5 backdrop-blur-[2px] transition-all duration-300 hover:bg-[#F6F0DF] hover:text-[#223D27] hover:scale-105 cursor-pointer">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                </svg>
              </div>
              
              {/* LinkedIn mini representation */}
              <div className="w-10 h-10 rounded-full border border-[#F6F0DF]/20 flex items-center justify-center text-[#F6F0DF] bg-[#F6F0DF]/5 backdrop-blur-[2px] transition-all duration-300 hover:bg-[#F6F0DF] hover:text-[#223D27] hover:scale-105 cursor-pointer">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
            </div>

            {/* Micro Toggle button */}
            <button
              onClick={() => setTestToggle(!testToggle)}
              className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#F6F0DF]/40 hover:text-[#F6F0DF] transition-colors duration-200 cursor-pointer flex items-center gap-2 mt-1"
            >
              <span>SYS_TOGGLE:</span>
              <span className={testToggle ? "text-[#F6F0DF] font-bold" : "opacity-50"}>ON</span>
              <span className="opacity-30">|</span>
              <span className={!testToggle ? "text-[#F6F0DF] font-bold" : "opacity-50"}>OFF</span>
            </button>
          </div>
          
          {/* Panel 2: Action Elements */}
          <div className="flex flex-col gap-4 border border-[#F6F0DF]/10 rounded-2xl p-4 bg-black/10 items-stretch justify-center min-h-[160px]">
            <div className="font-mono text-[8px] tracking-widest text-[#F6F0DF]/40 uppercase mb-1 text-center">
              Action Elements
            </div>

            {/* Copy Address Button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F6F0DF] text-[#223D27] font-mono text-[9px] font-bold tracking-wider hover:bg-[#F6F0DF]/90 active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} strokeWidth={2.5} />
                  COPIED!
                </>
              ) : (
                <>
                  <Copy size={12} strokeWidth={2.5} />
                  COPY ADDRESS
                </>
              )}
            </button>

            {/* Gateway Hover Button */}
            <div className="border border-[#F6F0DF]/20 rounded-xl p-2.5 flex items-center justify-between group cursor-pointer hover:bg-[#F6F0DF]/5 transition-colors">
              <span className="font-mono text-[8px] tracking-wider text-[#F6F0DF]/50">ROUTING</span>
              <span className="font-mono text-[9px] tracking-widest text-[#F6F0DF] group-hover:translate-x-1 transition-transform">
                ENTER GATE →
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <p className="font-mono text-[10px] leading-relaxed text-[#F6F0DF]/60">
          A collection of the micro-interaction UI elements used sitewide. Features include inverted glassmorphic badge hovers, elastic scale active states, and discrete toggle switches.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN ABOUT PAGE
// ----------------------------------------------------------------------
export default function About() {
  const [isReady, setIsReady] = useState(false);
  const [showArtwork, setShowArtwork] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const maxScrollRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const currentScrollY = useRef(0);

  const getGlassClass = () => "glass-deep-blur";
  
  // Smooth scroll tracking matching other scrollable screens
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
    // Scale travel range between -100px (short pages) and -300px (long pages)
    const travel = Math.min(300, Math.max(100, max * 0.1));
    return `${progress * -travel}px`;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Dynamic header and text reveals loader trigger
  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  // Scroll and Resize Observer initialization
  useEffect(() => {
    if (!isReady) return;
    
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    
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
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, [isReady]);

  const headerText = "The Museum";
  
  // Title animations: Centering initially, scaling/moving to the top, and then scrolling up 1:1 with cards
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
    hidden: { opacity: 0, y: 30 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1, 0.36, 1],
        delay: idx * 0.1,
      }
    })
  };


  return (
    <div className="w-full h-screen min-h-screen bg-[#223D27] text-[#F6F0DF] relative overflow-hidden touch-none">

      {/* Parallax Background Artwork */}
      <motion.div 
        className="fixed top-0 left-0 right-0 bottom-[-300px] w-full pointer-events-none select-none z-0 overflow-hidden transition-opacity duration-500"
        style={{ 
          opacity: showArtwork ? 0.15 : 0,
          y: bgY,
          scale: 1.15,
          transformOrigin: "center top",
        }}
      >
        <img 
          src="/OG2.PNG" 
          alt="Atmospheric Background Artwork" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Big Centered Title */}
      <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none select-none z-20">
        <motion.div
          style={{ y: titleY, scale: titleScale }}
          className="cursor-default"
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            className="font-maghfirea text-[clamp(2.5rem,12vw,200px)] text-[#F6F0DF] flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] selection:bg-[#F6F0DF] selection:text-[#223D27] px-4 w-full"
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
                            hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
                            visible: (idx: number) => ({
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                              transition: {
                                duration: 1.0,
                                ease: [0.21, 1, 0.36, 1],
                                delay: idx * 0.05
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

      {/* Scroll Invite */}
      <motion.div
        style={{ opacity: inviteOpacity, y: inviteY }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#F6F0DF]/60">
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

      {/* Scrollable Frame Container */}
      {isReady && (
        <motion.div
          key="about-scroll-container"
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 w-full px-6 md:px-16 lg:px-24 xl:px-36 pb-32 flex flex-col items-center select-text"
          style={{ y: contentY }}
        >
          {/* Spacer to push exhibition cards below the fold */}
          <div className="w-full h-screen flex-shrink-0" />
          {/* Intro Description Block (Scrolls up into view) */}
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-6 mb-8 md:mb-10 z-10 text-center select-none pt-12">
              <motion.p
                initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-[#F6F0DF]/60 max-w-xl leading-relaxed mt-2"
              >
                An archive of the design principles, visual systems, and motion dynamics defining this digital gallery.
              </motion.p>


 
              <button
                onClick={() => setShowArtwork(!showArtwork)}
                className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#F6F0DF]/40 hover:text-[#F6F0DF] cursor-pointer flex items-center gap-2.5 mt-2 select-none transition-all duration-200"
              >
                <span>Atmospheric Artwork:</span>
                <span className={showArtwork ? "text-[#F6F0DF] font-bold" : "opacity-50"}>ON</span>
                <span className="opacity-30">|</span>
                <span className={!showArtwork ? "text-[#F6F0DF] font-bold" : "opacity-50"}>OFF</span>
              </button>
            </div>
 
            <SelfDrawingLine className="mb-10 max-w-[1440px] mx-auto" />

          {/* Exhibition Grid Layout */}
          <div className="grid grid-cols-12 gap-8 md:gap-12 w-full max-w-[1440px] mx-auto z-10 items-stretch">
            {/* Exhibit 1: Typeface Specimen */}
            <motion.div 
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 lg:col-span-8"
            >
              <TypographyExhibit glassClass={getGlassClass()} />
            </motion.div>

            {/* Exhibit 2: Color Palette */}
            <motion.div 
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <SwatchesExhibit glassClass={getGlassClass()} />
            </motion.div>

            {/* Exhibit 3: Liquid Kinetics */}
            <motion.div 
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 md:col-span-6 lg:col-span-5"
            >
              <LiquidToggleExhibit glassClass={getGlassClass()} />
            </motion.div>

            {/* Exhibit 5: Spring Dynamics */}
            <motion.div 
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12 md:col-span-6 lg:col-span-7"
            >
              <MotionPhysicsExhibit glassClass={getGlassClass()} />
            </motion.div>

            {/* Exhibit 6: UI Component Showcase */}
            <motion.div 
              custom={5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardRevealVariants}
              className="col-span-12"
            >
              <ButtonCollectionExhibit glassClass={getGlassClass()} />
            </motion.div>
          </div>

          {/* Minimal Editorial Footer */}
          <footer className="mt-32 w-full max-w-[1440px] pt-8 border-t border-[#F6F0DF]/10 flex items-center justify-center text-[9px] font-mono tracking-[0.2em] text-[#F6F0DF]/40 z-10 select-none">
            © {new Date().getFullYear()} CHERIF BOUABDALLAH
          </footer>
        </motion.div>
      )}
    </div>
  );
}
