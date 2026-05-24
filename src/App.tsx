/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import About from "./pages/About";
import LiquidNavbar from "./components/LiquidNavbar";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#386641] overflow-hidden">
      {/* Liquid Navbar at top middle */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <LiquidNavbar />
        </motion.div>
      </div>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

