import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence, useScroll } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import Footer from "../components/Footer";
import {
  Github,
  ArrowRight
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

// Lazy load portfolio projects to decouple their heavy chunks from the Portfolio page initial load
const Vortex = React.lazy(() => import("./Vortex"));
const SoccerTeam = React.lazy(() => import("./SoccerTeam"));
const NoodlePlace = React.lazy(() => import("./NoodlePlace"));

// Type declarations
export type ModalKey = "vortex" | "soccer" | "noodle";

export interface FeaturedProject {
  id: ModalKey;
  number: string;
  title: string;
  descriptionKey: keyof typeof TRANSLATIONS.en;
  githubUrl: string;
  showGithub?: boolean;
  layoutId: string;
  bgColor: string;
  reverse?: boolean;
}

// 1. Static project database
export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "vortex",
    number: "01",
    title: "Vortex",
    descriptionKey: "vortexDesc",
    githubUrl: "https://github.com/CherifBouabdallah",
    showGithub: true,
    layoutId: "vortex-sandbox-card",
    bgColor: "#141212",
  },
  {
    id: "soccer",
    number: "02",
    title: "Olympus FC",
    descriptionKey: "soccerDesc",
    githubUrl: "https://github.com/CherifBouabdallah",
    showGithub: false,
    layoutId: "soccer-team-card",
    bgColor: "#FAFAF8",
    reverse: true,
  },
  {
    id: "noodle",
    number: "03",
    title: "Kiri Ramen",
    descriptionKey: "ramenDesc",
    githubUrl: "https://github.com/CherifBouabdallah",
    showGithub: false,
    layoutId: "noodle-place-card",
    bgColor: "#121212",
  }
];

// 3. Shared Preview: Scaled page thumbnail with unified hover (Memoized)
export const ProjectPreview = React.memo(({ onClick, layoutId, bgColor, children, hoverLabel = "Open Project" }: {
  onClick: () => void;
  layoutId: string;
  bgColor: string;
  children: React.ReactNode;
  hoverLabel?: string;
}) => {
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
});

// 4. Morphing Title animation - centered split header (Memoized & character split tree optimized)
interface MorphingTitleProps {
  text: string;
  isReady: boolean;
}

const MorphingTitle = React.memo(({ text, isReady }: MorphingTitleProps) => {
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Use IntersectionObserver to detect when title scrolls into view
  useEffect(() => {
    if (!isReady || hasBeenInView) return;
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isReady, hasBeenInView]);

  // Memoize character split tree to prevent rebuilding character span objects on re-renders
  const splitText = useMemo(() => {
    let charCounter = 0;
    return text.split(" ").map((word, wordIndex) => {
      const chars = word.split("").map((char) => {
        const globalIndex = charCounter++;
        return { char, globalIndex };
      });
      return { wordIndex, chars };
    });
  }, [text]);

  const shouldAnimate = isReady && hasBeenInView;

  return (
    <motion.h1
      ref={titleRef}
      className="font-maghfirea text-[clamp(2.3rem,12vw,200px)] text-theme-text flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] px-4 w-full"
    >
      {splitText.map(({ wordIndex, chars }) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {chars.map(({ char, globalIndex }, charIndex) => (
            <span
              key={charIndex}
              className="inline-block overflow-hidden"
              style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                animate={shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                transition={{
                  duration: 1.0,
                  ease: [0.21, 1, 0.36, 1],
                  delay: globalIndex * 0.05,
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
});

// 5. Featured Project Card Component (Memoized)
interface FeaturedCardProps {
  project: FeaturedProject;
  t: any;
  onOpen: (key: ModalKey) => void;
  getGlassClass: () => string;
}

const FeaturedCard = React.memo(({ project, t, onOpen, getGlassClass }: FeaturedCardProps) => {
  const handleOpen = useCallback(() => {
    onOpen(project.id);
  }, [project.id, onOpen]);

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
    <motion.div
      custom={parseInt(project.number, 10)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardRevealVariants}
      className="col-span-12 defer-render"
    >
      <div className={`glass-square ${getGlassClass()} p-6 md:p-10 flex flex-col lg:flex-row ${project.reverse ? "lg:flex-row-reverse" : ""} gap-8 lg:gap-12 items-center text-left overflow-hidden relative group`}>
        {/* Text Description Column */}
        <div className="flex-1 flex flex-col justify-center min-h-[280px]">
          <div>
            {/* Metadata Header */}
            <div className="flex justify-between items-center mb-6 border-b border-theme-text/10 pb-4">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">
                {project.number} / {t.featuredProjectLabel}
              </span>
            </div>

            <h2 className="font-maghfirea text-[clamp(1.8rem,4vw,3rem)] text-theme-text tracking-wide mb-4 leading-tight">
              {project.title}
            </h2>

            <p className="font-mono text-[10px] md:text-[12px] leading-relaxed text-theme-text/70 mb-6">
              {t[project.descriptionKey]}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpen}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-widest hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              {t.openProjectLabel}
              <ArrowRight size={12} strokeWidth={2.5} />
            </button>

            {project.showGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-theme-text/5 hover:bg-theme-text/10 text-theme-text border border-theme-text/15 font-mono text-[10px] font-bold tracking-widest active:scale-[0.98] transition-all duration-200"
              >
                <Github size={12} />
                {t.sourceCodeLabel}
              </a>
            )}
          </div>
        </div>

        {/* Preview Column — vertically centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[520px]">
            <ProjectPreview
              onClick={handleOpen}
              layoutId={project.layoutId}
              bgColor={project.bgColor}
              hoverLabel={t.openProjectHover}
            >
              <Suspense fallback={null}>
                {project.id === "vortex" ? (
                  <Vortex isPreview={true} />
                ) : project.id === "soccer" ? (
                  <SoccerTeam isPreview={true} isCardPreview={true} />
                ) : (
                  <NoodlePlace isPreview={true} isCardPreview={true} />
                )}
              </Suspense>
            </ProjectPreview>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// 6. Preview Modal Overlay (Memoized)
interface PreviewModalProps {
  onClose: () => void;
  layoutId: string;
  bgColor: string;
  children: React.ReactNode;
}

export const PreviewModal = React.memo(({ onClose, layoutId, bgColor, children }: PreviewModalProps) => {
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fallback timer: in case onLayoutAnimationComplete doesn't fire for some reason
    const fallbackTimer = setTimeout(() => {
      setIsLayoutComplete(true);
    }, 850);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (isLayoutComplete) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLayoutComplete]);

  const isLightBg = bgColor === "#FAFAF8";
  const textColorClass = isLightBg ? "text-slate-800" : "text-stone-200";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
      onClick={onClose}
    >
      <div
        className="w-full h-full max-w-[1280px] max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          layoutId={layoutId}
          transition={{ type: "spring", stiffness: 180, damping: 25 }}
          onLayoutAnimationComplete={() => {
            setIsLayoutComplete(true);
          }}
          className="w-full h-full border border-white/10 overflow-y-auto no-scrollbar cursor-default relative"
          style={{ borderRadius: 28, transform: "translate3d(0,0,0)", backgroundColor: bgColor }}
          data-lenis-prevent
        >
          <AnimatePresence mode="wait">
            {!isLayoutComplete ? (
              <div key="blank" className="w-full h-full" />
            ) : isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center select-none p-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className={`w-8 h-8 rounded-full border-2 border-t-transparent ${isLightBg ? 'border-[#12224A]' : 'border-orange-500'}`}
                />
                <div className={`mt-6 font-mono text-[9px] tracking-[0.25em] uppercase ${textColorClass} opacity-60 text-center`}>
                  // INITIALIZING PROJECT PREVIEW
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[120] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center font-mono text-[10px] tracking-wider cursor-pointer transition-all duration-300 shadow-md"
          title="Close Preview (Esc)"
        >
          ESC
        </button>
      </div>
    </motion.div>
  );
});


// 7. Main Portfolio Component
interface PortfolioProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Portfolio({ lang, setLang }: PortfolioProps) {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  const getGlassClass = useCallback(() => "glass-deep-blur", []);

  const t = TRANSLATIONS[lang];

  const portfolioRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: portfolioRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  // Unified ESC key listener to close preview modals
  useEffect(() => {
    if (!activeModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeModal]);

  // Lock background scroll when modal is active
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (activeModal) {
      document.documentElement.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.documentElement.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [activeModal]);

  const headerText = t.portfolioTitle;

  const titleScale = isMobile ? 0.8 : 0.55;
  const titleOpacity = 1;

  const inviteOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const inviteY = useTransform(smoothProgress, [0, 0.1], ["0px", "15px"]);

  // Stable callbacks for modal operations to prevent child re-renders
  const handleOpen = useCallback((key: ModalKey) => {
    setActiveModal(key);
  }, []);

  const handleClose = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <div id="portfolio" ref={portfolioRef} className="w-full bg-theme-bg text-theme-text border-t-80 border-theme-text relative selection:bg-theme-text selection:text-theme-bg">

      {/* Split Layout */}
      <div className="flex flex-col md:flex-row w-full">

        {/* Left Column: Sticky Title */}
        <div className="w-full md:w-[38%] md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-theme-text/10 py-16 md:py-0 relative">

          <motion.div
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="text-center px-6 cursor-default select-none"
          >
            <MorphingTitle text={headerText} isReady={isReady} />
          </motion.div>

          <motion.p
            key={`intro-${lang}`}
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-theme-text/60 max-w-sm leading-relaxed mt-6 text-center px-6"
          >
            {t.portfolioIntro}
          </motion.p>

          <motion.div
            style={{ opacity: inviteOpacity, y: inviteY }}
            className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2.5 pointer-events-auto"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-theme-text/60">
                {t.scrollLabel}
              </span>
              <div className="w-[1.5px] h-[22px] bg-theme-text/20 relative overflow-hidden">
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-theme-text/80 h-full w-full"
                  style={{ originY: 0 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Scrollable Projects */}
        <div className="w-full md:w-[62%]">
          {isReady && (
            <div className="flex flex-col">
              {FEATURED_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="min-h-[80vh] md:min-h-screen flex items-center justify-center p-6 md:p-10 lg:p-16"
                >
                  <FeaturedCard
                    project={project}
                    t={t}
                    onOpen={handleOpen}
                    getGlassClass={getGlassClass}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Shared Overlay Modal for Project Previews */}
      <AnimatePresence>
        {activeModal && (
          <PreviewModal
            onClose={handleClose}
            layoutId={
              activeModal === "vortex"
                ? "vortex-sandbox-card"
                : activeModal === "soccer"
                ? "soccer-team-card"
                : activeModal === "noodle"
                ? "noodle-place-card"
                : "sf-animation-card"
            }
            bgColor={
              activeModal === "vortex"
                ? "#141212"
                : activeModal === "soccer"
                ? "#FAFAF8"
                : "#121212"
            }
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-[0.2em] text-theme-text/30">loading preview...</div>}>
              {activeModal === "vortex" ? (
                <Vortex isPreview={true} startUnlocked={true} />
              ) : activeModal === "soccer" ? (
                <SoccerTeam isPreview={true} />
              ) : (
                <NoodlePlace isPreview={true} />
              )}
            </Suspense>
          </PreviewModal>
        )}
      </AnimatePresence>

    </div>
  );
}
