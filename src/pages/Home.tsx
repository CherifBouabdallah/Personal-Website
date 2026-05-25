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
      className="font-maghfirea text-[clamp(1.8rem,8vw,120px)] text-[#F6F0DF] flex flex-wrap justify-center gap-x-[0.25em] text-center leading-[0.95] relative -translate-y-12 md:-translate-y-35 px-4 select-none w-full"
    >
      {text.split(" ").map((word, wordIndex) => (
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
  );
}
