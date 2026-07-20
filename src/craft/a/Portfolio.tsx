import "./nocturne.css";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Github, ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "../../data/translations";
import { MaskRiseTitle } from "../../components/MaskRiseTitle";
import { FEATURED_PROJECTS, ProjectPreview, type ModalKey, type FeaturedProject } from "../../pages/Portfolio";
import { SPRING_MORPH, useMotionPrefs } from "../../lib/motion";

const Vortex = React.lazy(() => import("../../pages/Vortex"));
const SoccerTeam = React.lazy(() => import("../../pages/SoccerTeam"));
const NoodlePlace = React.lazy(() => import("../../pages/NoodlePlace"));

const BG_COLOR: Record<ModalKey, string> = {
  vortex: "#141212",
  soccer: "#FAFAF8",
  noodle: "#121212",
};

function ProjectBody({ id, isCardPreview = false, startUnlocked = false }: { id: ModalKey; isCardPreview?: boolean; startUnlocked?: boolean }) {
  if (id === "vortex") return <Vortex isPreview startUnlocked={startUnlocked} />;
  if (id === "soccer") return <SoccerTeam isPreview isCardPreview={isCardPreview} />;
  return <NoodlePlace isPreview isCardPreview={isCardPreview} />;
}

// Opacity-only card reveal — the "given silence" deletion: no y-slide, the
// card is simply present once the room has lit its way to it.
const FeaturedCard = React.memo(({ project, t, onOpen }: { project: FeaturedProject; t: any; onOpen: (key: ModalKey) => void }) => {
  const handleOpen = useCallback(() => onOpen(project.id), [project.id, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-12 defer-render"
    >
      <div className={`glass-square glass-deep-blur p-6 md:p-10 flex flex-col lg:flex-row ${project.reverse ? "lg:flex-row-reverse" : ""} gap-8 lg:gap-12 items-center text-left overflow-hidden relative group`}>
        <div className="flex-1 flex flex-col justify-center min-h-[280px]">
          <div>
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

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[520px]">
            <ProjectPreview onClick={handleOpen} layoutId={project.layoutId} bgColor={project.bgColor} hoverLabel={t.openProjectHover}>
              <Suspense fallback={null}>
                <ProjectBody id={project.id} isCardPreview={project.id !== "vortex"} />
              </Suspense>
            </ProjectPreview>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Direction A's own modal: the staged close (content fades, then the morph
// reverses, then the backdrop lifts) that the pristine PreviewModal doesn't do.
function NocturnePreviewModal({
  onRequestClose,
  isClosing,
  layoutId,
  bgColor,
  children,
}: {
  onRequestClose: () => void;
  isClosing: boolean;
  layoutId: string;
  bgColor: string;
  children: React.ReactNode;
}) {
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    const fallback = setTimeout(() => setIsLayoutComplete(true), 850);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: reduced ? { duration: 0.15 } : { delay: 0.42, duration: 0.3 } }}
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-hidden cursor-pointer"
      onClick={onRequestClose}
    >
      <div className="w-full h-full max-w-[1280px] max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
        <motion.div
          layoutId={layoutId}
          transition={SPRING_MORPH}
          onLayoutAnimationComplete={() => setIsLayoutComplete(true)}
          className="w-full h-full border border-white/10 overflow-y-auto no-scrollbar cursor-default relative"
          style={{ borderRadius: 28, transform: "translate3d(0,0,0)", backgroundColor: bgColor }}
          data-lenis-prevent
        >
          <motion.div
            animate={{ opacity: isClosing ? 0 : isLayoutComplete ? 1 : 0 }}
            transition={{ duration: isClosing ? 0.18 : 0.4 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </motion.div>

        <button
          onClick={onRequestClose}
          className="absolute top-6 right-6 z-[120] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center font-mono text-[10px] tracking-wider cursor-pointer transition-all duration-300 shadow-md"
          title="Close Preview (Esc)"
        >
          ESC
        </button>
      </div>
    </motion.div>
  );
}

interface PortfolioProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Portfolio({ lang }: PortfolioProps) {
  const [isReady, setIsReady] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const handleOpen = useCallback((key: ModalKey) => {
    setIsClosing(false);
    setActiveModal(key);
  }, []);

  const handleRequestClose = useCallback(() => {
    setIsClosing(true);
    const delay = reduced ? 0 : 180;
    setTimeout(() => {
      setActiveModal(null);
      setIsClosing(false);
    }, delay);
  }, [reduced]);

  useEffect(() => {
    if (!activeModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleRequestClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [activeModal, handleRequestClose]);

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

  return (
    <div id="portfolio" ref={portfolioRef} className="w-full bg-transparent text-theme-text relative selection:bg-theme-text selection:text-theme-bg craft-a-spotlight-dim">
      <motion.div
        animate={{ opacity: activeModal ? 0.4 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row w-full"
      >
        <div className="w-full md:w-[38%] md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center py-16 md:py-0 px-6">
          <MaskRiseTitle
            text={t.portfolioTitle}
            isReady={isReady}
            className="font-maghfirea text-[clamp(2.3rem,8vw,5.5rem)] leading-[0.95] text-center select-none"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-theme-text/60 max-w-sm leading-relaxed mt-6 text-center px-6"
          >
            {t.portfolioIntro}
          </motion.p>
        </div>

        <div className="w-full md:w-[62%]">
          {isReady && (
            <div className="flex flex-col">
              {FEATURED_PROJECTS.map((project) => (
                <div key={project.id} className="min-h-[80vh] md:min-h-screen flex items-center justify-center p-6 md:p-10 lg:p-16">
                  <FeaturedCard project={project} t={t} onOpen={handleOpen} />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {activeModal && (
          <NocturnePreviewModal
            onRequestClose={handleRequestClose}
            isClosing={isClosing}
            layoutId={FEATURED_PROJECTS.find((p) => p.id === activeModal)!.layoutId}
            bgColor={BG_COLOR[activeModal]}
          >
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center font-mono text-[9px] tracking-[0.2em] text-theme-text/30">loading preview...</div>}>
              <ProjectBody id={activeModal} startUnlocked />
            </Suspense>
          </NocturnePreviewModal>
        )}
      </AnimatePresence>
    </div>
  );
}
