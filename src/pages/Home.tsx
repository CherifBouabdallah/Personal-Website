import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const text = "Cherif Bouabdallah";

  return (
    <h1
      /* 
        ADJUST FONT SIZE HERE:
        - text-[clamp(1.5rem,8vw,120px)] makes the text smaller.
        - Format: clamp(MIN_SIZE, RESPONSIVE_SIZE, MAX_SIZE)
        
        ADJUST HEIGHT (VERTICAL POSITION) HERE:
        - relative -translate-y-20 moves the text higher up.
        - You can increase/decrease this (e.g., -translate-y-12, -translate-y-24, or custom value -translate-y-[100px])
      */
      className="font-maghfirea text-[clamp(1.5rem,8vw,120px)] text-[#F6F0DF] whitespace-nowrap flex justify-center selection:bg-[#F6F0DF] selection:text-[#386641] relative -translate-y-75"
    >
      {text.split("").map((char, index) => (
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
  );
}
