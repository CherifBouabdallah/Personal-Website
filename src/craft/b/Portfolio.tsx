import "./broadsheet.css";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { TRANSLATIONS } from "../../data/translations";
import SplitLine from "../shared/SplitLine";
import Grain from "../shared/Grain";
import { BroadsheetFrame } from "./chrome";
import { usePlateStrike, useSectionSnap } from "./broadsheetMotion";
import {
  FEATURED_PROJECTS,
  ProjectPreview,
  PreviewModal,
  type ModalKey,
  type FeaturedProject,
} from "../../pages/Portfolio";

const Vortex = React.lazy(() => import("../../pages/Vortex"));
const SoccerTeam = React.lazy(() => import("../../pages/SoccerTeam"));
const NoodlePlace = React.lazy(() => import("../../pages/NoodlePlace"));

const BG_COLOR: Record<ModalKey, string> = {
  vortex: "#141212",
  soccer: "#FAFAF8",
  noodle: "#121212",
};

// Contents-index metadata not carried by FEATURED_PROJECTS (which pristine
// Portfolio owns) — kept local to this file, reusing existing translated
// category labels rather than adding new ones.
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const t = TRANSLATIONS[lang];

  useSectionSnap(sectionRef);
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
      ref={sectionRef}
      className="w-full relative bg-theme-text text-theme-bg selection:bg-theme-bg selection:text-theme-text overflow-hidden"
    >
      <Grain variant="paper" />
      <BroadsheetFrame folioLeft="N.02" folioRight={t.portfolio} runningHead={t.broadsheetRunningHead} />

      <div className="flex flex-col md:flex-row w-full">
        {/* Left: masthead */}
        <div className="w-full md:w-[36%] md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-theme-bg/15 py-16 md:py-0 px-6 relative z-10">
          <h2
            ref={titleRef}
            className="craft-b-plate-strike font-maghfirea text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] text-center select-none"
          >
            <SplitLine text={t.portfolioTitle} by="word" />
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
