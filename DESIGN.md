---
name: Cherif Bouabdallah
description: A premium personal website, creative showcase, and interactive engineering sandbox
colors:
  primary-bg: "#223D27"
  primary-text: "#F6F0DF"
  secondary-text: "#DEDBC8"
typography:
  display:
    fontFamily: "Maghfirea, serif"
    fontSize: "clamp(2.3rem, 12vw, 200px)"
    fontWeight: "normal"
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-sans), sans-serif"
    fontSize: "clamp(0.9rem, 2vw, 1.2rem)"
    fontWeight: "normal"
  label:
    fontFamily: "monospace"
    fontSize: "9px"
    letterSpacing: "0.25em"
rounded:
  sm: "4px"
  md: "12px"
  lg: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary-text}"
    textColor: "{colors.primary-bg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "rgba(246, 240, 223, 0.9)"
  button-secondary:
    backgroundColor: "rgba(246, 240, 223, 0.05)"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "rgba(246, 240, 223, 0.1)"
  card-glass:
    backgroundColor: "rgba(34, 61, 39, 0.35)"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Cherif Bouabdallah

## 1. Overview

**Creative North Star: "The Forest Sanctuary"**

"The Forest Sanctuary" is an editorial, print-inspired design aesthetic tailored for a high-fidelity software engineering showcase. The visual landscape is defined by a deep, atmospheric Forest Green background contrasted against a warm, literary Alabaster font. Large, structural serif headings create a rhythmic hierarchy, while negative space is treated as an active design element rather than a default empty container.

This design system rejects standard corporate SaaS visual strategies, such as generic card grids, neon purple/blue gradients, and sketchy hand-drawn SVGs. Instead, it values subtle micro-animations, physical drag kinematics, and tactile glass highlights to anchor the interactive engineering sandbox.

**Key Characteristics:**
- **Atmospheric Depth**: A saturated dark green base that feels calming, premium, and distinct from typical gray/black dark modes.
- **Editorial Contrast**: Sophisticated serif display headers paired with clean monospaced layout elements.
- **Tactile Kinematics**: Physics-based, spring-loaded movement for all interactive surfaces.

## 2. Colors

The color palette is organic and restrained, relying on three core tones to establish visual tone.

### Primary
- **Forest Green** (#223D27 / oklch(33.5% 0.076 138.5)): The core canvas color. Used for the global page background and base component containers.

### Secondary
- **Warm Alabaster** (#F6F0DF / oklch(95.4% 0.021 86)): The main text, selection, and primary action color. Highly legible against the forest background.

### Tertiary
- **Muted Stone** (#DEDBC8 / oklch(88.3% 0.022 88)): The secondary text color. Used for body text, subtitles, and low-priority labels to reduce visual weight.

### Named Rules
**The Forest Canopy Rule.** The global page background must always remain Forest Green (#223D27). High-contrast white (#FAFAF8) or pitch black (#141212) backgrounds are strictly restricted to isolated pop-up overlay panels (e.g., preview modals).

## 3. Typography

**Display Font:** Maghfirea (serif font)
**Body Font:** Sans-Serif system font (Inter/Helvetica fallback)
**Label/Mono Font:** Monospace system font

**Character:** The pairing of the expressive, custom serif display font *Maghfirea* with strict, clean monospace labels creates a tension between artisanal craft and technical precision.

### Hierarchy
- **Display** (normal, clamp(2.3rem, 12vw, 200px), 0.95): Used for main page titles and large text statements.
- **Headline** (semibold, clamp(1.8rem, 4vw, 3rem), 1.2): Used for primary section headers.
- **Body** (normal, clamp(0.9rem, 2vw, 1.2rem), 1.6): Used for descriptive copy and text passages.
- **Label** (normal, 9px, letter-spacing: 0.25em, uppercase): Used for tags, navigation items, and helper metrics.

### Named Rules
**The Maghfirea Statement Rule.** The display font *Maghfirea* is reserved exclusively for single-line statements and page titles. It must never be used for multi-line paragraphs or UI labels.

## 4. Elevation

The system relies on tonal layering and complex glass highlight matrices rather than traditional heavy drop-shadows to convey depth.

### Shadow Vocabulary
- **Tactile Glass Glow** (box-shadow in `.glass-square`): A collection of subtle inset highlights (white on top, dark gray on the bottom) and soft ambient shadows that simulate physical glass depth on a dark canvas.

### Named Rules
**The Ambient Response Rule.** Card surfaces are flat and flush at rest. Shadows, deep blurs, and hover scale transforms appear only in response to direct user interaction.

## 5. Components

### Buttons
- **Shape:** Softly curved corners (12px radius).
- **Primary:** Warm Alabaster background with Forest Green text. Medium padding (12px 24px) and bold monospaced typography.
- **Hover / Focus:** Minor scale transform (`scale(0.98)`) and high contrast hover brightness change.
- **Secondary:** Transparent background, fine Alabaster border (`1px solid rgba(246, 240, 223, 0.15)`), and Alabaster text.

### Cards / Containers
- **Corner Style:** Rounded corners (24px radius).
- **Background:** Semi-transparent Forest Green base (`rgba(34, 61, 39, 0.35)`) with a high backdrop-filter blur.
- **Border:** Fine, low-opacity Alabaster stroke (`1px solid rgba(246, 240, 223, 0.25)`).

### Navigation
- **Style:** Underline navigation layout. Text items use uppercase monospaced labels (`9px`) with generous tracking (`0.25em`). Active state is indicated by a clean, spring-loaded under-bar animation.

## 6. Do's and Don'ts

### Do:
- **Do** maintain a strict 4.5:1 contrast ratio for body text by using Warm Alabaster (#F6F0DF) on Forest Green (#223D27).
- **Do** restrict card rounding to a maximum of 24px to preserve a premium structured aesthetic.
- **Do** implement standard spring-based easing for active transitions to support tactile responsive feels.

### Don't:
- **Don't** use standard SaaS card grids featuring a generic top icon, bold heading, and small body text.
- **Don't** mix solid borders with large, heavy drop-shadows on cards (the ghost-card look).
- **Don't** implement purple/blue neon gradients or standard glassmorphism as a default decoration.
- **Don't** display sketchy SVG illustrations or hand-drawn graphics.
