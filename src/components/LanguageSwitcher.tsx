import { memo, Fragment } from "react";
import { motion } from "framer-motion";

interface LanguageSwitcherProps {
  lang: "en" | "fr";
  setLang: (l: "en" | "fr") => void;
  layoutId: string;
}

export const LanguageSwitcher = memo(({ lang, setLang, layoutId }: LanguageSwitcherProps) => {
  return (
    <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.25em] uppercase select-none">
      {(["EN", "FR"] as const).map((l, idx) => {
        const active = lang === l.toLowerCase();
        return (
          <Fragment key={l}>
            {idx > 0 && <span className="opacity-25 text-theme-text">/</span>}
            <button
              onClick={() => setLang(l.toLowerCase() as "en" | "fr")}
              className={`relative cursor-pointer pb-1 transition-colors duration-300 ${
                active ? "text-theme-text font-bold" : "text-theme-text/40 hover:text-theme-text/80"
              }`}
            >
              {l}
              {active && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-theme-text"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
});
