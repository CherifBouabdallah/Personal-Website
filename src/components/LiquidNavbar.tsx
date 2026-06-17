import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

// Register Draggable plugin
gsap.registerPlugin(Draggable);

const PATHS = ["/", "/portfolio", "/contact", "/about"];

interface LiquidNavbarProps {
  className?: string;
}

export default function LiquidNavbar({ className = "" }: LiquidNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [navStyle, setNavStyle] = useState<"gooey" | "underline" | "glass-pill" | "framed">(() => {
    return (localStorage.getItem("navStyle") as any) || "gooey";
  });

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const draggableInstance = useRef<any>(null);

  const currentIndex = PATHS.indexOf(location.pathname);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const initialComplete = (activeIndex / (PATHS.length - 1)) * 100;

  // Initial config matching the Jhey toggle
  const config = {
    complete: initialComplete,
    active: false,
    deviation: 2,
    alpha: 16,
    bounce: true,
    hue: 144,
    bubble: true,
  };

  // Interpolate tab styles (color, scale, opacity) dynamically along with the bubble movement (Gooey style only)
  const updateLinkColors = (complete: number) => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const links = toggle.querySelectorAll(".nav-link-item");
    const numPages = PATHS.length;
    const interval = 100 / (numPages - 1);

    links.forEach((link: any, i: number) => {
      const targetVal = i * interval;
      const distance = Math.abs(complete - targetVal);
      const factor = Math.max(0, 1 - distance / interval);

      // Active color: #F6F0DF (rgb(246, 240, 223))
      // Inactive color: #223D27 (rgb(34, 61, 39))
      const r = Math.round(34 + (246 - 34) * factor);
      const g = Math.round(61 + (240 - 61) * factor);
      const b = Math.round(39 + (223 - 39) * factor);

      link.style.color = `rgb(${r}, ${g}, ${b})`;
      link.style.transform = `scale(${1 + 0.05 * factor})`;
      link.style.opacity = String(0.7 + 0.3 * factor);
    });
  };

  // Sync state with HTML dataset attributes & CSS custom properties (Gooey style only)
  const updateVisuals = (complete: number, active: boolean, delta = 0) => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    toggle.style.setProperty("--complete", String(complete));
    toggle.style.setProperty("--hue", String(config.hue));
    toggle.style.setProperty("--delta", String(delta));
    toggle.dataset.active = String(active);
  };

  // Switcher Outside Click Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    if (isSwitcherOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSwitcherOpen]);

  // Route-driven animation when page changes (Gooey style only)
  useEffect(() => {
    if (navStyle !== "gooey") return;

    const toggle = toggleRef.current;
    if (!toggle) return;

    const currentIndex = PATHS.indexOf(location.pathname);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;
    const targetComplete = (activeIndex / (PATHS.length - 1)) * 100;

    // Apply color styling immediately to prevent layout flash before animation begins
    updateLinkColors(targetComplete);

    // Set active to trigger the bubble scaling animation
    toggle.dataset.active = "true";
    toggle.dataset.pressed = "true";

    gsap.to(toggle, {
      "--complete": targetComplete,
      duration: 0.4,
      ease: config.bounce
        ? "elastic.out(1, 0.6)"
        : "power2.out",
      onUpdate: function () {
        const currentComplete = parseFloat(toggle.style.getPropertyValue("--complete")) || 0;
        updateLinkColors(currentComplete);
      },
      onComplete: () => {
        toggle.dataset.active = "false";
        toggle.dataset.pressed = "false";
        updateLinkColors(targetComplete);
      },
    });
  }, [location.pathname, navStyle]);

  // Click handler for menu items
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  // Set up GSAP Draggable for swipe/drag navigation (Gooey style only)
  useEffect(() => {
    if (navStyle !== "gooey") return;

    const toggle = toggleRef.current;
    if (!toggle) return;

    // Create a drag proxy element dynamically
    const proxy = document.createElement("div");
    proxyRef.current = proxy;

    draggableInstance.current = Draggable.create(proxy, {
      allowContextMenu: true,
      handle: toggle,
      onDragStart: function () {
        const toggleBounds = toggle.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(toggle);
        const bubbleWidth = parseFloat(computedStyle.getPropertyValue("--bubble-width")) || 120;
        const travelDistance = toggleBounds.width - bubbleWidth;

        const currentIndex = PATHS.indexOf(location.pathname);
        const activeIndex = currentIndex === -1 ? 0 : currentIndex;
        const startComplete = (activeIndex / (PATHS.length - 1)) * 100;

        this.travelDistance = travelDistance;
        this.startComplete = startComplete;
        this.leftLimit = - (startComplete / 100) * travelDistance;
        this.rightLimit = (1 - startComplete / 100) * travelDistance;

        toggle.dataset.active = "true";
      },
      onDrag: function () {
        const dragged = this.x - this.startX;
        const complete = gsap.utils.clamp(
          0,
          100,
          gsap.utils.mapRange(this.leftLimit, this.rightLimit, 0, 100, dragged)
        );
        this.complete = complete;

        // Calculate delta for the bubble squeeze stretch effect
        const delta = Math.min(Math.abs(this.deltaX), 12);
        updateVisuals(complete, true, delta);
        updateLinkColors(complete);
      },
      onDragEnd: function () {
        const numPages = PATHS.length;
        const snapInterval = 100 / (numPages - 1);
        const nearestIndex = Math.round(this.complete / snapInterval);
        const targetComplete = nearestIndex * snapInterval;
        const targetPath = PATHS[nearestIndex];

        gsap.fromTo(
          toggle,
          {
            "--complete": this.complete,
          },
          {
            "--complete": targetComplete,
            duration: 0.25,
            ease: "power2.out",
            onUpdate: function () {
              const currentComplete = parseFloat(toggle.style.getPropertyValue("--complete")) || 0;
              updateLinkColors(currentComplete);
            },
            onComplete: () => {
              toggle.dataset.active = "false";
              updateLinkColors(targetComplete);
              if (location.pathname !== targetPath) {
                navigate(targetPath);
              }
            },
          }
        );
      },
      onRelease: function () {
        gsap.set(toggle, { "--delta": "0" });
      }
    })[0];

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current.kill();
      }
    };
  }, [location.pathname, navigate, navStyle]);

  const renderNavbar = () => {
    switch (navStyle) {
      case "underline":
        return (
          <div className="flex items-center gap-6 md:gap-8 relative py-3 px-6 border-b border-[#F6F0DF]/10">
            {PATHS.map((path) => {
              let label = "Home";
              if (path === "/portfolio") label = "Portfolio";
              if (path === "/contact") label = "Contact";
              if (path === "/about") label = "About";

              const active = location.pathname === path;
              return (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => handleNavClick(path, e)}
                  className={`relative font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase transition-all duration-300 py-1.5 cursor-pointer select-none decoration-none ${
                    active ? "text-[#F6F0DF] font-bold" : "text-[#F6F0DF]/55 hover:text-[#F6F0DF]/90"
                  }`}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="editorialActiveUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F6F0DF]"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        );

      case "glass-pill":
        return (
          <div className="flex items-center p-1 bg-black/25 border border-[#F6F0DF]/15 rounded-full backdrop-blur-md gap-1 shadow-inner">
            {PATHS.map((path) => {
              let label = "Home";
              if (path === "/portfolio") label = "Portfolio";
              if (path === "/contact") label = "Contact";
              if (path === "/about") label = "About";

              const active = location.pathname === path;
              return (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => handleNavClick(path, e)}
                  className={`relative px-4 py-1.5 rounded-full font-mono text-[9px] sm:text-[10px] tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer select-none decoration-none z-10 ${
                    active ? "text-[#223D27] scale-[1.02]" : "text-[#F6F0DF]/60 hover:text-[#F6F0DF]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeGlassPillIndicator"
                      className="absolute inset-0 bg-[#F6F0DF] rounded-full z-[-1] shadow-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {label}
                </a>
              );
            })}
          </div>
        );

      case "framed":
        return (
          <div className="flex items-center gap-4 py-2 px-4">
            {PATHS.map((path) => {
              let label = "Home";
              if (path === "/portfolio") label = "Portfolio";
              if (path === "/contact") label = "Contact";
              if (path === "/about") label = "About";

              const active = location.pathname === path;
              return (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => handleNavClick(path, e)}
                  className={`relative px-4 py-1.5 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 cursor-pointer select-none decoration-none ${
                    active ? "text-[#F6F0DF]" : "text-[#F6F0DF]/50 hover:text-[#F6F0DF]"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeModernistFrame"
                      className="absolute inset-0 border border-[#F6F0DF]/40 rounded-[6px]"
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    >
                      {/* Subtle architectural corner accents */}
                      <span className="absolute -top-[1.5px] -left-[1.5px] w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-[#F6F0DF]" />
                      <span className="absolute -top-[1.5px] -right-[1.5px] w-1.5 h-1.5 border-t-[1.5px] border-r-[1.5px] border-[#F6F0DF]" />
                      <span className="absolute -bottom-[1.5px] -left-[1.5px] w-1.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#F6F0DF]" />
                      <span className="absolute -bottom-[1.5px] -right-[1.5px] w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-[#F6F0DF]" />
                    </motion.div>
                  )}
                  {label}
                </a>
              );
            })}
          </div>
        );

      case "gooey":
      default:
        return (
          <button
            ref={toggleRef}
            aria-label="toggle"
            aria-pressed={activeIndex > 0 ? "true" : "false"}
            className="liquid-toggle"
            style={{
              "--complete": initialComplete,
            } as React.CSSProperties}
          >
            {/* Navigation Labels Layer */}
            <div className="nav-links-overlay">
              {PATHS.map((path) => {
                let label = "Home";
                if (path === "/portfolio") label = "Portfolio";
                if (path === "/contact") label = "Contact";
                if (path === "/about") label = "About";

                const active = location.pathname === path;
                return (
                  <a
                    key={path}
                    href={path}
                    onClick={(e) => handleNavClick(path, e)}
                    className={`nav-link-item ${active ? "active" : ""}`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>

            {/* Continuous Track Background */}
            <div className="indicator-track"></div>

            {/* Glass Bubble Selector */}
            <div className="indicator__liquid">
              <div className="shadow"></div>
              <div className="wrapper">
                <div className="liquids">
                  <div className="liquid__shadow"></div>
                </div>
              </div>
            </div>
          </button>
        );
    }
  };

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {renderNavbar()}

      {/* Embedded Layout Switcher Dropdown next to Navbar */}
      <div 
        ref={switcherRef}
        className="relative font-mono"
      >
        <button
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border border-[#F6F0DF]/15 bg-black/25 backdrop-blur-md cursor-pointer text-[#F6F0DF]/60 hover:text-[#F6F0DF] hover:border-[#F6F0DF]/40 hover:bg-white/5 transition-all duration-300 shadow-md"
          title="Change Navbar Style"
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
          </svg>
        </button>

        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-10 right-0 p-3 bg-black/90 border border-[#F6F0DF]/15 rounded-xl backdrop-blur-md shadow-2xl flex flex-col gap-2 w-48 text-left z-[100]"
            >
              <div className="text-[8px] tracking-[0.3em] text-[#F6F0DF]/40 uppercase font-bold border-b border-[#F6F0DF]/10 pb-1.5 mb-1 select-none">
                NAV STYLE
              </div>
              {(
                [
                  { id: "gooey", label: "Fluid Gooey" },
                  { id: "underline", label: "Editorial" },
                  { id: "glass-pill", label: "Glass Pill" },
                  { id: "framed", label: "Modernist" }
                ] as const
              ).map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setNavStyle(opt.id);
                    localStorage.setItem("navStyle", opt.id);
                    setIsSwitcherOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-[9px] tracking-wider uppercase font-bold transition-all duration-200 cursor-pointer ${
                    navStyle === opt.id 
                      ? "bg-[#F6F0DF] text-[#223D27]" 
                      : "text-[#F6F0DF]/60 hover:text-[#F6F0DF] hover:bg-[#F6F0DF]/5"
                  }`}
                >
                  <span>0{i + 1} // {opt.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG Goo and Knockout Filter Definitions */}
      <svg className="sr-only" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              id="SvgjsFeGaussianBlur1000"
              result="SvgjsFeGaussianBlur1000"
              in="SourceGraphic"
              stdDeviation="4"
            ></feGaussianBlur>
            <feColorMatrix
              id="SvgjsFeColorMatrix1001"
              result="SvgjsFeColorMatrix1001"
              in="SvgjsFeGaussianBlur1000"
              values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 18 -10
              "
              type="matrix"
            ></feColorMatrix>
            <feComposite
              id="SvgjsFeComposite1002"
              result="SvgjsFeComposite1002"
              in="SvgjsFeColorMatrix1001"
              operator="atop"
            ></feComposite>
          </filter>
          <filter id="knockout" colorInterpolationFilters="sRGB">
            <feColorMatrix
              result="knocked"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -1 -1 -1 1 0"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope="3" intercept="-1" />
              <feFuncG type="linear" slope="3" intercept="-1" />
              <feFuncB type="linear" slope="3" intercept="-1" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
              <feFuncG type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
              <feFuncB type="table" tableValues="0 0 0 0 0 1 1 1 1 1" />
            </feComponentTransfer>
          </filter>
          <filter id="remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        -255 -255 -255 0 1"
              result="black-pixels"
            />
            <feMorphology
              in="black-pixels"
              operator="dilate"
              radius="0.5"
              result="smoothed"
            />
            <feComposite in="SourceGraphic" in2="smoothed" operator="out" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
