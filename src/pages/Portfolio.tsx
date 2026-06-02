import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Portfolio() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const text = "Portfolio";

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden select-none">
      <h1 className="font-maghfirea text-[clamp(2.5rem,12vw,200px)] text-[#F6F0DF] whitespace-nowrap flex justify-center selection:bg-[#F6F0DF] selection:text-[#223D27] px-4 w-full">
        {text.split("").map((char, index) => (
          <span
            key={index}
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
                delay: index * 0.05,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Copyright Footer */}
      <footer className="absolute bottom-8 font-mono text-[9px] tracking-[0.2em] text-[#F6F0DF]/40 pointer-events-none select-none z-10">
        © {new Date().getFullYear()} CHERIF BOUABDALLAH
      </footer>
    </div>
  );
}
