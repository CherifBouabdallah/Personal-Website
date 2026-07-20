import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Github, ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "../../data/translations";
import { gsap, ScrollTrigger } from "../shared/gsapSetup";
import { EASE_ENTER, useMotionPrefs } from "../../lib/motion";
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

function ProjectBody({ id, isCardPreview = false, startUnlocked = false }: { id: ModalKey; isCardPreview?: boolean; startUnlocked?: boolean }) {
  if (id === "vortex") return <Vortex isPreview startUnlocked={startUnlocked} />;
  if (id === "soccer") return <SoccerTeam isPreview isCardPreview={isCardPreview} />;
  return <NoodlePlace isPreview isCardPreview={isCardPreview} />;
}

interface SlideProps {
  project: FeaturedProject;
  t: any;
  onOpen: (key: ModalKey) => void;
  visualRef?: (el: HTMLDivElement | null) => void;
}

// One project's content, reused identically by both the desktop horizontal
// rail and the mobile/reduced-motion vertical stack.
const ProjectSlide = React.memo(({ project, t, onOpen, visualRef }: SlideProps) => {
  const handleOpen = useCallback(() => onOpen(project.id), [project.id, onOpen]);

  return (
    <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-center text-left px-2">
      <div className="flex flex-col gap-4 order-2 lg:order-1">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-45">
          {project.number} / {t.featuredProjectLabel}
        </span>
        <h3 className="font-maghfirea text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight">
          {project.title}
        </h3>
        <p className="font-mono text-[11px] md:text-[12px] leading-relaxed text-theme-text/70 max-w-md">
          {t[project.descriptionKey]}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
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

      <div ref={visualRef} className="order-1 lg:order-2 w-full will-change-transform">
        <ProjectPreview onClick={handleOpen} layoutId={project.layoutId} bgColor={project.bgColor} hoverLabel={t.openProjectHover}>
          <Suspense fallback={null}>
            <ProjectBody id={project.id} isCardPreview={project.id !== "vortex"} />
          </Suspense>
        </ProjectPreview>
      </div>
    </div>
  );
});

interface PortfolioProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

/**
 * Kinetic Canopy — Portfolio.
 *
 * The signature mechanic: vertical scroll drives a pinned horizontal rail of
 * the three projects (desktop only), each scaling up as it crosses the
 * viewport center. Mobile and reduced-motion visitors get a plain vertical
 * stack instead — no pin, no hijack, ever.
 */
export default function Portfolio({ lang }: PortfolioProps) {
  const [isReady, setIsReady] = useState(false);
  const [isDesktopRail, setIsDesktopRail] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visualRefs = useRef<Map<ModalKey, HTMLDivElement>>(new Map());
  const { reduced, transition } = useMotionPrefs();

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  // Desktop rail vs. mobile/reduced-motion vertical stack — only one of the
  // two ever mounts, so there's never a duplicate layoutId in the DOM at once.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktopRail(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  // Section label reveal — the receiving half of Home's kinetic wordmark
  // hand-off: scales/fades in as this section approaches, timed to read as
  // continuous with Home's title scaling/fading out (see craft/c/Home.tsx).
  useEffect(() => {
    const label = labelRef.current;
    if (!label) return;

    if (reduced) {
      gsap.set(label, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        label,
        { opacity: 0, scale: 0.55 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: label, start: "top 95%", end: "top 45%", scrub: 0.3 },
        }
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  // Horizontal rail: classic GSAP pin + scrub hijack. Track lives inside
  // #portfolio so the section's own offsetTop never shifts — only its
  // height grows for the pinned duration, which ScrollTrigger accounts for.
  // Torn down completely on breakpoint change / unmount so no orphaned pin
  // survives a craft-variant switch or a resize below md.
  useEffect(() => {
    if (!isReady || !isDesktopRail) return;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(track.scrollWidth - wrapper.clientWidth, 0);

      const mainTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      FEATURED_PROJECTS.forEach((project) => {
        const visual = visualRefs.current.get(project.id);
        if (!visual) return;
        gsap.set(visual, { scale: 0.82 });
        ScrollTrigger.create({
          trigger: visual,
          containerAnimation: mainTween,
          start: "left right",
          end: "right left",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            const scale = 0.82 + (1 - Math.abs(p - 0.5) * 2) * 0.18;
            gsap.set(visual, { scale });
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, wrapper);

    return () => ctx.revert();
  }, [isReady, isDesktopRail]);

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
  const activeProject = activeModal ? FEATURED_PROJECTS.find((p) => p.id === activeModal)! : null;

  return (
    <div id="portfolio" className="w-full bg-transparent text-theme-text relative selection:bg-theme-text selection:text-theme-bg">
      <div ref={labelRef} className="w-full flex flex-col items-center gap-4 pt-20 pb-14 md:pt-28 md:pb-20 px-6 will-change-transform">
        <h2 className="font-maghfirea text-[clamp(2.2rem,7vw,5rem)] leading-none text-center select-none">
          {t.portfolioTitle}
        </h2>
        <p className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-theme-text/60 max-w-sm text-center leading-relaxed">
          {t.portfolioIntro}
        </p>
      </div>

      {isReady && (
        isDesktopRail ? (
          <div ref={wrapperRef} className="relative h-screen w-full overflow-hidden">
            <div ref={trackRef} className="flex h-full will-change-transform">
              {FEATURED_PROJECTS.map((project) => (
                <div key={project.id} className="flex-none w-screen h-full flex items-center justify-center px-[5vw]">
                  <ProjectSlide
                    project={project}
                    t={t}
                    onOpen={handleOpen}
                    visualRef={(el) => {
                      if (el) visualRefs.current.set(project.id, el);
                      else visualRefs.current.delete(project.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-20 md:gap-28 px-6 py-10 md:py-16">
            {FEATURED_PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={transition({ duration: 0.8, ease: EASE_ENTER })}
              >
                <ProjectSlide project={project} t={t} onOpen={handleOpen} />
              </motion.div>
            ))}
          </div>
        )
      )}

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
