import { useEffect } from "react";

// Module-level so a stylesheet is only ever injected once per session,
// even if the owning route mounts/unmounts multiple times.
const injectedHrefs = new Set<string>();

/**
 * Lazily injects <link rel="stylesheet"> tags for webfonts that only a
 * specific route needs, instead of loading them globally in index.html.
 */
export function useRouteFonts(hrefs: string[]) {
  useEffect(() => {
    hrefs.forEach((href) => {
      if (injectedHrefs.has(href)) return;
      injectedHrefs.add(href);

      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = new URL(href).origin;
      preconnect.crossOrigin = "anonymous";
      document.head.appendChild(preconnect);

      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = href;
      document.head.appendChild(stylesheet);
    });
  }, [hrefs]);
}

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Geist+Mono:wght@100..900&display=swap";

export const FONTSHARE_HREF =
  "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@800,700,500,400&display=swap";

export const MONOCHROME_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..600;1,8..60,300..600&family=JetBrains+Mono:wght@300..700&display=swap";
