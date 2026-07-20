import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CraftVariant = "current" | "a" | "b" | "c";

const STORAGE_KEY = "craft-variant";

interface CraftValue {
  variant: CraftVariant;
  setVariant: (v: CraftVariant) => void;
}

const CraftContext = createContext<CraftValue>({
  variant: "current",
  setVariant: () => {},
});

function isValidVariant(value: string | null): value is CraftVariant {
  return value === "current" || value === "a" || value === "b" || value === "c";
}

function readStoredVariant(): CraftVariant {
  // Outside dev, always lock to "current" regardless of any stray localStorage
  // value — the panel that writes it is dev-only, and a real visitor should get
  // a deterministic site.
  if (!import.meta.env.DEV || typeof window === "undefined") return "current";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isValidVariant(stored) ? stored : "current";
}

export function CraftProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<CraftVariant>(readStoredVariant);

  const setVariant = (v: CraftVariant) => {
    setVariantState(v);
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, v);
    }
  };

  // Mirror the variant onto <html> so purely cosmetic passes can live in CSS
  // instead of forcing React re-renders.
  useEffect(() => {
    document.documentElement.setAttribute("data-craft", variant);
  }, [variant]);

  return (
    <CraftContext.Provider value={{ variant, setVariant }}>
      {children}
    </CraftContext.Provider>
  );
}

export function useCraftVariant() {
  return useContext(CraftContext);
}
