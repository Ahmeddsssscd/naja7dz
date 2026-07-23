/**
 * Najaح logo — uses pre-combined PNG for nav (zero alignment issues),
 * plus separate icon/wordmark for other uses.
 *
 * Variants:
 *   <Logo />                    Wordmark only
 *   <Logo variant="mark" />     Icon only
 *   <Logo variant="combined" /> Single combined PNG (icon + wordmark baked together)
 *
 * Dark mode: dark:invert flips navy → cream automatically.
 */
import { LOGO_ICON_B64 } from "./logo-icon-data";

// Aspect ratios (width / height of source PNG)
const COMBINED_RATIO = 757 / 200; // logo-combined.png
const WM_RATIO       = 365 / 113; // logo-wordmark.png (trimmed)

type LogoProps = {
  height?: number;
  variant?: "wordmark" | "mark" | "combined";
  className?: string;
  priority?: boolean;
};

export function Logo({ height = 36, variant = "wordmark", className = "" }: LogoProps) {
  if (variant === "combined") {
    // Single pre-baked image — icon and wordmark are one unit, perfectly aligned.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo-combined.png"
        alt="Najaح"
        className={`dark:invert flex-shrink-0 ${className}`}
        style={{ height, width: Math.round(height * COMBINED_RATIO), display: "block" }}
      />
    );
  }

  if (variant === "mark") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={LOGO_ICON_B64}
        alt="Najaح"
        className={`dark:invert ${className}`}
        style={{ height, width: height }}
      />
    );
  }

  // wordmark (default)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-wordmark.png"
      alt="Najaح"
      className={`dark:invert ${className}`}
      style={{ height, width: Math.round(height * WM_RATIO) }}
    />
  );
}
