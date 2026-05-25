import { motion, Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";



// Elegant self-drawing border divider rule
function SelfDrawingLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-[1px] bg-[#F6F0DF]/10 overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[#F6F0DF]/30 origin-left"
      />
    </div>
  );
}

export default function Experimental() {
  const [isReady, setIsReady] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsReady(true);

    // Apply no-scrollbar to HTML and Body to hide vertical scrollbars globally on PC/Desktop
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");

    const scrollContainer = document.querySelector(".overflow-y-auto") as HTMLElement | null;
    let rafId: number;
    let lastScrollTop = -1;

    const handleScroll = () => {
      // Robust calculation capturing scroll position regardless of whether viewport (window) or container scrolls
      const scrollTop = Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        scrollContainer ? scrollContainer.scrollTop : 0
      );

      if (scrollTop !== lastScrollTop) {
        lastScrollTop = scrollTop;
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${-scrollTop * 0.15}px) scale(1.15)`;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    // Using capture phase intercepts scroll events bubbling up from any child (like the .overflow-y-auto container)
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    
    // Set initial position
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll, { capture: true });
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const titleText = "Cherif Bouabdallah";

  const skillsList = [
    "React & Next.js",
    "TypeScript & Node.js",
    "Framer Motion & GSAP",
    "Tailwind CSS & Vanilla CSS",
    "Creative Web Design",
    "Performance Optimization",
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "Email", url: "mailto:hello@example.com" },
  ];

  // Micro-interaction entry animation variants
  const elementVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (delayIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 1, 0.36, 1] as [number, number, number, number],
        delay: delayIndex * 0.12,
      },
    }),
  };

  // Leica-style blur-reveal for paragraphs
  const blurRevealVariants: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.4,
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#386641] text-[#F6F0DF] relative overflow-hidden">
      {/* Background Artwork Image */}
      <div 
        ref={bgRef}
        className="fixed inset-0 w-full h-screen pointer-events-none select-none z-0 overflow-hidden transition-opacity duration-300"
        style={{ 
          opacity: 0.12,
          transform: "translateY(0px) scale(1.15)",
          transformOrigin: "center top",
          willChange: "transform"
        }}
      >
        <img 
          src="/Untitled_Artwork.png" 
          alt="Background Artwork" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* ========================================== */}
      {/* HOMEPAGE CORE CONTENT                      */}
      {/* ========================================== */}
      {isReady && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full min-h-screen px-6 md:px-16 lg:px-24 xl:px-36 pb-32 flex flex-col items-center overflow-x-hidden selection:bg-[#F6F0DF] selection:text-[#386641]"
          style={{
            paddingTop: window.innerWidth < 768 
              ? "150px" 
              : "max(320px, calc(50vh - clamp(1.5rem, 8vw, 120px) / 2))"
          }}
        >
          {/* Main Core Layout (Stretches full width, borderless Apple-style) */}
          <div className="w-full max-w-none flex flex-col gap-16 md:gap-28 z-10">

            {/* ========================================== */}
            {/* SECTION 1: HERO & 3-COLUMN FULL-WIDTH GRID */}
            {/* ========================================== */}
            <div className="flex flex-col gap-12 md:gap-20">

              {/* Apple-style animated responsive title */}
              <h1 className="font-maghfirea text-[clamp(2.8rem,9vw,120px)] text-[#F6F0DF] flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] relative translate-y-0 md:-translate-y-48">
                {titleText.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = wordIndex * 7 + charIndex;
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
                              delay: globalIndex * 0.05,
                            }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>

              {/* 3-Column Minimal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-16 items-start mt-8 md:-mt-48">

                {/* Column 1: Portrait Frame with simple border (no animations) */}
                <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-stretch w-full max-w-[280px] md:max-w-none mx-auto aspect-[4/5] md:aspect-auto min-h-[350px] lg:min-h-[420px]">
                  <div className="w-full h-full border border-[#F6F0DF] overflow-hidden bg-white/5 relative select-none">
                    <img
                      src="/IMG_2656.JPEG"
                      alt="Portrait of Cherif Bouabdallah"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Column 2: Biography Text Block with Blur Reveal */}
                <motion.div
                  custom={2}
                  initial="hidden"
                  animate={isReady ? "visible" : "hidden"}
                  variants={elementVariants}
                  className="col-span-1 md:col-span-5 flex flex-col justify-start text-center md:text-left select-text"
                >
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none">
                    01 / Biography
                  </div>
                  <motion.p
                    variants={blurRevealVariants}
                    className="text-base md:text-lg lg:text-xl leading-relaxed text-[#F6F0DF]/80 font-normal"
                  >
                    I am a designer and full-stack software engineer who focuses on bridging the gap between aesthetics and clean code. I build performant front-ends and interactive experiences that are highly responsive and structured. Driven by curiosity, I aim to craft memorable digital products that look beautiful and feel extremely premium.
                  </motion.p>
                </motion.div>

                {/* Column 3: Skills List with Hover-Light Rules */}
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate={isReady ? "visible" : "hidden"}
                  variants={elementVariants}
                  className="col-span-1 md:col-span-3 flex flex-col justify-start select-text glass-square p-6 md:p-8"
                >
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none text-center md:text-left">
                    02 / Expertise
                  </div>
                  <ul className="space-y-1 font-mono text-xs md:text-sm text-[#F6F0DF]/90 text-left">
                    {skillsList.map((skill, index) => (
                      <motion.li
                        key={skill}
                        whileHover="hover"
                        initial="initial"
                        className="relative flex items-center justify-between py-3 border-b border-[#F6F0DF]/10 cursor-default group"
                      >
                        <div className="flex items-center gap-3">
                          <motion.span
                            variants={{
                              initial: { scale: 1, backgroundColor: "rgba(246, 240, 223, 0.4)" },
                              hover: { scale: 1.4, backgroundColor: "rgba(246, 240, 223, 1)" }
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                          />
                          <span className="transition-colors duration-300 group-hover:text-white">
                            {skill}
                          </span>
                        </div>

                        {/* Self-drawing line beneath on hover */}
                        <motion.div
                          variants={{
                            initial: { scaleX: 0 },
                            hover: { scaleX: 1 }
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F6F0DF]/40 origin-left"
                        />
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

              </div>
            </div>

            {/* Self-Drawing Line Divider */}
            <SelfDrawingLine className="mt-4 md:mt-8" />

            {/* ========================================== */}
            {/* SECTION 2: 2-COLUMN FULL-WIDTH GRID        */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

              {/* Column 1: Social Links with Underline Roll Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                className="col-span-1 md:col-span-4 flex flex-col justify-start"
              >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none text-center md:text-left">
                  03 / Connect
                </div>
                <div className="flex flex-col gap-1 font-mono text-sm">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover="hover"
                      initial="initial"
                      className="group relative flex items-center justify-between py-3 border-b border-[#F6F0DF]/10 cursor-pointer"
                    >
                      <span className="relative overflow-hidden inline-block">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                          {social.name}
                        </span>
                        <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 font-bold">
                          {social.name}
                        </span>
                      </span>
                      <span className="text-xs transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 opacity-50 group-hover:opacity-100">
                        ↗
                      </span>

                      {/* Underline expanding from center */}
                      <motion.div
                        variants={{
                          initial: { scaleX: 0 },
                          hover: { scaleX: 1 }
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F6F0DF]/60 origin-center"
                      />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Column 2: Studies & Hobbies Details with Blur Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1], delay: 0.1 }}
                className="col-span-1 md:col-span-8 flex flex-col justify-start select-text text-center md:text-left"
              >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none">
                  04 / Background
                </div>
                <motion.div
                  variants={blurRevealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="space-y-6 text-base md:text-lg lg:text-xl leading-relaxed text-[#F6F0DF]/80 font-normal"
                >
                  <p>
                    Currently pursuing software engineering at <span className="text-[#F6F0DF] font-semibold underline decoration-[#F6F0DF]/30 underline-offset-4">EPFL</span> (École Polytechnique Fédérale de Lausanne), focusing on distributed architectures, interactive computer graphics, and engineering clean web environments.
                  </p>
                  <p>
                    When I am not coding, you will find me playing competitive <span className="text-[#F6F0DF] font-semibold">Volleyball</span>, designing high-fidelity layouts, or studying new patterns in digital systems. I enjoy creating seamless interactions and testing fluid web interfaces.
                  </p>
                </motion.div>
              </motion.div>

            </div>

          </div>

          {/* ========================================== */}
          {/* MINIMAL FOOTER                             */}
          {/* ========================================== */}
          <footer className="mt-32 w-full pt-8 border-t border-[#F6F0DF]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6F0DF]/40 gap-4 z-10 select-none text-center sm:text-left">
            <div>
              🔬 Simple Luxury Experimental Sandbox — EPFL Edition
            </div>
            <div className="font-mono text-[10px] break-all">
              To delete: remove <code className="text-[#F6F0DF]/60 bg-white/5 px-1 py-0.5 rounded">src/pages/Experimental.tsx</code> & route in <code className="text-[#F6F0DF]/60 bg-white/5 px-1 py-0.5 rounded">src/App.tsx</code>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
