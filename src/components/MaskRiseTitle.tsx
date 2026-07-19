import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_ENTER, useMotionPrefs } from "../lib/motion";

interface MaskRiseTitleProps {
  text: string;
  isReady: boolean;
  className?: string;
}

export function MaskRiseTitle({ text, isReady, className = "" }: MaskRiseTitleProps) {
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { reduced, transition } = useMotionPrefs();

  useEffect(() => {
    if (!isReady || hasBeenInView) return;
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isReady, hasBeenInView]);

  const shouldAnimate = isReady && hasBeenInView;

  return (
    <h1 ref={titleRef} className={`overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={reduced ? false : { y: "110%" }}
        animate={reduced ? { opacity: 1 } : shouldAnimate ? { y: "0%" } : { y: "110%" }}
        transition={transition({ duration: 1.0, ease: EASE_ENTER })}
      >
        {text}
      </motion.span>
    </h1>
  );
}
