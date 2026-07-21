# Olympus FC — Minimalist Monochrome Redesign (Design Spec)

**Date:** 2026-07-21
**Target:** `src/pages/SoccerTeam.tsx` (route `/soccer-team`, Portfolio modal preview)
**Design system source:** `RNRN.txt` (repo root) — "Minimalist Monochrome"
**Status:** Approved for planning. Implementation plan: `docs/superpowers/plans/2026-07-21-olympus-fc-redesign-plan.md`

> **Revision (2026-07-21, post-implementation):** at the owner's direction the strict monochrome rule was relaxed to a luxury palette — ivory `#F4EFE4`, ink `#0D0C0A`, deep pine `#14261E`, antique gold `#A07C3E` (light surfaces), champagne `#D8BC80` (dark surfaces). The hero became a full-bleed ink section with the dither field in champagne gold; scroll choreography was extended with a scroll-velocity-reactive marquee, scrubbed parallax drifts (`data-drift`/`data-drift-x`), and clip-path wipe reveals (`data-wipe`). RNRN's "no parallax" rule was consciously overridden by the owner's request for scroll animations.

## 1. Goal

Rebuild the Olympus FC showcase page from the ground up as a **pure black-and-white editorial piece** — a luxury matchday programme / fashion-magazine treatment of a football club. It exists purely to showcase design & engineering skill (an "awwwards-style" piece). Every button/link is decorative and does nothing, except the existing Back/Close chrome. All imagery is placeholder boxes with a caption describing the intended image; the owner fills them in later.

**The one-line brief:** Vogue publishes a football club.

## 2. Non-negotiable constraints

1. **RNRN.txt rules are law for this page:** pure `#000`/`#FFF` (grays only for secondary text/hairlines), zero border-radius, zero box-shadows, serif display type (Playfair Display), oversized headlines (8xl/9xl), line-based structure (hairline → 8px rules), inversion instead of accent color, required layered textures. No other colors — the old navy/cream/gold/emerald palette is gone entirely, including `flagcdn` flag images (nationality becomes mono text: `ITA`, `SEN`, …).
2. **Motion philosophy — two regimes, explicitly split:**
   - **Interaction states (hover/focus/active): instant.** 0–100ms, binary inversions, per RNRN. No easing theatrics on hover.
   - **Storytelling (load/scroll reveals): smooth.** Masked line rises, rule "draw-ins", clip-path wipes, counter ticks — choreographed with GSAP ScrollTrigger (already Lenis-bridged) and Framer Motion. This is the user-requested "awwwards smoothness" and lives alongside RNRN's instant-interaction rule without contradiction.
   - **No parallax, no floating/bouncy elements, no gradient animations** (RNRN's "No" list).
3. **Reduced motion:** every animated surface goes through `useMotionPrefs()` (`src/lib/motion.ts`). Reduced = content visible immediately, marquee static, WebGL canvas renders one static frame (no rAF loop).
4. **Component contract preserved:** `SoccerTeam({ isPreview?, onClose?, isCardPreview? })` — the page renders standalone at `/soccer-team` AND inside Portfolio's modal. `fixed` positioning must become `absolute` when `isPreview` (existing pattern). `isCardPreview` = the tiny card thumbnail: no rAF/WebGL loops, no marquee animation, static everything.
5. **No new npm dependencies.** No three.js, no ogl, no reactbits package. The chosen effects are implemented self-contained (raw WebGL / CSS). Existing deps only: framer-motion, gsap, lenis, lucide-react.
6. **No Playwright / no browser automation** during build. Verification is `npm run lint` + the owner's manual browser pass.

## 3. Animation selection (from the user's reactbits list)

| Effect | Verdict | Treatment |
|---|---|---|
| **Dither** | ✅ Use | Hero background. Animated Bayer-matrix dithered noise field, strictly two-tone black-on-white — reads as living print halftone. Self-written raw WebGL fragment shader (~150 lines, zero deps). |
| **Gradual Blur** | ✅ Use | CSS-only progressive blur: stacked `backdrop-filter: blur()` layers with `mask-image` gradients. Applied as a fixed bottom-of-viewport veil (standalone route only) and on the marquee's left/right edges. |
| **Shape Blur** | ✅ Use (adapted) | Cursor-following soft-edged circular reveal on the Featured Player portrait panel: black panel, pointer reveals the underlying grayscale image placeholder through a blurred radial mask. CSS `mask-image: radial-gradient(...)` driven by pointer position — no WebGL needed. |
| Pixel Blast | ❌ Skip | Inherently colorful/playful; one WebGL surface (Dither) is the budget. |
| Fluid Glass | ❌ Skip | Glassmorphism — banned by both RNRN and CLAUDE.md. |
| Gradient Blinds | ❌ Skip | Color gradients — banned ("No accent colors. Ever."). |
| Grainient | ❌ Skip | Colorful gradients — banned. RNRN's own noise texture supplies the grain. |

RNRN's required static textures (horizontal-line pattern, grid, diagonal, noise SVG, inverted-section variants) are applied per its spec and provide the layered depth.

## 4. Typography & tokens

- **Fonts** (new `MONOCHROME_FONTS_HREF` export in `src/hooks/useRouteFonts.ts`, Google Fonts, single href):
  - Playfair Display `ital,wght@0,400..900;1,400..900` — headlines, pull quotes, oversized numerals
  - Source Serif 4 `opsz,wght@8..60,300..600` — body copy
  - JetBrains Mono `wght@300..700` — labels, metadata, tables, fine print
- **Tokens:** scoped to this page only — do NOT touch the global `@theme` in `src/index.css` (the Forest Sanctuary tokens are for the main site). Define CSS custom properties on the page root div (`--mono-bg: #FFFFFF; --mono-fg: #000000; --mono-muted: #F5F5F5; --mono-muted-fg: #525252; --mono-hairline: #E5E5E5`) and use Tailwind arbitrary values referencing them. Type scale, tracking, border weights (1/2/4/8px), spacing per RNRN §Design Token System.
- **Radius/shadow:** 0 / none, everywhere.

## 5. Page structure (top → bottom)

Every major section is separated by a **4px black horizontal rule** (8px before the final CTA). Container: `max-w-6xl`, `px-6 md:px-8 lg:px-12`, sections `py-24 md:py-32 lg:py-40`.

### 5.1 Header (fixed / absolute-in-preview)
White bar, **1px black bottom border**. Left: `OLYMPUS FC` wordmark — Playfair Display, tight tracking, with a small 8px black square glyph. Center: nav links (`Squad · Fixtures · Arena · Club`) in JetBrains Mono uppercase `tracking-widest` — dead anchors (`href="#"`, `onClick` preventDefault), hover = underline appears instantly. Right: `Back`/`Close` (functional, per contract) as a ghost mono link, plus a dead primary button `Season Tickets →` (black fill, white text, instant inversion on hover). Header background is opaque white — no blur/translucency (glass is banned).

### 5.2 Hero — "OLYMPUS"
Full viewport (`min-h-[100dvh]`). The **DitherField** WebGL canvas occupies the hero as a background band (full-bleed, behind content, ~55% opacity so type stays dominant). Content on top:
- Kicker line, JetBrains Mono 12px `tracking-widest`: `EST. 2018 — ATHLETIC CLUB — DIVISION I` flanked by 1px rules.
- Headline: `OLYMPUS` in Playfair Display, `text-[clamp(4rem,18vw,16rem)]`, `leading-none tracking-tighter`, filling the container width. Below it, offset right: *`Football Club`* in Playfair italic 4xl–6xl.
- RNRN hero punctuation: a **4px black rule with a small bordered square** terminating it.
- Meta column (right-aligned, mono, hairline-separated rows): next fixture, capacity, current league position.
- One dead CTA pair: `Match Programme →` (primary black) + `The Squad` (2px outline).

**Motion:** on load — masked line-rise of the kicker, then `OLYMPUS` reveals via `SplitLine` + `usePlateStrike` (existing hook; per-word clip rise), rules draw in (`scaleX` 0→1, transform-origin left), meta rows stagger-fade. Dither field animates continuously (slow, ~0.4 speed), static frame under reduced motion / card preview.

### 5.3 Marquee
Black band between two 4px rules. White uppercase Playfair text scrolling linearly (CSS keyframe translate, duplicated content, `will-change: transform`): `FORTUNA AUDACES IUVAT — OLYMPUS FC — EST. 2018 — ` … Gradual-blur masks on both edges (content fades/blurs out at the band's ends). Static in card preview & reduced motion. Items separated by small white squares.

### 5.4 The Club — manifesto (editorial spread)
White, **grid texture** (RNRN secondary pattern). Two-column editorial layout:
- Left column: section index `01 — THE CLUB` (mono), then heading `Discipline is a style.` (Playfair, 5xl–7xl).
- Right column: body copy in Source Serif 4 `lg leading-relaxed`, first paragraph opens with RNRN's **boxed drop cap** (2px-bordered square containing the initial letter). Two paragraphs of club-manifesto copy (write fresh copy; keep the "engineered performance, tactical geometry" voice).
- Full-width **editorial pull quote** beneath: oversized `"` glyph, italic Playfair 3xl–4xl: *"We do not chase the ball. We move the geometry until the ball arrives."* — attributed in mono caps to the head coach.

**Motion:** heading line-rise on scroll; drop-cap box draws its border; pull quote fades up once.

### 5.5 Squad — the index
Section index `02 — FIRST TEAM`. **A masthead-style table, not cards.** Full-width rows, 1px black rules between, grouped by position with mono group headers (`GOALKEEPERS / 1`, `DEFENDERS / 4`, …) sitting on 2px rules. Each row (CSS grid columns): oversized mono number (`01`–`11`), name in Playfair 2xl–3xl, position (mono caps), nation as three-letter mono code, and a dead `→` glyph.
**Hover: the entire row inverts to black/white instantly** (RNRN inversion-for-emphasis; 0ms). Keep 11 players from current data (names/positions/numbers/nations), no flags, no photos in rows.
**Motion:** rows stagger in on scroll with a short masked rise (once).

### 5.6 Featured player — the spread
Black inverted section, **vertical-line texture**. Magazine spread for the №9:
- Left: giant numeral `9` in Playfair white, `text-[clamp(10rem,30vw,24rem)]`, cropped by overflow.
- Right: **ImagePlaceholder** panel (see §6.3) — intended image: *"Full-body studio portrait of the striker, black & white, high contrast, dark background."* This panel carries the **shape-blur cursor reveal**: at rest it sits dimmed; the pointer reveals it fully through a soft blurred circular mask that follows the cursor (desktop pointer only; touch = fully visible).
- Stat strip beneath: `24 GOALS / 12 ASSISTS / 32 MATCHES` — white mono, separated by 1px white verticals, numbers tick up on scroll (reuse the Counter pattern, restyled).

### 5.7 Fixtures — the ledger
White, **diagonal-line texture**. Section index `03 — FIXTURES`. A results/fixtures ledger: rows with 1px rules — date (mono), home vs away (Playfair, `vs` in italic), venue (mono gray), then either the **score oversized in Playfair 4xl** (played) or a dead ghost button `RESERVE →` (upcoming). Olympus' name set heavier than opponents'. Hover: row's bottom rule thickens 1px→3px, instant. Keep the current 5-match dataset.

### 5.8 Records — inverted stats band
RNRN non-negotiable #3: **black background, white text, vertical-line texture.** Four oversized figures in Playfair 7xl–8xl (`48 PLAYED / 34 WINS / 87 GOALS / 3× TITLES`), mono labels, separated by 1px white vertical rules on desktop. Counters tick on scroll (quartic ease, once). Below, a single mono footnote line: `UNBEATEN TREBLE — DOMESTIC LEAGUE, CONTINENTAL CUP, SUPER CUP — 2023`.

### 5.9 The Arena
White, grid texture. Section index `04 — THE ARENA`. Editorial split:
- Large **ImagePlaceholder** (intended: *"Aerial black & white photograph of the stadium's retractable geometric roof."*), 2px black border; hover: border thickens to 4px and the placeholder's inner pattern scales 105% over 300ms (RNRN blog-image rule — the one sanctioned slow hover).
- Beside it: `Olympus Arena` heading (Playfair 5xl), one Source Serif paragraph, then a hairline **spec table** (mono): `CAPACITY 42,000 / BUILT 2021 / PITCH HYBRID / ROOF RETRACTABLE`.
- Milestone list (2021 canopy, 2023 treble, 2025 digital arena — reuse current copy, tightened): three rows, year in oversized Playfair, title mono caps, description Source Serif — 1px rules between. No sticky card stack.

### 5.10 Final CTA — inverted
8px rule above. **Black section, radial white texture** (RNRN inverted CTA). `JOIN THE FIRST ELEVEN` in Playfair white 6xl–8xl (line-rise on scroll). One line of Source Serif white/60. Email form (dead, `preventDefault`): white 2px **bottom-border-only** input on black (placeholder italic gray), focus thickens border to 4px; submit = white-filled button `Register →`, hover inverts to black/white-border, instant. Fine print in mono white/40.

### 5.11 Footer
White, 1px top rule. Three columns (mono, uppercase, tracking-widest): wordmark + small black square; dead links (`Privacy / Terms / Press`, hover-underline); `© {year} OLYMPUS FC — A DESIGN STUDY`. All dead.

### 5.12 Gradual-blur viewport veil
Standalone route only (not preview/modal): a fixed, pointer-events-none progressive blur strip along the bottom ~8rem of the viewport (stacked backdrop-filter layers, masked), so content softly exits the frame. Skipped when `isPreview`, reduced motion unaffected (it's static).

## 6. New components (all self-contained, no deps)

### 6.1 `src/components/DitherField.tsx`
Raw WebGL (`canvas` + `WebGLRenderingContext`, no libraries). Fragment shader: fbm/value noise animated by `u_time`, thresholded through a 4×4 (or 8×8) **Bayer ordered-dither matrix**, output strictly two colors (configurable fg/bg, here black on white). Pixel-size uniform ~2–3 device px for a visible halftone grain. Props: `{ className?, animate?: boolean, pixelSize?, speed? }`.
- rAF loop capped at 30fps (setTimeout-throttled rAF) — it's a texture, not a game.
- `IntersectionObserver`: pause when off-screen. Pause on `document.hidden`.
- `animate: false` (reduced motion / `isCardPreview`) → render exactly one frame, no loop.
- WebGL context unavailable → render nothing; the hero's noise/line textures carry the section (graceful degradation).
- Cleanup: cancel rAF, lose context on unmount.

### 6.2 `GradualBlur` (local to SoccerTeam.tsx or tiny component)
Pure CSS/JSX: a positioned container with 4–5 stacked children, each `backdrop-filter: blur(Npx)` with `mask-image: linear-gradient(...)` bands so blur intensifies progressively. No JS, no rAF. Used twice (viewport bottom veil; marquee edges — for the marquee, simple masked fade is acceptable if nested backdrop-filters prove glitchy over the moving track; decide at build time, both are sanctioned).

### 6.3 `ImagePlaceholder` (local component inside SoccerTeam.tsx)
A 2px-black-bordered box (aspect-ratio prop), `#F5F5F5` fill, hairline diagonal cross (two absolutely-positioned 1px lines), centered JetBrains Mono caption block: `[ IMAGE ]` + the description of the intended image + intended treatment (e.g. `GRAYSCALE · HIGH CONTRAST`). Props: `{ description: string, aspect?: string, className? }`. Every image slot on the page uses it; the owner replaces contents manually later.

### 6.4 Shape-blur cursor reveal (logic inside the Featured Player section)
Pointer-tracked CSS mask on the portrait panel: `mask-image: radial-gradient(circle 180px at var(--mx) var(--my), black 30%, transparent 75%)` over a full-opacity layer stacked on a 25%-opacity base layer. `--mx/--my` updated via `onPointerMove` writing to a ref'd element's style (no React state, no re-renders). The mask position eases toward the pointer with a small lerp in a rAF loop that only runs while the pointer is inside the panel. Touch/reduced-motion/card-preview: mask disabled, full visibility.

## 7. Motion inventory (build checklist)

| Moment | Mechanism | Notes |
|---|---|---|
| Hero headline reveal | `SplitLine` + `usePlateStrike` (existing) | fires on mount/scroll, once |
| Section headings | `SplitLine` + `usePlateStrike` with softer stagger | scroll, once |
| Rules draw in | GSAP `scaleX 0→1`, origin left, `ScrollTrigger once` | 0.8s, EASE_ENTER feel |
| Squad rows / fixture rows / meta rows | Framer `whileInView` stagger fade+rise (existing `fadeUp` idiom, `viewport={{ once: true }}`) | 0.5–0.6s |
| Counters | rAF quartic-ease count (port existing `Counter`) | once, IntersectionObserver |
| Marquee | CSS keyframes, linear, infinite | paused: reduced/cardPreview |
| Dither field | WebGL `u_time` | 30fps cap, visibility-gated |
| Hover states | CSS only, `duration-0`/`duration-100` | inversions, underlines, rule-thickening |
| Arena image hover | 300ms border-thicken + inner scale | RNRN's sanctioned exception |

All GSAP work wrapped in `gsap.context` scoped to the page root, reverted on unmount. All `once: true` — nothing re-triggers on scroll-up (stillness after the reveal is part of the aesthetic).

## 8. Integration changes outside the page file

1. `src/hooks/useRouteFonts.ts` — add `MONOCHROME_FONTS_HREF` export (Google href from §4). SoccerTeam stops importing `FONTSHARE_HREF`; the constant stays — NoodlePlace still uses it.
2. `src/pages/Portfolio.tsx` — `BG_COLOR.soccer: "#FAFAF8"` → `"#FFFFFF"` (modal plate behind the preview must match the new page).
3. `src/data/translations.ts` — rewrite `soccerDesc` (en + fr) to describe the monochrome editorial design study (mention: pure black/white editorial design, serif display typography, WebGL dither field, inverted sections, masthead squad index).
4. **Delete `src/components/HolographicBall.tsx`** — SoccerTeam was its only consumer and the redesign drops it.
5. No route, chunking, or `vite.config.ts` changes.

## 9. Accessibility & performance

- Focus states per RNRN: `focus-visible` 3px black outline offset 3px on buttons/links (white outline on inverted sections); input focus = bottom border 2px→4px. All interactive-looking dead elements are real `<button>`/`<a>` elements (keyboard-reachable, visible focus) that no-op.
- Dead links use `href="#"` + `preventDefault` (or `<button type="button">`) — no navigation, no console errors.
- Contrast: black/white = 21:1; gray `#525252` on white ≥ 7:1. Mono metadata ≥ 10px actual size (current page's 8px mono is below comfortable legibility — don't repeat it).
- Touch targets ≥ 44px on interactive elements.
- `SplitLine` keeps sr-only full text (built in).
- Perf budget: one WebGL canvas (30fps, small shader), one CSS marquee, CSS-only hovers. No scroll-linked rAF except the pointer-lerp (bounded to hover). Page remains a lazy route; fonts lazy via `useRouteFonts`. Target: no long tasks, no layout thrash (all reveals are transform/opacity).

## 10. Out of scope

- No changes to the main site (MainPage, navbar, theme tokens, preloader).
- No real backend/forms/analytics; no i18n for page copy (the page is an English design piece, matching Vortex/NoodlePlace precedent) — only `soccerDesc` is translated.
- No image sourcing — placeholders only.
- No test suite (repo has none; `npm run lint` + manual browser pass is the bar).
