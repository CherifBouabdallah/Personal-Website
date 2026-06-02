/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Experimental from "./pages/Experimental";
import Dev from "./pages/Dev";
import LiquidNavbar from "./components/LiquidNavbar";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isSiteReady = fontsLoaded && imageLoaded;
  const location = useLocation();

  useEffect(() => {
    // Fonts load check
    document.fonts.ready.then(() => setFontsLoaded(true));

    // Preload heavy images sitewide to prevent navigation and animation lag
    const imagesToPreload = ["/IMG_2656.JPEG", "/OG2.PNG"];
    let loadedCount = 0;

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          setImageLoaded(true);
        }
      };
      img.onload = handleLoad;
      img.onerror = handleLoad; // Fallback to avoid blocking if image path fails
    });
  }, []);

  const isScrollable = location.pathname === "/exp" || location.pathname === "/about" || location.pathname === "/dev";

  return (
    <div className={`relative flex min-h-screen bg-[#223D27] ${isScrollable ? "overflow-y-auto no-scrollbar overscroll-y-none items-stretch justify-stretch" : "items-center justify-center overflow-hidden"}`}>
      <AnimatePresence mode="wait">
        {!isSiteReady && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 w-full h-full bg-[#223D27] z-[999] flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono text-xs md:text-sm tracking-[0.45em] uppercase text-[#F6F0DF]/80 text-center px-4"
            >
              CHÉRIF BOUABDALLAH
            </motion.div>
            <div className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase text-[#F6F0DF]/30 text-center px-4">
              Loading creative systems...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSiteReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full min-h-screen relative ${isScrollable ? "flex flex-col items-stretch justify-start" : "flex items-center justify-center"}`}
        >
          {/* Liquid Navbar at top middle */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
            {location.pathname === "/" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  to="/exp"
                  className="px-4 py-1.5 border border-[#F6F0DF]/15 rounded-full bg-black/25 backdrop-blur-md text-[#F6F0DF]/70 hover:text-[#F6F0DF] hover:border-[#F6F0DF]/40 hover:bg-white/5 transition-all duration-300 font-mono text-[9px] tracking-widest uppercase font-bold cursor-pointer whitespace-nowrap shadow-md"
                >
                  EXP
                </Link>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <LiquidNavbar />
            </motion.div>
            {location.pathname === "/" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  to="/dev"
                  className="px-4 py-1.5 border border-[#F6F0DF]/15 rounded-full bg-black/25 backdrop-blur-md text-[#F6F0DF]/70 hover:text-[#F6F0DF] hover:border-[#F6F0DF]/40 hover:bg-white/5 transition-all duration-300 font-mono text-[9px] tracking-widest uppercase font-bold cursor-pointer whitespace-nowrap shadow-md"
                >
                  DEV
                </Link>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/exp" element={<Experimental />} />
            <Route path="/dev" element={<Dev />} />
          </Routes>
        </motion.div>
      )}
    </div>
  );
}
