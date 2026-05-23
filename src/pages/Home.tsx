import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setIsReady(true));
  }, []);

  const text = "Hello, World!";

  return (
    <h1 className="font-maghfirea text-[clamp(2rem,12vw,200px)] text-[#6A994E] whitespace-nowrap flex justify-center selection:bg-[#6A994E] selection:text-[#F6F0DF]">
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
