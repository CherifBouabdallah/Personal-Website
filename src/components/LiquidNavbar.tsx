import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  // Sync state with HTML dataset attributes & CSS custom properties
  const updateVisuals = (complete: number, active: boolean, delta = 0) => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    toggle.style.setProperty("--complete", String(complete));
    toggle.style.setProperty("--hue", String(config.hue));
    toggle.style.setProperty("--delta", String(delta));
    toggle.dataset.active = String(active);
  };

  // Route-driven animation when page changes
  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const currentIndex = PATHS.indexOf(location.pathname);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;
    const targetComplete = (activeIndex / (PATHS.length - 1)) * 100;
    
    // Set active to trigger the bubble scaling animation
    toggle.dataset.active = "true";
    toggle.dataset.pressed = "true";

    gsap.to(toggle, {
      "--complete": targetComplete,
      duration: 0.4,
      ease: config.bounce
        ? "elastic.out(1, 0.6)"
        : "power2.out",
      onComplete: () => {
        toggle.dataset.active = "false";
        toggle.dataset.pressed = "false";
      },
    });
  }, [location.pathname]);

  // Click handler for menu items
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  // Set up GSAP Draggable for swipe/drag navigation
  useEffect(() => {
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
        const bubbleWidth = 120;
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
            onComplete: () => {
              toggle.dataset.active = "false";
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
  }, [location.pathname, navigate]);

  return (
    <div className={`liquid-nav-container ${className}`}>
      <button
        ref={toggleRef}
        aria-label="toggle"
        aria-pressed={activeIndex > 0 ? "true" : "false"}
        className="liquid-toggle"
        style={{
          // Set initial complete state
          "--complete": initialComplete,
        } as React.CSSProperties}
      >
        {/* Navigation Labels Layer (Rendered below/inside the track bubble) */}
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

      {/* SVG Goo and Knockout Filter Definitions */}
      <svg className="sr-only" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              id="SvgjsFeGaussianBlur1000"
              result="SvgjsFeGaussianBlur1000"
              in="SourceGraphic"
              stdDeviation="4" /* Tweaked for smaller width/bubble */
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
