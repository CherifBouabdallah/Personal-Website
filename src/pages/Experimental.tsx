import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SegmentCascade, Segment } from "../components/BiographyAnimations";

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

export default function Experimental() {
  const [isReady, setIsReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="w-full h-screen min-h-screen relative overflow-hidden touch-none bg-theme-bg text-theme-text"
    >
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

            {/* HERO TITLE */}
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

              {/* Blueprint Layout Grid */}
              <div className="w-full mt-4 md:-mt-32">
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
              </div>

            </div>

          </div>

          {/* ========================================== */}
          {/* MINIMAL FOOTER                             */}
          {/* ========================================== */}
          <footer className="mt-32 w-full pt-8 border-t border-theme-text/10 flex items-center justify-center text-[9px] font-mono tracking-[0.2em] text-[#F6F0DF]/40 z-10 select-none">
            © {new Date().getFullYear()} CHERIF BOUABDALLAH
          </footer>
        </motion.div>
      )}
    </div>
  );
}
