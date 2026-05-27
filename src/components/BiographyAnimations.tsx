import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface Segment {
  text: string;
  className: string;
}

export interface WordsProps {
  segments: Segment[];
  containerClassName?: string;
}

// Option 1: Words Pull-Up (The cinema-style word masking pull-up provided by the user)
export const WordsPullUp: React.FC<WordsProps> = ({ segments, containerClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const allWords = segments.flatMap((segment) =>
    segment.text.split(" ").filter(w => w !== "").map(word => ({
      word,
      className: segment.className
    }))
  );

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap justify-center md:justify-start ${containerClassName}`}>
      {allWords.map((item, index) => (
        /* The container block acts as the clipping mask */
        <span key={index} className="inline-block overflow-hidden relative mr-[0.25em] last:mr-0 py-[0.05em]">
          <motion.span
            className={`inline-block ${item.className}`}
            initial={{ y: "120%" }}
            animate={isInView ? { y: 0 } : { y: "120%" }}
            transition={{
              duration: 0.8,
              delay: index * 0.06, // Stagger offset between successive words
              ease: [0.16, 1, 0.3, 1] // Custom cinema-style cubic-bezier ease-out
            }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

// Option 2: Editorial Words Blur & Fade (Soft, premium fade-in with focus blur)
export const WordsBlurFade: React.FC<WordsProps> = ({ segments, containerClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const allWords = segments.flatMap((segment) =>
    segment.text.split(" ").filter(w => w !== "").map(word => ({
      word,
      className: segment.className
    }))
  );

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap justify-center md:justify-start ${containerClassName}`}>
      {allWords.map((item, index) => (
        <span key={index} className="inline-block mr-[0.25em] last:mr-0 py-[0.05em]">
          <motion.span
            className={`inline-block ${item.className}`}
            initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
            animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(6px)", y: 6 }}
            transition={{
              duration: 0.8,
              delay: index * 0.03, // Snappy but extremely soft cascade
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

// Option 3: Segment Cascade (Calm, structured slide & fade for entire semantic clauses/sentences)
export const SegmentCascade: React.FC<WordsProps> = ({ segments, containerClassName = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div ref={containerRef} className={`flex flex-col gap-3 justify-center md:justify-start ${containerClassName}`}>
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          className={`inline-block ${segment.className}`}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 12, filter: "blur(4px)" }}
          transition={{
            duration: 1.2,
            delay: index * 0.22, // Staggered delays for a slow-paced, luxury editorial feel
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {segment.text}
        </motion.span>
      ))}
    </div>
  );
};
