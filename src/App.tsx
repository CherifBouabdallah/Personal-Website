/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, Suspense, lazy, ComponentType, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MainPage from "./pages/MainPage";
import LiquidNavbar from "./components/LiquidNavbar";
import Lenis from "lenis";
import { EASE_ENTER, ARRIVAL_SETTLE_MS, ARRIVAL_CONTRACT_MS, useMotionPrefs } from "./lib/motion";
import { bridgeLenisToScrollTrigger } from "./lib/gsapSetup";

// Static routes config to prevent recreation on every render
const SCROLLABLE_ROUTES = new Set(["/", "/vortex", "/portfolio", "/contact", "/soccer-team", "/noodle-place"]);
const NAVBAR_HIDDEN_ROUTES = new Set(["/vortex", "/soccer-team", "/noodle-place", "/secret101"]);

// Helper to support preloading on lazy components
function lazyWithPreload<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const Component = lazy(importFunc);
  (Component as any).preload = importFunc;
  return Component as typeof Component & { preload: () => Promise<any> };
}

// Lazy load pages with preload hooks
const Vortex = lazyWithPreload(() => import("./pages/Vortex"));
const SoccerTeam = lazyWithPreload(() => import("./pages/SoccerTeam"));
const NoodlePlace = lazyWithPreload(() => import("./pages/NoodlePlace"));
const NotFound = lazyWithPreload(() => import("./pages/NotFound"));
const Secret101 = lazyWithPreload(() => import("./pages/Secret101"));

type Language = "en" | "fr";

type PreloaderPhase = "loading" | "settling" | "contracting";

export default function App() {
  return <AppInner />;
}

function AppInner() {
  const [progress, setProgress] = useState(0);
  const [isSiteReady, setIsSiteReady] = useState(false);
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const { reduced } = useMotionPrefs();
  const location = useLocation();

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred-lang");
    return (saved === "en" || saved === "fr") ? saved : "en";
  });

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    localStorage.setItem("preferred-lang", lang);
  }, [lang]);

  // Stable language setter callback to prevent children re-renders
  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang);
  }, []);

  const fontsLoadedRef = useRef(false);
  const imagesLoadedRef = useRef(false);

  useEffect(() => {
    // Fonts load check
    document.fonts.ready.then(() => {
      fontsLoadedRef.current = true;
    });

    // Streamlined preloading of heavy images using Promise.all
    const imagesToPreload = ["/OG2.webp"];
    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Avoid blocking on failure
      });

    Promise.all(imagesToPreload.map(preloadImage)).then(() => {
      imagesLoadedRef.current = true;
    });

    // Idle-Time Preloading for lazy loaded page JS chunks only.
    // Their images are intentionally NOT prefetched here — each page
    // loads its own images on demand when actually visited.
    const preloadPages = () => {
      Vortex.preload();
      SoccerTeam.preload();
      NoodlePlace.preload();
      NotFound.preload();
      Secret101.preload();
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(preloadPages);
    } else {
      setTimeout(preloadPages, 1500);
    }
  }, []);

  // Simplified and consolidated progress animation loop
  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: number;
    let currentProgress = 0;

    const updateProgress = () => {
      const loaded = fontsLoadedRef.current && imagesLoadedRef.current;
      const target = loaded ? 100 : 90;

      if (currentProgress < target) {
        const diff = target - currentProgress;
        const speed = loaded ? 0.08 : 0.015; // Slow crawl up to 90%, fast sweep to 100%
        const step = Math.max(0.08, diff * speed);
        currentProgress = Math.min(target, currentProgress + step);
        setProgress(currentProgress);
      }

      if (currentProgress >= 100) {
        if (reduced) {
          timeoutId = window.setTimeout(() => setIsSiteReady(true), 300);
        } else {
          // Arrival: label settles -> bar contracts -> dissolves into the navbar.
          setPhase("settling");
          timeoutId = window.setTimeout(() => {
            setPhase("contracting");
            timeoutId = window.setTimeout(() => {
              setIsSiteReady(true);
            }, ARRIVAL_CONTRACT_MS);
          }, ARRIVAL_SETTLE_MS);
        }
        return;
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Initialize Lenis smooth scroll on mount / when site is ready. Snappier,
  // more decisive feel: shorter duration, a confident quint-out curve,
  // punchier wheel response.
  useEffect(() => {
    if (!isSiteReady) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 5), // easeOutQuint
      wheelMultiplier: 1.15,
      smoothWheel: true,
    });

    (window as any).__lenis = lenis;
    bridgeLenisToScrollTrigger();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).__lenis = undefined;
    };
  }, [isSiteReady]);

  const isScrollable = SCROLLABLE_ROUTES.has(location.pathname);
  const showNavbar = !NAVBAR_HIDDEN_ROUTES.has(location.pathname);

  return (
    <div className={`relative flex min-h-screen bg-theme-bg items-stretch justify-stretch ${isScrollable ? "overflow-y-visible" : "overflow-hidden"}`}>
      <AnimatePresence mode="wait">
        {!isSiteReady && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_ENTER }}
            className="fixed inset-0 w-full h-full bg-theme-bg z-[999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={phase === "loading" ? { opacity: [0.3, 0.8, 0.3] } : { opacity: 0.8 }}
              transition={phase === "loading" ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
              className="font-mono text-xs md:text-sm tracking-[0.45em] uppercase text-theme-text/80 text-center px-4"
            >
              CHERIF BOUABDALLAH
            </motion.div>
            <div className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase text-theme-text/30 text-center px-4">
              loading ...
            </div>
            {/* Minimalist luxury loading status bar */}
            <div
              className="mt-6 h-[1px] bg-theme-text/10 relative overflow-hidden transition-[width] duration-300 ease-out"
              style={{ width: phase === "contracting" ? "24px" : "160px" }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-theme-text/70"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSiteReady && (
        location.pathname === "/secret101" ? (
          <Suspense fallback={null}>
            <Routes>
              <Route path="/secret101" element={<Secret101 />} />
            </Routes>
          </Suspense>
        ) : (
          <div className="w-full min-h-screen relative flex flex-col items-stretch justify-start">
            {/* Liquid Navbar at top middle */}
            <AnimatePresence>
              {showNavbar && (
                <motion.div
                  key="navbar-wrapper"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: EASE_ENTER }}
                  className="fixed top-6 md:top-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
                >
                  <LiquidNavbar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    className="pointer-events-auto"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <Suspense fallback={null}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <MainPage
                      lang={lang}
                      setLang={handleSetLang}
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                    />
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <MainPage
                      lang={lang}
                      setLang={handleSetLang}
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <MainPage
                      lang={lang}
                      setLang={handleSetLang}
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                    />
                  }
                />
                <Route path="/vortex" element={<Vortex />} />
                <Route path="/soccer-team" element={<SoccerTeam />} />
                <Route path="/noodle-place" element={<NoodlePlace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        )
      )}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
