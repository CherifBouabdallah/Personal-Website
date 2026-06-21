/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const headingText = "404";
  const subText = "Not Found";

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative bg-[#223D27] text-[#F6F0DF] overflow-hidden select-none px-6">
      

      {/* Main Content Card */}
      <div className="max-w-2xl text-center z-10 flex flex-col items-center justify-center gap-8">
        
        {/* Massive Staggered 404 Heading */}
        <div className="relative">
          <h1 className="font-maghfirea text-[clamp(6rem,18vw,260px)] text-[#F6F0DF] leading-[0.8] select-none flex justify-center gap-x-[0.05em]">
            {(() => {
              let charCounter = 0;
              return headingText.split("").map((char, charIndex) => {
                const globalIndex = charCounter++;
                return (
                  <span key={charIndex} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: 150, filter: "blur(12px)" }}
                      animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 150, filter: "blur(12px)" }}
                      transition={{
                        opacity: { duration: 1.0, delay: globalIndex * 0.08 },
                        y: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: globalIndex * 0.08 },
                        filter: { duration: 0.8, delay: globalIndex * 0.08 }
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              });
            })()}
          </h1>
          

        </div>

        {/* Subtitle & Message Block */}
        <div className="space-y-4 max-w-md">
          {/* Subtext: "Not Found" */}
          <h2 className="overflow-hidden">
            <motion.span
              className="block font-serif italic text-2xl md:text-3xl text-[#DEDBC8]"
              initial={{ opacity: 0, y: 30 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              {subText}
            </motion.span>
          </h2>

          {/* Description including target path */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isReady ? { opacity: 0.65, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="font-mono text-[11px] sm:text-xs leading-relaxed text-[#F6F0DF] tracking-wide"
          >
            The page <code className="bg-black/20 px-2 py-0.5 rounded text-[#DEDBC8] text-[10px] sm:text-[11px] border border-white/5 font-semibold break-all">{location.pathname}</code> was not found on this server.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-4"
        >
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 px-8 py-3.5 bg-transparent border border-[#F6F0DF]/20 hover:border-[#F6F0DF]/60 text-[#F6F0DF] hover:bg-[#F6F0DF]/5 font-mono text-[10px] tracking-[0.25em] uppercase rounded-full transition-all duration-500 hover:scale-[1.02] cursor-pointer"
          >
            <Home size={12} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
            Return to Home Page
          </button>
        </motion.div>

      </div>



      {/* Footnote matching other pages */}
      <footer className="absolute bottom-8 font-mono text-[9px] tracking-[0.2em] opacity-35 select-none pointer-events-none">
        © {new Date().getFullYear()} CHERIF BOUABDALLAH
      </footer>

    </div>
  );
}