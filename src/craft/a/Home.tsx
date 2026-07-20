import "./nocturne.css";
import { useState, useEffect, memo } from "react";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TRANSLATIONS } from "../../data/translations";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { MaskRiseTitle } from "../../components/MaskRiseTitle";
import NocturneAtmosphere from "./NocturneAtmosphere";

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

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.215, 0.61, 0.355, 1] } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.015, delayChildren: 0.15 } },
};

interface HomeProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
}

export default function Home({ lang, setLang }: HomeProps) {
  const navigate = useNavigate();
  const [photoshopClicks, setPhotoshopClicks] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handlePhotoshopClick = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && lang === "fr") {
      setPhotoshopClicks((prev) => {
        const next = prev + 1;
        if (next >= 10) {
          navigate("/secret101");
          return 0;
        }
        return next;
      });
    }
  };

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", id === "home" ? "/" : `/${id}`);
    }
  };

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

  const t = TRANSLATIONS[lang];

  const codeLanguages = [
    { name: "Java", logo: <JavaLogo /> },
    { name: "Python", logo: <PythonLogo /> },
    { name: t.riscVName, logo: <RiscVLogo /> },
    { name: "Verilog", logo: <VerilogLogo /> },
  ];

  const designSkills = [
    { name: "Arduino", logo: <ArduinoLogo /> },
    { name: "Latex", logo: <LatexLogo /> },
    { name: "Blender", logo: <BlenderLogo /> },
    { name: "Photoshop", logo: <PhotoshopLogo /> },
    { name: t.creativeWebDesignName, logo: <DesignLogo /> },
  ];

  const monologueWords = t.monologue;
  const bgParagraphWords = t.background.split(" ");

  return (
    <div id="home" className="w-full relative bg-theme-bg text-theme-text select-text selection:bg-theme-text selection:text-theme-bg">
      <NocturneAtmosphere />

      <div className="relative z-10 flex flex-col md:flex-row w-full px-6 md:px-0">
        {/* Sticky left: the room holds this statement while everything else scrolls past it */}
        <div className="w-full md:w-[40%] md:sticky md:top-0 md:h-screen flex flex-col items-center justify-center py-16 md:py-0 px-4 md:px-12">
          <MaskRiseTitle
            text="Cherif Bouabdallah"
            isReady={isReady}
            className="font-maghfirea text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-center select-none"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-theme-text/45 text-center"
          >
            {t.coreStack}
          </motion.p>
        </div>

        {/* Scrolling right: everything else, in flow, passing beneath the held title */}
        <div className="w-full md:w-[60%] flex flex-col gap-16 py-16 md:py-32 px-4 md:px-12 md:pr-24">
          <div className="flex justify-start">
            <LanguageSwitcher lang={lang} setLang={setLang} layoutId="active-lang-bg-desktop" />
          </div>

          <motion.div
            key={`monologue-${lang}`}
            variants={containerVariants}
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
            variants={containerVariants}
            initial="hidden"
            animate={isReady ? "visible" : "hidden"}
            className="text-[14px] md:text-[16px] leading-relaxed text-theme-text/50"
          >
            {bgParagraphWords.map((word, idx) => (
              <motion.span key={idx} variants={wordVariants} className="inline-block mr-1.5">
                {word}
              </motion.span>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-8 border-t border-theme-text/10 pt-10">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-theme-text/10 pb-2">
                {t.languages}
              </div>
              <div className="flex flex-col gap-3">
                {codeLanguages.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2 text-theme-text/80 font-mono text-[11px] hover:text-theme-text transition-colors cursor-default">
                    <span className="opacity-60">{skill.logo}</span> {skill.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-theme-text/10 pb-2">
                {t.skills}
              </div>
              <div className="flex flex-col gap-3">
                {designSkills.map((skill) => (
                  <div
                    key={skill.name}
                    onClick={skill.name === "Photoshop" ? handlePhotoshopClick : undefined}
                    className="flex items-center gap-2 text-theme-text/80 font-mono text-[11px] hover:text-theme-text transition-colors cursor-default"
                  >
                    <span className="opacity-60">{skill.logo}</span> {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
              {t.gateway}
            </div>
            <div className="flex flex-col gap-0">
              <a
                href="/contact"
                onClick={handleScrollTo("contact")}
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
              >
                <span className="font-mono text-[12px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text group-hover:translate-x-1 transition-all duration-500">
                  {t.contact}
                </span>
                <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </a>
              <a
                href="/portfolio"
                onClick={handleScrollTo("portfolio")}
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-theme-text/10 transition-all duration-500 decoration-none"
              >
                <span className="font-mono text-[12px] tracking-[0.4em] text-theme-text/60 group-hover:text-theme-text group-hover:translate-x-1 transition-all duration-500">
                  {t.portfolio}
                </span>
                <span className="font-mono text-[10px] text-theme-text/0 group-hover:text-theme-text/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
