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

// Aspect ratio (width / height of source PNG) for the combined lockup.
const COMBINED_RATIO = 757 / 200; // logo-combined.png

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

  // wordmark (default) — clean typographic wordmark (no baked-in artwork/line).
  // "naja" in the foreground brand colour + the Arabic ح accent in gold.
  return (
    <span
      className={`inline-flex items-baseline font-bold tracking-tight leading-none select-none ${className}`}
      style={{ fontSize: Math.round(height * 0.86) }}
      aria-label="Najaح"
    >
      <span className="text-fg">naja</span>
      <span className="text-gold ms-[0.02em]">ح</span>
    </span>
  );
}
