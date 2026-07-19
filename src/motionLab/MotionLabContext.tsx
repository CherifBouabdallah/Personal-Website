import { createContext, useContext, useState, ReactNode } from "react";

export type MotionVariant = "a" | "a2" | "b";

const STORAGE_KEY = "motion-lab-variant";

interface MotionLabValue {
  variant: MotionVariant;
  setVariant: (v: MotionVariant) => void;
}

const MotionLabContext = createContext<MotionLabValue>({
  variant: "a",
  setVariant: () => {},
});

function isValidVariant(value: string | null): value is MotionVariant {
  return value === "a" || value === "a2" || value === "b";
}

function readStoredVariant(): MotionVariant {
  // Outside dev, always lock to "a" regardless of any stray localStorage value —
  // this context (and the panel that writes to it) is deleted before ship, but this
  // keeps a real visitor's experience deterministic if that hasn't happened yet.
  if (!import.meta.env.DEV || typeof window === "undefined") return "a";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isValidVariant(stored) ? stored : "a";
}

export function MotionLabProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState<MotionVariant>(readStoredVariant);

  const setVariant = (v: MotionVariant) => {
    setVariantState(v);
    if (import.meta.env.DEV && typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, v);
    }
  };

  return (
    <MotionLabContext.Provider value={{ variant, setVariant }}>
      {children}
    </MotionLabContext.Provider>
  );
}

export function useMotionVariant() {
  return useContext(MotionLabContext);
}
