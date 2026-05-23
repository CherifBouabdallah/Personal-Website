/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function App() {
  const text = "Hello, World!";
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F0DF] overflow-hidden">
      <h1 className="font-maghfirea text-[clamp(2rem,12vw,200px)] text-[#6A994E] whitespace-nowrap flex justify-center selection:bg-[#6A994E] selection:text-[#F6F0DF]">
        {text.split("").map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
            style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <motion.span
              className="inline-block"
              // Ported from (1): Starts invisible and shifted down by 40px
              initial={{ opacity: 0, y: 40 }}
              animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.9, // animation-duration: 0.9s
                ease: [0.21, 1, 0.36, 1], // cubic-bezier(0.21, 1, 0.36, 1)
                delay: index * 0.05, // animation-delay steps of 0.08s per letter
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </h1>
    </div>
  );
}
