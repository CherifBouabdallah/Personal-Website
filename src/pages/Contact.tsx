import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from "framer-motion";
import { useState, useEffect, useRef, Fragment } from "react";
import Footer from "../components/Footer";
import { TRANSLATIONS } from "../data/translations";
import { SPRING_UI, SPRING_SCROLL, EASE_ENTER_CHAR, useMotionPrefs } from "../lib/motion";

type Language = "en" | "fr";

// Inline SVGs to ensure cross-browser compatibility and consistent styling
const GithubIcon = ({ className = "w-6 h-6 md:w-8 md:h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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

const LinkedinIcon = ({ className = "w-6 h-6 md:w-8 md:h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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

const EmailIcon = ({ className = "w-6 h-6 md:w-8 md:h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
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
  transition: SPRING_UI,
} as const;

interface ContactProps {
  lang: "en" | "fr";
}

export default function Contact({ lang }: ContactProps) {
  const { reduced } = useMotionPrefs();
  const [isReady, setIsReady] = useState(false);
  const [activePopup, setActivePopup] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const [copiedType, setCopiedType] = useState<"EMAIL" | "GITHUB" | "LINKEDIN" | null>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

  // Detect when title scrolls into view to trigger the character animation
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

  const contactRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const { scrollYProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_SCROLL);

  const text = "Contact";

  const iconsOpacity = useTransform(smoothProgress, [0.35, 0.85], [0, 1]);
  const iconsY = useTransform(smoothProgress, [0.35, 0.95], ["6vh", "0vh"]);
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
      icon: <GithubIcon className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      name: "EMAIL" as const,
      url: "",
      icon: <EmailIcon className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
      name: "LINKEDIN" as const,
      url: "https://www.linkedin.com/in/cherif-bouabdallah/",
      icon: <LinkedinIcon className="w-5 h-5 md:w-6 md:h-6" />,
    },
  ];

  return (
    <div id="contact" ref={contactRef} className="w-full min-h-screen relative flex flex-col items-center justify-center selection:bg-theme-text selection:text-theme-bg py-20 md:py-28">
        {/* Large Title */}
        <div className="cursor-default select-none pointer-events-none mb-16 md:mb-24">
          <h1 ref={titleRef} className="font-maghfirea text-[clamp(2.5rem,8vw,5.5rem)] md:text-[clamp(3.5rem,10vw,140px)] text-theme-text flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] selection:bg-theme-text selection:text-theme-bg px-4 w-full">
            {(() => {
              const shouldAnimate = isReady && hasBeenInView;
              let charCounter = 0;
              return text.split(" ").map((word, wordIndex, arr) => (
                <Fragment key={wordIndex}>
                  <span className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = charCounter++;
                      return (
                        <span
                          key={charIndex}
                          className="inline-block overflow-hidden"
                          style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
                        >
                          <motion.span
                            className="inline-block"
                            initial={reduced ? false : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={reduced ? { opacity: 1 } : shouldAnimate ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 35, filter: "blur(10px)" }}
                            transition={reduced ? { duration: 0 } : { duration: 1.0, ease: EASE_ENTER_CHAR, delay: globalIndex * 0.05 }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                  {wordIndex < arr.length - 1 && " "}
                </Fragment>
              ));
            })()}
          </h1>
        </div>

        {/* Social Icons Container */}
        <motion.div
          style={{ opacity: iconsOpacity, y: iconsY, scale: iconsScale }}
          className="flex items-center justify-center gap-6 sm:gap-8 md:gap-14"
        >
          {socials.map((social) => {
            const content = (
              <>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/90 bg-theme-text/5 backdrop-blur-[4px] transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:bg-theme-text group-hover:text-theme-bg group-hover:scale-105 group-hover:border-theme-text group-hover:shadow-[0_8px_30px_rgb(34,61,39,0.15)]">
                  {social.icon}
                </div>
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-theme-text/40 mt-4 transition-colors duration-300 group-hover:text-theme-text/80">
                  {social.name}
                </span>
              </>
            );

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
                {content}

                <AnimatePresence>
                  {activePopup === social.name && (
                    <motion.div
                      variants={popupVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ originX: 0.5, originY: 0 }}
                      className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 bg-theme-text/[0.03] backdrop-blur-[24px] text-theme-text/90 p-4 rounded-2xl border border-theme-text/10 z-50 whitespace-nowrap min-w-[290px] shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
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
                          <span className="font-mono text-[11px] font-bold select-all text-theme-text/90 tracking-wide">
                            {social.name === "GITHUB" ? "github.com/CherifBouabdallah" : "linkedin.com/in/cherif-bouabdallah"}
                          </span>
                          <div className="flex flex-row gap-2 w-full">
                            <button
                              onClick={(e) => handleCopyText(social.url, social.name, e)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-theme-text text-theme-bg font-mono text-[10px] font-bold tracking-wider hover:bg-theme-text/90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
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
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-theme-text/10 text-theme-text border border-theme-text/20 font-mono text-[10px] font-bold tracking-wider hover:bg-theme-text/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
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
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-theme-text/60">
            {t.scrollLabel}
          </span>
          <div className="w-[1.5px] h-[22px] bg-theme-text/20 relative overflow-hidden">
            <motion.div
              animate={{
                y: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-theme-text/80 h-full w-full"
              style={{ originY: 0 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Copyright Footer */}
      <Footer
        style={{ opacity: footerOpacity, y: footerY }}
        className="absolute bottom-8 text-theme-text pointer-events-none"
      />
    </div>
  );
}
