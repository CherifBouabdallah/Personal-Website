import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// SVG Logos for Core Stack
const JavaLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3M10 1v3M14 1v3" />
  </svg>
);

const PythonLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1V7a5 5 0 0 1 5-5h5z" />
    <path d="M12 22v-8a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v4a5 5 0 0 1-5 5h-5z" />
    <circle cx="5" cy="5" r="0.75" fill="currentColor" />
    <circle cx="19" cy="19" r="0.75" fill="currentColor" />
  </svg>
);

const RiscVLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="12" height="12" x="6" y="6" rx="2" />
    <path d="M9 6V2M15 6V2M9 22v-4M15 22v-4M6 9H2M6 15H2M22 9h-4M22 15h-4" />
  </svg>
);

const VerilogLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h3l3-8 4 16 3-10 2 2h3" />
  </svg>
);

const ArduinoLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-2.5-3.5-6-3.5-8-1.5s-2 5 0 7 5.5 2 8-1.5c2.5 3.5 6 3.5 8 1.5s2-5 0-7-5.5-2-8 1.5z" />
    <path d="M6 12h2M16 12h2M17 11v2" />
  </svg>
);

const LatexLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 15h4l-3-3 3-3H9" />
  </svg>
);

const BlenderLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M12 5.5V2M16.5 7.5L19.5 5M17.5 12h4" />
  </svg>
);

const PhotoshopLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h2.5a1.5 1.5 0 0 1 0 3H7v4M13.5 11c0-.5.5-1 1-1h.5a1 1 0 0 1 1 1c0 1-2 1-2 2a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1" />
  </svg>
);

const DesignLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912-1.275-1.275L12 3Z" />
  </svg>
);

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

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const text = "Cherif Bouabdallah";

  return (
    <div className="w-full min-h-screen flex flex-col pt-32 pb-8 px-6 md:px-16 lg:px-24 xl:px-32 relative bg-[#223D27] text-[#F6F0DF] overflow-y-auto select-text selection:bg-[#F6F0DF] selection:text-[#223D27]">
      
      {/* Main Grid Content Area */}
      <div className="flex-1 flex flex-col w-full mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start w-full">
          
          {/* Column 1 (Left): Portrait & Metadata */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-6 md:border-r md:border-[#F6F0DF]/10 md:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 1.0, delay: 0.7 }}
            >
              <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                01 / Portrait
              </div>
              <div className="w-4/5 md:w-full aspect-[4/5] max-h-[420px] border border-[#F6F0DF]/20 overflow-hidden bg-white/5 relative rounded-xl shadow-lg">
                <img
                  src="/IMG_2656.JPEG"
                  alt="Portrait of Cherif Bouabdallah"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 1.0, delay: 0.8 }}
            >
              <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                02 / Info
              </div>
              <div className="font-mono text-[10px] md:text-[12px] leading-relaxed text-[#F6F0DF]/50 space-y-2 border border-[#F6F0DF]/10 rounded-xl p-4 md:p-5 bg-black/10">
                <div><span className="text-[#F6F0DF] opacity-80 font-bold">CLIENT:</span> Cherif Bouabdallah</div>
                <div><span className="text-[#F6F0DF] opacity-80 font-bold">ROLE:</span> EPFL CS Engineer</div>
                <div><span className="text-[#F6F0DF] opacity-80 font-bold">GRID:</span> Modular Swiss 12-Col</div>
                <div><span className="text-[#F6F0DF] opacity-80 font-bold">LOC:</span> Lausanne, CH</div>
              </div>
            </motion.div>
          </div>

          {/* Column 2 (Center): Core Title & Monologue */}
          <div className="col-span-1 md:col-span-6 flex flex-col gap-8 md:gap-10 text-center md:text-left">
            {/* Unified Staggered Heading */}
            <h1 className="font-maghfirea text-[clamp(2.5rem,7vw,110px)] text-[#F6F0DF] flex flex-wrap justify-center md:justify-start gap-x-[0.25em] text-center leading-[0.95] selection:bg-[#F6F0DF] selection:text-[#223D27] px-4 md:px-0 w-full">
              {(() => {
                let charCounter = 0;
                return text.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = charCounter++;
                      return (
                        <span
                          key={charIndex}
                          className="inline-block overflow-hidden"
                          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                        >
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                            transition={{
                              duration: 1.0,
                              ease: [0.21, 1, 0.36, 1],
                              delay: globalIndex * 0.04,
                            }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                ));
              })()}
            </h1>

            <div className="space-y-6 md:space-y-8 text-left max-w-xl">
              {/* Monologue */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 1.0, delay: 0.5 }}
                className="text-[15px] md:text-[18px] leading-relaxed text-[#F6F0DF]/90 font-medium"
              >
                I am a designer and full-stack software engineer who focuses on bridging the gap between aesthetics and clean code. <span className="font-serif italic text-[#DEDBC8]">I build performant front-ends and interactive experiences that are highly responsive and structured.</span> Driven by curiosity, I aim to craft memorable digital products that look beautiful and feel extremely premium.
              </motion.div>

              {/* Background Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 1.0, delay: 0.6 }}
                className="text-[13px] md:text-[15px] leading-relaxed text-[#F6F0DF]/60"
              >
                Currently pursuing software engineering at EPFL (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.
              </motion.p>
            </div>
          </div>

          {/* Column 3 (Right): Capabilities & Gateway */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-8 md:border-l md:border-[#F6F0DF]/10 md:pl-8">
            <div>
              <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                03 / Core Stack
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-[#F6F0DF]/10 pb-2">LANGUAGES</div>
                  <div className="flex flex-col gap-3">
                    {codeLanguages.map((skill, index) => (
                      <motion.div key={skill.name} initial={{ opacity: 0, x: -10 }} animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.5, delay: 0.9 + index * 0.05 }} className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[10px] md:text-[11px] hover:text-[#F6F0DF] transition-colors cursor-default">
                        <span className="opacity-60">{skill.logo}</span> {skill.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40 mb-3 select-none border-b border-[#F6F0DF]/10 pb-2">SKILLS</div>
                  <div className="flex flex-col gap-3">
                    {designSkills.map((skill, index) => (
                      <motion.div key={skill.name} initial={{ opacity: 0, x: -10 }} animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ duration: 0.5, delay: 1.0 + index * 0.05 }} className="flex items-center gap-2 text-[#F6F0DF]/80 font-mono text-[10px] md:text-[11px] hover:text-[#F6F0DF] transition-colors cursor-default">
                        <span className="opacity-60">{skill.logo}</span> {skill.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase opacity-40 mb-4 select-none">
                04 / Gateway
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="flex flex-col gap-0 py-2">
                  <div onClick={() => navigate("/contact")} className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500">
                    <span className="font-mono text-[11px] md:text-[12px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">CONTACT</span>
                    <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">→</span>
                  </div>
                  <div onClick={() => navigate("/portfolio")} className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500">
                    <span className="font-mono text-[11px] md:text-[12px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">PORTFOLIO</span>
                    <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">→</span>
                  </div>
                  <div onClick={() => navigate("/about")} className="cursor-pointer group flex items-center gap-6 py-1.5 border-b border-transparent hover:border-[#F6F0DF]/10 transition-all duration-500">
                    <span className="font-mono text-[11px] md:text-[12px] tracking-[0.4em] text-[#F6F0DF]/60 group-hover:text-[#F6F0DF]/100 group-hover:translate-x-1 transition-all duration-500">ABOUT</span>
                    <span className="font-mono text-[10px] text-[#F6F0DF]/0 group-hover:text-[#F6F0DF]/40 transition-all duration-500 ml-auto -translate-x-4 group-hover:translate-x-0">→</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="w-full text-center font-mono text-[9px] tracking-[0.2em] text-[#F6F0DF]/30 select-none pt-4 border-t border-[#F6F0DF]/5 z-10">
        © {new Date().getFullYear()} CHERIF BOUABDALLAH
      </footer>
      
    </div>
  );
}
