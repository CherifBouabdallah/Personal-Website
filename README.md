# Cherif Bouabdallah - Personal Website & Sandbox

A high-fidelity, premium personal website, creative showcase, and interactive engineering sandbox demonstrating fluid web mechanics, physics-based motion, and bespoke user interfaces.

## 🚀 Technologies

- **Core**: React 19 (TypeScript) + Vite 6
- **Styling**: Tailwind CSS v4 + Vanilla CSS Custom Properties
- **Animation & Physics**: Framer Motion + GSAP (GreenSock Animation Platform) with Draggable plugin
- **Routing**: React Router DOM v7
- **Deployment**: Custom automated shell deployment to Nginx static hosting

## 📂 Project Structure

- `src/App.tsx`: Main entry point, custom preloader (sitewide font & heavy image preloading), and route layout.
- `src/components/LiquidNavbar.tsx`: Custom gooey navigation bar with swipe/drag kinematics powered by GSAP Draggable and SVG blend mode matrices.
- `src/pages/About.tsx`: "The Museum" page detailing font choices, color swatches, spring physics, and component libraries.
- `src/pages/Experimental.tsx`: Monologue, bio, EPFL context, software capabilities, and tools metadata.
- `src/pages/Dev.tsx`: "Vortex Sandbox" simulating OS widgets, CPU/RAM hud controls, Dynamic Island expanded menu systems, and physics cards.
- `src/pages/Contact.tsx`: Interactive scroll-bound contact card portal with popup links for LinkedIn, Email, and GitHub.
- `deploy.sh` & `nginx-default.conf`: Production scripts for compilation and Nginx routing.

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Build Static Site**:
   ```bash
   npm run build
   ```