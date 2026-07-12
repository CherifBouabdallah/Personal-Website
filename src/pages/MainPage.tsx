import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import Portfolio from "./Portfolio";
import Contact from "./Contact";

type Language = "en" | "fr";

interface MainPageProps {
  lang: Language;
  setLang: (l: Language) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function MainPage({ lang, setLang, activeSection, setActiveSection }: MainPageProps) {
  const location = useLocation();

  // Scroll to hash section on mount or when hash changes
  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150); // slight delay to ensure layouts are stable and Lenis is active
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  // Scroll spy to update the active navbar state based on viewport intersection
  useEffect(() => {
    const sections = ["home", "portfolio", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: "-30% 0px -40% 0px", // focus on the middle section of the screen
          threshold: 0,
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [setActiveSection]);

  return (
    <div className="w-full flex flex-col items-stretch justify-start bg-theme-bg">
      <Home lang={lang} setLang={setLang} />
      <Portfolio lang={lang} setLang={setLang} />
      <Contact />
    </div>
  );
}
