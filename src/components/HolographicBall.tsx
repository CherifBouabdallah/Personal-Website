"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

interface HolographicBallProps {
  className?: string;
  themeColor?: string; // Hex color for the wireframe (e.g. luxury blue `#12224A`)
  isLightMode?: boolean;
  isPreview?: boolean;
  isCardPreview?: boolean;
}

export default function HolographicBall({
  className = "",
  themeColor = "#12224A",
  isLightMode = true,
  isPreview = false,
  isCardPreview = false,
}: HolographicBallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsiveness tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse tracking state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 120 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Mouse pointer drift translation offsets
  const driftX = useTransform(mouseXSpring, [-1, 1], [-12, 12]);
  const driftY = useTransform(mouseYSpring, [-1, 1], [-12, 12]);

  // Mouse 3D rotation transforms
  const rotateX = useTransform(mouseYSpring, [-1, 1], [25, -25]);
  const rotateY = useTransform(mouseXSpring, [-1, 1], [-25, 25]);

  const scaleVal = isCardPreview ? 0.75 : (isMobile ? 0.95 : 1.25);

  return (
    <div ref={containerRef} className={`w-full h-full relative select-none flex items-center justify-center ${className}`}>
      {/* Central blur radial light glow */}
      <motion.div
        style={{
          width: 320,
          height: 320,
          x: driftX,
          y: driftY,
          scale: scaleVal,
          background: `radial-gradient(circle, ${themeColor}15 0%, transparent 70%)`,
        }}
        className="absolute pointer-events-none z-0"
      />

      {/* Main interactive orbital system */}
      <motion.div
        style={{
          x: driftX,
          y: driftY,
          scale: scaleVal,
          rotateX: rotateX,
          rotateY: rotateY,
          perspective: 1000,
        }}
        className="relative w-full h-full max-w-[280px] max-h-[280px] md:max-w-[340px] md:max-h-[340px] aspect-square flex items-center justify-center z-10"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Outer Ring 1 - Dashed blueprint ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={themeColor}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="2 6"
            opacity="0.30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Outer Ring 2 - Solid fine ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={themeColor}
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
            opacity="0.18"
          />

          {/* Diagonal crosshairs to add technical tactical look */}
          <line x1="15" y1="50" x2="85" y2="50" stroke={themeColor} strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.12" strokeDasharray="2 2" />
          <line x1="50" y1="15" x2="50" y2="85" stroke={themeColor} strokeWidth="0.5" vectorEffect="non-scaling-stroke" opacity="0.12" strokeDasharray="2 2" />

          {/* Ring 3 - Dynamic orbital ellipse 1 */}
          <motion.ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="18"
            fill="none"
            stroke={themeColor}
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            opacity="0.45"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Ring 4 - Dynamic orbital ellipse 2 (orthogonal) */}
          <motion.ellipse
            cx="50"
            cy="50"
            rx="18"
            ry="35"
            fill="none"
            stroke={themeColor}
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            opacity="0.35"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Inner Core Ring */}
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="none"
            stroke={themeColor}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />

          {/* Core Solid point */}
          <motion.circle
            cx="50"
            cy="50"
            r="2"
            fill={themeColor}
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Tiny orbiting nodes (satellites) */}
          <motion.circle
            cx="50"
            cy="50"
            r="1"
            fill={themeColor}
            style={{ transformOrigin: "50px 50px" }}
            animate={{
              rotate: 360,
              x: [0, 5, 0], // floating offset
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          <motion.circle
            cx="50"
            cy="50"
            r="0.7"
            fill={themeColor}
            style={{ transformOrigin: "50px 50px" }}
            animate={{
              rotate: -360,
              y: [0, -4, 0],
            }}
            transition={{
              rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
