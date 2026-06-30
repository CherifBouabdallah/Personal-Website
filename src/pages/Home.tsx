import { useState, useEffect, memo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import Footer from "../components/Footer";

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

const codeLanguages = [
  { name: "Java", logo: <JavaLogo /> },
  { name: "Python", logo: <PythonLogo /> },
  { name: "Risc-V Assembly", logo: <RiscVLogo /> },
  { name: "Verilog", logo: <VerilogLogo /> }
];

const designSkills = [
  { name: "Arduino", logo: <ArduinoLogo /> },
  { name: "Latex", logo: <LatexLogo /> },
  { name: "Blender", logo: <BlenderLogo /> },
  { name: "Photoshop", logo: <PhotoshopLogo /> },
  { name: "Creative Web Design", logo: <DesignLogo /> }
];

const monologueWords = [
  { text: "I", italic: false },
  { text: "am", italic: false },
  { text: "a", italic: false },
  { text: "designer", italic: false },
  { text: "and", italic: false },
  { text: "full-stack", italic: false },
  { text: "software", italic: false },
  { text: "engineer", italic: false },
  { text: "who", italic: false },
  { text: "focuses", italic: false },
  { text: "on", italic: false },
  { text: "bridging", italic: false },
  { text: "the", italic: false },
  { text: "gap", italic: false },
  { text: "between", italic: false },
  { text: "aesthetics", italic: false },
  { text: "and", italic: false },
  { text: "clean", italic: false },
  { text: "code.", italic: false },
  { text: "I", italic: true },
  { text: "build", italic: true },
  { text: "performant", italic: true },
  { text: "front-ends", italic: true },
  { text: "and", italic: true },
  { text: "interactive", italic: true },
  { text: "experiences", italic: true },
  { text: "that", italic: true },
  { text: "are", italic: true },
  { text: "highly", italic: true },
  { text: "responsive", italic: true },
  { text: "and", italic: true },
  { text: "structured.", italic: true },
  { text: "Driven", italic: false },
  { text: "by", italic: false },
  { text: "curiosity,", italic: false },
  { text: "I", italic: false },
  { text: "aim", italic: false },
  { text: "to", italic: false },
  { text: "craft", italic: false },
  { text: "memorable", italic: false },
  { text: "digital", italic: false },
  { text: "products", italic: false },
  { text: "that", italic: false },
  { text: "look", italic: false },
  { text: "beautiful", italic: false },
  { text: "and", italic: false },
  { text: "feel", italic: false },
  { text: "extremely", italic: false },
  { text: "premium.", italic: false }
];

const bgParagraphWords = "Currently pursuing software engineering at EPFL (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.".split(" ");

// --- Polished Animation Timeline (portrait removed, all elements breathe) ---
const TIMELINE = {
  NAME_CHAR_STAGGER: 0.035,
  NAME_CHAR_DURATION: 0.85,
  MONOLOGUE_START: 0.6,
  MONOLOGUE_WORD_STAGGER: 0.022,
  BG_PARAGRAPH_START: 1.6,
  BG_WORD_STAGGER: 0.02,
  SKILLS_START: 2.0,
  SKILLS_ITEM_STAGGER: 0.06,
  GATEWAY_START: 2.8,
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

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const nameText = "Cherif Bouabdallah";

  return (
    <div className="w-full min-h-screen flex flex-col pt-24 md:pt-32 pb-8 px-6 md:px-16 lg:px-24 xl:px-32 relative bg-[#223D27] text-[#F6F0DF] select-text selection:bg-[#F6F0DF] selection:text-[#223D27]">

      <div className="flex-1 flex flex-col w-full mx-auto max-w-7xl">

        {/* Desktop Layout – A rhythmic, architectural composition */}
        <div className="hidden md:flex flex-col gap-16 w-full">

          {/* 1. Name as a statement — full‑width, precise reveal */}
          <h1 className="font-maghfirea text-[clamp(3.5rem,10vw,140px)] text-[#F6F0DF] leading-[0.9] tracking-[-0.02em] text-left w-full overflow-visible select-none">
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
                            initial={{ opacity: 0, y: 30 }}
                            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{
                              duration: TIMELINE.NAME_CHAR_DURATION,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * TIMELINE.NAME_CHAR_STAGGER,
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

          {/* 2. Content – asymmetric two‑column body */}
          <div className="grid grid-cols-12 gap-x-12 gap-y-16">

            {/* Left: narrative */}
            <div className="col-span-7 flex flex-col gap-10">
              {/* Monologue */}
              <motion.div
                variants={monologueContainerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
                className="text-[16px] md:text-[19px] leading-relaxed text-[#F6F0DF]/90 font-medium"
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
                variants={bgContainerVariants}
                initial="hidden"
                animate={isReady ? "visible" : "hidden"}
                className="text-[14px] md:text-[16px] leading-relaxed text-[#F6F0DF]/50"
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

            {/* Right: capabilities + gateway */}
            <div className="col-span-5 flex flex-col gap-12 border-l border-[#F6F0DF]/10 pl-10">
              {/* Core Stack */}
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                  01 / Core Stack
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-[#F6F0DF]/10 pb-2">
                      LANGUAGES
                    </div>
                    <div className="flex flex-col gap-3">
                      {codeLanguages.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -5 }}
                          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                          transition={{
                            duration: 0.5,
                            delay: TIMELINE.SKILLS_START + index * TIMELINE.SKILLS_ITEM_STAGGER,
                            ease: [0.25, 1, 0.5, 1]
                          }}
                          className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[11px] hover:text-[#F6F0DF] transition-colors cursor-default"
                        >
                          <span className="opacity-60">{skill.logo}</span> {skill.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-40 mb-4 select-none border-b border-[#F6F0DF]/10 pb-2">
                      SKILLS
                    </div>
                    <div className="flex flex-col gap-3">
                      {designSkills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -5 }}
                          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                          transition={{
                            duration: 0.5,
                            delay: TIMELINE.SKILLS_START + 0.15 + index * TIMELINE.SKILLS_ITEM_STAGGER,
                            ease: [0.25, 1, 0.5, 1]
                          }}
                          className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[11px] hover:text-[#F6F0DF] transition-colors cursor-default"
                        >
                          <span className="opacity-60">{skill.logo}</span> {skill.name}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gateway */}
              <div>
                <div className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 mb-6 select-none">
                  02 / Gateway
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
                    <div
                      onClick={() => navigate("/contact")}
                      id="desktop-gateway-contact"
                      className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500"
                    >
                      <span className="font-mono text-[12px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">
                        CONTACT
                      </span>
                      <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                        →
                      </span>
                    </div>
                    <div
                      onClick={() => navigate("/portfolio")}
                      id="desktop-gateway-portfolio"
                      className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500"
                    >
                      <span className="font-mono text-[12px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">
                        PORTFOLIO
                      </span>
                      <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                        →
                      </span>
                    </div>
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
                            initial={{ opacity: 0, y: 30 }}
                            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{
                              duration: TIMELINE.NAME_CHAR_DURATION,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * TIMELINE.NAME_CHAR_STAGGER,
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
          <motion.div
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

          {/* Core Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="w-full text-left"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
              01 / Core Stack
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-[#F6F0DF]/10 pb-2">
                  LANGUAGES
                </div>
                <div className="flex flex-col gap-3">
                  {codeLanguages.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[10px] hover:text-[#F6F0DF] transition-colors cursor-default"
                    >
                      <span className="opacity-60">{skill.logo}</span> {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-[#F6F0DF]/10 pb-2">
                  SKILLS
                </div>
                <div className="flex flex-col gap-3">
                  {designSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[10px] hover:text-[#F6F0DF] transition-colors cursor-default"
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
              02 / Gateway
            </div>
            <div className="flex flex-col gap-0 py-2">
              <div
                onClick={() => navigate("/contact")}
                id="mobile-gateway-contact"
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500"
              >
                <span className="font-mono text-[11px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">
                  CONTACT
                </span>
                <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </div>
              <div
                onClick={() => navigate("/portfolio")}
                id="mobile-gateway-portfolio"
                className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500"
              >
                <span className="font-mono text-[11px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">
                  PORTFOLIO
                </span>
                <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">
                  →
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer className="w-full text-center text-[#F6F0DF]/30 mt-auto pt-8 z-10" />
    </div>
  );
}