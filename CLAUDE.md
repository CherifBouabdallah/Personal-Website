# CLAUDE.md — Project Memory & Guidelines

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. Project Overview & Stack

Cherif Bouabdallah's personal website: a premium, editorial-styled showcase and interactive engineering sandbox. See `PRODUCT.md` for brand/purpose and `DESIGN.md` for the full design system.

- **Core Stack:** React 19 + TypeScript 5.8 + Vite 8, React Router DOM v7 (SPA, no SSR). Lenis for smooth scrolling.
- **Styling:** Tailwind CSS v4 (CSS-first config — no `tailwind.config.js`; theme tokens live in `src/index.css`), vanilla CSS custom properties, `lucide-react` icons. Animation via Framer Motion (primary, incl. `layoutId` shared-element morphs) + GSAP/ScrollTrigger (scroll-scrubbed effects driving the print-chrome plate-strike reveal and section snap — see `src/hooks/useBroadsheetMotion.ts`). `LiquidNavbar` itself is pure Framer Motion; there is no GSAP Draggable anywhere in the codebase.
- **Backend / Automations:** None. Fully static site — no API server, no n8n integrations, no custom systemd services (deploy script only reloads nginx).
- **Environment:** Dual-boot development (Windows/Debian Linux), running behind Tailscale networks where relevant. Dev server binds `0.0.0.0:3000` so it's reachable across the tailnet.

## 2. Frequent Development Commands

- **Dev Server:** `npm run dev` — Vite on port 3000, `--host=0.0.0.0`
- **Build Command:** `npm run build` — production build to `dist/` (`tsc` is NOT part of the build; type errors don't fail it)
- **Lint/Format:** `npm run lint` — type-check only (`tsc --noEmit`). There is no ESLint/Prettier config and no test suite; `npm run lint` + manual browser verification is the correctness bar.
- **Scripts:**
  - `npm run preview` — serve the production build locally
  - `npm run clean` — remove `dist/`
  - `deploy.sh` — production deploy on the target host (see §4)

## 3. Code Style & Architecture Guardrails

- **Naming Conventions:** PascalCase for component/page files (`LiquidNavbar.tsx`), camelCase `useX` for hooks (`useRouteFonts.ts`), camelCase for functions/variables, lowercase for data/lib modules (`translations.ts`, `motion.ts`).
- **Design System Rules:** Read `DESIGN.md` before touching visual styling — "The Forest Sanctuary": forest green `#223D27` background (must stay), warm alabaster `#F6F0DF` text, serif display font *Maghfirea* for statements only, monospace for labels. Hard rules: no neon, no glassmorphism, no sketchy SVGs, max 24px card rounding. Prefer stark contrast and clean layouts. Respect `prefers-reduced-motion` when adding new motion (per `PRODUCT.md`).
- **TypeScript/JavaScript:** Strict modern ESNext/ES2020 target, explicit typing (e.g. `LanguageTranslations` interface types the i18n dictionary). Path alias `@/*` resolves to the **repo root**, not `src/`. Prefer Tailwind theme tokens (`bg-theme-bg`, `text-theme-text`, defined in `src/index.css`) over hardcoded hex values in components.
- **Directory Mapping:**
  - `src/App.tsx` — top-level component owning global state (language, nav section, preloader, Lenis instance) passed via props; no context/store
  - `src/pages/` — route pages: `MainPage.tsx` (single scrollable page for `/`, `/portfolio`, `/contact` with scroll-spy URL sync) plus lazy-loaded standalone sandboxes (`Vortex`, `SoccerTeam`, `NoodlePlace`, `Secret101`, `NotFound`)
  - `src/components/` — shared UI (`LiquidNavbar`, `HolographicBall`, `MaskRiseTitle`, `Footer`, `LanguageSwitcher`, `BroadsheetFrame` (print-chrome — registration marks, folios, rotated running head), `Grain` (paper texture overlay), `SplitLine` (GSAP-animatable word-split wrapper))
  - `src/hooks/` — `useRouteFonts.ts` lazily injects per-route webfonts (module-level `Set`, once per session); `useBroadsheetMotion.ts` exports `usePlateStrike` (GSAP letterpress headline reveal, drives `SplitLine`'s `[data-split-unit]`s) and `useSectionSnap` (desktop scroll-snap nudge between sections)
  - `src/data/translations.ts` — manual `en`/`fr` dictionary; extend the interface and both language entries to add copy (no i18n library)
  - `src/lib/motion.ts` — shared motion helpers (easing/spring constants, `useMotionPrefs()` — every animated surface should use this instead of calling `useReducedMotion()` directly)
  - `src/lib/gsapSetup.ts` — registers the ScrollTrigger plugin and bridges it to the app's Lenis instance (`bridgeLenisToScrollTrigger()`, called once from `App.tsx`)
  - `src/index.css` — Tailwind `@theme` block + `:root` design tokens, plus the print-chrome rules (`.running-head`, `.plate-strike`, Portfolio's inverted-selection exception)
  - `public/` — static assets: `fonts/Maghfirea.ttf`, webp images, `robots.txt`, `sitemap.xml`
  - `docs/superpowers/` — plans and design specs; `motion-audits/` — saved page snapshots for motion review
- **Architecture notes worth knowing before editing:**
  - **Preloader:** `App` blocks rendering behind a manual progress animation gated on `document.fonts.ready` + a hardcoded image preload list (`/OG2.webp`), independent of React Suspense. Lenis initializes only after it resolves.
  - **Routing quirks:** sandbox routes are lazy-loaded via a custom `lazyWithPreload` helper and idle-preloaded after first paint; `NAVBAR_HIDDEN_ROUTES` / `SCROLLABLE_ROUTES` control navbar visibility and page scroll; `/secret101` renders entirely outside the navbar/layout tree.
  - **Build:** manual vendor chunk splitting in `vite.config.ts` (`vendor-react`, `vendor-motion`, `vendor-icons`) for long-lived caching; CSS code-splitting on. `DISABLE_HMR=true` disables HMR *and* file watching (used by agent/AI Studio environments to prevent flicker) — don't remove.

## 4. Deployment & Infrastructure Notes

Two independent deployment paths exist — check which is actually current before changing routing/cache behavior:

1. **Self-hosted Nginx (Debian):** `deploy.sh`, run manually on the target host. It is **destructive**: `git fetch` + `git reset --hard origin/main` + `git clean -fd` (local changes on the host are wiped), then `npm ci`, `npm run build`, copies `nginx-default.conf` to `/etc/nginx/sites-available/default` (SPA fallback routing), rsyncs `dist/` → `/var/www/html` with `--delete` (zero-downtime sync), and `systemctl reload nginx`.
2. **Vercel:** `vercel.json` handles SPA rewrites and cache headers (immutable 1-year cache for `/assets/`, 1-week for fonts/images).

Don't assume one path implies the other is unused.
