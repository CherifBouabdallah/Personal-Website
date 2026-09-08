import { motion, useTransform, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";
import { SPRING_UI, SPRING_SCROLL, useMotionPrefs } from "../lib/motion";

const GithubIcon = ({ className = "w-5 h-5 md:w-6 md:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5 md:w-6 md:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const EmailIcon = ({ className = "w-5 h-5 md:w-6 md:h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

interface ContactProps {
  lang: "en" | "fr";
}

export default function Contact({ lang }: ContactProps) {
  const [isReady, setIsReady] = useState(false);
  const [activePopup, setActivePopup] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const [copiedType, setCopiedType] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { transition } = useMotionPrefs();

  usePlateStrike(titleRef, isReady);

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (active) setIsReady(true);
    });
    const timer = setTimeout(() => {
      if (active) setIsReady(true);
    }, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
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
      if (!target.closest(".social-container")) setActivePopup(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [activePopup]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL);
  const footerOpacity = useTransform(smoothProgress, [0.65, 0.98], [0, 0.35]);
  const footerY = useTransform(smoothProgress, [0.65, 0.98], ["15px", "0px"]);

  const socials = [
    { name: "GITHUB" as const, number: "01", url: "https://github.com/CherifBouabdallah", icon: <GithubIcon /> },
    { name: "EMAIL" as const, number: "02", url: "", icon: <EmailIcon /> },
    { name: "LINKEDIN" as const, number: "03", url: "https://www.linkedin.com/in/cherif-bouabdallah/", icon: <LinkedinIcon /> },
  ];

  return (
    <div
      id="contact"
      ref={sectionRef}
      className="w-full min-h-screen relative flex flex-col items-center justify-center selection:bg-theme-text selection:text-theme-bg pt-40 pb-24 md:pt-56 md:pb-32 bg-theme-bg text-theme-text overflow-hidden"
    >

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6">
        <h1
          ref={titleRef}
          className="plate-strike font-maghfirea text-[clamp(2.6rem,9vw,140px)] text-theme-text text-center leading-[0.95] w-full overflow-visible mb-16 md:mb-24"
        >
          <SplitLine text="Contact" />
        </h1>

        <div className="flex items-center justify-center gap-8 sm:gap-10 md:gap-16 border-t border-theme-text/10 pt-14">
          {socials.map((social) => {
            const isExpanded = activePopup === social.name;
            return (
              <div
                key={social.name}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-haspopup="true"
                aria-label={`Toggle contact details for ${social.name}`}
                className="social-container flex flex-col items-center group cursor-pointer relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-text/40 focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg"
                onClick={() => setActivePopup(isExpanded ? null : social.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivePopup(isExpanded ? null : social.name);
                  }
                }}
              >
                <span className="font-mono text-[9px] tracking-[0.25em] opacity-30 mb-2">{social.number}</span>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/90 bg-theme-text/5 transition-all duration-500 group-hover:bg-theme-text group-hover:text-theme-bg group-hover:scale-105 group-hover:border-theme-text">
                  {social.icon}
                </div>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-theme-text/40 mt-4 transition-colors duration-300 group-hover:text-theme-text/80">
                  {social.name}
                </span>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: -24, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.92 }}
                      transition={transition(SPRING_UI)}
                      style={{ originX: 0.5, originY: 0 }}
                      className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 bg-theme-text/[0.04] text-theme-text/90 p-4 rounded-2xl border border-theme-text/10 z-50 whitespace-nowrap min-w-[280px] shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {social.name === "EMAIL" ? (
                        <>
                          <span className="font-mono text-[11px] font-bold select-all text-theme-text/90 tracking-wide">
                            chrif.bouabdallah@gmail.com
                          </span>
                          <button
                            onClick={(e) => handleCopyText("chrif.bouabdallah@gmail.com", "EMAIL", e)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-wider hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                          >
                            {copiedType === "EMAIL" ? "COPIED!" : "COPY ADDRESS"}
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-[11px] font-bold select-all text-theme-text/90 tracking-wide">
                            {social.name === "GITHUB" ? "github.com/CherifBouabdallah" : "linkedin.com/in/cherif-bouabdallah"}
                          </span>
                          <div className="flex flex-row gap-2 w-full">
                            <button
                              onClick={(e) => handleCopyText(social.url, social.name, e)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-wider hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            >
                              {copiedType === social.name ? "COPIED!" : "COPY LINK"}
                            </button>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-theme-text/10 text-theme-text border border-theme-text/20 font-mono text-[10px] font-bold tracking-wider hover:bg-theme-text/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            >
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
        </div>
      </div>

      <Footer style={{ opacity: footerOpacity, y: footerY }} className="absolute bottom-8 text-theme-text pointer-events-none" />
    </div>
  );
}
