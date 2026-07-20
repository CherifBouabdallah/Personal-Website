import { Fragment } from "react";

interface SplitLineProps {
  text: string;
  by?: "word" | "char";
  className?: string;
}

/**
 * Splits a line of text into GSAP-animatable units (`[data-split-unit]`),
 * each wrapped in an overflow-hidden clip so a translate/scale reveal has
 * something to clip against. Full text stays in an sr-only node so screen
 * readers get one clean announcement instead of fragments.
 */
export default function SplitLine({ text, by = "word", className = "" }: SplitLineProps) {
  const units = by === "char" ? Array.from(text) : text.split(" ");

  return (
    <span className={className}>
      <span aria-hidden className="inline">
        {units.map((unit, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden align-top">
              <span className="inline-block will-change-transform" data-split-unit>
                {unit === "" ? " " : unit}
              </span>
            </span>
            {by === "word" && i < units.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
