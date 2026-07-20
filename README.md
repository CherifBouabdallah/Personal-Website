# Cherif Bouabdallah - Personal Website & Sandbox

A high-fidelity, premium personal website, creative showcase, and interactive engineering sandbox demonstrating fluid web mechanics, physics-based motion, and bespoke user interfaces.

## 🚀 Technologies

- **Core**: React 19 (TypeScript 5.8) + Vite 8, no SSR
- **Routing**: React Router DOM v7 — `/`, `/portfolio`, and `/contact` all render the same scrollable `MainPage` with scroll-spy URL sync; `/vortex`, `/soccer-team`, `/noodle-place` are standalone lazy-loaded sandbox routes
- **Styling**: Tailwind CSS v4 (CSS-first config in `src/index.css`, no `tailwind.config.js`) + vanilla CSS custom properties, `lucide-react` icons
- **Animation**: Framer Motion (primary, including `layoutId` shared-element morphs) + GSAP/ScrollTrigger for scroll-scrubbed effects (the print-chrome plate-strike headline reveal and section snap — see `src/hooks/useBroadsheetMotion.ts`). No GSAP Draggable anywhere in the codebase.
- **Smooth scroll**: Lenis, bridged to GSAP's ScrollTrigger via `src/lib/gsapSetup.ts`
- **Backend**: none — fully static site
- **Deployment**: Vercel (`vercel.json`) and/or a self-hosted Nginx box via `deploy.sh`

## 📂 Project Structure

- `src/App.tsx`: root component — preloader (font + hero image preload gate), Lenis init, route layout, navbar visibility rules.
- `src/pages/MainPage.tsx`: composes `Home.tsx`, `Portfolio.tsx`, and `Contact.tsx` into one scrollable page.
- `src/pages/Home.tsx`: masthead, headline, monologue/bio copy, core-stack skills, gateway links.
- `src/pages/Portfolio.tsx`: numbered contents index of featured projects with a card ↔ modal shared-element preview morph.
- `src/pages/Contact.tsx`: social contact cards with copy-to-clipboard popups.
- `src/pages/Vortex.tsx`, `SoccerTeam.tsx`, `NoodlePlace.tsx`: standalone lazy-loaded portfolio project sandboxes, also embedded as live previews inside Portfolio's modal.
- `src/pages/Secret101.tsx`, `NotFound.tsx`: hidden easter-egg route and 404 page.
- `src/components/`: shared UI — `LiquidNavbar`, `BroadsheetFrame` (print-chrome registration marks/folios/running head), `SplitLine`, `MaskRiseTitle`, `Grain`, `Footer`, `LanguageSwitcher`, `HolographicBall`.
- `src/hooks/`: `useBroadsheetMotion.ts` (GSAP plate-strike reveal + section snap), `useRouteFonts.ts` (lazy per-route webfont injection).
- `src/lib/`: `motion.ts` (shared easing/spring constants + `useMotionPrefs()`), `gsapSetup.ts` (ScrollTrigger + Lenis bridge).
- `src/data/translations.ts`: manual `en`/`fr` copy dictionary.
- `deploy.sh` & `nginx-default.conf`: destructive, idempotent production deploy to a self-hosted Nginx box (`git reset --hard` + `npm ci` + build + rsync).
- `vercel.json`: SPA rewrites and cache headers for the Vercel deployment path.

See `CLAUDE.md` for full architecture notes and `DESIGN.md` for the design system.

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server** (binds `0.0.0.0:3000`):
   ```bash
   npm run dev
   ```

3. **Type-check**:
   ```bash
   npm run lint
   ```

4. **Build Static Site**:
   ```bash
   npm run build
   ```
