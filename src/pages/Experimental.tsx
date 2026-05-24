import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

// Custom SVG component that generates organic, flowing topographic waves
// mimicking the marble/liquid pattern in the reference image.
// The waves are animated using slow independent keyframes and scroll naturally.
function TopographicBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden opacity-[0.06]">
      <svg
        className="w-full h-full min-w-[1440px] min-h-[900px]"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes flowLayer1 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(-1.5%, 1%) scale(1.01) rotate(0.3deg); }
            66% { transform: translate(1%, -1.5%) scale(0.99) rotate(-0.3deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes flowLayer2 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(1.5%, -1.5%) scale(0.98) rotate(-0.5deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          @keyframes flowLayer3 {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            33% { transform: translate(-1%, -1%) scale(1.01) rotate(0.4deg); }
            66% { transform: translate(1.5%, 1%) scale(0.99) rotate(-0.4deg); }
            100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          }
          .animate-flow-layer-1 {
            animation: flowLayer1 45s ease-in-out infinite;
            transform-origin: center;
          }
          .animate-flow-layer-2 {
            animation: flowLayer2 55s ease-in-out infinite;
            transform-origin: center;
          }
          .animate-flow-layer-3 {
            animation: flowLayer3 65s ease-in-out infinite;
            transform-origin: center;
          }
        `}</style>

        <g fill="none" stroke="#F6F0DF" strokeWidth="3" strokeLinecap="round">
          {/* Layer 1: Top-Left diagonal ripples */}
          <g className="animate-flow-layer-1">
            <path d="M-100,-100 Q150,100 400,200 T900,400 T1500,200" />
            <path d="M-100,-50 Q180,150 450,260 T970,450 T1590,230" />
            <path d="M-100,0 Q210,200 500,320 T1040,500 T1680,260" />
            <path d="M-100,50 Q240,250 550,380 T1110,550 T1770,290" />
            <path d="M-100,100 Q270,300 600,440 T1180,600 T1860,320" />
            <path d="M-100,150 Q300,350 650,500 T1250,650 T1950,350" />
          </g>

          {/* Layer 2: Center fluid swirling river */}
          <g className="animate-flow-layer-2">
            <path d="M-100,400 C300,250 500,750 900,600 S1300,300 2020,400" />
            <path d="M-100,460 C320,310 530,810 930,660 S1340,360 2020,460" />
            <path d="M-100,520 C340,370 560,870 960,720 S1380,420 2020,520" />
            <path d="M-100,580 C360,430 590,930 990,780 S1420,480 2020,580" />
            <path d="M-100,640 C380,490 620,990 1020,840 S1460,540 2020,640" />
          </g>

          {/* Layer 3: Bottom-Right loop clusters, left contour & top-right ridges */}
          <g className="animate-flow-layer-3">
            <path d="M1200,1180 C1100,1050 1150,850 1350,750 S1750,700 1850,900 S1650,1180 1350,1180" />
            <path d="M1250,1180 C1170,1080 1210,910 1370,820 S1700,780 1780,930 S1610,1180 1370,1180" />
            <path d="M1300,1180 C1240,1110 1270,970 1390,890 S1650,860 1710,960 S1570,1180 1390,1180" />
            <path d="M1350,1180 C1310,1140 1330,1030 1410,960 S1600,940 1640,990 S1530,1180 1410,1180" />
            <path d="M1400,1180 C1380,1160 1390,1090 1430,1030 S1550,1020 1570,1050 S1490,1180 1430,1180" />

            <path d="M-100,800 Q100,850 200,1000 T500,1180" />
            <path d="M-100,860 Q120,910 230,1060 T560,1180" />
            <path d="M-100,920 Q140,970 260,1120 T620,1180" />
            <path d="M-100,980 Q160,1030 290,1180" />

            <path d="M1100,-100 Q1300,100 1500,0 T2020,-100" />
            <path d="M1170,-100 Q1360,130 1570,20 T2020,-50" />
            <path d="M1240,-100 Q1420,160 1640,40 T2020,0" />
            <path d="M1310,-100 Q1480,190 1710,60 T2020,50" />
            <path d="M1380,-100 Q1540,220 1780,80 T2020,100" />
          </g>
        </g>
      </svg>
    </div>
  );
}

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

  useEffect(() => {
    setIsReady(true);
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
    <div className="w-full min-h-screen bg-[#386641] text-[#F6F0DF] relative">
      {/* ========================================== */}
      {/* HOMEPAGE CORE CONTENT                      */}
      {/* ========================================== */}
      {isReady && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen px-6 md:px-16 lg:px-24 xl:px-36 pb-32 flex flex-col items-center overflow-x-hidden selection:bg-[#F6F0DF] selection:text-[#386641]"
          style={{
            paddingTop: "max(380px, calc(50vh - clamp(1.5rem, 8vw, 120px) / 2))"
          }}
        >
          {/* Dynamic Topographic Marble Pattern */}
          <TopographicBackground />

          {/* Main Core Layout (Stretches full width, borderless Apple-style) */}
          <div className="w-full max-w-none flex flex-col gap-20 md:gap-28 z-10">

            {/* ========================================== */}
            {/* SECTION 1: HERO & 3-COLUMN FULL-WIDTH GRID */}
            {/* ========================================== */}
            <div className="flex flex-col gap-12 md:gap-20">

              {/* Apple-style animated minimal title */}
              <h1 className="font-maghfirea text-[clamp(1.5rem,8vw,120px)] text-[#F6F0DF] whitespace-nowrap flex justify-center selection:bg-[#F6F0DF] selection:text-[#386641] relative -translate-y-75">
                {titleText.split("").map((char, index) => (
                  <span
                    key={index}
                    className="inline-block overflow-hidden"
                    style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: 40 }}
                      animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                      transition={{
                        duration: 0.9,
                        ease: [0.21, 1, 0.36, 1],
                        delay: index * 0.05,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* 3-Column Minimal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start -mt-75">

                {/* Column 1: Portrait Frame with simple border (no animations) */}
                <div className="md:col-span-4 flex flex-col items-stretch aspect-[4/5] md:aspect-auto min-h-[350px] lg:min-h-[420px]">
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
                  className="md:col-span-5 flex flex-col justify-start select-text"
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
                  className="md:col-span-3 flex flex-col justify-start select-text"
                >
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none">
                    02 / Expertise
                  </div>
                  <ul className="space-y-1 font-mono text-xs md:text-sm text-[#F6F0DF]/90">
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
            <SelfDrawingLine className="mt-8" />

            {/* ========================================== */}
            {/* SECTION 2: 2-COLUMN FULL-WIDTH GRID        */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">

              {/* Column 1: Social Links with Underline Roll Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                className="md:col-span-4 flex flex-col justify-start"
              >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 mb-4 md:mb-6 select-none">
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
                className="md:col-span-8 flex flex-col justify-start select-text"
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
          <footer className="mt-32 w-full pt-8 border-t border-[#F6F0DF]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6F0DF]/40 gap-4 z-10 select-none">
            <div>
              🔬 Simple Luxury Experimental Sandbox — EPFL Edition
            </div>
            <div className="font-mono text-[10px]">
              To delete: remove <code className="text-[#F6F0DF]/60 bg-white/5 px-1 py-0.5 rounded">src/pages/Experimental.tsx</code> & route in <code className="text-[#F6F0DF]/60 bg-white/5 px-1 py-0.5 rounded">src/App.tsx</code>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
