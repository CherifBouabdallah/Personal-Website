import { useMotionVariant, MotionVariant } from "./MotionLabContext";

const OPTIONS: MotionVariant[] = ["a", "a2", "b"];

export function MotionLabPanel() {
  const { variant, setVariant } = useMotionVariant();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-1 rounded-md border border-theme-text/20 bg-theme-bg/90 backdrop-blur-sm px-2 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase select-none">
      <span className="text-theme-text/40 mr-1">Motion</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => setVariant(opt)}
          className={`px-2 py-1 rounded cursor-pointer transition-colors ${
            variant === opt
              ? "bg-theme-text text-theme-bg"
              : "text-theme-text/60 hover:text-theme-text"
          }`}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
