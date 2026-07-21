# Olympus FC Monochrome Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `src/pages/SoccerTeam.tsx` (route `/soccer-team`) from scratch as a pure black-and-white "Minimalist Monochrome" editorial showcase page, per the approved spec `docs/superpowers/specs/2026-07-21-olympus-fc-redesign-design.md`.

**Architecture:** One rebuilt page file (repo pattern: sandbox pages are single-file) plus one new self-contained WebGL component (`DitherField`). Reuses existing `SplitLine`, `usePlateStrike`, `useMotionPrefs`, `useRouteFonts`, GSAP/ScrollTrigger (already Lenis-bridged) and Framer Motion. Deletes `HolographicBall`.

**Tech Stack:** React 19, TypeScript, Tailwind v4 (arbitrary values), Framer Motion, GSAP ScrollTrigger, raw WebGL (no libraries).

## Global Constraints

- **Read the spec first**: `docs/superpowers/specs/2026-07-21-olympus-fc-redesign-design.md`. It is the design contract; this plan is the build order.
- **Colors:** only `#000000`, `#FFFFFF`, `#F5F5F5` (muted bg), `#525252` (secondary text), `#E5E5E5` (hairlines). No other color anywhere on this page. No gradients except the RNRN texture patterns and mask gradients.
- **Zero `border-radius`, zero `box-shadow`, zero backdrop blur on chrome** (backdrop-filter is allowed ONLY inside the GradualBlur stacks).
- **No new npm dependencies. No Playwright.** Verification = `npm run lint` (tsc) + dev-server eyeball check (`npm run dev`, port 3000).
- **No parallax, no bouncy/floating idle animation.** Hover/focus transitions ≤ 100ms (`duration-100` or `transition-none`); the ONE exception is the Arena image hover (300ms, sanctioned by spec §5.9). Scroll/load reveals are smooth (0.5–0.9s) and fire **once**.
- **All reveals** go through `useMotionPrefs()` (`src/lib/motion.ts`) — reduced motion ⇒ content immediately visible, no loops.
- **GSAP-driven reveals must be disabled when `isPreview`** (modal scrolls in a div; window-scroller ScrollTriggers would never fire and content would stay hidden). Framer `whileInView` (IntersectionObserver) works everywhere and needs no gating.
- **Every button/link is dead** (`<button type="button">` with no handler, or `href="#"` + `preventDefault`) EXCEPT the header Back/Close button, which keeps its current behavior (`onClose()` if provided else `navigate("/portfolio")`).
- **Component contract preserved:** `export default function SoccerTeam({ isPreview = false, onClose, isCardPreview = false }: SoccerTeamProps)`. `fixed` → `absolute` when `isPreview` (header, veil, textures).
- **Fonts on elements via inline style constants** (repo idiom): `DISPLAY` = Playfair Display, `MONO` = JetBrains Mono; body font (Source Serif 4) set once on the page root.
- **Commit after every task** on the current branch. Message style: repo uses conventional-ish prefixes (`feat:`, `refactor:`, `chore:`).
- Mono/label text minimum `text-[10px]` — do not copy the old page's 8px labels.
- Keep `docs/` and this plan out of implementation commits (they're already committed).

**Verification loop for every task** (referenced as "VERIFY" below):
1. `npm run lint` → expect exit 0, no output. (Pre-existing errors unrelated to touched files: report, don't fix.)
2. If the dev server isn't running: `npm run dev` (background) → open `http://localhost:3000/soccer-team`, check the task's visual checklist.

---

### Task 1: Fonts + page scaffold (root, tokens, helpers, header, footer)

**Files:**
- Modify: `src/hooks/useRouteFonts.ts` (add one export at the bottom)
- Modify: `src/pages/SoccerTeam.tsx` (full rewrite — delete ALL existing content)

**Interfaces:**
- Produces (used by every later task, all module-level in `SoccerTeam.tsx`):
  - `const DISPLAY: { fontFamily: string }`, `const MONO: { fontFamily: string }`
  - `const dead: (e: React.SyntheticEvent) => void`
  - `function Rule({ weight?: 1|2|4|8, className?: string, animated?: boolean })` — black horizontal rule; `animated` adds `data-rule` (picked up by Task 2's draw-in hook)
  - `function SectionIndex({ n, label }: { n: string; label: string })` — mono kicker `01 — THE CLUB`
  - `function ImagePlaceholder({ description, treatment?, aspect?, inverted?, className? }: { description: string; treatment?: string; aspect?: string; inverted?: boolean; className?: string })`
  - `function Counter({ target, suffix? }: { target: number; suffix?: string })`
  - `const NOISE_BG: string` (data-URI noise), `const TEXTURE: Record<"lines"|"grid"|"diag"|"vlinesWhite", React.CSSProperties>`
  - Page root `<div ref={rootRef}>` with fonts/colors; header + footer rendered; `<main>` contains a `{/* SECTIONS */}` marker where Tasks 2–10 insert sections in order.

- [ ] **Step 1: Add the font href**

Append to `src/hooks/useRouteFonts.ts`:

```ts
export const MONOCHROME_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..600;1,8..60,300..600&family=JetBrains+Mono:wght@300..700&display=swap";
```

- [ ] **Step 2: Rewrite `src/pages/SoccerTeam.tsx` as the scaffold**

Replace the entire file with:

```tsx
import { motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRouteFonts, MONOCHROME_FONTS_HREF } from "../hooks/useRouteFonts";
import { useMotionPrefs, EASE_ENTER } from "../lib/motion";
import SplitLine from "../components/SplitLine";
import { usePlateStrike } from "../hooks/useBroadsheetMotion";
import { gsap } from "../lib/gsapSetup";

// ---------------------------------------------------------------- tokens
const DISPLAY = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const MONO = { fontFamily: "'JetBrains Mono', monospace" } as const;

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// RNRN.txt required textures — rendered as absolutely-positioned overlays.
const TEXTURE: Record<"lines" | "grid" | "diag" | "vlinesWhite", React.CSSProperties> = {
  lines: {
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
    backgroundSize: "100% 4px",
    opacity: 0.015,
  },
  grid: {
    backgroundImage:
      "linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    opacity: 0.4,
  },
  diag: {
    backgroundImage:
      "repeating-linear-gradient(45deg, transparent, transparent 40px, #00000010 40px, #00000010 42px)",
    opacity: 0.5,
  },
  vlinesWhite: {
    backgroundImage:
      "repeating-linear-gradient(90deg, transparent, transparent 1px, #fff 1px, #fff 2px)",
    backgroundSize: "4px 100%",
    opacity: 0.03,
  },
};

function Texture({ style }: { style: React.CSSProperties }) {
  return <div aria-hidden className="pointer-events-none absolute inset-0" style={style} />;
}

// ---------------------------------------------------------------- helpers
const dead = (e: React.SyntheticEvent) => e.preventDefault();

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_ENTER } },
};

function Rule({ weight = 4, className = "", animated = false }: {
  weight?: 1 | 2 | 4 | 8; className?: string; animated?: boolean;
}) {
  return (
    <div
      aria-hidden
      data-rule={animated || undefined}
      className={`w-full bg-black origin-left ${className}`}
      style={{ height: weight }}
    />
  );
}

function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <p className="text-[11px] tracking-[0.25em] uppercase text-[#525252]" style={MONO}>
      {n} — {label}
    </p>
  );
}

function ImagePlaceholder({ description, treatment = "GRAYSCALE · HIGH CONTRAST", aspect = "4 / 5", inverted = false, className = "" }: {
  description: string; treatment?: string; aspect?: string; inverted?: boolean; className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-2 ${inverted ? "border-white bg-black" : "border-black bg-[#F5F5F5]"} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={inverted ? "#3F3F3F" : "#D4D4D4"} strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={inverted ? "#3F3F3F" : "#D4D4D4"} strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className={`border px-4 py-3 text-center max-w-[36ch] ${inverted ? "border-white bg-black text-white" : "border-black bg-white"}`}>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={MONO}>[ image ]</p>
          <p className={`mt-2 text-[10px] leading-relaxed uppercase tracking-wider ${inverted ? "text-[#A3A3A3]" : "text-[#525252]"}`} style={MONO}>
            {description}
          </p>
          <p className={`mt-2 text-[9px] tracking-[0.2em] ${inverted ? "text-[#A3A3A3]" : "text-[#525252]"}`} style={MONO}>{treatment}</p>
        </div>
      </div>
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotionPrefs();

  useEffect(() => {
    if (reduced) { setCount(target); return; }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const durationMs = 1500;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        setCount(Math.floor((1 - Math.pow(1 - progress, 4)) * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [target, reduced]);

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

// ---------------------------------------------------------------- page
interface SoccerTeamProps {
  isPreview?: boolean;
  onClose?: () => void;
  isCardPreview?: boolean;
}

export default function SoccerTeam({ isPreview = false, onClose, isCardPreview = false }: SoccerTeamProps) {
  useRouteFonts([MONOCHROME_FONTS_HREF]);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPrefs();

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, []);

  // GSAP reveals only make sense against the window scroller — see Global Constraints.
  const gsapReveals = fontsReady && !isPreview && !isCardPreview;

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-screen overflow-x-hidden bg-white text-black selection:bg-black selection:text-white"
      style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
    >
      {/* global paper noise */}
      <div
        aria-hidden
        className={`${isPreview ? "absolute" : "fixed"} inset-0 pointer-events-none z-40`}
        style={{ backgroundImage: NOISE_BG, opacity: 0.02 }}
      />

      {/* ------------------------------------------------ header */}
      <header className={`${isPreview ? "absolute" : "fixed"} top-0 left-0 w-full z-50 bg-white border-b border-black`}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 select-none">
            <span aria-hidden className="block w-2 h-2 bg-black" />
            <span className="text-lg font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["Squad", "Fixtures", "Arena", "Club"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-black focus-visible:border-black focus-visible:outline-none transition-none py-2"
                style={MONO}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { if (onClose) onClose(); else navigate("/portfolio"); }}
              className="text-[10px] tracking-[0.25em] uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-2 min-h-[44px] px-2 cursor-pointer"
              style={MONO}
            >
              {onClose ? "Close" : "Back"}
            </button>
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 bg-black text-white px-5 min-h-[44px] text-[10px] tracking-[0.25em] uppercase font-medium border border-black hover:bg-white hover:text-black transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
              style={MONO}
            >
              Season Tickets <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* SECTIONS — Tasks 2–10 insert here, in spec order */}
      </main>

      {/* ------------------------------------------------ footer */}
      <footer className="relative border-t border-black py-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="block w-2 h-2 bg-black" />
            <span className="text-base font-bold tracking-tight" style={DISPLAY}>Olympus FC</span>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Press"].map((item) => (
              <a key={item} href="#" onClick={dead}
                className="text-[10px] tracking-[0.25em] uppercase border-b border-transparent hover:border-black focus-visible:border-black focus-visible:outline-none py-2"
                style={MONO}>
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#525252]" style={MONO}>
            © {new Date().getFullYear()} Olympus FC — A design study
          </p>
        </div>
      </footer>
    </div>
  );
}
```

Note: several helpers (`SplitLine`, `usePlateStrike`, `gsap`, `motion`, `stagger`, `fadeUp`, `Rule`, `SectionIndex`, `ImagePlaceholder`, `Counter`, `Texture`, `TEXTURE`, `gsapReveals`, `reduced`, `isCardPreview`) stay unused until Tasks 2–10. The repo's `tsconfig.json` has neither `strict` nor `noUnusedLocals`, so `npm run lint` will not flag them — leave them as-is.

- [ ] **Step 3: VERIFY** — lint passes; `/soccer-team` shows white page, black-bordered header with wordmark/nav/dead CTA + working Back, footer. All corners sharp, no color.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRouteFonts.ts src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): monochrome scaffold — fonts, tokens, header, footer"
```

---

### Task 2: DitherField component + Hero section + rule draw-in hook

**Files:**
- Create: `src/components/DitherField.tsx`
- Modify: `src/pages/SoccerTeam.tsx` (insert hero as first child of `<main>`; add `useRuleDraw` hook near other helpers; call it in the component)

**Interfaces:**
- Consumes: Task 1 helpers (`Rule`, `MONO`, `DISPLAY`, `dead`, `Texture`, `TEXTURE`, `gsapReveals`).
- Produces: `DitherField({ animate?: boolean; pixelSize?: number; speed?: number; className?: string })` (default export); `useRuleDraw(rootRef, enabled)` — animates every `[data-rule]` with `scaleX` 0→1 on scroll, once.

- [ ] **Step 1: Create `src/components/DitherField.tsx`**

```tsx
import { useEffect, useRef } from "react";

/**
 * Two-tone animated Bayer-dither noise field ("Dither" from the spec),
 * self-contained raw WebGL — no three.js. Black ink on white paper.
 * animate=false renders exactly one static frame (reduced motion / previews).
 */
const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_pixel;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

float bayer4(vec2 cell) {
  vec2 m = floor(mod(cell, 4.0));
  int idx = int(m.x) + int(m.y) * 4;
  float b = 0.0;
  if (idx == 0) b = 0.0;  else if (idx == 1) b = 8.0;  else if (idx == 2) b = 2.0;  else if (idx == 3) b = 10.0;
  else if (idx == 4) b = 12.0; else if (idx == 5) b = 4.0;  else if (idx == 6) b = 14.0; else if (idx == 7) b = 6.0;
  else if (idx == 8) b = 3.0;  else if (idx == 9) b = 11.0; else if (idx == 10) b = 1.0; else if (idx == 11) b = 9.0;
  else if (idx == 12) b = 15.0; else if (idx == 13) b = 7.0; else if (idx == 14) b = 13.0; else b = 5.0;
  return (b + 0.5) / 16.0;
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_pixel);
  vec2 uv = (cell * u_pixel) / u_res;
  uv.x *= u_res.x / u_res.y;
  float v = fbm(uv * 3.0 + vec2(u_time * 0.06, u_time * 0.03));
  v = smoothstep(0.35, 0.75, v);
  float ink = step(bayer4(cell), v);
  gl_FragColor = vec4(vec3(ink), 1.0);
}
`;

interface DitherFieldProps {
  animate?: boolean;
  pixelSize?: number; // CSS px per dither cell
  speed?: number;
  className?: string;
}

export default function DitherField({ animate = true, pixelSize = 2.5, speed = 1, className = "" }: DitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return; // graceful degradation: section textures carry the hero

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPixel = gl.getUniformLocation(program, "u_pixel");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.clientWidth; const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uPixel, Math.max(1, Math.round(pixelSize * dpr)));
    };

    const start = performance.now();
    const draw = () => {
      gl.uniform1f(uTime, ((performance.now() - start) / 1000) * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0; let timer = 0; let running = false;
    let inView = true; let pageVisible = !document.hidden;

    const loop = () => {
      draw();
      // ponytail: 30fps cap via setTimeout+rAF; it's a texture, not a game
      timer = window.setTimeout(() => { raf = requestAnimationFrame(loop); }, 1000 / 30);
    };
    const syncLoop = () => {
      const shouldRun = animate && inView && pageVisible;
      if (shouldRun && !running) { running = true; loop(); }
      if (!shouldRun && running) { running = false; clearTimeout(timer); cancelAnimationFrame(raf); }
    };

    resize();
    draw(); // always paint at least one frame

    const ro = new ResizeObserver(() => { resize(); if (!running) draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncLoop(); });
    io.observe(canvas);
    const onVis = () => { pageVisible = !document.hidden; syncLoop(); };
    document.addEventListener("visibilitychange", onVis);
    syncLoop();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [animate, pixelSize, speed]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
```

- [ ] **Step 2: Add `useRuleDraw` to `SoccerTeam.tsx`** (below the other helpers, above the page component)

```tsx
/** Draws every [data-rule] in from the left on scroll, once. Window scroller only. */
function useRuleDraw(rootRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const { reduced } = useMotionPrefs();
  useEffect(() => {
    if (!enabled || reduced) return;
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((rule) => {
        gsap.fromTo(rule, { scaleX: 0 }, {
          scaleX: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: rule, start: "top 92%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [rootRef, enabled, reduced]);
}
```

Inside the `SoccerTeam` component body add: `useRuleDraw(rootRef, gsapReveals);`
Also add a headline ref + plate strike: `const heroRef = useRef<HTMLDivElement>(null); usePlateStrike(heroRef, gsapReveals, { stagger: 0.08, distance: -40 });`

- [ ] **Step 3: Insert the hero section** (first child of `<main>`)

```tsx
{/* ---------------------------------------------- 00 · hero */}
<section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-16">
  {/* dither field band, behind content */}
  <div aria-hidden className="absolute inset-x-0 bottom-0 top-1/3 opacity-[0.55]">
    <DitherField animate={!isCardPreview && !reduced} speed={0.4} />
    {/* fade the field's top edge into the page */}
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />
  </div>
  <Texture style={TEXTURE.lines} />

  <div ref={heroRef} className="relative max-w-6xl mx-auto w-full px-6 md:px-8 lg:px-12 py-24">
    {/* kicker */}
    <div className="flex items-center gap-4">
      <span aria-hidden className="h-px w-12 bg-black" />
      <p className="text-[11px] tracking-[0.3em] uppercase" style={MONO}>
        Est. 2018 — Athletic Club — Division I
      </p>
      <span aria-hidden className="h-px flex-1 bg-black" />
    </div>

    {/* headline */}
    <h1
      className="mt-8 font-black uppercase leading-[0.85] tracking-tighter text-[clamp(4rem,17vw,15rem)]"
      style={DISPLAY}
    >
      <SplitLine text="OLYMPUS" />
    </h1>
    <p className="mt-2 md:text-right italic text-[clamp(1.75rem,5vw,4rem)] leading-none" style={DISPLAY}>
      <SplitLine text="Football Club" />
    </p>

    {/* RNRN hero punctuation: thick rule terminated by a bordered square */}
    <div className="mt-10 flex items-center gap-3">
      <Rule weight={4} animated className="flex-1" />
      <span aria-hidden className="block w-3 h-3 border-2 border-black shrink-0" />
    </div>

    {/* meta + CTAs */}
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
      <div className="flex flex-wrap items-center gap-4">
        <button type="button"
          className="flex items-center gap-2 bg-black text-white px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border border-black hover:bg-white hover:text-black transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
          style={MONO}>
          Match Programme <span aria-hidden>→</span>
        </button>
        <button type="button"
          className="px-8 py-4 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border-2 border-black hover:bg-black hover:text-white transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
          style={MONO}>
          The Squad
        </button>
      </div>

      <motion.dl
        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="justify-self-stretch md:justify-self-end w-full md:max-w-xs text-[11px] uppercase tracking-[0.15em]"
        style={MONO}
      >
        {[
          ["Next fixture", "Olympus v Stellar FC — Jun 22"],
          ["Kick-off", "21:00 — Olympus Arena"],
          ["Position", "1st — Division I"],
        ].map(([k, v]) => (
          <motion.div key={k} variants={fadeUp} className="flex justify-between gap-6 border-t border-[#E5E5E5] py-3 last:border-b">
            <dt className="text-[#525252]">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </div>
  </div>
</section>
```

Add import at top of the page file: `import DitherField from "../components/DitherField";`

- [ ] **Step 4: VERIFY** — lint passes. Hero: giant serif OLYMPUS reveals word-rise on load (fonts gate), dither halftone drifts slowly behind the lower half in pure b/w, thick rule draws in, meta rows stagger. With OS reduced-motion: everything visible instantly, dither static.

- [ ] **Step 5: Commit**

```bash
git add src/components/DitherField.tsx src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): WebGL dither field + editorial hero"
```

---

### Task 3: Marquee band + GradualBlur

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (insert after hero; add `GradualBlur` helper + marquee keyframes; mount bottom veil)

**Interfaces:**
- Consumes: Task 1 helpers.
- Produces: `function GradualBlur({ direction }: { direction: "bottom" | "left" | "right" })` — absolutely-positioned progressive-blur stack filling its parent (parent must be `relative` + sized + `pointer-events-none`).

- [ ] **Step 1: Add the marquee keyframes and `GradualBlur`**

Inside the page root div (anywhere top-level in the JSX), add a scoped style tag:

```tsx
<style>{`
  @keyframes olympus-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
`}</style>
```

Helper (module level):

```tsx
const BLUR_STEPS = [0.5, 1, 2, 4, 8];
function GradualBlur({ direction }: { direction: "bottom" | "left" | "right" }) {
  const toEdge = direction === "bottom" ? "to top" : direction === "left" ? "to right" : "to left";
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {BLUR_STEPS.map((px, i) => {
        // each layer blurs a progressively nearer-the-edge band
        const from = 100 - (i + 1) * (100 / BLUR_STEPS.length);
        const mask = `linear-gradient(${toEdge}, black ${from}%, transparent ${from + 100 / BLUR_STEPS.length + 10}%)`;
        return (
          <div key={px} className="absolute inset-0"
            style={{ backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`, maskImage: mask, WebkitMaskImage: mask }} />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Insert the marquee section** (after hero, inside `<main>`)

```tsx
{/* ---------------------------------------------- marquee */}
<section aria-hidden className="relative bg-black text-white overflow-hidden select-none">
  <Rule weight={4} className="absolute top-0" />
  <div className="py-6 overflow-hidden relative">
    <div
      className="flex w-max whitespace-nowrap will-change-transform"
      style={(reduced || isCardPreview) ? undefined : { animation: "olympus-marquee 28s linear infinite" }}
    >
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center">
          {["Olympus FC", "Est. MMXVIII", "Fortuna Audaces Iuvat", "The Unbeaten Treble"].map((text) => (
            <span key={text} className="flex items-center">
              <span className="px-8 text-2xl md:text-3xl uppercase font-bold tracking-tight" style={DISPLAY}>{text}</span>
              <span className="block w-2 h-2 bg-white" />
            </span>
          ))}
        </div>
      ))}
    </div>
    {/* gradual blur at both ends of the band */}
    <div className="absolute inset-y-0 left-0 w-24"><GradualBlur direction="left" /></div>
    <div className="absolute inset-y-0 right-0 w-24"><GradualBlur direction="right" /></div>
  </div>
  <Rule weight={4} className="absolute bottom-0" />
</section>
```

- [ ] **Step 3: Mount the viewport bottom veil** (sibling of `<main>`, before the footer):

```tsx
{!isPreview && !isCardPreview && (
  <div aria-hidden className="fixed bottom-0 left-0 right-0 h-28 z-30 pointer-events-none">
    <GradualBlur direction="bottom" />
  </div>
)}
```

- [ ] **Step 4: VERIFY** — lint passes. Black band with white serif marquee scrolling seamlessly (no jump at loop point — the track is two identical copies and translates exactly -50%); both edges melt into blur; content softly blurs at the bottom of the viewport while scrolling. Reduced motion: marquee static.

- [ ] **Step 5: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): marquee band + gradual blur veils"
```

---

### Task 4: Manifesto section ("01 — The Club")

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (insert after marquee; add `manifestoRef` + plate strike)

**Interfaces:** Consumes Task 1 helpers + `usePlateStrike`.

- [ ] **Step 1: Add heading ref** in the component body: `const manifestoRef = useRef<HTMLDivElement>(null); usePlateStrike(manifestoRef, gsapReveals, { stagger: 0.06 });`

- [ ] **Step 2: Insert the section**

```tsx
{/* ---------------------------------------------- 01 · the club */}
<section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
  <Texture style={TEXTURE.grid} />
  <div className="relative max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      <div className="lg:col-span-5" ref={manifestoRef}>
        <SectionIndex n="01" label="The Club" />
        <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight" style={DISPLAY}>
          <SplitLine text="Discipline is a style." />
        </h2>
        <Rule weight={2} animated className="mt-8 max-w-[120px]" />
      </div>

      <div className="lg:col-span-7 text-lg leading-relaxed max-w-[62ch]">
        <p>
          <span aria-hidden className="float-left mr-4 mt-1 flex h-16 w-16 items-center justify-center border-2 border-black text-5xl font-bold leading-none" style={DISPLAY}>F</span>
          <span aria-hidden>ounded</span><span className="sr-only">Founded</span> in 2018, Olympus was built on a
          refusal: that athletic ambition and visual restraint could not share a crest. The club plays in black and
          white because the game, reduced to its essence, is geometry — lines held, angles closed, space created
          and denied.
        </p>
        <p className="mt-6">
          Every department of the club answers to the same standard. The pitch is measured, the press is
          choreographed, the badge is set in serif. Nothing decorative survives unless it works.
        </p>
      </div>
    </div>

    {/* pull quote */}
    <motion.figure
      variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
      className="mt-20 md:mt-28 border-t border-b border-black py-12 md:py-16 relative"
    >
      <span aria-hidden className="absolute -top-2 left-0 text-8xl md:text-9xl leading-none opacity-10 select-none" style={DISPLAY}>“</span>
      <blockquote className="italic text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto text-center" style={DISPLAY}>
        We do not chase the ball. We move the geometry until the ball arrives.
      </blockquote>
      <figcaption className="mt-8 text-center text-[11px] tracking-[0.3em] uppercase text-[#525252]" style={MONO}>
        R. Vallgren — Head Coach
      </figcaption>
    </motion.figure>
  </div>
</section>
```

(Drop-cap accessibility: the boxed `F` and the visible `ounded` are both `aria-hidden`; screen readers get the full word from the `sr-only` span — keep that exact pattern.)

- [ ] **Step 3: VERIFY** — lint passes. Two-column editorial spread, boxed drop cap, faint grid texture, centered italic pull quote between rules. Heading line-rises on scroll (standalone route), instantly visible in modal preview.

- [ ] **Step 4: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): manifesto spread with drop cap and pull quote"
```

---

### Task 5: Squad index ("02 — First Team")

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (data + section after manifesto)

**Interfaces:** Consumes Task 1 helpers. Produces module-level `const SQUAD: { group: string; players: { n: number; name: string; pos: string; nat: string }[] }[]` (Task 6 references player №9 conceptually only — no code dependency).

- [ ] **Step 1: Add the data** (module level):

```tsx
const SQUAD = [
  { group: "Goalkeepers", players: [
    { n: 1, name: "Álvaro Montero", pos: "Goalkeeper", nat: "COL" },
  ]},
  { group: "Defenders", players: [
    { n: 2, name: "James O'Brien", pos: "Right-Back", nat: "IRL" },
    { n: 3, name: "Yuto Nakamura", pos: "Left-Back", nat: "JPN" },
    { n: 4, name: "Lucas Delvaux", pos: "Centre-Back", nat: "BEL" },
    { n: 5, name: "Karim Hadj", pos: "Centre-Back", nat: "ALG" },
  ]},
  { group: "Midfielders", players: [
    { n: 6, name: "André Ferreira", pos: "Defensive Mid", nat: "POR" },
    { n: 8, name: "Sami El-Masri", pos: "Central Mid", nat: "EGY" },
    { n: 10, name: "Nils Eriksen", pos: "Attacking Mid", nat: "NOR" },
  ]},
  { group: "Forwards", players: [
    { n: 7, name: "Diego Vargas", pos: "Right Wing", nat: "ARG" },
    { n: 9, name: "Luca Moretti", pos: "Striker", nat: "ITA" },
    { n: 11, name: "Moussa Diallo", pos: "Left Wing", nat: "SEN" },
  ]},
];
```

- [ ] **Step 2: Insert the section** (after manifesto)

```tsx
{/* ---------------------------------------------- 02 · first team */}
<section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
  <Rule weight={4} className="absolute top-0 left-0" />
  <div className="max-w-6xl mx-auto">
    <div className="flex items-end justify-between gap-6">
      <div>
        <SectionIndex n="02" label="First Team" />
        <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Eleven</h2>
      </div>
      <p className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#525252] pb-2" style={MONO}>Season 2026–27</p>
    </div>

    <div className="mt-16">
      {SQUAD.map(({ group, players }) => (
        <div key={group} className="mt-12 first:mt-0">
          <div className="flex items-baseline justify-between border-b-2 border-black pb-3">
            <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold" style={MONO}>{group}</h3>
            <span className="text-[11px] tracking-[0.2em] text-[#525252]" style={MONO}>/ {players.length}</span>
          </div>
          <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {players.map((p) => (
              <motion.li key={p.n} variants={fadeUp}>
                <div className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_1fr_10rem_4rem_3rem] items-center gap-4 border-b border-black py-5 px-2 -mx-2 hover:bg-black hover:text-white transition-none cursor-default">
                  <span className="text-lg md:text-xl tabular-nums text-[#525252] group-hover:text-white" style={MONO}>
                    {String(p.n).padStart(2, "0")}
                  </span>
                  <span className="text-2xl md:text-3xl tracking-tight" style={DISPLAY}>{p.name}</span>
                  <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-[#525252] group-hover:text-white" style={MONO}>{p.pos}</span>
                  <span className="text-[11px] tracking-[0.2em] justify-self-end md:justify-self-start" style={MONO}>{p.nat}</span>
                  <span aria-hidden className="hidden md:block justify-self-end text-xl">→</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: VERIFY** — lint passes. Masthead table: 4 groups, 11 rows, hairline rules; hovering any row inverts it fully black/white with **no** transition delay; rows stagger-rise in on first scroll; no flags, no photos.

- [ ] **Step 4: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): masthead squad index with row inversion"
```

---

### Task 6: Featured player spread (№9, shape-blur cursor reveal)

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (add `CursorRevealPanel` helper + section after squad)

**Interfaces:** Consumes Task 1 helpers (`ImagePlaceholder`, `Counter`). Produces `function CursorRevealPanel({ children, disabled }: { children: React.ReactNode; disabled?: boolean })`.

- [ ] **Step 1: Add `CursorRevealPanel`** (module level). Two stacked copies of the child: a dimmed base and a full layer masked by a blurred circle that lerps toward the pointer.

```tsx
function CursorRevealPanel({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 50, y: 50, tx: 50, ty: 50, raf: 0, active: false });

  const stop = () => { cancelAnimationFrame(state.current.raf); state.current.active = false; };
  useEffect(() => stop, []);

  if (disabled) return <div>{children}</div>;

  const tick = () => {
    const s = state.current;
    s.x += (s.tx - s.x) * 0.12;
    s.y += (s.ty - s.y) * 0.12;
    const el = overlayRef.current;
    if (el) {
      el.style.setProperty("--mx", `${s.x}%`);
      el.style.setProperty("--my", `${s.y}%`);
    }
    if (Math.abs(s.tx - s.x) + Math.abs(s.ty - s.y) > 0.1 || s.active) {
      s.raf = requestAnimationFrame(tick);
    }
  };

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        const s = state.current;
        s.tx = ((e.clientX - rect.left) / rect.width) * 100;
        s.ty = ((e.clientY - rect.top) / rect.height) * 100;
        if (!s.active) { s.active = true; s.raf = requestAnimationFrame(tick); }
      }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") stop(); }}
    >
      {/* dimmed base — always visible so touch/no-hover still sees content */}
      <div className="opacity-40" aria-hidden>{children}</div>
      {/* full layer revealed through a soft cursor-following mask */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          ["--mx" as string]: "50%",
          ["--my" as string]: "50%",
          maskImage: "radial-gradient(circle 200px at var(--mx) var(--my), black 35%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle 200px at var(--mx) var(--my), black 35%, transparent 75%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Insert the section** (after squad). In the component body nothing new is needed; `reduced` and `isCardPreview` exist.

```tsx
{/* ---------------------------------------------- featured №9 */}
<section className="relative bg-black text-white py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
  <Texture style={TEXTURE.vlinesWhite} />
  <div className="relative max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-6 relative">
        <p className="text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>Featured — Striker</p>
        <div aria-hidden className="leading-[0.75] font-black text-[clamp(10rem,28vw,22rem)] select-none -ml-4" style={DISPLAY}>9</div>
        <h2 className="mt-4 text-4xl md:text-5xl tracking-tight" style={DISPLAY}>Luca Moretti</h2>
        <p className="mt-3 text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>№ 9 — Striker — Italy</p>
      </div>

      <div className="lg:col-span-6">
        <CursorRevealPanel disabled={reduced || isCardPreview}>
          <ImagePlaceholder
            inverted
            description="Full-body studio portrait of striker Luca Moretti, black & white, dark background"
            treatment="GRAYSCALE · HIGH CONTRAST · DARK SET"
            aspect="4 / 5"
          />
        </CursorRevealPanel>
      </div>
    </div>

    {/* stat strip */}
    <div className="mt-16 grid grid-cols-3 border-t border-b border-white/40 divide-x divide-white/40 text-center">
      {[
        { target: 24, label: "Goals" },
        { target: 12, label: "Assists" },
        { target: 32, label: "Matches" },
      ].map(({ target, label }) => (
        <div key={label} className="py-8">
          <p className="text-4xl md:text-5xl font-bold" style={DISPLAY}><Counter target={target} /></p>
          <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>{label}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

(`inverted` is the prop defined in Task 1's `ImagePlaceholder` — white borders/lines, black caption card, gray caption text — for use on black sections.)

- [ ] **Step 3: VERIFY** — lint passes. Black spread, giant white "9", portrait placeholder dimmed at rest; moving the mouse over it reveals full brightness through a soft trailing circle. Touch/reduced-motion/card-preview: placeholder fully visible, no effect. Counters tick.

- [ ] **Step 4: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): featured no.9 spread with cursor reveal"
```

---

### Task 7: Fixtures ledger ("03 — Fixtures")

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (data + section after featured player)

**Interfaces:** Consumes Task 1 helpers. Produces module-level `const FIXTURES`.

- [ ] **Step 1: Data** (module level):

```tsx
const FIXTURES = [
  { home: "Olympus FC", away: "Titan Athletic", date: "Jun 08", venue: "Olympus Arena", score: "3–1" },
  { home: "Nova United", away: "Olympus FC", date: "Jun 15", venue: "Nova Park", score: "1–2" },
  { home: "Olympus FC", away: "Stellar FC", date: "Jun 22", venue: "Olympus Arena", score: null },
  { home: "Phoenix Rising", away: "Olympus FC", date: "Jun 29", venue: "Phoenix Stadium", score: null },
  { home: "Olympus FC", away: "Apex City", date: "Jul 06", venue: "Olympus Arena", score: null },
] as const;
```

- [ ] **Step 2: Section** (after featured player):

```tsx
{/* ---------------------------------------------- 03 · fixtures */}
<section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
  <Texture style={TEXTURE.diag} />
  <div className="relative max-w-6xl mx-auto">
    <SectionIndex n="03" label="Fixtures" />
    <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl tracking-tight" style={DISPLAY}>The Ledger</h2>

    <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 border-t border-black">
      {FIXTURES.map((f) => {
        const olympusHome = f.home === "Olympus FC";
        return (
          <motion.li key={`${f.home}-${f.away}`} variants={fadeUp}>
            <div className="group grid grid-cols-1 md:grid-cols-[6rem_1fr_auto] items-center gap-4 md:gap-8 border-b border-black hover:border-b-[3px] hover:-mb-[2px] py-8 transition-none">
              <div style={MONO} className="text-[11px] tracking-[0.25em] uppercase text-[#525252]">
                {f.date}
                <span className="block mt-1 text-[10px] normal-case tracking-[0.15em]">{f.venue}</span>
              </div>
              <p className="text-2xl md:text-4xl tracking-tight" style={DISPLAY}>
                <span className={olympusHome ? "font-bold" : ""}>{f.home}</span>
                <span className="italic text-[#525252] mx-3 text-xl md:text-2xl">vs</span>
                <span className={!olympusHome ? "font-bold" : ""}>{f.away}</span>
              </p>
              {f.score ? (
                <p className="text-4xl md:text-5xl font-bold tabular-nums justify-self-start md:justify-self-end" style={DISPLAY}>{f.score}</p>
              ) : (
                <button type="button"
                  className="justify-self-start md:justify-self-end text-[11px] tracking-[0.25em] uppercase border-2 border-black px-6 py-3 min-h-[44px] hover:bg-black hover:text-white transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-black focus-visible:outline-offset-[3px] cursor-pointer"
                  style={MONO}>
                  Reserve <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  </div>
</section>
```

- [ ] **Step 3: VERIFY** — lint passes. Ledger rows: mono date/venue, serif matchup with italic "vs", Olympus set bold, oversized scores for played matches, dead outlined Reserve buttons for upcoming; hovering a row visibly thickens its bottom rule with no easing; no layout jump (`-mb-[2px]` compensates).

- [ ] **Step 4: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): fixtures ledger"
```

---

### Task 8: Records — inverted stats band

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (section after fixtures)

**Interfaces:** Consumes Task 1 helpers (`Counter`, `Texture`, `TEXTURE`).

- [ ] **Step 1: Section:**

```tsx
{/* ---------------------------------------------- records */}
<section className="relative bg-black text-white py-24 md:py-32 px-6 md:px-8 lg:px-12 overflow-hidden">
  <Texture style={TEXTURE.vlinesWhite} />
  <div className="relative max-w-6xl mx-auto">
    <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-white/30 text-center">
      {[
        { target: 48, label: "Played" },
        { target: 34, label: "Wins" },
        { target: 87, label: "Goals" },
        { target: 3, suffix: "×", label: "Titles" },
      ].map(({ target, suffix, label }) => (
        <div key={label} className="py-10 px-4">
          <p className="text-7xl md:text-8xl font-bold leading-none" style={DISPLAY}>
            <Counter target={target} suffix={suffix} />
          </p>
          <p className="mt-4 text-[11px] tracking-[0.35em] uppercase text-white/60" style={MONO}>{label}</p>
        </div>
      ))}
    </div>
    <p className="mt-12 pt-8 border-t border-white/30 text-center text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>
      Unbeaten Treble — Domestic League · Continental Cup · Super Cup — 2023
    </p>
  </div>
</section>
```

- [ ] **Step 2: VERIFY** — lint passes. Full-bleed black band, faint vertical white pinstripes, four huge serif figures ticking up once on scroll, mono footnote under a hairline.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): inverted records band"
```

---

### Task 9: The Arena ("04 — The Arena")

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (section after records)

**Interfaces:** Consumes Task 1 helpers (`ImagePlaceholder`, `Rule`, `SectionIndex`).

- [ ] **Step 1: Section:**

```tsx
{/* ---------------------------------------------- 04 · the arena */}
<section className="relative py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12">
  <Texture style={TEXTURE.grid} />
  <div className="relative max-w-6xl mx-auto">
    <SectionIndex n="04" label="The Arena" />
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* image: the ONE sanctioned slow hover (border thickens, content scales, 300ms) */}
      <div className="lg:col-span-7 group">
        <div className="border-2 border-black group-hover:border-4 group-hover:-m-[2px] transition-all duration-100 overflow-hidden">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <ImagePlaceholder
              description="Aerial black & white photograph of the stadium's retractable geometric steel roof"
              treatment="GRAYSCALE · ARCHITECTURAL · AERIAL"
              aspect="16 / 10"
              className="border-0"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <h2 className="text-5xl md:text-6xl tracking-tight" style={DISPLAY}>Olympus Arena</h2>
        <p className="mt-6 text-lg leading-relaxed max-w-[52ch]">
          Opened in 2021, the Olympus Arena seats 42,000 beneath a fully retractable geometric steel roof.
          Hybrid turf, sight-lines engineered to the millimetre, and not a single decorative surface in the building.
        </p>
        <dl className="mt-10" style={MONO}>
          {[
            ["Capacity", "42,000"],
            ["Built", "2021"],
            ["Pitch", "Hybrid"],
            ["Roof", "Retractable"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-t border-[#E5E5E5] last:border-b py-3 text-[11px] tracking-[0.2em] uppercase">
              <dt className="text-[#525252]">{k}</dt>
              <dd className="font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    {/* milestones */}
    <div className="mt-24">
      {[
        { year: "2021", title: "Retractable Canopy & Hybrid Pitch", text: "State-of-the-art hybrid turf and a fully retractable geometric steel roof over the home ground." },
        { year: "2023", title: "The Unbeaten Treble", text: "League, continental cup and super cup lifted in a single season without a defeat." },
        { year: "2025", title: "Digital Arena Integration", text: "Real-time analytics, full-stadium connectivity, and physical-to-virtual matchday sensing." },
      ].map(({ year, title, text }) => (
        <div key={year} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-12 border-t border-black last:border-b py-10 items-baseline">
          <p className="text-5xl md:text-6xl font-bold tabular-nums" style={DISPLAY}>{year}</p>
          <div>
            <h3 className="text-[12px] tracking-[0.3em] uppercase font-bold" style={MONO}>{title}</h3>
            <p className="mt-3 text-base leading-relaxed max-w-[62ch] text-[#525252]">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: VERIFY** — lint passes. Split spread: bordered aerial-placeholder (hover: border 2→4px + inner 105% scale over 300ms, no jump), spec table, three milestone rows with oversized serif years.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): arena spread and milestones"
```

---

### Task 10: Final CTA

**Files:**
- Modify: `src/pages/SoccerTeam.tsx` (last section inside `<main>`, before `</main>`; add `ctaRef` + plate strike)

**Interfaces:** Consumes Task 1 helpers + `usePlateStrike`.

- [ ] **Step 1:** component body: `const ctaRef = useRef<HTMLDivElement>(null); usePlateStrike(ctaRef, gsapReveals, { stagger: 0.07 });`

- [ ] **Step 2: Section:**

```tsx
{/* ---------------------------------------------- final cta */}
<Rule weight={8} />
<section className="relative bg-black text-white py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-12 overflow-hidden">
  <div aria-hidden className="pointer-events-none absolute inset-0"
    style={{ backgroundImage: "radial-gradient(circle at top center, #ffffff, transparent 70%)", opacity: 0.05 }} />
  <div ref={ctaRef} className="relative max-w-4xl mx-auto text-center">
    <h2 className="text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase font-bold" style={DISPLAY}>
      <SplitLine text="Join the First Eleven" />
    </h2>
    <p className="mt-8 text-lg leading-relaxed text-white/70 max-w-[48ch] mx-auto">
      Season 2026–27 registration of interest. Early access to fixtures, programmes and season tickets.
    </p>

    <form onSubmit={dead} className="mt-12 max-w-md mx-auto text-left">
      <label htmlFor="olympus-email" className="block text-[11px] tracking-[0.3em] uppercase text-white/60" style={MONO}>
        Email address
      </label>
      <div className="mt-3 flex items-stretch gap-4">
        <input
          id="olympus-email" type="email" placeholder="name@example.com"
          className="flex-1 min-w-0 bg-transparent border-b-2 border-white px-1 py-3 text-base placeholder:italic placeholder:text-white/40 focus:outline-none focus:border-b-4 focus-visible:border-b-4"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        />
        <button type="submit"
          className="bg-white text-black px-8 min-h-[44px] text-[11px] tracking-[0.25em] uppercase font-medium border border-white hover:bg-black hover:text-white transition-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[3px] cursor-pointer"
          style={MONO}>
          Register <span aria-hidden>→</span>
        </button>
      </div>
      <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-white/40" style={MONO}>
        * A design study — no data is collected, nothing is sent
      </p>
    </form>
  </div>
</section>
```

- [ ] **Step 3: VERIFY** — lint passes. 8px rule, black CTA with faint radial glow texture, headline line-rises, bottom-border input thickens on focus, white button inverts instantly, submit does nothing (no navigation, no console error).

- [ ] **Step 4: Commit**

```bash
git add src/pages/SoccerTeam.tsx
git commit -m "feat(olympus): inverted final cta"
```

---

### Task 11: Integration cleanup + full verification

**Files:**
- Modify: `src/pages/Portfolio.tsx` (one value)
- Modify: `src/data/translations.ts` (two strings)
- Delete: `src/components/HolographicBall.tsx`

**Interfaces:** none new.

- [ ] **Step 1:** In `src/pages/Portfolio.tsx`, change `BG_COLOR`: `soccer: "#FAFAF8"` → `soccer: "#FFFFFF"`.

- [ ] **Step 2:** In `src/data/translations.ts`, replace both `soccerDesc` values:

en:
```
"A ground-up monochrome redesign study for a professional football club. Pure black-and-white editorial design: oversized serif typography, a live WebGL dither field, a masthead-style squad index with full-row inversions, inverted stat bands, and print-inspired rules, textures and drop caps throughout."
```

fr:
```
"Une étude de refonte monochrome conçue de zéro pour un club de football professionnel. Design éditorial en noir et blanc pur : typographie serif surdimensionnée, fond tramé WebGL animé, effectif présenté façon ours de magazine avec inversion des lignes au survol, bandeaux de statistiques inversés, et filets, textures et lettrines inspirés de l'imprimé."
```

- [ ] **Step 3:** Delete `src/components/HolographicBall.tsx` (`git rm src/components/HolographicBall.tsx`). Confirm no remaining references: `grep -rn "HolographicBall" src` → no output. Confirm `FONTSHARE_HREF` no longer imported by SoccerTeam but still by NoodlePlace.

- [ ] **Step 4: Full verification**
  - `npm run lint` → exit 0.
  - `npm run build` → succeeds.
  - Browser sweep at `/soccer-team`: every checklist from Tasks 1–10; strictly no color anywhere (inspect: no navy/gold/emerald remnants); no rounded corners; no shadows.
  - Portfolio route: open the Olympus FC card modal — page renders inside it with all content **visible** (nothing stuck at opacity 0 — this is the `gsapReveals` gate working), white plate behind, Close works. Card thumbnail: static (no marquee movement, static dither frame).
  - Keyboard pass: tab through header, squad rows are not focusable (they're not interactive), dead buttons/links focus with visible 3px outlines, form input focus thickens border.
  - OS reduced-motion: all content visible without animation.

- [ ] **Step 5: Commit**

```bash
git add -A src/pages/Portfolio.tsx src/data/translations.ts src/components
git commit -m "refactor(olympus): integrate monochrome page — modal plate, translations, drop HolographicBall"
```

---

## Post-plan notes for the executor

- The plan's JSX is the contract for structure, classes, and copy — but you are expected to fix small mechanical issues tsc surfaces (e.g. `React.CSSProperties` custom-property casts) without changing the design.
- If nested `backdrop-filter` layers glitch over the moving marquee track in Chromium, replace the marquee's two `GradualBlur` edges with plain mask fades: a single overlay per side, `background: linear-gradient(to right, black, transparent)` — sanctioned by spec §6.2.
- Do not touch `src/index.css`, `vite.config.ts`, routing, or the preloader.
