import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dev() {
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const [islandTab, setIslandTab] = useState<"music" | "system">("music");
  const [isPlaying, setIsPlaying] = useState(true);
  const [musicProgress, setMusicProgress] = useState(35);
  const [activeWallpaper, setActiveWallpaper] = useState<"sunset" | "lunar" | "aurora">("sunset");

  // Dynamic ticking time
  const [timeStr, setTimeStr] = useState("17:20");
  const [dateStr, setDateStr] = useState("Monday, June 1");

  // Simulated metrics
  const [cpuLoad, setCpuLoad] = useState(12);
  const [memLoad, setMemLoad] = useState(7.4);

  const navigate = useNavigate();

  // Dynamic font and style inject
  useEffect(() => {
    // Fonts load
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Geist+Mono:wght@100..900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // CSS Keyframe styles
    const style = document.createElement("style");
    style.innerHTML = `
      .vortex-font-bricolage {
        font-family: 'Bricolage Grotesque', sans-serif;
      }
      .vortex-font-sans {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      .vortex-font-mono {
        font-family: 'Geist Mono', monospace;
      }
      @keyframes gear-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-gear-spin {
        animation: gear-spin 8s linear infinite;
      }
      .group:hover .animate-gear-spin-hover {
        animation: gear-spin 2s linear infinite;
      }
      @keyframes shimmer-slide {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .shimmer-pulse {
        background: linear-gradient(90deg, rgba(253,251,247,0.15) 0%, rgba(253,251,247,0.6) 50%, rgba(253,251,247,0.15) 100%);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: shimmer-slide 3s linear infinite;
      }
      .gooey-filter-container {
        filter: url(#gooey-filter-effect);
      }
      @keyframes bell-shake {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(14deg); }
        30% { transform: rotate(-14deg); }
        45% { transform: rotate(9deg); }
        60% { transform: rotate(-9deg); }
        75% { transform: rotate(4deg); }
        90% { transform: rotate(-4deg); }
      }
      .group:hover .bell-animate {
        animation: bell-shake 0.8s ease-in-out;
      }
      @keyframes wave-ripple {
        0% { opacity: 0; transform: scale(0.85); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: scale(1.15); }
      }
      .wave-animate-1 { animation: wave-ripple 1.5s infinite 0s; }
      .wave-animate-2 { animation: wave-ripple 1.5s infinite 0.3s; }
      .wave-animate-3 { animation: wave-ripple 1.5s infinite 0.6s; }
    `;
    document.head.appendChild(style);
    setIsReady(true);

    // Dynamic ticking clock
    const clockInterval = setInterval(() => {
      const now = new Date();
      let hh = String(now.getHours()).padStart(2, "0");
      let mm = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hh}:${mm}`);

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`);
    }, 1000);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      clearInterval(clockInterval);
    };
  }, []);

  // Wallpaper themes
  const wallpaperThemes = {
    sunset: "bg-gradient-to-tr from-[#3b2318] via-[#1c120e] to-[#0c0807]",
    lunar: "bg-gradient-to-tr from-[#1f2937] via-[#111827] to-[#030712]",
    aurora: "bg-gradient-to-tr from-[#064e3b] via-[#022c22] to-[#020617]"
  };

  // Metric updates
  useEffect(() => {
    if (!isLocked && isIslandExpanded && islandTab === "system") {
      const interval = setInterval(() => {
        setCpuLoad(Math.floor(Math.random() * 15) + 5);
        setMemLoad(parseFloat((7.1 + Math.random() * 0.4).toFixed(1)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLocked, isIslandExpanded, islandTab]);

  // Audio duration updates
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isLocked) {
      interval = setInterval(() => {
        setMusicProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLocked]);

  return (
    <div className="w-full relative flex flex-col items-center min-h-screen bg-[#141212] text-[#FDFBF7] vortex-font-sans overflow-x-hidden select-none pb-24">
      {/* Background Override Overlay */}
      <div className="fixed inset-0 z-0 bg-[#141212] pointer-events-none" />

      {/* 1. MOCKUP VORTEX HEADER (Fixed top edge-to-edge nav) */}
      <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between border-b border-[#FDFBF7]/5 bg-[#1C1917]/85 backdrop-blur-md px-4 py-4.5 shadow-md z-30">
        {/* Logo element */}
        <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative mr-3 w-8 h-8 rounded-lg border-2 border-[#FDFBF7] overflow-hidden flex items-center justify-center bg-stone-950">
            {/* Sliding cover gradient */}
            <div className="absolute inset-[1.5px] rounded-[5px] bg-gradient-to-t from-orange-500/20 to-orange-500/90 transition-transform duration-500 ease-out group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-25" />
            {/* Logo SVG symbol */}
            <svg className="w-4 h-4 text-[#FDFBF7] z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="vortex-font-bricolage text-xl font-bold tracking-tight">Vortex</span>
        </div>

        {/* Nav links right */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Portfolio link */}
          <a href="/portfolio" onClick={(e) => { e.preventDefault(); navigate("/portfolio"); }} className="group flex items-center text-sm font-bold text-[#FDFBF7]/70 hover:text-[#FDFBF7] transition duration-300">
            <svg className="w-4.5 h-4.5 mr-1.5 fill-current transition-transform duration-300 group-hover:-rotate-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
            </svg>
            <span>Portfolio</span>
          </a>

          {/* GitHub Link Button with Arrow Slide */}
          <a 
            href="https://github.com/CherifBouabdallah"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-xl bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/15 px-4 py-2.5 text-xs sm:text-sm font-bold transition duration-300 overflow-hidden pl-10 pr-4 select-none h-11 border border-[#FDFBF7]/5 text-[#FDFBF7] decoration-none"
          >
            {/* GitHub icon left */}
            <div className="absolute left-3.5 transition-all duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-xs">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            {/* Centered label */}
            <div className="transition-transform duration-300 group-hover:-translate-x-3.5 whitespace-nowrap">
              View GitHub
            </div>
            {/* Arrow right sliding in */}
            <div className="absolute right-3.5 translate-x-full scale-x-50 opacity-0 blur-xs transition-all duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none text-[#F97316]">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Hire Cherif Button */}
          <button 
            onClick={() => navigate("/contact")}
            className="group relative inline-flex items-center justify-center rounded-xl bg-[#FDFBF7] text-stone-900 hover:bg-[#FDFBF7]/90 px-4 py-2.5 text-xs sm:text-sm font-bold transition duration-300 h-11 border border-[#FDFBF7]/10 cursor-pointer"
          >
            {/* Gear/Star SVG badge */}
            <svg className="mr-2 w-4 h-4 fill-current text-orange-500 animate-gear-spin-hover" viewBox="0 0 24 24">
              <path className="animate-gear-spin-hover origin-center gear-icon" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.11-1.03-.41-2.01-.91-2.92l1.64-1.64c.39-.39.39-1.02 0-1.41l-1.41-1.41c-.39-.39-1.02-.39-1.41 0l-1.64 1.64c-.91-.5-1.89-.8-2.92-.91V3.5c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1V5.7c-1.03.11-2.01.41-2.92.91L5.03 4.97c-.39-.39-1.02-.39-1.41 0L2.21 6.38c-.39.39-.39 1.02 0 1.41l1.64 1.64c-.5.91-.8 1.89-.91 2.92H1.5c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h1.44c.11 1.03.41 2.01.91 2.92l-1.64 1.64c-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0l1.64-1.64c.91.5 1.89.8 2.92.91v2.24c0 .55.45 1 1 1h2c.55 0 1-.45 1-1V18.3c1.03-.11 2.01-.41 2.92-.91l1.64 1.64c.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.02 0-1.41l-1.64-1.64c.5-.91.8-1.89.91-2.92h2.24c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1h-2.24z"/>
            </svg>
            <span>Hire Cherif</span>
            <span className="ml-2 rounded-md bg-stone-900 text-stone-100 text-[10px] px-1.5 py-0.5 tracking-wider uppercase font-bold">EPFL</span>
          </button>
        </div>
      </header>

      {/* Outer wrapper max-w container */}
      <div className="w-full max-w-[1440px] px-6 sm:px-12 md:px-16 flex flex-col items-center gap-16 relative z-10 pt-40">
        {/* ========================================================= */}
        {/* 2. HERO TITLE SECTION WITH THE SVG HANDDRAWN LOOP          */}
        {/* ========================================================= */}
        <section className="w-full max-w-4xl flex flex-col items-center gap-6 text-center">
          <h1 className="vortex-font-bricolage text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-center relative select-none">
            Vortex Sandbox
            <br />
            for {" "}
            <mark className="relative bg-transparent text-inherit inline-block overflow-visible px-2 sm:px-4">
              <span className="relative z-10">Devs</span>
              {/* Elegant hand-drawn highlighter loop circling 'Devs' */}
              <svg className="absolute -inset-1 sm:-inset-2 w-full h-full text-orange-500 overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none" fill="none">
                <motion.path 
                  d="M10,25 C15,10 40,5 85,12 C95,14 98,22 80,32 C60,40 25,38 12,30 C3,22 8,12 55,6 C75,3 90,8 96,12" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 1.8, ease: "easeInOut" }}
                />
              </svg>
            </mark>
          </h1>
          
          <p className="max-w-xl mx-auto text-base sm:text-lg text-[#FDFBF7]/60 leading-relaxed font-medium">
            An interactive creative tech sandbox showcasing high-performance web engineering. Test custom spring models, gooey filters, keyframe physics, and dynamic HUD widgets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button onClick={() => setIsLocked(false)} className="group relative inline-flex items-center justify-center rounded-2xl bg-[#FDFBF7] text-stone-950 font-bold px-7 py-4 text-base transition duration-300 shadow-xl shadow-orange-950/20 hover:scale-[1.02] pl-14 cursor-pointer">
              <div className="absolute left-5 transition-all duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 13H5v-2h14v2z" />
                </svg>
              </div>
              <div className="transition-transform duration-300 group-hover:-translate-x-4">
                Unlock Sandbox
              </div>
              <div className="absolute right-5 translate-x-full scale-x-50 opacity-0 blur-xs transition-all duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none text-orange-500">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            <button onClick={() => navigate("/contact")} className="group relative inline-flex items-center justify-center rounded-2xl bg-[#FDFBF7]/10 text-[#FDFBF7] font-bold px-6 py-4 text-base transition duration-300 border border-[#FDFBF7]/10 hover:bg-[#FDFBF7]/15 cursor-pointer">
              <svg className="mr-2.5 w-5 h-5 fill-current text-orange-500 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span>Get In Touch</span>
              <span className="ml-2 rounded-lg bg-stone-950 px-2 py-0.5 text-xs text-[#FDFBF7]/80">EPFL</span>
            </button>
          </div>

          {/* Interactive instruction cue */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-[#FDFBF7]/30 select-none">
            <svg className="w-3.5 h-3.5 fill-current animate-bounce" viewBox="0 0 24 24">
              <path d="M19 15l-1.41-1.41-5.59 5.59V3h-2v16.17l-5.59-5.59L3 15l9 9 9-9z" />
            </svg>
            <span>Psst… it's interactive! Try unlocking the sandbox</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. INTERACTIVE MACOS DESKTOP WINDOW SHOWCASE               */}
        {/* ========================================================= */}
        <section className="w-full flex justify-center">
          <div className="w-full max-w-[1150px] aspect-[16/10] rounded-[28px] sm:rounded-[36px] border-4 border-stone-800 bg-stone-950 overflow-hidden relative shadow-2xl transition-all duration-700">
            {/* Custom Wallpapers */}
            <div className={`absolute inset-0 transition-all duration-700 ${wallpaperThemes[activeWallpaper]}`} />

            {/* Aurora blur radial overlays for custom desktop feels */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Lock Screen View overlay */}
            <AnimatePresence>
              {isLocked && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-between p-6 sm:p-12 cursor-pointer"
                  onClick={() => setIsLocked(false)}
                >
                  {/* Status header */}
                  <div className="w-full flex items-center justify-between text-xs font-semibold text-[#FDFBF7]/60">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.17 19.58 10.53 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                      <span>Vortex LAN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>87%</span>
                      <div className="w-6 h-3.5 border border-[#FDFBF7]/50 rounded-sm p-[1px] flex items-center">
                        <div className="h-full w-4/5 bg-[#FDFBF7] rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Main Time and Weather Widget */}
                  <div className="flex flex-col items-center text-center gap-4">
                    <span className="text-stone-300/80 text-sm font-semibold tracking-wider uppercase select-none">{dateStr}</span>
                    <h2 className="text-6xl sm:text-8xl font-bold tracking-tight text-[#FDFBF7]/90 select-none tabular-nums">{timeStr}</h2>
                    
                    {/* Weather dock widget */}
                    <div className="flex items-center gap-3 bg-stone-900/60 border border-[#FDFBF7]/10 rounded-2xl px-4 py-2 mt-2 backdrop-blur-md">
                      <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1s-1 .45-1 1v1c0 .55.45 1 1 1zm0 20c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1zm10-10c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1zM4 12c0-.55-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1zm14.36-6.95c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l.71.71c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-.71-.71zm-12.02 12c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l.71.71c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-.71-.71z"/>
                      </svg>
                      <span className="text-xs font-bold text-[#FDFBF7]/80">Paris</span>
                      <span className="w-[1px] h-3 bg-[#FDFBF7]/20" />
                      <span className="text-xs font-bold tracking-wide text-orange-400">24° Work</span>
                    </div>
                  </div>

                  {/* Press to unlock shimmer button */}
                  <div className="shimmer-text text-xl font-bold uppercase tracking-widest pb-4 select-none">
                    Press to unlock
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unlocked Desktop View */}
            <div className="absolute inset-0 flex flex-col justify-between">
              
              {/* macOS Menu bar */}
              <div className="w-full h-8 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 text-[11px] font-medium text-stone-200 select-none z-10">
                <div className="flex items-center gap-4">
                  <svg className="w-3.5 h-3.5 text-[#FDFBF7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span className="font-bold">Vortex OS</span>
                  <span className="hidden sm:inline opacity-70">Engine</span>
                  <span className="hidden sm:inline opacity-70">Simulation</span>
                  <span className="hidden sm:inline opacity-70">Performance</span>
                  <span className="hidden sm:inline opacity-70">Logs</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="opacity-80 font-semibold">{timeStr}</span>
                  <button onClick={() => setIsLocked(true)} className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] font-bold uppercase transition">
                    Lock
                  </button>
                </div>
              </div>

              {/* Dynamic Island Notch Component */}
              <div className="flex-1 flex flex-col items-center justify-start pt-8 relative">
                
                {/* Simulated Dynamic Island notch */}
                <div className="relative z-30">
                  <motion.div 
                    layout
                    id="dev-dynamic-island"
                    className="bg-black/95 text-stone-100 border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-[24px] cursor-pointer"
                    style={{ transformOrigin: "top center" }}
                    initial={{ width: 130, height: 28 }}
                    animate={isIslandExpanded ? { width: 320, height: 168, borderRadius: 28 } : { width: 130, height: 28, borderRadius: 18 }}
                    onClick={() => setIsIslandExpanded(!isIslandExpanded)}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <AnimatePresence mode="wait">
                      {!isIslandExpanded ? (
                        <motion.div 
                           key="island-collapsed"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.15 }}
                           className="w-full h-full flex items-center justify-between px-3 text-[9px]"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="font-mono tracking-widest text-orange-500 font-bold">VORTEX</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[#FDFBF7]/40 font-mono">
                            {isPlaying && (
                              <span className="flex items-end gap-[1px] h-2">
                                <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.4s_infinite]" style={{ height: '100%' }} />
                                <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.6s_infinite_0.1s]" style={{ height: '60%' }} />
                                <span className="w-[1.5px] bg-orange-500 animate-[pulse_0.5s_infinite_0.2s]" style={{ height: '80%' }} />
                              </span>
                            )}
                            <span>{isPlaying ? "ON" : "OFF"}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="island-expanded"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                          className="w-full h-full p-4 flex flex-col justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Expanded Header Tab Selector */}
                          <div className="flex justify-between items-center pb-2 border-b border-white/5 select-none">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setIslandTab("music")}
                                className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded transition-colors ${islandTab === "music" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white/70"}`}
                              >
                                🎵 PLAYER
                              </button>
                              <button 
                                onClick={() => setIslandTab("system")}
                                className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded transition-colors ${islandTab === "system" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white/70"}`}
                              >
                                📊 SYSTEM
                              </button>
                            </div>
                            <button 
                              onClick={() => setIsIslandExpanded(false)} 
                              className="text-white/30 hover:text-white text-[9px] font-mono"
                            >
                              [close]
                            </button>
                          </div>

                          {/* Expanded Body Content */}
                          <div className="flex-1 flex items-center mt-2.5">
                            {islandTab === "music" ? (
                              <div className="w-full flex items-center justify-between gap-4 text-left">
                                {/* Album Art rotates if music is playing */}
                                <motion.div 
                                  animate={isPlaying ? { rotate: 360 } : {}}
                                  transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                                  className="w-12 h-12 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center relative shadow-inner overflow-hidden"
                                >
                                  {/* Vinyl labels */}
                                  <div className="absolute w-4 h-4 rounded-full bg-orange-500 border border-black z-10 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-black" />
                                  </div>
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_90%)]" />
                                </motion.div>
                                
                                <div className="flex-1 flex flex-col gap-1.5">
                                  <div className="flex justify-between items-baseline select-none">
                                    <span className="text-[10px] font-bold text-[#FDFBF7]">Calm Horizons</span>
                                    <span className="text-[8px] font-mono text-[#FDFBF7]/40">Vortex</span>
                                  </div>
                                  
                                  {/* Interactive Progress timeline bar */}
                                  <div 
                                    className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer"
                                    onClick={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const clickX = e.clientX - rect.left;
                                      const percentage = Math.round((clickX / rect.width) * 100);
                                      setMusicProgress(percentage);
                                    }}
                                  >
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${musicProgress}%` }} />
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className="w-8 h-8 rounded-full bg-[#FDFBF7]/5 hover:bg-[#FDFBF7]/15 border border-white/10 flex items-center justify-center text-[10px] transition active:scale-90 cursor-pointer"
                                >
                                  {isPlaying ? "⏸" : "▶"}
                                </button>
                              </div>
                            ) : (
                              <div className="w-full grid grid-cols-2 gap-4 text-left">
                                <div className="flex flex-col justify-center gap-1">
                                  <span className="text-[7.5px] font-mono text-[#FDFBF7]/40 tracking-wider uppercase">VORTEX PROCESS</span>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-mono font-bold text-orange-500">{cpuLoad}%</span>
                                    <span className="text-[8px] text-[#FDFBF7]/30 font-semibold">CPU LOAD</span>
                                  </div>
                                  {/* Line graph line representation */}
                                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div 
                                      animate={{ width: `${cpuLoad * 4}%` }} 
                                      className="h-full bg-orange-500 rounded-full" 
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col justify-center gap-1 border-l border-white/5 pl-4">
                                  <span className="text-[7.5px] font-mono text-[#FDFBF7]/40 tracking-wider uppercase">MEMORY ALLOC</span>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-mono font-bold text-[#FDFBF7]/90">{memLoad} GB</span>
                                    <span className="text-[8px] text-[#FDFBF7]/30 font-semibold">RAM USED</span>
                                  </div>
                                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div 
                                      animate={{ width: `${(memLoad / 16) * 100}%` }} 
                                      className="h-full bg-[#FDFBF7]/40 rounded-full" 
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Mouse interaction cue */}
                <div className="absolute bottom-6 font-mono text-[9px] text-[#FDFBF7]/30 uppercase tracking-widest pointer-events-none select-none">
                  Press the Dynamic Island notch to expand
                </div>
              </div>

              {/* Wallpaper customizer dock at the bottom of the mockup */}
              <div className="w-full flex justify-center pb-6 z-10 px-4">
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md shadow-xl">
                  <span className="font-mono text-[8px] tracking-widest text-[#FDFBF7]/40 uppercase font-semibold select-none pr-1">
                    Wallpaper:
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: "sunset", label: "Sunset", color: "bg-orange-600" },
                      { id: "lunar", label: "Lunar", color: "bg-stone-600" },
                      { id: "aurora", label: "Aurora", color: "bg-emerald-600" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveWallpaper(item.id as any)}
                        className={`w-4.5 h-4.5 rounded-full ${item.color} border transition-all duration-300 hover:scale-125 cursor-pointer relative flex items-center justify-center ${activeWallpaper === item.id ? "border-[#FDFBF7] scale-110" : "border-white/10"}`}
                        title={item.label}
                      >
                        {activeWallpaper === item.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FDFBF7]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Separator block */}
        <div className="w-full flex flex-col items-center select-none pt-4">
          <span className="font-mono text-[9px] tracking-[0.4em] text-[#FDFBF7]/35 uppercase mb-2">Sandbox Features Directory</span>
          <div className="w-full h-[1px] bg-[#FDFBF7]/5" />
        </div>
        {/* ========================================================= */}
        {/* 4. THE 8 FEATURE CARDS GRID WITH SIGNATURE HOVER EFFECTS   */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-[1440px] text-center">
          
          {/* Card 1: Fluid Transitions (Gooey Circles) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">framer-motion / svg filter</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible">
              <div className="flex items-center justify-center space-x-3.5 gooey-filter-container relative w-24 h-16">
                <div className="w-9 h-9 rounded-full bg-[#FDFBF7] transition-all duration-500 ease-out group-hover:translate-x-7" />
                <div className="w-6 h-6 rounded-full bg-[#FDFBF7] transition-all duration-500 ease-out group-hover:-translate-x-7" />
                
                {/* SVG Gooey filter */}
                <svg className="absolute w-0 h-0">
                  <defs>
                    <filter id="gooey-filter-effect">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Fluid Transitions</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Gooey morphing vectors using SVG blend-mode filters and spring animations.
            </p>
          </div>

          {/* Card 2: Interactive Physics (Swinging Bell) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">keyframe physics</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible">
              <div className="relative">
                {/* Notification Badge dot */}
                <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-orange-500 border border-stone-950 transition-transform duration-300 group-hover:scale-125 z-10" />
                
                {/* Bell SVG */}
                <svg className="w-12 h-12 fill-current text-[#FDFBF7] bell-animate origin-top" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Interactive Physics</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Bell shake notification triggers styled with custom CSS keyframes and spring physics.
            </p>
          </div>

          {/* Card 3: Real-Time Data (Spinning Clock) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">react hooks</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible">
              <svg className="w-12 h-12 fill-none stroke-[#FDFBF7] stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                {/* Minute hand rotates 540 degrees */}
                <path className="origin-center transition-transform duration-500 ease-out group-hover:rotate-[540deg]" strokeLinecap="round" d="M12 12V7" style={{ transformOrigin: "12px 12px" }} />
                {/* Hour hand rotates 180 degrees */}
                <path className="origin-center transition-transform duration-500 ease-out group-hover:rotate-[180deg]" strokeLinecap="round" d="M12 12h4" style={{ transformOrigin: "12px 12px" }} />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Real-Time Data</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Synchronized date-time engines driven by modular React scheduler states.
            </p>
          </div>

          {/* Card 4: Gesture Interaction (Tilting Hand & Wave lines) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">touch api / event handlers</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible relative">
              
              {/* Ripple curves fading in and scaling */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-16 h-16 text-orange-500/40 fill-none stroke-current stroke-2 overflow-visible" viewBox="0 0 24 24">
                  <path className="wave-animate-1 opacity-0" d="M2 12 C 5 6, 19 6, 22 12" />
                  <path className="wave-animate-2 opacity-0" d="M4 14 C 7 9, 17 9, 20 14" />
                  <path className="wave-animate-3 opacity-0" d="M6 16 C 9 12, 15 12, 18 16" />
                </svg>
              </div>

              {/* Hand cursor icon */}
              <svg className="w-10 h-10 fill-current text-[#FDFBF7] transition-all duration-300 origin-bottom group-hover:-rotate-12 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" viewBox="0 0 24 24">
                <path d="M12 24c6.63 0 12-5.37 12-12S18.63 0 12 0 0 5.37 0 12s5.37 12 12 12zm-1-19.4c0-.33.27-.6.6-.6s.6.27.6.6v7.3h-1.2V4.6zm-2.4 1.7c0-.33.27-.6.6-.6s.6.27.6.6v5.6H8.6V6.3zm4.8.8c0-.33.27-.6.6-.6s.6.27.6.6v4.8h-1.2V7.1zm2.4 1.7c0-.33.27-.6.6-.6s.6.27.6.6v3.2h-1.2V8.8z"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Gesture Interaction</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Responsive mouse hover and touch swipe gestures with elastic boundary dampening.
            </p>
          </div>

          {/* Card 5: Vector Animations (Lid Lift Box) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">css transforms</span>
            <div className="h-20 flex flex-col items-center justify-center mb-2 overflow-visible relative">
              {/* Sparkle star pops up */}
              <svg className="absolute w-4 h-4 fill-current text-orange-500 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-[-24px] group-hover:scale-125 transition-all duration-500" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>

              {/* Present Lid */}
              <svg className="w-12 h-4 fill-current text-[#FDFBF7] transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-6 origin-bottom-right" viewBox="0 0 24 8">
                <rect x="1" y="1" width="22" height="6" rx="1" />
                <path d="M10 1h4v6h-4z" />
              </svg>
              {/* Present Box base */}
              <svg className="w-10 h-8 fill-current text-[#FDFBF7]/80 mt-[-1px]" viewBox="0 0 20 16">
                <rect x="1" y="0" width="18" height="15" rx="1" />
                <path d="M8 0h4v15H8z" className="text-[#FDFBF7]"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Vector Animations</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Lid-lifting 3D effect present box utilizing complex CSS hover translations.
            </p>
          </div>

          {/* Card 6: HUD Control Panels (Control knobs sliding) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">parametric state</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible">
              <div className="w-16 h-12 border border-[#FDFBF7]/40 rounded-lg p-2.5 flex flex-col justify-between relative bg-stone-950/60">
                {/* Slider Track 1 */}
                <div className="w-full h-1.5 bg-white/10 rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-orange-500 border border-stone-950 transition-transform duration-500 ease-out group-hover:translate-x-6" style={{ left: '10%' }} />
                </div>
                {/* Slider Track 2 */}
                <div className="w-full h-1.5 bg-white/10 rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FDFBF7] border border-stone-950 transition-transform duration-500 ease-out group-hover:translate-x-4" style={{ left: '20%' }} />
                </div>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">HUD Control Panels</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Bidirectional custom control knobs with instantaneous React state interpolation.
            </p>
          </div>

          {/* Card 7: Modular Widgets (Widgets Dock) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">flexible grid</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible gap-2">
              {/* Battery circular widget */}
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#FDFBF7]/30 flex items-center justify-center group-hover:border-solid group-hover:border-orange-500 group-hover:scale-105 transition duration-300">
                <span className="text-[7.5px] font-mono font-bold text-orange-400">87%</span>
              </div>
              {/* Sun Weather Widget */}
              <div className="w-8 h-8 rounded-lg bg-stone-950 border border-[#FDFBF7]/10 flex items-center justify-center group-hover:scale-105 group-hover:rotate-12 transition duration-300">
                <svg className="w-4.5 h-4.5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Modular Widgets</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Responsive battery levels and weather docks with modular CSS grid architecture.
            </p>
          </div>

          {/* Card 8: Blazing Fast (Lightning Bolt Drawing) */}
          <div className="group relative flex flex-col items-center justify-center p-6 bg-stone-900/40 border border-stone-800 rounded-3xl min-h-[220px] transition-all duration-300 hover:bg-stone-900/60 hover:border-orange-500/30 shadow-lg cursor-pointer">
            <span className="font-mono text-[8px] uppercase tracking-wider text-orange-500 mb-2 font-bold px-2 py-0.5 rounded bg-orange-950/20 border border-orange-500/10">svg line drawing</span>
            <div className="h-20 flex items-center justify-center mb-2 overflow-visible">
              <svg className="w-12 h-12 text-[#FDFBF7] group-hover:text-orange-500 transition-colors duration-300 overflow-visible" viewBox="0 0 24 24">
                <motion.path 
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="200"
                  strokeDashoffset="0"
                  variants={{
                    hover: {
                      strokeDashoffset: [200, 0],
                      fill: ["rgba(249, 115, 22, 0)", "rgba(249, 115, 22, 1)"],
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }
                  }}
                  className="group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#FDFBF7] tracking-tight">Blazing Fast</h3>
            <p className="text-[10px] text-stone-400 mt-2 max-w-[180px] leading-relaxed mx-auto font-medium">
              Lightning-fast page rendering optimized using stroke line drawing variants.
            </p>
          </div>

        </section>

        {/* ========================================================= */}
        {/* 5. CALL TO ACTION SECTION (Zen Browser style button)       */}
        {/* ========================================================= */}
        <section className="w-full max-w-2xl flex justify-center mt-6">
          <div 
            onClick={() => navigate("/contact")}
            className="w-full border-2 border-stone-800 hover:border-orange-500/40 rounded-[32px] p-8 flex flex-col items-center justify-center gap-5 cursor-pointer group transition-all duration-500 bg-stone-900/30 relative overflow-hidden text-center shadow-2xl"
          >
            {/* Decal background layout */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border-4 border-[#FDFBF7]" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-[#FDFBF7]" />
            </div>

            <span className="vortex-font-mono text-[9px] tracking-[0.3em] uppercase text-orange-500 font-bold">
              03 / INVITATION GATEWAY
            </span>
            
            <h3 className="vortex-font-bricolage text-3xl sm:text-4xl text-[#FDFBF7] tracking-tight block relative">
              Start A Project With Cherif
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </h3>

            {/* Sliding text link */}
            <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#FDFBF7]/40 group-hover:text-[#FDFBF7]/90 transition-colors duration-300 relative h-4 overflow-hidden w-48 justify-center">
              <span className="ease transition-transform duration-300 group-hover:-translate-y-4">
                GET IN TOUCH
              </span>
              <span className="ease absolute translate-y-4 transition-transform duration-300 group-hover:translate-y-0 text-orange-500">
                LET'S TALK →
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="mt-32 w-full max-w-[1440px] pt-8 border-t border-[#FDFBF7]/5 flex items-center justify-center text-[9px] font-mono tracking-[0.2em] text-[#FDFBF7]/30 z-10 select-none px-6">
        © {new Date().getFullYear()} CHERIF BOUABDALLAH
      </footer>

      {/* Big typography shadow logo "Vortex" in background */}
      <div className="absolute bottom-0 left-0 right-0 text-center select-none pointer-events-none overflow-hidden h-32 sm:h-48 z-0">
        <span className="font-bold tracking-tight text-[12rem] sm:text-[18rem] md:text-[22rem] leading-none bg-gradient-to-b from-[#FDFBF7]/[0.02] to-transparent bg-clip-text text-transparent opacity-30 select-none uppercase vortex-font-bricolage">
          Vortex
        </span>
      </div>

    </div>
  );
}
