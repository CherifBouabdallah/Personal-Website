/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const isAbout = location.pathname === "/about";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F6F0DF] overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-8 right-8 flex gap-8 z-10"
      >
        <Link
          to="/"
          className={`font-maghfirea text-xl tracking-wider transition-all duration-300 relative group ${!isAbout ? "text-[#6A994E]" : "text-[#6A994E]/50 hover:text-[#6A994E]"
            }`}
        >
          Hello
          <span
            className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#6A994E] origin-left transition-transform duration-300 ${!isAbout ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
          />
        </Link>
        <Link
          to="/about"
          className={`font-maghfirea text-xl tracking-wider transition-all duration-300 relative group ${isAbout ? "text-[#6A994E]" : "text-[#6A994E]/50 hover:text-[#6A994E]"
            }`}
        >
          About
          <span
            className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#6A994E] origin-left transition-transform duration-300 ${isAbout ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
          />
        </Link>
      </motion.nav>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

