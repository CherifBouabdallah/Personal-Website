import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SPRING_NAV, TWEEN_INSTANT, useMotionPrefs } from "../lib/motion";

const SECTIONS = ["home", "portfolio", "contact"];

interface LiquidNavbarProps {
  className?: string;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function LiquidNavbar({ className = "", activeSection = "home", setActiveSection }: LiquidNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { reduced } = useMotionPrefs();

  // Find the active index
  const activeIndex = SECTIONS.indexOf(activeSection);

  // Refs for tracking coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [coords, setCoords] = useState<{ left: number; width: number } | null>(null);

  // Whether the navbar is currently sitting over the Portfolio section's
  // cream background (it's the one inverted "negative" section — cream bg,
  // dark text). Tracked from real on-screen geometry, not the coarser
  // activeSection scroll-spy (which fires at 35% viewport and lags well
  // behind the moment the cream background actually reaches the fixed
  // navbar near the top of the screen).
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    let ticking = false;

    const checkBackground = () => {
      ticking = false;
      const nav = containerRef.current;
      const portfolioEl = document.getElementById("portfolio");
      if (!nav || !portfolioEl) {
        setOnLight(false);
        return;
      }
      const navMid = nav.getBoundingClientRect().top + nav.getBoundingClientRect().height / 2;
      const pRect = portfolioEl.getBoundingClientRect();
      setOnLight(navMid >= pRect.top && navMid <= pRect.bottom);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkBackground);
    };

    checkBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location.pathname]);

  // Transition settings based on reduced motion preferences
  const transition = reduced ? TWEEN_INSTANT : SPRING_NAV;

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
  const handleNavClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault();
    const cleanPath = section === "home" ? "/" : `/${section}`;
    if (location.pathname !== "/" && location.pathname !== "/portfolio" && location.pathname !== "/contact") {
      navigate(cleanPath);
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", cleanPath);
        if (setActiveSection) {
          setActiveSection(section);
        }
      }
    }
  };

  return (
    <div className={`relative flex items-center select-none ${className}`}>
      {/* Editorial Underline Navbar */}
      <div
        ref={containerRef}
        className={`flex items-center gap-10 md:gap-16 relative py-3 px-6 border-b ${onLight ? "border-theme-bg/15" : "border-theme-text/10"}`}
      >
        {SECTIONS.map((section, index) => {
          let label = "Home";
          if (section === "portfolio") label = "Portfolio";
          if (section === "contact") label = "Contact";

          const active = activeSection === section;
          return (
            <a
              key={section}
              href={section === "home" ? "/" : `/${section}`}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onClick={(e) => handleNavClick(section, e)}
              className={`relative font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase py-1.5 cursor-pointer decoration-none inline-flex flex-col items-center justify-center ${
                onLight
                  ? active
                    ? "text-theme-bg font-bold"
                    : "text-theme-bg/55 hover:text-theme-bg/90"
                  : active
                    ? "text-theme-text font-bold"
                    : "text-theme-text/55 hover:text-theme-text/90"
              }`}
              data-text={label}
            >
              {label}
            </a>
          );
        })}

        {coords && (
          <motion.div
            className={`absolute bottom-3 h-[1.5px] ${onLight ? "bg-theme-bg" : "bg-theme-text"}`}
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
