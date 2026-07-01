import { useState, useEffect, memo, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import Footer from "../components/Footer";
import { TRANSLATIONS } from "../data/translations";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

// SVG Logos for Core Stack
const JavaLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3M10 1v3M14 1v3" />
  </svg>
));

const PythonLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5h5z" />
    <path d="M12 22v-8a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v4a5 5 0 0 1-5 5h-5z" />
    <circle cx="5" cy="5" r="0.75" fill="currentColor" />
    <circle cx="19" cy="19" r="0.75" fill="currentColor" />
  </svg>
));

const RiscVLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="12" height="12" x="6" y="6" rx="2" />
    <path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4" />
  </svg>
));

const VerilogLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h3l3-8 4 16 3-10 2 2h3" />
  </svg>
));

const ArduinoLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2.5-3.5-6-3.5-8-1.5s-2 5 0 7 5.5 2 8-1.5c2.5 3.5 6 3.5 8 1.5s2-5 0-7-5.5-2-8 1.5z" />
    <path d="M6 12h2M16 12h2M17 11v2" />
  </svg>
));

const LatexLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h4l-3-3 3-3H9" />
  </svg>
));

const BlenderLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M12 5.5V2M16.5 7.5L19.5 5M17.5 12h4" />
  </svg>
));

const PhotoshopLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h2.5a1.5 1.5 0 0 1 0 3H7v4M13.5 11c0-.5.5-1 1-1h.5a1 1 0 0 1 1 1c0 1-2 1-2 2a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1" />
  </svg>
));

const DesignLogo = memo(() => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912-1.275-1.275L12 3Z" />
  </svg>
));

// --- Polished Animation Timeline (portrait removed, all elements breathe) ---
const TIMELINE = {
  NAME_CHAR_STAGGER: 0.02,
  NAME_CHAR_DURATION: 0.6,
  MONOLOGUE_START: 0.2,
  MONOLOGUE_WORD_STAGGER: 0.015,
  BG_PARAGRAPH_START: 0.6,
  BG_WORD_STAGGER: 0.012,
  SKILLS_START: 0.8,
  SKILLS_ITEM_STAGGER: 0.04,
  GATEWAY_START: 1.1,
};

const monologueContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TIMELINE.MONOLOGUE_WORD_STAGGER,
      delayChildren: TIMELINE.MONOLOGUE_START
    }
  }
};

const bgContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: TIMELINE.BG_WORD_STAGGER,
      delayChildren: TIMELINE.BG_PARAGRAPH_START
    }
  }
};

// Mobile variants (scroll‑triggered)
const mobileMonologueContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.1
    }
  }
};

const mobileBgContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.1
    }
  }
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.215, 0.610, 0.355, 1.000]
    }
  }
};

interface HomeProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Home({ lang, setLang }: HomeProps) {
  const [isReady, setIsReady] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialMount(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const nameText = "Cherif Bouabdallah";

  const t = TRANSLATIONS[lang];

  const codeLanguages = [
    { name: "Java", logo: <JavaLogo /> },
    { name: "Python", logo: <PythonLogo /> },
    { name: t.riscVName, logo: <RiscVLogo /> },
    { name: "Verilog", logo: <VerilogLogo /> }
  ];

  const designSkills = [
    { name: "Arduino", logo: <ArduinoLogo /> },
    { name: "Latex", logo: <LatexLogo /> },
    { name: "Blender", logo: <BlenderLogo /> },
    { name: "Photoshop", logo: <PhotoshopLogo /> },
    { name: t.creativeWebDesignName, logo: <DesignLogo /> }
  ];

  const monologueWords = t.monologue;
  const bgParagraphWords = t.background.split(" ");

  return (
    <div className="w-full min-h-screen flex flex-col pt-24 md:pt-32 pb-8 px-6 md:px-16 lg:px-24 xl:px-32 relative bg-theme-bg text-theme-text select-text selection:bg-theme-text selection:text-theme-bg">

      <div className="flex-1 flex flex-col w-full mx-auto max-w-7xl">

        <div className="hidden md:flex flex-col gap-16 w-full">

          <h1 className="font-maghfirea text-[clamp(3.5rem,10vw,140px)] text-theme-text leading-[0.9] tracking-[-0.02em] text-center w-full overflow-visible select-none">
            {(() => {
              let charCounter = 0;
              return nameText.split(" ").map((word, wordIndex, arr) => (
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
                            initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
                            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.05,
                            }}
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

          <div className="grid grid-cols-12 gap-x-12 gap-y-16">

            <div className="col-span-7 flex flex-col gap-10">
              {/* Language Switcher */}
              <div className="flex justify-start">
                <LanguageSwitcher lang={lang} setLang={setLang} layoutId="active-lang-bg-desktop" />
              </div>

              <motion.div
                key={`monologue-${lang}`}
                variants={monologueContainerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
                className="text-[16px] md:text-[19px] leading-relaxed text-theme-text/90 font-medium"
              >
                {monologueWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    className={`inline-block mr-1.5 ${word.italic ? "font-serif italic text-theme-muted" : ""}`}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                key={`bg-${lang}`}
                variants={bgContainerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
                className="text-[14px] md:text-[16px] leading-relaxed text-theme-text/50"
              >
                {bgParagraphWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    className="inline-block mr-1.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <div className="col-span-5 flex flex-col gap-12 border-l border-theme-text/10 pl-10">
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                  {t.coreStack}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-theme-text/10 pb-2">
                      {t.languages}
                    </div>
                    <div className="flex flex-col gap-3" key={`languages-${lang}`}>
                      {codeLanguages.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -5 }}
                          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                          transition={{
                            duration: 0.5,
                            delay: isInitialMount ? (TIMELINE.SKILLS_START + index * TIMELINE.SKILLS_ITEM_STAGGER) : (index * 0.02),
                            ease: [0.25, 1, 0.5, 1]
                          }}
                          className="flex items-center gap-2 text-theme-text/80 font-mono text-[11px] hover:text-theme-text transition-colors cursor-default"
                        >
                          <span className="opacity-60">{skill.logo}</span> {skill.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-theme-text/10 pb-2">
                      {t.skills}
                    </div>
                    <div className="flex flex-col gap-3" key={`skills-${lang}`}>
                      {designSkills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -5 }}
                          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                          transition={{
                            duration: 0.5,
                            delay: isInitialMount ? (TIMELINE.SKILLS_START + 0.15 + index * TIMELINE.SKILLS_ITEM_STAGGER) : (index * 0.02),
                            ease: [0.25, 1, 0.5, 1]
                          }}
                          className="flex items-center gap-2 text-theme-text/80 font-mono text-[11px] hover:text-theme-text transition-colors cursor-default"
                        >
                          <span className="opacity-60">{skill.logo}</span> {skill.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                  {t.gateway}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.8,
                    delay: TIMELINE.GATEWAY_START,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                >
                  <div className="flex flex-col gap-0">
                    <Link
                      to="/contact"
                      id="desktop-gateway-contact"
                      className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
                    >
                      <span className="font-mono text-[12px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text/100 group-hover:translate-x-1 transition-all duration-500">
                        {t.contact}
                      </span>
                      <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                        →
                      </span>
                    </Link>
                    <Link
                      to="/portfolio"
                      id="desktop-gateway-portfolio"
                      className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
                    >
                      <span className="font-mono text-[12px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text/100 group-hover:translate-x-1 transition-all duration-500">
                        {t.portfolio}
                      </span>
                      <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                        →
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout – Elegant vertical rhythm */}
        <div className="flex md:hidden flex-col gap-10 w-full">

          {/* Name */}
          <h1 className="font-maghfirea text-[clamp(2.2rem,9vw,4rem)] text-[#F6F0DF] leading-[0.95] text-center w-full overflow-visible">
            {(() => {
              let charCounter = 0;
              return nameText.split(" ").map((word, wordIndex, arr) => (
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
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.05,
                            }}
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

          {/* Monologue (scroll reveal) */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-start">
              <LanguageSwitcher lang={lang} setLang={setLang} layoutId="active-lang-bg-mobile" />
            </div>
            <motion.div
              key={`mobile-monologue-${lang}`}
              variants={mobileMonologueContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="text-[16px] leading-relaxed text-[#F6F0DF]/90 font-medium text-left w-full"
            >
              {monologueWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={wordVariants}
                  className={`inline-block mr-1.5 ${word.italic ? "font-serif italic text-[#DEDBC8]" : ""}`}
                >
                  {word.text}
                </motion.span>
              ))}
            </motion.div>

            {/* Background paragraph */}
            <motion.div
              key={`mobile-bg-${lang}`}
              variants={mobileBgContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="text-[14px] leading-relaxed text-[#F6F0DF]/50 text-left w-full"
            >
              {bgParagraphWords.map((word, idx) => (
                <motion.span key={idx} variants={wordVariants} className="inline-block mr-1.5">
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Core Stack */}
          <motion.div
            key={`mobile-stack-${lang}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="w-full text-left"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
              {t.coreStack}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-theme-text/10 pb-2">
                  {t.languages}
                </div>
                <div className="flex flex-col gap-3" key={`mobile-languages-${lang}`}>
                  {codeLanguages.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 text-theme-text/80 font-mono text-[10px] hover:text-theme-text transition-colors cursor-default"
                    >
                      <span className="opacity-60">{skill.logo}</span> {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-theme-text/10 pb-2">
                  {t.skills}
                </div>
                <div className="flex flex-col gap-3" key={`mobile-skills-${lang}`}>
                  {designSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 text-theme-text/80 font-mono text-[10px] hover:text-theme-text transition-colors cursor-default"
                    >
                      <span className="opacity-60">{skill.logo}</span> {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gateway */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="w-full text-left"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
              {t.gateway}
            </div>
            <div className="flex flex-col gap-0 py-2">
              <Link
                to="/contact"
                id="mobile-gateway-contact"
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
              >
                <span className="font-mono text-[11px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text group-hover:translate-x-1 transition-all duration-500">
                  {t.contact}
                </span>
                <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </Link>
              <Link
                to="/portfolio"
                id="mobile-gateway-portfolio"
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
              >
                <span className="font-mono text-[11px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text group-hover:translate-x-1 transition-all duration-500">
                  {t.portfolio}
                </span>
                <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer className="w-full text-center text-theme-text/30 mt-auto pt-8 z-10" />
    </div>
  );
}