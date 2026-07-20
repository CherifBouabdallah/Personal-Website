import { useCraftVariant, CraftVariant } from "./CraftContext";

const OPTIONS: { value: CraftVariant; label: string }[] = [
  { value: "current", label: "CUR" },
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
];

export function CraftPanel() {
  const { variant, setVariant } = useCraftVariant();

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1 rounded-md border border-theme-text/20 bg-theme-bg/90 backdrop-blur-sm px-2 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase select-none">
      <span className="text-theme-text/40 mr-1">Craft</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setVariant(opt.value)}
          aria-pressed={variant === opt.value}
          className={`px-2 py-1 rounded cursor-pointer transition-colors ${
            variant === opt.value
              ? "bg-theme-text text-theme-bg"
              : "text-theme-text/60 hover:text-theme-text"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
