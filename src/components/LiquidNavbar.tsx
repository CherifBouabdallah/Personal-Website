import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const PATHS = ["/", "/portfolio", "/contact"];

interface LiquidNavbarProps {
  className?: string;
}

export default function LiquidNavbar({ className = "" }: LiquidNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Find the active index
  const activeIndex = PATHS.indexOf(location.pathname);

  // Refs for tracking coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [coords, setCoords] = useState<{ left: number; width: number } | null>(null);

  // Transition settings based on reduced motion preferences
  const transition = shouldReduceMotion
    ? { type: "tween" as const, duration: 0 }
    : { type: "spring" as const, duration: 0.38, bounce: 0 };

  useEffect(() => {
    const updateCoords = () => {
      if (activeIndex !== -1) {
        const activeEl = linkRefs.current[activeIndex];
        if (activeEl) {
          setCoords({
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
          });
        }
      } else {
        setCoords(null);
      }
    };

    // Calculate initial coordinates
    updateCoords();

    // Event listener for viewport resizing
    window.addEventListener("resize", updateCoords);

    // ResizeObserver to track layouts, e.g. when fonts load or items shift
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateCoords();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateCoords);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [activeIndex]);

  // Click handler for menu items
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className={`relative flex items-center select-none ${className}`}>
      {/* Editorial Underline Navbar */}
      <div
        ref={containerRef}
        className="flex items-center gap-10 md:gap-16 relative py-3 px-6 border-b border-theme-text/10"
      >
        {PATHS.map((path, index) => {
          let label = "Home";
          if (path === "/portfolio") label = "Portfolio";
          if (path === "/contact") label = "Contact";

          const active = location.pathname === path;
          return (
            <a
              key={path}
              href={path}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onClick={(e) => handleNavClick(path, e)}
              className={`relative font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 py-1.5 cursor-pointer decoration-none inline-flex flex-col items-center justify-center ${
                active ? "text-theme-text font-bold" : "text-theme-text/55 hover:text-theme-text/90"
              }`}
              data-text={label}
            >
              {label}
            </a>
          );
        })}

        {coords && (
          <motion.div
            className="absolute bottom-3 h-[1.5px] bg-theme-text"
            animate={{
              left: coords.left,
              width: coords.width,
            }}
            transition={transition}
          />
        )}
      </div>
    </div>
  );
}
