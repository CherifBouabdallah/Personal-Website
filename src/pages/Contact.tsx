import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

// Inline SVGs to ensure cross-browser compatibility and consistent styling
const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const EmailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const popupVariants = {
  initial: { opacity: 0, y: -40, scale: 0.1, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, scale: 0.1, filter: "blur(8px)" },
  transition: { type: "spring", stiffness: 380, damping: 22 }
} as const;

export default function Contact() {
  const [isReady, setIsReady] = useState(false);
  const [year, setYear] = useState<string>(() => String(new Date().getFullYear()));
  const [activePopup, setActivePopup] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const [copiedType, setCopiedType] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyText = (text: string, type: "EMAIL" | "GITHUB" | "LINKEDIN", e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  useEffect(() => {
    if (!activePopup) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".social-container")) {
        setActivePopup(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [activePopup]);

  // Smooth virtual scroll tracking
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    damping: 30,
    stiffness: 120,
    mass: 0.8,
  });

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
    
    // Apply no-scrollbar to HTML and Body to ensure clean scrollbar-free virtual scroll layout
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  // Fetch the current year from the internet with a 3-second timeout fallback
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const fetchYear = async () => {
      try {
        const res = await fetch("https://worldtimeapi.org/api/ip", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.datetime) {
            const parsedYear = data.datetime.substring(0, 4);
            if (/^\d{4}$/.test(parsedYear)) {
              setYear(parsedYear);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch year from internet, using local system clock:", err);
      } finally {
        clearTimeout(timeoutId);
      }
    };
    fetchYear();
  }, []);

  useEffect(() => {
    let current = 0;
    let lastTime = Date.now();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const timeDiff = now - lastTime;
      lastTime = now;

      // Dampen extreme/fast scroll bursts
      let delta = e.deltaY * 0.002;
      if (timeDiff < 20 && Math.abs(e.deltaY) > 80) {
        delta = e.deltaY * 0.0006;
      }

      current = Math.max(0, Math.min(1, current + delta));
      scrollProgress.set(current);
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const delta = deltaY * 0.005; // Touch scroll sensitivity
      current = Math.max(0, Math.min(1, current + delta));
      scrollProgress.set(current);
      startY = currentY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        current = Math.max(0, Math.min(1, current + 0.25));
        scrollProgress.set(current);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        current = Math.max(0, Math.min(1, current - 0.25));
        scrollProgress.set(current);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollProgress]);

  const text = "Contact";

  // Framer Motion transforms tied to our virtual scroll progression (0 -> 1)
  const titleY = useTransform(smoothProgress, [0, 1], ["0vh", "-16vh"]);
  const titleScale = useTransform(smoothProgress, [0, 1], [1, isMobile ? 0.65 : 0.45]);

  const iconsOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);
  const iconsY = useTransform(smoothProgress, [0.35, 0.95], ["10vh", "6vh"]);
  const iconsScale = useTransform(smoothProgress, [0.35, 0.95], [0.85, 1]);

  const inviteOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const inviteY = useTransform(smoothProgress, [0, 0.25], ["0px", "15px"]);

  const footerOpacity = useTransform(smoothProgress, [0.65, 0.98], [0, 0.35]);
  const footerY = useTransform(smoothProgress, [0.65, 0.98], ["15px", "0px"]);

  const bgY = useTransform(smoothProgress, [0, 1], ["0px", "-100px"]);

  const socials = [
    {
      name: "GITHUB" as const,
      url: "https://github.com/CherifBouabdallah",
      icon: <GithubIcon />,
    },
    {
      name: "EMAIL" as const,
      url: "",
      icon: <EmailIcon />,
    },
    {
      name: "LINKEDIN" as const,
      url: "https://www.linkedin.com/in/cherif-bouabdallah/",
      icon: <LinkedinIcon />,
    },
  ];

  return (
    <div className="w-full h-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none touch-none">
      {/* Background Artwork Image */}
      <motion.div 
        style={{ 
          opacity: 0.12,
          y: bgY,
          scale: 1.15,
          transformOrigin: "center top",
        }}
        className="fixed top-0 left-0 right-0 bottom-[-300px] w-full pointer-events-none select-none z-0 overflow-hidden"
      >
        <img 
          src="/OG.png" 
          alt="Background Artwork" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        style={{ y: titleY, scale: titleScale }}
        className="z-10 cursor-default"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="font-maghfirea text-[clamp(2.5rem,12vw,200px)] text-[#F6F0DF] whitespace-nowrap flex justify-center selection:bg-[#F6F0DF] selection:text-[#386641] px-4 w-full"
        >
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden"
              style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 1.0, ease: [0.21, 1, 0.36, 1] }
                  }
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </motion.div>

      {/* Social Icons Container */}
      <motion.div
        style={{ opacity: iconsOpacity, y: iconsY, scale: iconsScale }}
        className="absolute z-10 flex items-center justify-center gap-6 sm:gap-8 md:gap-14"
      >
        {socials.map((social) => {
          const content = (
            <>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#F6F0DF]/20 flex items-center justify-center text-[#F6F0DF]/90 bg-[#F6F0DF]/5 backdrop-blur-[4px] transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:bg-[#F6F0DF] group-hover:text-[#386641] group-hover:scale-105 group-hover:border-[#F6F0DF] group-hover:shadow-[0_8px_30px_rgb(246,240,223,0.15)]">
                {social.icon}
              </div>
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-[#F6F0DF]/40 mt-4 transition-colors duration-300 group-hover:text-[#F6F0DF]/80">
                {social.name}
              </span>
            </>
          );

          return (
            <div
              key={social.name}
              className="social-container flex flex-col items-center group cursor-pointer relative"
              onClick={() => setActivePopup(activePopup === social.name ? null : social.name)}
            >
              {content}

              <AnimatePresence>
                {activePopup === social.name && (
                  <motion.div
                    variants={popupVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ originX: 0.5, originY: 0 }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 bg-[#F6F0DF]/5 backdrop-blur-[4px] text-[#F6F0DF]/90 p-3 rounded-2xl border border-[#F6F0DF]/20 z-50 whitespace-nowrap min-w-[280px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {social.name === "EMAIL" ? (
                      <>
                        <span className="font-mono text-[11px] font-bold select-all text-[#F6F0DF]/90 tracking-wide">
                          chrif.bouabdallah@gmail.com
                        </span>
                        <button
                          onClick={(e) => handleCopyText("chrif.bouabdallah@gmail.com", "EMAIL", e)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F6F0DF] text-[#386641] font-mono text-[10px] font-bold tracking-wider hover:bg-[#F6F0DF]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                          {copiedType === "EMAIL" ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              COPIED!
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                              COPY ADDRESS
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[11px] font-bold select-all text-[#F6F0DF]/90 tracking-wide">
                          {social.name === "GITHUB" ? "github.com/CherifBouabdallah" : "linkedin.com/in/cherif-bouabdallah"}
                        </span>
                        <div className="flex flex-row gap-2 w-full">
                          <button
                            onClick={(e) => handleCopyText(social.url, social.name, e)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F6F0DF] text-[#386641] font-mono text-[10px] font-bold tracking-wider hover:bg-[#F6F0DF]/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                          >
                            {copiedType === social.name ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                COPIED!
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                COPY LINK
                              </>
                            )}
                          </button>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F6F0DF]/10 text-[#F6F0DF] border border-[#F6F0DF]/20 font-mono text-[10px] font-bold tracking-wider hover:bg-[#F6F0DF]/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            GO TO PAGE
                          </a>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Selected Option A: Minimalist Sliding Line */}
      <motion.div
        style={{ opacity: inviteOpacity, y: inviteY }}
        className="absolute bottom-12 flex flex-col items-center gap-2.5 z-10 pointer-events-none"
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

      {/* Copyright Footer */}
      <motion.footer
        style={{ opacity: footerOpacity, y: footerY }}
        className="absolute bottom-8 font-mono text-[9px] tracking-[0.2em] text-[#F6F0DF] pointer-events-none"
      >
        © {year} CHERIF BOUABDALLAH
      </motion.footer>
    </div>
  );
}
