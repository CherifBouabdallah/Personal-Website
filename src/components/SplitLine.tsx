import { Fragment } from "react";

interface SplitLineProps {
  text: string;
  className?: string;
}

/**
 * Splits a line of text into GSAP-animatable word units (`[data-split-unit]`),
 * each wrapped in an overflow-hidden clip so a translate/scale reveal has
 * something to clip against. Full text stays in an sr-only node so screen
 * readers get one clean announcement instead of fragments.
 */
export default function SplitLine({ text, className = "" }: SplitLineProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden align-top">
              <span className="inline-block will-change-transform" data-split-unit>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
