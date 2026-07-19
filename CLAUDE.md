# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cherif Bouabdallah's personal website: a premium, editorial-styled showcase and interactive engineering sandbox (React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion). See `PRODUCT.md` for brand/purpose and `DESIGN.md` for the full design system ("The Forest Sanctuary" — forest green `#223D27` background, warm alabaster `#F6F0DF` text, serif display font *Maghfirea* for statements only, monospace for labels). Read `DESIGN.md` before touching visual styling — it defines hard rules (e.g. background must stay forest green; no neon/glassmorphism/sketchy SVGs; max 24px card rounding).

## Commands

- `npm run dev` — start Vite dev server on port 3000 (`--host=0.0.0.0`)
- `npm run build` — production build (`tsc` is not run as part of build; type errors don't fail it)
- `npm run lint` — type-check only, via `tsc --noEmit` (there is no separate lint/test runner in this repo)
- `npm run preview` — preview the production build locally
- `npm run clean` — remove `dist/`

There is no automated test suite (no Jest/Vitest config present). Treat `npm run lint` + manual verification in the browser as the correctness bar.

## Architecture

**Routing (`src/App.tsx`)**: A single top-level `App` component owns global state (language, active nav section, preloader progress, Lenis smooth-scroll instance) and passes it down as props — there is no context/store. Routes are split into two groups:
- `/`, `/portfolio`, `/contact` all render the same `MainPage` (a single long scrollable page with `Home` → `Portfolio` → `Contact` sections); the route only controls which section is scrolled into view on mount (see `MainPage.tsx`). Scroll position is also synced back into the URL via a scroll-spy (`history.replaceState`, no navigation).
- Sandbox/standalone routes (`/vortex`, `/soccer-team`, `/noodle-place`, `/secret101`, 404) are separate full-page experiences, lazy-loaded with a custom `lazyWithPreload` helper and idle-time-preloaded after initial paint. These routes hide the navbar (`NAVBAR_HIDDEN_ROUTES`) and disable page scroll (`SCROLLABLE_ROUTES`) as needed.
- `/secret101` is special-cased to render completely outside the normal navbar/layout tree.

**Preloader**: `App` blocks rendering behind a manual progress animation gated on `document.fonts.ready` and a hardcoded image preload list (`/OG2.webp`), independent of React Suspense. Only after both resolve does the real UI mount and Lenis (smooth scroll) initialize.

**Per-route fonts (`src/hooks/useRouteFonts.ts`)**: Global fonts load in `index.html`; page-specific webfonts (e.g. for Vortex, Secret101) are injected lazily via this hook using a module-level `Set` so each stylesheet loads at most once per session, keeping the global font payload small.

**i18n (`src/data/translations.ts`)**: Manual `en`/`fr` dictionary typed by `LanguageTranslations`, selected by a single `lang` state lifted in `App` and persisted to `localStorage`. No i18n library — add new copy by extending the interface and both language entries.

**Styling**: Tailwind v4 (CSS-first config, no `tailwind.config.js`) — theme tokens are defined in `src/index.css` via `:root` custom properties (`--theme-bg`, `--theme-text`) mapped into Tailwind's `@theme` block (`--color-theme-bg`, `--color-theme-text`), then used as `bg-theme-bg` / `text-theme-text` utility classes. Prefer extending tokens in `src/index.css` over hardcoding hex values in components.

**Motion**: Framer Motion is the primary animation library (page transitions, navbar, holographic ball). GSAP + Draggable powers physics-based drag kinematics in `LiquidNavbar`. Respect `prefers-reduced-motion` per `PRODUCT.md`'s accessibility requirements when adding new motion.

**Build (`vite.config.ts`)**: Manual vendor chunk splitting (`vendor-react`, `vendor-motion`, `vendor-icons`) to keep long-lived libraries cached across deploys independently of app code; CSS code-splitting is on so per-route styles aren't all loaded up front. `DISABLE_HMR=true` disables file watching entirely — used by AI Studio/agent environments to prevent flicker during automated edits; don't remove this without checking why it was added.

**Path alias**: `@/*` resolves to the repo root (see `tsconfig.json` / `vite.config.ts`), not `src/`.

## Deployment

`deploy.sh` is a manual, destructive deploy script run on the target host: it hard-resets the working tree to `origin/main` (`git reset --hard` + `git clean -fd`), rebuilds, and rsyncs `dist/` over Nginx's web root using `nginx-default.conf` for SPA fallback routing. This is separate from the Vercel deployment implied by `vercel.json` (which handles SPA rewrites and static-asset cache headers for a Vercel-hosted deployment). Don't assume one deployment path implies the other is unused — check which is actually current before changing routing/cache behavior.
