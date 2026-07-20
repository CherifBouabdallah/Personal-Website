import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCraftVariant } from "../craft/CraftContext";
import CurrentHome from "./Home";
import CurrentPortfolio from "./Portfolio";
import CurrentContact from "./Contact";
import HomeA from "../craft/a/Home";
import PortfolioA from "../craft/a/Portfolio";
import ContactA from "../craft/a/Contact";
import HomeB from "../craft/b/Home";
import PortfolioB from "../craft/b/Portfolio";
import ContactB from "../craft/b/Contact";
import HomeC from "../craft/c/Home";
import PortfolioC from "../craft/c/Portfolio";
import ContactC from "../craft/c/Contact";

const VARIANT_PAGES = {
  current: { Home: CurrentHome, Portfolio: CurrentPortfolio, Contact: CurrentContact },
  a: { Home: HomeA, Portfolio: PortfolioA, Contact: ContactA },
  b: { Home: HomeB, Portfolio: PortfolioB, Contact: ContactB },
  c: { Home: HomeC, Portfolio: PortfolioC, Contact: ContactC },
} as const;

type Language = "en" | "fr";

interface MainPageProps {
  lang: Language;
  setLang: (l: Language) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function MainPage({ lang, setLang, activeSection, setActiveSection }: MainPageProps) {
  const location = useLocation();
  const { variant } = useCraftVariant();
  const { Home, Portfolio, Contact } = VARIANT_PAGES[variant];

  // Scroll to section on mount based on pathname or hash
  useEffect(() => {
    // Determine target section from pathname or hash
    let targetId = "";
    if (location.pathname === "/portfolio") {
      targetId = "portfolio";
    } else if (location.pathname === "/contact") {
      targetId = "contact";
    } else {
      const hash = location.hash || window.location.hash;
      if (hash) {
        targetId = hash.replace("#", "");
      }
    }

    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150); // slight delay to ensure layouts are stable and Lenis is active
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  // Scroll spy to update the active navbar state based on scroll position
  useEffect(() => {
    const sections = ["home", "portfolio", "contact"];

    const handleScroll = () => {
      // If near the bottom of the page, always show contact
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      // Find the section whose top is closest to (but above) the viewport center
      const viewportCenter = window.scrollY + window.innerHeight * 0.35;
      let current = "home";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= viewportCenter) {
          current = id;
        }
      }

      setActiveSection(current);

      // Update URL to reflect the current section with clean paths
      const cleanPath = current === "home" ? "/" : `/${current}`;
      if (window.location.pathname !== cleanPath) {
        window.history.replaceState(null, "", cleanPath);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set the correct initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setActiveSection]);

  return (
    <div className="w-full flex flex-col items-stretch justify-start bg-theme-bg">
      <Home lang={lang} setLang={setLang} />
      <Portfolio lang={lang} setLang={setLang} />
      <Contact lang={lang} />
    </div>
  );
}
