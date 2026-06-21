import { motion, HTMLMotionProps } from "framer-motion";

interface FooterProps extends HTMLMotionProps<"footer"> {
  className?: string;
}

export default function Footer({ className = "", ...props }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className={`font-mono text-[9px] tracking-[0.2em] select-none ${className}`}
      {...props}
    >
      © {year} CHERIF BOUABDALLAH
    </motion.footer>
  );
}
