import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionPrefs } from "../lib/motion";

/**
 * Print-inspired page furniture — registration crosses, margin folios, and a
 * rotated running head. Purely decorative (aria-hidden), so it never
 * competes with the real document outline.
 */

export function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`w-3 h-3 opacity-30 pointer-events-none select-none ${className}`}
    >
      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Folio({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[9px] tracking-[0.25em] uppercase opacity-40 select-none pointer-events-none ${className}`}>
      {children}
    </span>
  );
}

export function RunningHead({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      className={`running-head font-mono text-[9px] tracking-[0.25em] uppercase opacity-30 select-none pointer-events-none whitespace-nowrap ${className}`}
    >
      {text}
    </span>
  );
}

/**
 * The four corner registration marks, left/right folios, and a side-rail
 * running head, laid over a `relative`-positioned section. Desktop only —
 * on mobile the margin doesn't exist, so the marks would just crowd content.
 * The running head drifts gently against scroll progress for a subtle
 * layered-page depth cue.
 */
export function BroadsheetFrame({
  folioLeft,
  folioRight,
  runningHead,
}: {
  folioLeft: string;
  folioRight: string;
  runningHead: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-28, 28]);

  return (
    <div ref={sectionRef} aria-hidden className="absolute inset-0 pointer-events-none select-none hidden md:block z-20">
      <RegistrationMark className="absolute top-6 left-6" />
      <RegistrationMark className="absolute top-6 right-6" />
      <RegistrationMark className="absolute bottom-6 left-6" />
      <RegistrationMark className="absolute bottom-6 right-6" />
      <Folio className="absolute top-6 left-14">{folioLeft}</Folio>
      <Folio className="absolute top-6 right-14">{folioRight}</Folio>
      <motion.div className="absolute top-1/2 right-3 -translate-y-1/2" style={{ y }}>
        <RunningHead text={runningHead} />
      </motion.div>
    </div>
  );
}
