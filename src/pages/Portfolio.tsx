import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";

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

// Static project database
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

// Shared Preview: Scaled page thumbnail with unified hover (Memoized)
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

// Preview Modal Overlay (Memoized)
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

const BG_COLOR: Record<ModalKey, string> = {
  vortex: "#141212",
  soccer: "#F4EFE4",
  noodle: "#121212",
};

// Contents-index metadata not carried by FeaturedProject — reuses existing
// translated category labels rather than adding new ones.
type CategoryKey = "sandboxLabel" | "webDesignLabel" | "ramenLabel";
const PLATE_META: Record<ModalKey, { year: string; categoryKey: CategoryKey }> = {
  vortex: { year: "2024", categoryKey: "sandboxLabel" },
  soccer: { year: "2023", categoryKey: "webDesignLabel" },
  noodle: { year: "2024", categoryKey: "ramenLabel" },
};

function ProjectBody({ id, isCardPreview = false, startUnlocked = false }: { id: ModalKey; isCardPreview?: boolean; startUnlocked?: boolean }) {
  if (id === "vortex") return <Vortex isPreview startUnlocked={startUnlocked} />;
  if (id === "soccer") return <SoccerTeam isPreview isCardPreview={isCardPreview} />;
  return <NoodlePlace isPreview isCardPreview={isCardPreview} />;
}

interface IndexRowProps {
  project: FeaturedProject;
  t: (typeof TRANSLATIONS)["en"];
  isHovered: boolean;
  onHover: (id: ModalKey | null) => void;
  onOpen: (id: ModalKey) => void;
}

const IndexRow = React.memo(({ project, t, isHovered, onHover, onOpen }: IndexRowProps) => {
  const meta = PLATE_META[project.id];
  const handleOpen = useCallback(() => onOpen(project.id), [project.id, onOpen]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${t.openProjectLabel}: ${project.title}`}
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(project.id)}
      onBlur={() => onHover(null)}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      className={`group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 md:gap-8 py-6 md:py-7 border-b border-theme-bg/15 cursor-pointer transition-colors duration-300 focus-visible:outline-none ${isHovered ? "bg-theme-bg/[0.04]" : ""}`}
    >
      <span className="font-mono text-[11px] tracking-[0.2em] opacity-50">{project.number}</span>
      <h3 className="font-maghfirea text-[clamp(1.5rem,4.2vw,3rem)] leading-none tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-2">
        {project.title}
      </h3>
      <span className="col-span-2 md:col-span-1 font-mono text-[9px] tracking-[0.25em] uppercase opacity-45 md:text-right whitespace-nowrap">
        {meta.year} · {t[meta.categoryKey]}
      </span>
    </div>
  );
});

interface PortfolioProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Portfolio({ lang }: PortfolioProps) {
  const [isReady, setIsReady] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [hoveredId, setHoveredId] = useState<ModalKey | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const t = TRANSLATIONS[lang];

  usePlateStrike(titleRef, isReady);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!activeModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeModal]);

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

  const handleOpen = useCallback((key: ModalKey) => setActiveModal(key), []);
  const handleClose = useCallback(() => setActiveModal(null), []);

  const hoveredProject = hoveredId ? FEATURED_PROJECTS.find((p) => p.id === hoveredId) ?? null : null;
  const activeProject = activeModal ? FEATURED_PROJECTS.find((p) => p.id === activeModal)! : null;

  return (
    <div
      id="portfolio"
      className="w-full relative bg-theme-text text-theme-bg selection:bg-theme-bg selection:text-theme-text overflow-hidden"
    >

      <div className="flex flex-col md:flex-row w-full">
        {/* Left: masthead */}
        <div className="w-full md:w-[36%] md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-theme-bg/15 py-16 md:py-0 px-6 relative z-10">
          <h2
            ref={titleRef}
            className="plate-strike font-maghfirea text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] text-center"
          >
            <SplitLine text={t.portfolioTitle} />
          </h2>
          <p className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase opacity-60 max-w-sm leading-relaxed mt-6 text-center px-6">
            {t.portfolioIntro}
          </p>
          <span className="font-mono text-[9px] tracking-[0.35em] uppercase opacity-40 mt-10 border-t border-theme-bg/15 pt-4">
            {t.broadsheetContentsLabel}
          </span>
        </div>

        {/* Right: numbered contents index + margin preview */}
        <div className="w-full md:w-[64%] px-6 md:px-12 lg:px-16 py-16 md:py-24 relative z-10">
          {isReady && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10 md:gap-14 items-start">
              <div className="flex flex-col border-t border-theme-bg/15">
                {FEATURED_PROJECTS.map((project) => (
                  <IndexRow
                    key={project.id}
                    project={project}
                    t={t}
                    isHovered={hoveredId === project.id}
                    onHover={setHoveredId}
                    onOpen={handleOpen}
                  />
                ))}
              </div>

              <div className="hidden md:block sticky top-32">
                <AnimatePresence mode="wait">
                  {hoveredProject ? (
                    <motion.div
                      key={hoveredProject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <ProjectPreview
                        onClick={() => handleOpen(hoveredProject.id)}
                        layoutId={hoveredProject.layoutId}
                        bgColor={hoveredProject.bgColor}
                        hoverLabel={t.openProjectHover}
                      >
                        <Suspense fallback={null}>
                          <ProjectBody id={hoveredProject.id} isCardPreview={hoveredProject.id !== "vortex"} />
                        </Suspense>
                      </ProjectPreview>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full aspect-[16/10] border border-theme-bg/15 flex items-center justify-center"
                    >
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-30">
                        {t.broadsheetContentsLabel}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeModal && activeProject && (
          <PreviewModal onClose={handleClose} layoutId={activeProject.layoutId} bgColor={BG_COLOR[activeModal]}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-[0.2em] text-theme-text/30">loading preview...</div>}>
              <ProjectBody id={activeModal} startUnlocked />
            </Suspense>
          </PreviewModal>
        )}
      </AnimatePresence>
    </div>
  );
}
