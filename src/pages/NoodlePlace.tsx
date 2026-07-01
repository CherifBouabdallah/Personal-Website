import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Flame,
  Droplet,
  Users,
  Compass,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";

interface NoodlePlaceProps {
  isPreview?: boolean;
}

// ── Static Quote Text ──
function ScrubbingTextReveal({ text }: { text: string }) {
  return (
    <p className="font-cabinet text-3xl md:text-5xl lg:text-6xl text-left tracking-tight leading-[1.15] max-w-5xl text-[#F4F1EA]">
      {text}
    </p>
  );
}

// ── Infinite Marquee ──
function Marquee({ items, speed = 25 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="w-full overflow-hidden relative py-4 border-y border-white/5 bg-black/25">
      <motion.div
        animate={{ x: [0, "-33.33%"] }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        className="flex gap-16 white-space-nowrap w-max px-4 text-center items-center"
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#F4F1EA]/60 flex items-center gap-3 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Double-Bezel Bento Card Enclosure ──
function DoubleBezelCard({ children, className = "", onClick, whileHover }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  whileHover?: any;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={whileHover}
      className={`bg-white/5 border border-white/10 p-2 rounded-[2rem] transition-all duration-500 flex flex-col justify-stretch items-stretch ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="bg-[#181818] shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.08)] rounded-[calc(2rem-0.5rem)] p-6 md:p-8 flex-1 flex flex-col justify-between items-stretch overflow-hidden relative">
        {children}
      </div>
    </motion.div>
  );
}

export default function NoodlePlace({ isPreview = false }: NoodlePlaceProps) {
  const navigate = useNavigate();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom states
  const [activeMenuTab, setActiveMenuTab] = useState<"signature" | "sides">("signature");
  const [selectedBowlIndex, setSelectedBowlIndex] = useState(0);
  const [isReserved, setIsReserved] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");

  // Carousel states for Guest Testimonials
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [scrollContainer, setScrollContainer] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    let parent = containerRef.current?.parentElement;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        setScrollContainer(parent);
        break;
      }
      parent = parent.parentElement;
    }
  }, []);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer ? { current: scrollContainer } : undefined,
    offset: ["start start", "end end"]
  });
  const heroImageY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  // Dynamic style injection (Cabinet Grotesk + custom css overrides)
  useEffect(() => {
    // Fonts load
    const linkFonts = document.createElement("link");
    linkFonts.href = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    // CSS Keyframe styles
    const style = document.createElement("style");
    style.innerHTML = `
      .font-cabinet {
        font-family: 'Cabinet Grotesk', sans-serif;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(244, 241, 234, 0.1);
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(244, 241, 234, 0.25);
      }
    `;
    document.head.appendChild(style);
    setFontsLoaded(true);

    return () => {
      document.head.removeChild(linkFonts);
      document.head.removeChild(style);
    };
  }, []);

  const signatureBowls = [
    {
      name: "KURO SHOYU",
      jpName: "黒醤油ラーメン",
      price: "$24",
      broth: "36-Hour Duck & Dashi",
      tare: "Aged Smoked Soy",
      oil: "Black Garlic Mayu",
      toppings: "Smoked Duck Breast, Kyoto Negi, Ajitama, Charcoal Bamboo Shoot",
      description: "A dark, highly complex masterpiece. Fuses rich duck fats with an ultra-umami dashi blend, rounded by centuries-old barrel-aged shoyu and toasted black garlic.",
      color: "from-black via-[#1E1E1E] to-[#121212]",
      metrics: { temp: "84°C", thickness: "1.8mm", egg: "Soft Center" }
    },
    {
      name: "TONKOTSU CRAFT",
      jpName: "クラフト豚骨",
      price: "$22",
      broth: "48-Hour Heritage Pork Bone",
      tare: "White Sea Salt Shio",
      oil: "Aromatic Pork Lard",
      toppings: "Torched Chashu, Wood Ear Mushrooms, Aged Nori, Ajitama",
      description: "Rich, creamy, and heavily emulsified. Pork marrow bones are boiled continuously for two days to extract absolute depth, layered with high-heat toasted pork fat oil.",
      color: "from-[#2A231F] via-[#1F1B19] to-[#121212]",
      metrics: { temp: "86°C", thickness: "2.2mm", egg: "Custard" }
    },
    {
      name: "SPICY RED CLAY MISO",
      jpName: "赤土辛味噌",
      price: "$23",
      broth: "36-Hour Chicken & Ginger",
      tare: "Fermented Red Miso Paste",
      oil: "House-Charred Chili Rayu",
      toppings: "Minced Spicy Berkshire Pork, Fermented Bamboo Slices, Ajitama",
      description: "Earth-toned and packing a punch. Crafted from three fermented misos, paired with toasted sesame oil and a slow-steeped chili oil containing 15 spices.",
      color: "from-[#3B1F16] via-[#241712] to-[#121212]",
      metrics: { temp: "85°C", thickness: "2.0mm", egg: "Soft Center" }
    }
  ];

  const sidesList = [
    { name: "Smoked Duck Gyoza", price: "$12", description: "Pan-fried with a crispy skirt, served with black garlic dipping shoyu." },
    { name: "Charred Negi & Pork Cheek", price: "$14", description: "Tender pork jowl strips glazed in sweet sake reduction with charred wild onions." },
    { name: "Ajitama Tempura", price: "$8", description: "Soft-boiled egg crisp-fried in light tempura batter, finished with smoked sea salt." },
    { name: "Hokkaido Matcha Soft-Serve", price: "$10", description: "Organic stone-ground green tea gelato with puffed red rice and sesame honey." }
  ];

  const testimonials = [
    {
      quote: "Kiri Ramen isn't just dinner; it's a monastic experience. Eating in absolute silence allows you to taste the broth in three distinct dimensions. Unparalleled mastery.",
      author: "René Takahara",
      title: "Chef & Food Anthropologist"
    },
    {
      quote: "An architectural marvel of flavor. The wabi-sabi minimalist setting aligns perfectly with the hyper-focused menu. That Kuro Shoyu broth is pure liquid gold.",
      author: "Evelyn Sterling",
      title: "Design Critic, Monocle"
    },
    {
      quote: "The noodles possess a perfect toothsome spring. Fusing local organic grains with ancient stone-milled rye yields a flavor profile that other ramen counters cannot replicate.",
      author: "Kensuke Sato",
      title: "Master Noodle Maker"
    }
  ];

  const marqueeItems = [
    "Aged Shoyu", "Kyoto Negi", "Chashu Smoke", "36h Broth", "Kyoto Negi", "Charcoal Bamboo Shoot", "Custard Ajitama", "Stone-milled Rye", "Grown in Hokkaido"
  ];

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;
    setIsReserved(true);
  };

  if (!fontsLoaded) return null;

  return (
    <main className="overflow-x-hidden w-full max-w-full bg-[#121212] text-[#F4F1EA] selection:bg-[#C85A32] selection:text-[#F4F1EA] relative min-h-[100dvh] custom-scrollbar">

      {/* Dynamic Background film-grain noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Standalone Back Button (rendered only in Portfolio context or full viewport) */}
      {!isPreview && (
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => navigate("/portfolio")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#F4F1EA]/80 hover:text-[#F4F1EA] hover:bg-white/10 transition-all duration-300 font-mono text-[9px] tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft size={10} />
            Back to Showcase
          </button>
        </div>
      )}

      {/* Floating Island Navigation bar */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[600px] flex items-center justify-between py-3 px-6 rounded-full border border-white/5 bg-white/2 backdrop-blur-md">
        <span className="font-cabinet font-extrabold text-[12px] tracking-[0.25em] uppercase text-[#F4F1EA]">
          霧 <span className="text-[#C85A32]">KIRI</span>
        </span>
        <div className="flex gap-6 font-mono text-[8px] tracking-[0.18em] uppercase">
          <a href="#menu" className="text-[#F4F1EA]/70 hover:text-[#F4F1EA] transition-colors">THE MENU</a>
          <a href="#ritual" className="text-[#F4F1EA]/70 hover:text-[#F4F1EA] transition-colors">THE RITUAL</a>
          <a href="#reserve" className="text-[#F4F1EA]/70 hover:text-[#F4F1EA] transition-colors font-bold text-[#C85A32]">REQUEST SEAT</a>
        </div>
      </nav>

      {/* ── SECTION 1: ATTENTION (Hero) ── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-32 pb-16 overflow-hidden">
        {/* Parallax ambient grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,90,50,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Headline block (Left col-span-7) */}
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Micro Eyebrow */}
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C85A32]">
                AN INTIMATE 8-SEAT RAMEN COUNTER
              </span>
            </div>

            {/* Title (Max 2 lines under the Iron Rule) */}
            <h1 className="font-cabinet text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[0.98] text-[#F4F1EA] tracking-tighter mb-6 w-full max-w-5xl">
              Crafted in mist. <br />
              <span className="text-[#C85A32] italic">Served in silence.</span>
            </h1>

            {/* Subtext (Max 20 words) */}
            <p className="font-mono text-[11px] md:text-[13px] tracking-wide leading-relaxed text-[#A0A09A] max-w-[50ch] mb-8">
              A sensory, contemplative culinary ritual. Broths simmered for 36 hours. Hand-folded rye noodles. Eaten in focused silence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#reserve"
                className="inline-flex items-center justify-between gap-4 py-3.5 px-6 rounded-full bg-[#C85A32] text-[#F4F1EA] font-mono text-[10px] font-bold tracking-widest hover:bg-[#C85A32]/90 active:scale-[0.98] transition-all duration-300 shadow-md group"
              >
                <span>REQUEST A SEAT</span>
                <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={10} />
                </span>
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[#F4F1EA] font-mono text-[10px] font-bold tracking-widest transition-all duration-300"
              >
                EXPLORE MENU
              </a>
            </div>
          </motion.div>

          {/* Hero Image (Right col-span-5) */}
          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            {/* Double-Bezel Hardware Wrapper */}
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-[2.5rem] w-full max-w-[420px] aspect-square overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-[calc(2.5rem-0.625rem)] overflow-hidden relative group">
                <img
                  src="/kiri_ramen_hero.png"
                  alt="Steaming bowl of Kiri Tonkotsu Ramen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-[#C85A32] uppercase">Signature</span>
                    <h3 className="font-cabinet text-xl font-bold leading-tight">Mugiwara Tonkotsu</h3>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-3 py-1 rounded-full bg-[#C85A32] text-[#F4F1EA] shadow">
                    $22
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: INTEREST (Bento Grid) ── */}
      <section id="menu" className="py-24 md:py-36 px-6 md:px-16 lg:px-24 border-t border-white/5 relative bg-gradient-to-b from-[#121212] to-[#151515]">
        <div className="max-w-[1440px] mx-auto">
          {/* Header block (centered, no metadata meta-labels) */}
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-cabinet text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              The Seasonal Bowls
            </h2>
            <p className="font-mono text-[10px] md:text-[11px] tracking-wide text-[#A0A09A] max-w-[48ch] leading-relaxed">
              Our menu is limited to three core recipes, curated daily to preserve absolute precision. Hand-folded local rye noodles paired with slow-steeped stocks.
            </p>

            {/* Menu tab filter button block */}
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 mt-8">
              <button
                onClick={() => setActiveMenuTab("signature")}
                className={`px-6 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all duration-300 ${activeMenuTab === "signature" ? "bg-[#C85A32] text-[#F4F1EA]" : "text-[#A0A09A] hover:text-[#F4F1EA]"}`}
              >
                Signature Bowls
              </button>
              <button
                onClick={() => setActiveMenuTab("sides")}
                className={`px-6 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all duration-300 ${activeMenuTab === "sides" ? "bg-[#C85A32] text-[#F4F1EA]" : "text-[#A0A09A] hover:text-[#F4F1EA]"}`}
              >
                Sides & Matcha
              </button>
            </div>
          </div>

          {activeMenuTab === "signature" ? (
            /* Bento Grid (Zero empty space, interlocking math layout) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">
              {/* Highlight Main Bowl detail Card - col-span-8 */}
              <DoubleBezelCard className="md:col-span-8 md:row-span-2">
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#C85A32] uppercase">{signatureBowls[selectedBowlIndex].jpName}</span>
                    <h3 className="font-cabinet text-3xl font-extrabold tracking-tight mt-1 text-[#F4F1EA]">
                      {signatureBowls[selectedBowlIndex].name}
                    </h3>
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#C85A32]">
                    {signatureBowls[selectedBowlIndex].price}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                  {/* Left stats detail column */}
                  <div className="flex flex-col justify-between">
                    <p className="font-mono text-[11px] leading-relaxed text-[#A0A09A] mb-6">
                      {signatureBowls[selectedBowlIndex].description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <span className="font-mono text-[8px] tracking-widest uppercase text-[#A0A09A]">Broth Structure</span>
                        <div className="font-cabinet text-sm font-bold text-[#F4F1EA] mt-1 flex items-center gap-2">
                          <Droplet size={12} className="text-[#C85A32]" />
                          {signatureBowls[selectedBowlIndex].broth}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] tracking-widest uppercase text-[#A0A09A]">Fermentation Base (Tare)</span>
                        <div className="font-cabinet text-sm font-bold text-[#F4F1EA] mt-1">
                          {signatureBowls[selectedBowlIndex].tare}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] tracking-widest uppercase text-[#A0A09A]">Finishing Aromatic Oil</span>
                        <div className="font-cabinet text-sm font-bold text-[#F4F1EA] mt-1">
                          {signatureBowls[selectedBowlIndex].oil}
                        </div>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] tracking-widest uppercase text-[#A0A09A]">Core Toppings</span>
                        <div className="font-mono text-[10px] text-[#A0A09A] mt-1 leading-relaxed">
                          {signatureBowls[selectedBowlIndex].toppings}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right specs micro-dashboard column */}
                  <div className="bg-black/25 rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-mono text-[9px] tracking-wider uppercase text-[#C85A32] border-b border-white/5 pb-2.5 mb-4">
                        Precision Metrics
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-left">
                          <span className="font-mono text-[9px] text-[#A0A09A]">Service Temp</span>
                          <span className="font-mono text-[11px] font-bold text-[#F4F1EA]">{signatureBowls[selectedBowlIndex].metrics.temp}</span>
                        </div>
                        <div className="flex justify-between items-center text-left">
                          <span className="font-mono text-[9px] text-[#A0A09A]">Noodle Caliber</span>
                          <span className="font-mono text-[11px] font-bold text-[#F4F1EA]">{signatureBowls[selectedBowlIndex].metrics.thickness}</span>
                        </div>
                        <div className="flex justify-between items-center text-left">
                          <span className="font-mono text-[9px] text-[#A0A09A]">Egg Consistency</span>
                          <span className="font-mono text-[11px] font-bold text-[#F4F1EA]">{signatureBowls[selectedBowlIndex].metrics.egg}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex gap-2">
                      {signatureBowls.map((bowl, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedBowlIndex(index)}
                          className={`flex-1 py-2 rounded-lg font-mono text-[8px] tracking-wider uppercase border transition-all duration-300 ${index === selectedBowlIndex ? "bg-[#C85A32]/10 border-[#C85A32] text-[#C85A32]" : "border-white/5 hover:border-white/15 text-[#A0A09A]"}`}
                        >
                          Bowl {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </DoubleBezelCard>

              {/* Tonkotsu Preview Switcher Card - col-span-4 */}
              <DoubleBezelCard
                className="md:col-span-4 md:row-span-1"
                onClick={() => setSelectedBowlIndex(1)}
                whileHover={{ y: -4, borderColor: "rgba(200,90,50,0.3)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[8px] tracking-widest text-[#C85A32] uppercase">BOWL 02</span>
                  <span className="font-mono text-[10px] text-[#A0A09A]">$22</span>
                </div>
                <h3 className="font-cabinet text-xl font-bold text-[#F4F1EA]">Tonkotsu Craft</h3>
                <p className="font-mono text-[9px] text-[#A0A09A] mt-2 leading-relaxed flex-1">
                  Rich pork marrow broth boiled continuously for 48 hours to create a velvet emulsion.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#C85A32]">
                  <span>48H SLOW BREW</span>
                  <Clock size={12} />
                </div>
              </DoubleBezelCard>

              {/* Spicy Red Clay Miso Card - col-span-4 */}
              <DoubleBezelCard
                className="md:col-span-4 md:row-span-1"
                onClick={() => setSelectedBowlIndex(2)}
                whileHover={{ y: -4, borderColor: "rgba(200,90,50,0.3)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[8px] tracking-widest text-[#C85A32] uppercase">BOWL 03</span>
                  <span className="font-mono text-[10px] text-[#A0A09A]">$23</span>
                </div>
                <h3 className="font-cabinet text-xl font-bold text-[#F4F1EA]">Spicy Miso</h3>
                <p className="font-mono text-[9px] text-[#A0A09A] mt-2 leading-relaxed flex-1">
                  Earth-toned base from three fermented misos, paired with toasted sesame oil and rayu.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#C85A32]">
                  <span>HEATING LEVEL 3</span>
                  <Flame size={12} />
                </div>
              </DoubleBezelCard>

              {/* Wabi Sabi Dining Philosophy Card - col-span-4 */}
              <DoubleBezelCard className="md:col-span-4 md:row-span-2">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-mono text-[8px] tracking-widest text-[#C85A32] uppercase">OUR RITUAL</span>
                  <Compass size={14} className="text-[#C85A32]" />
                </div>
                <h3 className="font-cabinet text-lg font-bold text-[#F4F1EA] mb-3">The Sound of Mist</h3>
                <p className="font-mono text-[9px] text-[#A0A09A] leading-relaxed mb-4">
                  To honor the chef's craft and cultivate deep focus, our counter operates in silent dining mode. We ask that conversations be put aside while the broth remains hot.
                </p>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5 font-mono text-[8px] text-[#A0A09A] space-y-2">
                  <div className="flex gap-2">
                    <span className="text-[#C85A32] font-bold">I.</span>
                    <span>Reservations are release-only.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#C85A32] font-bold">II.</span>
                    <span>8 guests per seating block.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#C85A32] font-bold">III.</span>
                    <span>No digital screens at the counter.</span>
                  </div>
                </div>
                <div className="mt-6 flex-1 flex items-end">
                  <div className="w-full h-24 rounded-xl overflow-hidden relative">
                    <img
                      src="/kiri_ramen_interior.png"
                      alt="Counter detail"
                      className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </DoubleBezelCard>

              {/* Highlight Shoyu Card - col-span-4 */}
              <DoubleBezelCard
                className="md:col-span-4 md:row-span-1"
                onClick={() => setSelectedBowlIndex(0)}
                whileHover={{ y: -4, borderColor: "rgba(200,90,50,0.3)" }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[8px] tracking-widest text-[#C85A32] uppercase">BOWL 01</span>
                  <span className="font-mono text-[10px] text-[#A0A09A]">$24</span>
                </div>
                <h3 className="font-cabinet text-xl font-bold text-[#F4F1EA]">Kuro Shoyu</h3>
                <p className="font-mono text-[9px] text-[#A0A09A] mt-2 leading-relaxed flex-1">
                  Barrel-aged smoked soy sauce blended with rich duck fat broth and kombu dashi.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#C85A32]">
                  <span>BARREL AGED SHOYU</span>
                  <Droplet size={12} />
                </div>
              </DoubleBezelCard>

              {/* Kyoto Negi Farm Card - col-span-4 */}
              <DoubleBezelCard className="md:col-span-4 md:row-span-1">
                <span className="font-mono text-[8px] tracking-widest text-[#C85A32] uppercase mb-4 block">INGREDIENTS</span>
                <h3 className="font-cabinet text-lg font-bold text-[#F4F1EA]">Negi & Rye</h3>
                <p className="font-mono text-[9px] text-[#A0A09A] leading-relaxed">
                  We fly in Negi green onions from Kyoto weekly and source stone-milled rye grains directly from Hokkaido.
                </p>
              </DoubleBezelCard>
            </div>
          ) : (
            /* Sides and Matcha grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sidesList.map((side, idx) => (
                <DoubleBezelCard key={idx}>
                  <div className="flex justify-between items-start mb-2 border-b border-white/5 pb-2">
                    <h3 className="font-cabinet text-xl font-bold text-[#F4F1EA]">{side.name}</h3>
                    <span className="font-mono text-xs font-bold text-[#C85A32]">{side.price}</span>
                  </div>
                  <p className="font-mono text-[10px] text-[#A0A09A] leading-relaxed">
                    {side.description}
                  </p>
                </DoubleBezelCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: DESIRE (GSAP Scroll & Text Reveal + Inline Micro-Images) ── */}
      <section id="ritual" className="py-32 md:py-48 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] border-t border-white/5 relative overflow-hidden">
        {/* Dynamic backdrop image scroll layer */}
        <div className="absolute inset-0 z-0 opacity-15 grayscale pointer-events-none">
          <img
            src="/kiri_ramen_interior.png"
            alt="Intimate Ramen bar"
            className="w-full h-full object-cover scale-110"
          />
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10">
          <div className="flex flex-col gap-12 text-left">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C85A32]">
              THE SOUND OF STEAM
            </span>

            {/* Scrubbing Text Reveal with Inline typography images */}
            <ScrubbingTextReveal
              text="Our counter operates as a sanctuary. As steam rises, conversation fades. We cook in mist, and we serve in absolute silence so that each ingredient can be fully tasted without the noise of the digital world."
            />

            {/* Micro layout inline image element demonstrating custom premium touches */}
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <span className="font-mono text-[10px] text-[#A0A09A] tracking-wider">
                CO-FOUNDER KENSHIN & HEIRLOOM GRAINS
              </span>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
                <span className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center font-bold text-xs text-[#C85A32]">
                  謙
                </span>
                <span className="font-mono text-[9px] text-[#F4F1EA] pr-3 uppercase tracking-wider">Kenshin Sato</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling ingredients marquee */}
      <Marquee items={marqueeItems} />

      {/* ── SECTION 4: TESTIMONIAL CAROUSEL ── */}
      <section className="py-24 px-6 md:px-16 lg:px-24 border-t border-white/5 bg-[#121212]">
        <div className="max-w-[800px] mx-auto text-center relative">
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#C85A32] mb-8 block">GUEST IMPRESSIONS</span>

          <div className="min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-6"
              >
                <p className="font-cabinet text-xl md:text-2xl italic leading-relaxed text-[#F4F1EA]">
                  "{testimonials[testimonialIdx].quote}"
                </p>
                <div className="font-mono text-[9px] tracking-widest text-[#A0A09A] uppercase pt-4">
                  <span className="text-[#F4F1EA] font-bold">{testimonials[testimonialIdx].author}</span> — {testimonials[testimonialIdx].title}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={handlePrevTestimonial}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-white/5 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono text-[9px] tracking-widest text-[#A0A09A]">
              0{testimonialIdx + 1} / 0{testimonials.length}
            </span>
            <button
              onClick={handleNextTestimonial}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#F4F1EA]/60 hover:text-[#F4F1EA] hover:bg-white/5 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: ACTION (Seat Request Form) ── */}
      <section id="reserve" className="py-24 md:py-36 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(200,90,50,0.05)_0%,transparent_50%)] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Form Description left column */}
          <div className="lg:col-span-6 text-left">
            <h2 className="font-cabinet text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Request a Seat
            </h2>
            <p className="font-mono text-[10px] md:text-[11px] tracking-wide text-[#A0A09A] max-w-[44ch] leading-relaxed mb-6">
              Due to our limited 8-seat counter capacity, we operate strictly on reservation request blocks. Enter your details below; our hosts will confirm seat availability via SMS.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C85A32]">
                  <Users size={12} />
                </div>
                <div>
                  <h4 className="font-cabinet text-[11px] font-bold text-[#F4F1EA]">Counter Seats</h4>
                  <p className="font-mono text-[9px] text-[#A0A09A]">Seating blocks are strictly capped at 2 people max.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C85A32]">
                  <Clock size={12} />
                </div>
                <div>
                  <h4 className="font-cabinet text-[11px] font-bold text-[#F4F1EA]">Dining Window</h4>
                  <p className="font-mono text-[9px] text-[#A0A09A]">45 minutes per dining seating block.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form input right column with Double-Bezel hardware frame */}
          <div className="lg:col-span-6">
            <DoubleBezelCard>
              {isReserved ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <CheckCircle size={44} className="text-[#C85A32] mx-auto mb-6" />
                  <h3 className="font-cabinet text-2xl font-bold text-[#F4F1EA] mb-2">Request Received</h3>
                  <p className="font-mono text-[10px] text-[#A0A09A] max-w-[32ch] mx-auto leading-relaxed">
                    Thank you, {name}. If a seat opens for {guests} guests on {date} at {time}, we will send a confirmation text message.
                  </p>
                  <button
                    onClick={() => setIsReserved(false)}
                    className="mt-8 font-mono text-[9px] text-[#C85A32] tracking-widest uppercase hover:underline"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-6">
                  <div>
                    <label className="block font-mono text-[8px] tracking-widest text-[#A0A09A] uppercase mb-2">
                      GUEST NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenji Sato"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] placeholder-[#A0A09A]/40 focus:outline-none focus:border-[#C85A32] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[8px] tracking-widest text-[#A0A09A] uppercase mb-2">
                        PARTY SIZE
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C85A32] transition-colors"
                      >
                        <option value="1">1 Seat</option>
                        <option value="2">2 Seats (Max)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[8px] tracking-widest text-[#A0A09A] uppercase mb-2">
                        SEATING DATE
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C85A32] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[8px] tracking-widest text-[#A0A09A] uppercase mb-2">
                      PREFERRED SEATING BLOCK
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C85A32] transition-colors"
                    >
                      <option value="18:00">18:00 Seating Block</option>
                      <option value="19:00">19:00 Seating Block</option>
                      <option value="20:00">20:00 Seating Block</option>
                      <option value="21:00">21:00 Seating Block</option>
                    </select>
                  </div>

                  {/* Submit Button using Button-in-Button Trailing Icon */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-between gap-4 py-3.5 px-6 rounded-full bg-[#C85A32] text-[#F4F1EA] font-mono text-[10px] font-bold tracking-widest hover:bg-[#C85A32]/90 active:scale-[0.98] transition-all duration-300 shadow-md group cursor-pointer"
                  >
                    <span>REQUEST COUNTER SEAT</span>
                    <span className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={10} />
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 pt-2 font-mono text-[7px] text-[#A0A09A] tracking-wider uppercase">
                    <CheckCircle size={10} className="text-[#C85A32]" />
                    NO BOOKING FEE · SMS STATUS VERIFICATION
                  </div>
                </form>
              )}
            </DoubleBezelCard>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-white/5 text-center bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[9px] tracking-[0.2em] text-[#A0A09A]">
          <span className="uppercase">
            © {new Date().getFullYear()} KIRI RAMEN. Kyoto & Overseas.
          </span>
          <div className="flex gap-6 uppercase">
            <a href="#menu" className="hover:text-[#F4F1EA]">MENU</a>
            <a href="#ritual" className="hover:text-[#F4F1EA]">RITUAL</a>
            <a href="#reserve" className="hover:text-[#F4F1EA]">RESERVATIONS</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
