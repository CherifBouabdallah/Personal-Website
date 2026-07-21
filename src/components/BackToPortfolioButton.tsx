import { Minimize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Matches the Portfolio preview modal's floating button chrome exactly, so
// leaving the modal for the full page (via "open full page") and landing
// directly on the route both offer the same way back.
export default function BackToPortfolioButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/portfolio")}
      className="fixed top-6 left-6 z-[200] w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md"
      title="Back to portfolio"
    >
      <Minimize2 size={14} />
    </button>
  );
}
