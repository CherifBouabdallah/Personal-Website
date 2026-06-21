import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PATHS = ["/", "/portfolio", "/contact", "/about"];

interface LiquidNavbarProps {
  className?: string;
}

export default function LiquidNavbar({ className = "" }: LiquidNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

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
      <div className="flex items-center gap-10 md:gap-16 relative py-3 px-6 border-b border-[#F6F0DF]/10">
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
              className={`relative font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase transition-all duration-300 py-1.5 cursor-pointer decoration-none ${
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
    </div>
  );
}
